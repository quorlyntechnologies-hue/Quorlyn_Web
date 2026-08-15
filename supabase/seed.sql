-- Development seed data.
--
-- ⚠ DEMO DATA — NEVER RUN THIS AGAINST PRODUCTION.
--
-- Every row is obviously fictional: names are placeholders, addresses use the
-- reserved example.com domain, and references sit in a DEMO year block that
-- cannot collide with real QRN-<year>-<n> values. The point is to exercise the
-- admin UI's list, filter, pagination and status flows — not to look real.
--
-- Apply with:  psql "$DATABASE_URL" -f supabase/seed.sql
-- Remove with: delete from public.inquiries where reference like 'QRN-DEMO-%';

begin;

insert into public.inquiries
  (reference, name, email, company, phone, project_type, budget, timeline, preferred_contact, message, status, source_path)
values
  ('QRN-DEMO-0001', 'Demo Applicant One', 'demo-one@example.com', 'Example Manufacturing Ltd', '+977 1 4000000',
   'Product engineering', '$15,000 – $50,000', 'Within 1–3 months', 'Email',
   'DEMO RECORD. We run production scheduling on spreadsheets across three sites and need a single system before the next fiscal year.',
   'new', '/contact'),

  ('QRN-DEMO-0002', 'Demo Applicant Two', 'demo-two@example.com', 'Example Logistics', null,
   'AI engineering', 'Prefer to discuss', 'As soon as possible', 'Video call',
   'DEMO RECORD. We want to classify inbound support email automatically and route it, but have no idea whether the volume justifies it.',
   'contacted', '/services'),

  ('QRN-DEMO-0003', 'Demo Applicant Three', 'demo-three@example.com', null, '+977 1 4111111',
   'Platform & cloud', '$5,000 – $15,000', 'Within 3–6 months', 'Phone call',
   'DEMO RECORD. Deploys are manual and take an afternoon. We need CI/CD and somewhere to see errors when something breaks.',
   'qualified', '/contact'),

  ('QRN-DEMO-0004', 'Demo Applicant Four', 'demo-four@example.com', 'Example Retail Group', null,
   'Data engineering', '$50,000+', 'Still planning', 'Email',
   'DEMO RECORD. Four systems disagree on revenue. We need one definition and a dashboard the board will actually trust.',
   'in_discussion', '/work'),

  ('QRN-DEMO-0005', 'Demo Applicant Five', 'demo-five@example.com', null, null,
   'Not sure yet', 'Under $5,000', 'Still planning', 'Email',
   'DEMO RECORD. Early idea for a booking tool. Mostly want to know whether it is worth building at all.',
   'lost', '/');

commit;
