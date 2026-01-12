const Policy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Privacy & Usage Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: January 2026
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-medium">1. Overview</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            This AI chat application is designed to help users communicate,
            generate content, and explore ideas. By using this app, you agree
            to the policies outlined below.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-medium">2. Data & Privacy</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            We do not sell personal data. Messages may be temporarily processed
            to improve system quality and performance. Avoid sharing sensitive
            information such as passwords, financial details, or personal
            identification.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-medium">3. Acceptable Use</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>No illegal, harmful, or abusive content</li>
            <li>No attempts to exploit or bypass system limits</li>
            <li>No impersonation or misinformation</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-medium">4. AI Limitations</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            AI-generated responses may be inaccurate or incomplete. Always
            verify important information and do not rely on the AI for legal,
            medical, or financial decisions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-medium">5. Changes</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            This policy may be updated at any time. Continued use of the
            application means you accept the revised policy.
          </p>
        </section>

        <footer className="pt-6 border-t text-center text-xs text-muted-foreground">
          © 2026 AI Chat App. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Policy;
