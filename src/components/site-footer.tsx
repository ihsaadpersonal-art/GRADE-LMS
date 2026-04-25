import { Container } from "@/components/ui";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card py-8">
      <Container className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>GRADE Academic Coaching, Bangladesh</p>
        <p>Science + English for SSC and HSC students with daily accountability.</p>
      </Container>
    </footer>
  );
}
