import Link from "next/link";

import { QuorlynMark } from "@/components/brand/QuorlynMark";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import type { Session } from "@/lib/auth/dal";

/** Nav is filtered by what the signed-in staff member may actually reach, so
 *  nobody is shown a link that will bounce them. */
function navFor(session: Session) {
  const canSeeInquiries =
    session.profile.role === "admin" || session.profile.can_view_inquiries;

  return [
    { href: "/admin", label: "Dashboard", show: true },
    { href: "/admin/inquiries", label: "Inquiries", show: canSeeInquiries },
  ].filter((item) => item.show);
}

export function AdminChrome({
  session,
  current,
  children,
}: {
  session: Session;
  current: string;
  children: React.ReactNode;
}) {
  const items = navFor(session);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-void/85 backdrop-blur-xl">
        <Container size="wide" className="flex h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="inline-flex items-center gap-2.5 rounded-sm">
              <QuorlynMark size={26} />
              <span className="font-mono text-[11px] tracking-[0.22em] text-subtle uppercase">
                Admin
              </span>
            </Link>

            <nav aria-label="Admin">
              <ul className="flex items-center gap-1">
                {items.map((item) => {
                  const active =
                    item.href === "/admin" ? current === "/admin" : current.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex h-9 items-center rounded-md px-3 text-sm transition-colors duration-150",
                          active ? "bg-white/8 text-fg" : "text-muted hover:text-fg",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm leading-tight text-fg">
                {session.profile.full_name || session.email}
              </p>
              <p className="font-mono text-[10px] tracking-[0.14em] text-subtle uppercase">
                {session.profile.role}
              </p>
            </div>
            <SignOutButton />
          </div>
        </Container>
      </header>

      <Container size="wide" className="py-10 lg:py-14">
        {children}
      </Container>
    </>
  );
}
