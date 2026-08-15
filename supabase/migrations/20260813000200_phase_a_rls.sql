-- Quorlyn Phase A — Row Level Security
--
-- Threat model: the anon key is public. It ships in the browser bundle and must
-- be treated as known to an attacker. Therefore `anon` gets NO policy on any
-- table here — not even insert on inquiries. Public submissions go through the
-- server route using the service role key, which never leaves the server.
--
-- Hiding a nav item is not access control. These policies are the control.

-- ---------------------------------------------------------------------------
-- Helpers
--
-- security definer so they can read profiles without re-entering the policy
-- that calls them, which would recurse. search_path is pinned to stop a
-- caller-controlled schema shadowing `profiles`.
-- ---------------------------------------------------------------------------

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_active
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_active and role = 'admin'
  );
$$;

create or replace function public.can_view_inquiries()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and is_active
      and (role = 'admin' or can_view_inquiries)
  );
$$;

-- ---------------------------------------------------------------------------
-- Enable RLS everywhere. A table without this is readable by anyone holding
-- the anon key.
-- ---------------------------------------------------------------------------

alter table public.profiles          enable row level security;
alter table public.inquiries         enable row level security;
alter table public.inquiry_notes     enable row level security;
alter table public.inquiry_counters  enable row level security;
alter table public.notifications     enable row level security;
alter table public.audit_logs        enable row level security;
alter table public.rate_limits       enable row level security;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create policy "staff read own profile"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy "admins read all profiles"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

create policy "admins manage profiles"
  on public.profiles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Staff may edit their own name, but not their role or active flag —
-- privilege escalation is blocked at the database, not the form.
create policy "staff update own display name"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select p.role from public.profiles p where p.id = auth.uid())
    and is_active = (select p.is_active from public.profiles p where p.id = auth.uid())
    and can_view_inquiries = (select p.can_view_inquiries from public.profiles p where p.id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- inquiries — leads are commercially sensitive and contain personal data
-- ---------------------------------------------------------------------------

create policy "authorised staff read inquiries"
  on public.inquiries for select
  to authenticated
  using (public.can_view_inquiries());

create policy "authorised staff update inquiries"
  on public.inquiries for update
  to authenticated
  using (public.can_view_inquiries())
  with check (public.can_view_inquiries());

-- Deletion is an admin action; everyone else archives instead.
create policy "admins delete inquiries"
  on public.inquiries for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- inquiry_notes — internal commentary, never exposed publicly
-- ---------------------------------------------------------------------------

create policy "authorised staff read notes"
  on public.inquiry_notes for select
  to authenticated
  using (public.can_view_inquiries());

create policy "authorised staff write notes"
  on public.inquiry_notes for insert
  to authenticated
  with check (public.can_view_inquiries() and author_id = auth.uid());

create policy "authors edit own notes"
  on public.inquiry_notes for update
  to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

create policy "authors or admins delete notes"
  on public.inquiry_notes for delete
  to authenticated
  using (author_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------------

create policy "staff read notifications"
  on public.notifications for select
  to authenticated
  using (public.is_staff());

create policy "staff mark notifications read"
  on public.notifications for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- ---------------------------------------------------------------------------
-- audit_logs — readable by admins, and append-only from the client's side.
-- Writes happen server-side with the service role.
-- ---------------------------------------------------------------------------

create policy "admins read audit log"
  on public.audit_logs for select
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- inquiry_counters and rate_limits
--
-- No policies at all: these are server-side machinery. RLS is enabled so that
-- the anon and authenticated roles are denied by default. The service role
-- bypasses RLS and is the only thing that touches them.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- Function execution grants
--
-- consume_rate_limit and next_inquiry_reference are security definer, so they
-- must not be callable by the public roles.
-- ---------------------------------------------------------------------------

revoke execute on function public.consume_rate_limit(text, integer, integer) from anon, authenticated;
revoke execute on function public.next_inquiry_reference() from anon, authenticated;
