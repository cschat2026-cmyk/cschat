import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdSlot } from "@/components/ad-slot";
import { CalculatorClient } from "@/components/calculator-client";
import { calculators, getCalculatorBySlug } from "@/lib/site-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return calculators.map((calculator) => ({
    slug: calculator.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const calculator = getCalculatorBySlug(slug);

  if (!calculator) {
    return {};
  }

  return {
    title: calculator.title,
    description: calculator.seoDescription,
  };
}

export default async function CalculatorPage({ params }: Props) {
  const { slug } = await params;
  const calculator = getCalculatorBySlug(slug);

  if (!calculator) {
    notFound();
  }

  return (
    <main className="calculator-page">
      <section className="page-hero compact">
        <p className="eyebrow">{calculator.category}</p>
        <h1>{calculator.title}</h1>
        <p>{calculator.intro}</p>
      </section>

      <CalculatorClient calculator={calculator} />

      <section className="page-grid">
        <article className="content-card">
          <h2>{calculator.explanationTitle}</h2>
          {calculator.explanationBody.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <AdSlot variant="result-inline" />
        </article>
        <article className="content-card">
          <h2>How to grow traffic around this page</h2>
          <p>
            Build related articles, examples, and internal links around this tool so
            the page becomes more useful than a bare calculator and stronger for
            search over time.
          </p>
          <p>
            Good next additions include pricing guides, niche-specific examples,
            country variations, and downloadable templates tied to the same search
            intent.
          </p>
        </article>
      </section>
    </main>
  );
}
