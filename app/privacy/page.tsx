import { contactHref } from "@/lib/contact";

export default function PrivacyPage() {
  return (
    <main className="content-page">
      <section className="page-hero">
        <p className="eyebrow">Privacy</p>
        <h1>Privacy policy placeholder for launch</h1>
        <p>
          This page gives you a clean starting point before adding analytics,
          advertising scripts, email collection, or affiliate links.
        </p>
      </section>

      <section className="policy-card">
        <h2>Information collection</h2>
        <p>
          Margin Atlas may collect non-personal usage data through analytics tools
          such as Google Analytics or privacy-friendly alternatives. If newsletter
          forms or contact forms are added later, update this page with the exact
          data collected and the service providers used.
        </p>

        <h2>Cookies and advertising</h2>
        <p>
          If display advertising is enabled, third-party vendors may use cookies to
          serve ads based on previous visits to this site or other websites. Before
          going live with ads, replace this placeholder text with your final ad and
          consent disclosures.
        </p>

        <h2>Calculator data</h2>
        <p>
          The calculators on this site currently run in the browser and do not
          submit form entries to a backend service. If that changes, document the
          storage, retention, and usage details here.
        </p>

        <h2>Contact</h2>
        <p>
          If you have any privacy questions, suggestions, or improvements for Margin
          Atlas, you can reach us directly by email.
        </p>
        <p className="contact-note">
          We especially welcome valuable suggestions, correction requests, and any
          ideas that could help improve the site experience.
        </p>
        <a className="button button-primary contact-button" href={contactHref}>
          Email Margin Atlas
        </a>
        <p className="contact-note">
          Clicking the button will open your email app with a prefilled Margin Atlas
          subject line for easier feedback organization.
        </p>
      </section>
    </main>
  );
}
