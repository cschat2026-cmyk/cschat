import Link from "next/link";

import { contactHref } from "@/lib/contact";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div>
        <strong>Margin Atlas</strong>
        <p>Practical calculators for fees, taxes, salary, and pricing decisions.</p>
        <p className="contact-note">
          If you have any suggestions, ideas, or improvements, feel free to email us anytime.
        </p>
      </div>
      <div className="footer-links">
        <Link href="/about">About</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/calculators/etsy-fee-calculator">Etsy Calculator</Link>
        <a href={contactHref}>Contact</a>
      </div>
    </footer>
  );
}
