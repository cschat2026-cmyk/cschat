"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { AdSlot } from "@/components/ad-slot";
import type { CalculatorPage } from "@/lib/site-data";
import {
  formatCurrency,
  formatHours,
  formatPercent,
  formatRate,
  runCalculator,
} from "@/lib/calculator-utils";
import { getRegionByCode } from "@/lib/site-data";

type Props = {
  calculator: CalculatorPage;
};

export function CalculatorClient({ calculator }: Props) {
  const searchParams = useSearchParams();
  const regionCode = searchParams.get("region") ?? calculator.primaryRegion;
  const region = getRegionByCode(regionCode);
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(calculator.fields.map((field) => [field.id, field.defaultValue])),
  );

  const results = runCalculator(calculator.slug, values);
  const primaryResult = calculator.results[0];

  function formatValue(
    innerFormat: CalculatorPage["results"][number]["format"],
    innerValue: number,
  ) {
    const locale = calculator.locale ?? region.locale;
    const currency = calculator.currencyCode ?? region.currency;

    if (innerFormat === "currency") {
      return formatCurrency(innerValue, locale, currency);
    }

    if (innerFormat === "percent") {
      return formatPercent(innerValue);
    }

    if (innerFormat === "hours") {
      return formatHours(innerValue);
    }

    return formatRate(innerValue, locale, currency);
  }

  return (
    <section className="calculator-layout">
      <article className="calculator-card">
        <h2>Enter your numbers</h2>
        <form className="calculator-form">
          {calculator.fields.map((field) => (
            <label key={field.id}>
              {field.label}
              <input
                type="number"
                min={field.min ?? 0}
                step={field.step ?? 1}
                value={values[field.id] ?? field.defaultValue}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [field.id]: Number.parseFloat(event.target.value) || 0,
                  }))
                }
              />
            </label>
          ))}
        </form>
      </article>

      <aside className="result-card">
        <p className="eyebrow">Estimated result</p>
        <p className="mini-label">Showing values for {region.name}</p>
        <h2>{formatValue(primaryResult.format, results[primaryResult.id] ?? 0)}</h2>
        <dl className="result-list">
          {calculator.results.map((result) => (
            <div key={result.id}>
              <dt>{result.label}</dt>
              <dd>{formatValue(result.format, results[result.id] ?? 0)}</dd>
            </div>
          ))}
        </dl>
        <AdSlot variant="sidebar" />
      </aside>
    </section>
  );
}
