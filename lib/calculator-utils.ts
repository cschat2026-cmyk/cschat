export type ResultMap = Record<string, number>;

export function formatCurrency(value: number, locale = "en-US", currency = "USD") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatPercent(value: number) {
  return `${(Number.isFinite(value) ? value : 0).toFixed(2)}%`;
}

export function formatHours(value: number) {
  return `${Math.round(Number.isFinite(value) ? value : 0)} hours`;
}

export function formatRate(value: number, locale = "en-US", currency = "USD") {
  return `${formatCurrency(value, locale, currency)}/hr`;
}

export function runCalculator(
  slug: string,
  values: Record<string, number>,
): ResultMap {
  if (slug === "etsy-fee-calculator") {
    const gross = values.price + values.shipping;
    const transactionFee = gross * (values.transaction / 100);
    const processingFee = gross * (values.processing / 100) + values.fixed;
    const totalFees = transactionFee + processingFee + values.listing;
    const net = gross - totalFees;
    const profit = net - values.cost;
    const rate = gross > 0 ? (totalFees / gross) * 100 : 0;

    return { gross, fees: totalFees, net, profit, rate };
  }

  if (slug === "paypal-fee-calculator") {
    const fee = values.amount * (values.percent / 100) + values.fixed;
    const received = values.amount - fee;
    const required =
      values.percent < 100 ? (values.target + values.fixed) / (1 - values.percent / 100) : 0;
    const rate = values.amount > 0 ? (fee / values.amount) * 100 : 0;

    return { fee, received, required, rate };
  }

  if (slug === "freelance-rate-calculator") {
    const billable = values.hours * values.weeks;
    const baseTarget = values.income + values.expenses;
    const reserve = baseTarget * (values.tax / 100);
    const target = baseTarget + reserve;
    const rate = billable > 0 ? target / billable : 0;
    const day = rate * 6;

    return { rate, billable, target, reserve, day };
  }

  if (slug === "salary-to-hourly-calculator") {
    const annual = values.salary;
    const weekly = values.weeks > 0 ? annual / values.weeks : 0;
    const hourly = values.hours * values.weeks > 0 ? annual / (values.hours * values.weeks) : 0;
    const monthly = annual / 12;

    return { annual, weekly, hourly, monthly };
  }

  if (
    slug === "sales-tax-calculator" ||
    slug === "vat-calculator" ||
    slug === "gst-hst-calculator" ||
    slug === "gst-calculator-au" ||
    slug === "gst-calculator-nz"
  ) {
    const preTax = values.amount;
    const taxAmount = preTax * (values.rate / 100);
    const total = preTax + taxAmount;

    return { preTax, taxAmount, total };
  }

  if (slug === "stamp-duty-calculator") {
    const duty = values.price * (values.rate / 100);
    const total = values.price + duty;

    return { duty, total };
  }

  return {};
}
