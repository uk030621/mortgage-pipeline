"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Pipeline" },
  { href: "/loans/new", label: "New mortgage" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between border-b border-rule bg-paper px-4 py-3 sticky top-0 z-30 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <span className="font-display italic text-lg text-ink">Ledger</span>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="p-2 -mr-2"
        >
          <MenuIcon />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setOpen(false)}
          />
          <nav className="absolute right-0 top-0 h-full w-64 bg-paper border-l border-rule p-6 flex flex-col pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between mb-8">
              <span className="font-display italic text-lg text-ink">
                Ledger
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="p-1"
              >
                <CloseIcon />
              </button>
            </div>
            <SidebarLinks
              pathname={pathname}
              onNavigate={() => setOpen(false)}
            />
            <div className="mt-auto pt-6 border-t border-rule">
              <SidebarFooter email={session?.user?.email} />
            </div>
          </nav>
        </div>
      )}

      {/* Desktop rail */}
      <nav className="hidden md:flex md:flex-col md:w-56 md:shrink-0 md:h-dvh md:sticky md:top-0 border-r border-rule px-6 py-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <span className="font-display italic text-xl text-ink mb-10">
          Ledger
        </span>
        <SidebarLinks pathname={pathname} />
        <div className="mt-auto pt-6 border-t border-rule">
          <SidebarFooter email={session?.user?.email} />
        </div>
      </nav>
    </>
  );
}

function SidebarLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <ul className="space-y-1">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className={`block px-3 py-2 text-sm -mx-3 ${
                active
                  ? "bg-forestSoft text-forest font-medium"
                  : "text-ink hover:bg-ink/5"
              }`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function SidebarFooter({ email }: { email?: string | null }) {
  return (
    <div>
      {email && <p className="text-xs text-slate truncate mb-3">{email}</p>}
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="text-xs text-slate hover:text-ink underline underline-offset-2"
      >
        Sign out
      </button>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
    </svg>
  );
}
