import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "@/components/admin/LoginForm";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { QuorlynMark } from "@/components/brand/QuorlynMark";
import { Container } from "@/components/ui/Container";
import { adminBackendReady } from "@/lib/auth/dal";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  if (!adminBackendReady()) return <SetupNotice />;

  return (
    <Container size="narrow" className="flex min-h-dvh flex-col justify-center py-20">
      <div className="mx-auto w-full max-w-md">
        <QuorlynMark size={38} />

        <p className="mt-8 font-mono text-label tracking-[0.2em] text-subtle uppercase">
          Quorlyn Admin
        </p>
        <h1 className="mt-4 text-h2 text-fg">Sign in</h1>
        <p className="mt-4 leading-relaxed text-muted">
          Staff access only. Accounts are created by an administrator — there is no public sign-up.
        </p>

        <div className="mt-10">
          <Suspense fallback={<div className="h-72" aria-hidden="true" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </Container>
  );
}
