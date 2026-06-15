import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/guides/security-code-review")({
  component: SecurityCodeReviewGuide,
  head: () => ({
    meta: [
      { title: "AI Security Code Review: An AI Code Checker Guide — CodeScan AI" },
      {
        name: "description",
        content:
          "Learn how an AI security code review and AI code checker detect vulnerabilities like SQL injection and insecure React patterns before they ship.",
      },
      { property: "og:title", content: "AI Security Code Review — An AI Code Checker Guide" },
      {
        property: "og:description",
        content:
          "How to use AI to find security vulnerabilities in code: SQL injection, XSS, secrets, and insecure React patterns.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://ntellicode-pal.lovable.app/guides/security-code-review" },
    ],
    links: [
      { rel: "canonical", href: "https://ntellicode-pal.lovable.app/guides/security-code-review" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "AI Security Code Review: An AI Code Checker Guide",
          description:
            "How to use AI to find security vulnerabilities in code, from SQL injection to insecure React patterns.",
          author: { "@type": "Organization", name: "CodeScan AI" },
        }),
      },
    ],
  }),
});

function SecurityCodeReviewGuide() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6">
      <article className="flex flex-col gap-6 text-cs-text">
        <header className="flex flex-col gap-3">
          <Link to="/" className="font-mono text-sm text-cs-info hover:underline">
            ← Back to CodeScan AI
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            AI Security Code Review: A Practical AI Code Checker Guide
          </h1>
          <p className="text-cs-muted">
            How automated, AI-powered code review catches security vulnerabilities —
            SQL injection, XSS, leaked secrets, and insecure React patterns — before
            they reach production.
          </p>
        </header>
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-bold">What is an AI security code review?</h2>
          <p className="leading-relaxed text-cs-muted">
            An AI security code review uses a large language model to read your source
            code the way a senior security engineer would: tracing data flow,
            spotting unsafe patterns, and explaining the risk in plain language. Unlike
            a simple linter, an AI code checker reasons about intent, so it can flag a
            SQL query built with string concatenation as an injection risk even when
            the syntax is valid.
          </p>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-bold">Vulnerabilities an AI code checker finds</h2>
          <ul className="flex list-disc flex-col gap-2 pl-5 text-cs-muted">
            <li>
              <strong className="text-cs-text">SQL injection</strong> — queries assembled
              from unsanitized input instead of parameterized statements.
            </li>
            <li>
              <strong className="text-cs-text">Cross-site scripting (XSS)</strong> — unsafe
              use of <code>dangerouslySetInnerHTML</code> or unescaped user content.
            </li>
            <li>
              <strong className="text-cs-text">Hardcoded secrets</strong> — API keys and
              tokens committed directly into source files.
            </li>
            <li>
              <strong className="text-cs-text">Insecure React patterns</strong> — missing
              input validation, unsafe effects, and unvalidated redirects.
            </li>
          </ul>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-bold">How to run a review with CodeScan AI</h2>
          <p className="leading-relaxed text-cs-muted">
            Paste a snippet, point at a public GitHub file, or scan a whole repository.
            CodeScan AI returns categorized findings (bugs, security, quality), then
            generates and runs edge-case tests, a full test suite, and a simulated
            CI/CD pipeline — giving you an evaluation grade and concrete fixes.
          </p>
          <Link
            to="/"
            className="inline-flex w-fit items-center justify-center rounded-md bg-cs-info px-4 py-2.5 text-sm font-bold text-cs-bg transition-colors hover:bg-cs-info/90"
          >
            Run a free AI code review
          </Link>
        </section>
      </article>
    </main>
  );
}