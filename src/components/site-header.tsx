import Link from "next/link";
import { Menu, MessageCircle } from "lucide-react";
import { ButtonLink, Container } from "@/components/ui";

const nav = [
  { href: "/courses/ssc-to-hsc-science-bridge", label: "Bridge Course" },
  { href: "/courses/hsc-26-exam-ready", label: "HSC 26" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Enrol" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/92 shadow-[0_8px_30px_rgba(32,48,37,0.06)] backdrop-blur-xl">
      <Container className="flex min-h-18 items-center justify-between gap-3 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3 font-semibold">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-sm text-primary-foreground shadow-sm">
            G
          </span>
          <span className="min-w-0 leading-tight">
            GRADE
            <span className="hidden text-xs font-medium text-muted-foreground sm:block">
              Academic Coaching
            </span>
          </span>
        </Link>
        <nav className="hidden items-center rounded-full border border-border bg-card/80 px-2 py-1 text-sm font-medium text-muted-foreground lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 transition hover:bg-muted hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="inline-grid size-11 place-items-center rounded-xl border border-border bg-card text-primary lg:hidden"
            aria-label="Open navigation"
            title="Navigation"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
          <ButtonLink href="/login" variant="secondary">
            Login
          </ButtonLink>
          <a
            href="https://wa.me/8801700000000"
            className="hidden min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-[#104d36] sm:inline-flex"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Chat on WhatsApp
          </a>
        </div>
      </Container>
    </header>
  );
}
