import { signOut } from "@/app/admin/actions";

/**
 * Sign out as a form post rather than a client-side call, so it works without
 * JavaScript and cannot be triggered by a stray GET (a link would be
 * prefetchable, and prefetching a logout is a genuinely annoying bug).
 */
export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="flex h-9 items-center rounded-md border border-line px-3 text-sm text-muted transition-colors duration-150 hover:border-line-strong hover:text-fg"
      >
        Sign out
      </button>
    </form>
  );
}
