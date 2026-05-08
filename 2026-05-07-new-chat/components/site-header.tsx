import Link from "next/link";

import { CountrySwitcher } from "@/components/country-switcher";

export function SiteHeader() {
  return (
    <header className="topbar">
      <Link className="brand" href="/">
        <span className="brand-mark">M</span>
        <span className="brand-copy">
          <strong>Margin Atlas</strong>
          <span>Seller and creator calculators</span>
        </span>
      </Link>
      <nav className="topnav" aria-label="Primary">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/privacy">Privacy</Link>
      </nav>
      <CountrySwitcher />
    </header>
  );
}
