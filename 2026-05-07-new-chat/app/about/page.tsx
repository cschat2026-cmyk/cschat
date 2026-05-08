import { contactHref } from "@/lib/contact";

export default function AboutPage() {
  return (
    <main className="content-page">
      <section className="page-hero">
        <p className="eyebrow">About</p>
        <h1>Margin Atlas helps people make better pricing decisions.</h1>
        <p>
          The site is built around fee calculators and freelance pricing tools for
          people who sell online, invoice clients, or compare platforms. The goal is
          to answer practical money questions quickly and clearly.
        </p>
      </section>

      <section className="page-grid">
        <article className="content-card">
          <h2>What this site covers</h2>
          <p>
            Margin Atlas focuses on calculators that support real business actions:
            setting product prices, estimating platform fees, pricing freelance
            projects, and understanding take-home revenue.
          </p>
          <p>
            Over time, this can grow into supporting articles, templates, and
            comparison pages that help visitors move from rough estimates to better
            decisions.
          </p>
        </article>
        <article className="content-card">
          <h2>What makes the site useful</h2>
          <p>
            Each calculator includes explanatory text, assumptions, and a clear
            result. This helps both users and search engines understand why the page
            exists and how it should be used.
          </p>
          <p>
            The site is also intentionally lightweight so it loads fast on mobile and
            can be maintained by a solo operator.
          </p>
          <h2>Share your feedback</h2>
          <p className="contact-note">
            If you have any valuable suggestions, feature ideas, bug reports, or
            thoughts on how this website can be improved, we would love to hear from you.
          </p>
          <p className="contact-note">
            Your feedback helps us keep improving Margin Atlas and build better tools
            for future visitors.
          </p>
          <a className="button button-primary contact-button" href={contactHref}>
            Contact us by email
          </a>
          <p className="contact-note">
            Click the button above to open your email app with a ready-made subject line,
            so we can easily identify feedback from Margin Atlas.
          </p>
        </article>
      </section>
    </main>
  );
}
