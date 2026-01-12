const Terms = () => {
  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground">
            Effective date: January 2026
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-medium">1. Acceptance of Terms</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            By accessing or using this AI chat application, you agree to be
            bound by these Terms of Service. If you do not agree, please do not
            use the application.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-medium">2. Use of the Service</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            You agree to use the service responsibly and only for lawful
            purposes. You must not misuse, disrupt, or attempt to reverse
            engineer the system.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-medium">3. User Content</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            You are responsible for the content you submit. You retain ownership
            of your content, but you grant us permission to process it in order
            to operate and improve the service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-medium">4. Service Availability</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            We do not guarantee uninterrupted or error-free operation. The
            service may be modified, suspended, or discontinued at any time
            without notice.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-medium">5. Disclaimer</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The service is provided “as is.” AI-generated responses may be
            incorrect, outdated, or misleading. We are not liable for decisions
            made based on AI output.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-medium">6. Termination</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            We reserve the right to suspend or terminate access if these terms
            are violated.
          </p>
        </section>

        <footer className="pt-6 border-t text-center text-xs text-muted-foreground">
          © 2026 AI Chat App. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Terms;
