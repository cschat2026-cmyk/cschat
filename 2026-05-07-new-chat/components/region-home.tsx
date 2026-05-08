"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { AdSlot } from "@/components/ad-slot";
import {
  calculators,
  defaultRegionCode,
  getFeaturedCalculatorsForRegion,
  getRegionByCode,
  regions,
  type RegionCode,
} from "@/lib/site-data";

function inferRegion(): RegionCode {
  if (typeof navigator === "undefined") {
    return defaultRegionCode;
  }

  const locale = (navigator.language || "").toLowerCase();

  if (locale.includes("en-gb")) {
    return "uk";
  }

  if (locale.includes("en-ca")) {
    return "ca";
  }

  if (locale.includes("en-au")) {
    return "au";
  }

  if (locale.includes("en-nz")) {
    return "nz";
  }

  return "us";
}

export function RegionHome() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [regionCode, setRegionCode] = useState<RegionCode>(defaultRegionCode);

  useEffect(() => {
    const requestedRegion = searchParams.get("region");

    if (
      requestedRegion === "us" ||
      requestedRegion === "uk" ||
      requestedRegion === "ca" ||
      requestedRegion === "au" ||
      requestedRegion === "nz"
    ) {
      setRegionCode(requestedRegion);
      return;
    }

    const inferred = inferRegion();
    setRegionCode(inferred);
    router.replace(`${pathname}?region=${inferred}`);
  }, [pathname, router, searchParams]);

  const activeRegion = useMemo(() => getRegionByCode(regionCode), [regionCode]);
  const featured = useMemo(
    () => getFeaturedCalculatorsForRegion(regionCode),
    [regionCode],
  );
  const broaderCatalog = useMemo(
    () =>
      calculators.filter(
        (calculator) =>
          !featured.some((featuredCalculator) => featuredCalculator.slug === calculator.slug),
      ),
    [featured],
  );

  function handleRegionChange(nextRegion: RegionCode) {
    setRegionCode(nextRegion);
    router.replace(`${pathname}?region=${nextRegion}`);
  }

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Built for international search demand</p>
          <h1>Useful calculators for people who sell, invoice, price work, and compare taxes.</h1>
          <p className="hero-text">
            Margin Atlas now highlights calculator topics by region so users in the
            United States, United Kingdom, Canada, Australia, and New Zealand see
            more relevant pricing, payroll, and tax tools first.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#featured-tools">
              Explore regional tools
            </a>
            <a className="button button-secondary" href="#catalog">
              View full catalog
            </a>
          </div>
        </div>
        <aside className="hero-card">
          <p className="mini-label">Detected audience focus</p>
          <ul className="stat-list">
            <li>
              <strong>{activeRegion.name}</strong>
              <span>{activeRegion.audienceLabel}</span>
            </li>
            <li>
              <strong>Popular search themes</strong>
              <span>{activeRegion.searchSignals.join(", ")}</span>
            </li>
            <li>
              <strong>Catalog breadth</strong>
              <span>{calculators.length} calculators with region-aware surfacing</span>
            </li>
          </ul>
        </aside>
      </section>

      <section className="region-switcher">
        <div className="section-heading">
          <p className="eyebrow">Region targeting</p>
          <h2>Show users the tools that make sense for where they are.</h2>
          <p>
            The homepage defaults to the current locale and still lets users switch
            regions manually if they are researching another country.
          </p>
        </div>
        <div className="region-pills" role="tablist" aria-label="Choose region">
          {regions.map((region) => (
            <button
              key={region.code}
              className={region.code === regionCode ? "region-pill active" : "region-pill"}
              type="button"
              onClick={() => handleRegionChange(region.code)}
            >
              {region.name}
            </button>
          ))}
        </div>
      </section>

      <section className="tools-section">
        <AdSlot variant="hero" />
      </section>

      <section className="tools-section" id="featured-tools">
        <div className="section-heading">
          <p className="eyebrow">Featured for {activeRegion.name}</p>
          <h2>Hotter calculator topics for this market</h2>
          <p>
            These are the tools most aligned with recurring search intent in{" "}
            {activeRegion.name}, based on common payroll, tax, selling, and pricing
            tasks in that market.
          </p>
        </div>
        <div className="tool-grid">
          {featured.map((calculator) => (
            <article className="tool-card" key={calculator.slug}>
              <p className="tool-tag">{calculator.category}</p>
              <h3>{calculator.title}</h3>
              <p>{calculator.description}</p>
              <Link className="inline-link" href={`/calculators/${calculator.slug}?region=${regionCode}`}>
                Open calculator
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="content-layout">
        <article className="content-card">
          <p className="eyebrow">Why regionalization matters</p>
          <h2>Calculator demand changes a lot by country.</h2>
          <p>
            UK users often look for VAT and stamp duty tools. Canadian and Australian
            users search for GST-related calculations. US users respond better to
            sales tax, salary conversion, and marketplace fee tools.
          </p>
          <p>
            By surfacing locally relevant tools first, the site becomes more useful
            and can expand into country-specific SEO clusters over time.
          </p>
        </article>
        <aside className="ad-card">
          <p className="eyebrow">Ad slot placeholder</p>
          <AdSlot variant="tool-grid" />
        </aside>
      </section>

      <section className="tools-section" id="catalog">
        <div className="section-heading">
          <p className="eyebrow">Full catalog</p>
          <h2>Broader calculator coverage across regions</h2>
          <p>
            Keep this section for discovery and internal linking, while using the
            regional section above to focus user attention.
          </p>
        </div>
        <div className="tool-grid">
          {broaderCatalog.map((calculator) => (
            <article className="tool-card" key={calculator.slug}>
              <p className="tool-tag">{calculator.category}</p>
              <h3>{calculator.title}</h3>
              <p>{calculator.description}</p>
              <Link className="inline-link" href={`/calculators/${calculator.slug}?region=${regionCode}`}>
                Open calculator
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="launch-plan">
        <div className="section-heading">
          <p className="eyebrow">Suggested next rollout</p>
          <h2>How to deepen the international footprint</h2>
        </div>
        <div className="timeline">
          <article className="timeline-card">
            <strong>Phase 1</strong>
            <p>
              Publish the regional calculators already in this build and create one
              support article for each region’s top tax topic.
            </p>
          </article>
          <article className="timeline-card">
            <strong>Phase 2</strong>
            <p>
              Add location-specific content such as province or state pages, plus
              paycheck, PAYG, or PAYE calculator variants where useful.
            </p>
          </article>
          <article className="timeline-card">
            <strong>Phase 3</strong>
            <p>
              Localize email capture and affiliate recommendations by market so ad
              traffic has stronger downstream monetization.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
