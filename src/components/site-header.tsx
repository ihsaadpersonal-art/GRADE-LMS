import Link from "next/link";
import { MessageCircle } from "lucide-react";
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
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <Container className="flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 font-semibold">
          <span className="grid size-9 place-items-center rounded-md bg-primary text-sm text-primary-foreground">
            G
          </span>
          <span className="leading-tight">
            GRADE
            <span className="block text-xs font-medium text-muted-foreground">
              Academic Coaching
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-muted-foreground lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-primary">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ButtonLink href="/login" variant="secondary">
            Login
          </ButtonLink>
          <a
            href="https://wa.me/8801700000000"
            className="hidden min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-[#164d3a] sm:inline-flex"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            WhatsApp
          </a>
        </div>
      </Container>
    </header>
  );
}
