export type CalculatorField = {
  id: string;
  label: string;
  defaultValue: number;
  step?: number;
  min?: number;
};

export type CalculatorResult = {
  id: string;
  label: string;
  format: "currency" | "percent" | "hours" | "rate";
};

export type RegionCode = "us" | "uk" | "ca" | "au" | "nz";

export type Region = {
  code: RegionCode;
  name: string;
  currency: string;
  locale: string;
  audienceLabel: string;
  searchSignals: string[];
  featuredSlugs: string[];
};

export type CalculatorPage = {
  slug: string;
  category: string;
  title: string;
  description: string;
  intro: string;
  fields: CalculatorField[];
  results: CalculatorResult[];
  explanationTitle: string;
  explanationBody: string[];
  seoTitle: string;
  seoDescription: string;
  supportedRegions: RegionCode[];
  primaryRegion: RegionCode;
  currencyCode?: string;
  locale?: string;
};

export const siteName = "Margin Atlas";
export const siteDescription =
  "Region-aware calculators for seller fees, taxes, payroll, and freelance pricing across major English-speaking markets.";

export const regions: Region[] = [
  {
    code: "us",
    name: "United States",
    currency: "USD",
    locale: "en-US",
    audienceLabel: "US sellers, freelancers, and households",
    searchSignals: ["seller fees", "salary", "take-home pay", "mortgage"],
    featuredSlugs: [
      "etsy-fee-calculator",
      "paypal-fee-calculator",
      "freelance-rate-calculator",
      "salary-to-hourly-calculator",
      "sales-tax-calculator",
    ],
  },
  {
    code: "uk",
    name: "United Kingdom",
    currency: "GBP",
    locale: "en-GB",
    audienceLabel: "UK buyers, side hustlers, and landlords",
    searchSignals: ["stamp duty", "VAT", "salary", "take-home pay"],
    featuredSlugs: [
      "stamp-duty-calculator",
      "vat-calculator",
      "salary-to-hourly-calculator",
      "paypal-fee-calculator",
      "freelance-rate-calculator",
    ],
  },
  {
    code: "ca",
    name: "Canada",
    currency: "CAD",
    locale: "en-CA",
    audienceLabel: "Canadian payroll and small business users",
    searchSignals: ["payroll deductions", "GST/HST", "salary", "freelance"],
    featuredSlugs: [
      "gst-hst-calculator",
      "salary-to-hourly-calculator",
      "paypal-fee-calculator",
      "freelance-rate-calculator",
      "etsy-fee-calculator",
    ],
  },
  {
    code: "au",
    name: "Australia",
    currency: "AUD",
    locale: "en-AU",
    audienceLabel: "Australian workers and GST-focused businesses",
    searchSignals: ["GST", "PAYG", "salary", "freelance"],
    featuredSlugs: [
      "gst-calculator-au",
      "salary-to-hourly-calculator",
      "freelance-rate-calculator",
      "paypal-fee-calculator",
      "etsy-fee-calculator",
    ],
  },
  {
    code: "nz",
    name: "New Zealand",
    currency: "NZD",
    locale: "en-NZ",
    audienceLabel: "NZ sole traders and PAYE searchers",
    searchSignals: ["GST", "PAYE", "salary", "fees"],
    featuredSlugs: [
      "gst-calculator-nz",
      "salary-to-hourly-calculator",
      "paypal-fee-calculator",
      "freelance-rate-calculator",
      "etsy-fee-calculator",
    ],
  },
];

export const calculators: CalculatorPage[] = [
  {
    slug: "etsy-fee-calculator",
    category: "Marketplace fees",
    title: "Etsy Fee Calculator",
    description:
      "Estimate listing fees, transaction fees, payment processing fees, and your net profit before you set a selling price.",
    intro:
      "Estimate how much Etsy fees can reduce your revenue before you set a selling price. Use this for quick margin checks and pricing experiments.",
    fields: [
      { id: "price", label: "Item price", defaultValue: 48, min: 0, step: 0.01 },
      {
        id: "shipping",
        label: "Shipping charged to customer",
        defaultValue: 6,
        min: 0,
        step: 0.01,
      },
      { id: "cost", label: "Your product cost", defaultValue: 18, min: 0, step: 0.01 },
      {
        id: "transaction",
        label: "Etsy transaction fee (%)",
        defaultValue: 6.5,
        min: 0,
        step: 0.01,
      },
      {
        id: "processing",
        label: "Payment processing fee (%)",
        defaultValue: 3,
        min: 0,
        step: 0.01,
      },
      { id: "fixed", label: "Payment fixed fee", defaultValue: 0.25, min: 0, step: 0.01 },
      { id: "listing", label: "Listing fee", defaultValue: 0.2, min: 0, step: 0.01 },
    ],
    results: [
      { id: "gross", label: "Gross order value", format: "currency" },
      { id: "fees", label: "Total fees", format: "currency" },
      { id: "net", label: "Net after fees", format: "currency" },
      { id: "profit", label: "Profit after product cost", format: "currency" },
      { id: "rate", label: "Fee rate", format: "percent" },
    ],
    explanationTitle: "How this Etsy fee calculator works",
    explanationBody: [
      "This calculator adds the product price and shipping charged to the customer, applies a transaction fee percentage, then applies a payment processing percentage and fixed fee. It also includes the listing fee and subtracts your product cost to estimate remaining profit.",
      "For real-world use, you may also want to account for packaging, shipping labels, taxes, and discounts. Those can be added later as optional inputs if you want a more advanced version.",
    ],
    seoTitle: "Etsy Fee Calculator | Margin Atlas",
    seoDescription:
      "Estimate Etsy listing fees, transaction fees, payment processing fees, and your net profit with this free Etsy fee calculator.",
    supportedRegions: ["us", "uk", "ca", "au", "nz"],
    primaryRegion: "us",
    currencyCode: "USD",
    locale: "en-US",
  },
  {
    slug: "paypal-fee-calculator",
    category: "Payment processing",
    title: "PayPal Fee Calculator",
    description:
      "Estimate PayPal fees and reverse-calculate the amount to charge if you want to receive a target amount after processing fees.",
    intro:
      "Work backward from your target payout or calculate your estimated processing cost on a payment you are about to receive.",
    fields: [
      { id: "amount", label: "Amount charged", defaultValue: 250, min: 0, step: 0.01 },
      { id: "percent", label: "Fee percentage (%)", defaultValue: 3.49, min: 0, step: 0.01 },
      { id: "fixed", label: "Fixed fee", defaultValue: 0.49, min: 0, step: 0.01 },
      {
        id: "target",
        label: "Target amount you want to receive",
        defaultValue: 200,
        min: 0,
        step: 0.01,
      },
    ],
    results: [
      { id: "fee", label: "Processing fee", format: "currency" },
      { id: "received", label: "Net received", format: "currency" },
      { id: "required", label: "Charge needed for target", format: "currency" },
      { id: "rate", label: "Effective fee rate", format: "percent" },
    ],
    explanationTitle: "When to use a PayPal fee calculator",
    explanationBody: [
      "This tool is useful when you are setting a price for freelance work, selling a digital file, or quoting a one-off invoice and want to know how much payment processing will take from the final amount.",
      "The reverse calculation is especially helpful when you have a fixed target amount in mind and need to price around the fee.",
    ],
    seoTitle: "PayPal Fee Calculator | Margin Atlas",
    seoDescription:
      "Estimate PayPal fees and reverse-calculate the amount to charge if you want to receive a target amount after processing fees.",
    supportedRegions: ["us", "uk", "ca", "au", "nz"],
    primaryRegion: "us",
    currencyCode: "USD",
    locale: "en-US",
  },
  {
    slug: "freelance-rate-calculator",
    category: "Freelance pricing",
    title: "Freelance Rate Calculator",
    description:
      "Estimate an hourly freelance rate based on income goals, business expenses, taxes, and realistic billable hours.",
    intro:
      "Estimate an hourly rate based on your annual income goal, business overhead, taxes, and the realistic number of billable hours you can sell.",
    fields: [
      { id: "income", label: "Annual income goal", defaultValue: 90000, min: 0, step: 1 },
      {
        id: "expenses",
        label: "Annual business expenses",
        defaultValue: 12000,
        min: 0,
        step: 1,
      },
      { id: "tax", label: "Tax buffer (%)", defaultValue: 25, min: 0, step: 0.1 },
      {
        id: "hours",
        label: "Billable hours per week",
        defaultValue: 24,
        min: 1,
        step: 0.5,
      },
      {
        id: "weeks",
        label: "Working weeks per year",
        defaultValue: 46,
        min: 1,
        step: 1,
      },
    ],
    results: [
      { id: "rate", label: "Suggested hourly rate", format: "rate" },
      { id: "billable", label: "Billable hours per year", format: "hours" },
      { id: "target", label: "Pre-tax revenue target", format: "currency" },
      { id: "reserve", label: "Annual tax reserve", format: "currency" },
      { id: "day", label: "Suggested project day rate", format: "currency" },
    ],
    explanationTitle: "Why freelancers underprice themselves",
    explanationBody: [
      "Many rate discussions start from a salary number and ignore unpaid admin time, marketing, taxes, and business software. This calculator helps you work from a more realistic revenue target.",
      "It is meant as a planning tool, not tax or legal advice, and should be adjusted to fit your market, skill level, and project complexity.",
    ],
    seoTitle: "Freelance Rate Calculator | Margin Atlas",
    seoDescription:
      "Estimate an hourly freelance rate based on income goals, business expenses, and billable hours with this free rate calculator.",
    supportedRegions: ["us", "uk", "ca", "au", "nz"],
    primaryRegion: "us",
    currencyCode: "USD",
    locale: "en-US",
  },
  {
    slug: "salary-to-hourly-calculator",
    category: "Salary conversion",
    title: "Salary to Hourly Calculator",
    description:
      "Convert annual salary into hourly, weekly, and monthly pay using a realistic number of working weeks and hours.",
    intro:
      "Turn a salary offer into hourly and weekly numbers so users can compare job offers, freelance rates, and part-time work more clearly.",
    fields: [
      { id: "salary", label: "Annual salary", defaultValue: 72000, min: 0, step: 1 },
      { id: "hours", label: "Hours worked per week", defaultValue: 40, min: 1, step: 0.5 },
      { id: "weeks", label: "Working weeks per year", defaultValue: 52, min: 1, step: 1 },
    ],
    results: [
      { id: "hourly", label: "Hourly pay", format: "rate" },
      { id: "weekly", label: "Weekly pay", format: "currency" },
      { id: "monthly", label: "Monthly pay", format: "currency" },
      { id: "annual", label: "Annual salary", format: "currency" },
    ],
    explanationTitle: "Why salary conversion tools stay useful",
    explanationBody: [
      "Salary conversion tools are a steady search category because job seekers, contractors, and side hustlers often compare income in different formats.",
      "This page also works well as a bridge into related content like take-home pay guides, overtime explainers, and local payroll tools.",
    ],
    seoTitle: "Salary to Hourly Calculator | Margin Atlas",
    seoDescription:
      "Convert annual salary into hourly, weekly, and monthly pay with this free salary to hourly calculator.",
    supportedRegions: ["us", "uk", "ca", "au", "nz"],
    primaryRegion: "us",
    currencyCode: "USD",
    locale: "en-US",
  },
  {
    slug: "sales-tax-calculator",
    category: "US taxes",
    title: "Sales Tax Calculator",
    description:
      "Add or remove sales tax from a price to estimate totals for shoppers, sellers, and small business owners in the United States.",
    intro:
      "Useful for US checkouts, invoicing, and product pricing when you need to add sales tax to a subtotal or back it out from a total price.",
    fields: [
      { id: "amount", label: "Price before tax", defaultValue: 125, min: 0, step: 0.01 },
      { id: "tax", label: "Sales tax rate (%)", defaultValue: 8.25, min: 0, step: 0.01 },
    ],
    results: [
      { id: "taxAmount", label: "Sales tax amount", format: "currency" },
      { id: "total", label: "Total with tax", format: "currency" },
      { id: "preTax", label: "Subtotal before tax", format: "currency" },
    ],
    explanationTitle: "Why a US sales tax calculator is useful",
    explanationBody: [
      "US tax rates vary by state and local jurisdiction, so people often want a quick way to estimate purchase totals or split tax out of a final amount.",
      "This type of page is easy to pair with state-specific explainers, checkout examples, and small business content.",
    ],
    seoTitle: "Sales Tax Calculator | Margin Atlas",
    seoDescription:
      "Add or remove sales tax from a price with this US sales tax calculator for shoppers and small businesses.",
    supportedRegions: ["us"],
    primaryRegion: "us",
    currencyCode: "USD",
    locale: "en-US",
  },
  {
    slug: "stamp-duty-calculator",
    category: "UK property",
    title: "Stamp Duty Calculator",
    description:
      "Estimate stamp duty land tax on a UK property purchase using a simple price and rate-based model.",
    intro:
      "A helpful first-pass tool for buyers researching UK home costs before speaking with a mortgage broker or solicitor.",
    fields: [
      { id: "price", label: "Property price", defaultValue: 425000, min: 0, step: 1 },
      { id: "rate", label: "Effective tax rate (%)", defaultValue: 5, min: 0, step: 0.01 },
    ],
    results: [
      { id: "duty", label: "Estimated stamp duty", format: "currency" },
      { id: "total", label: "Price plus duty", format: "currency" },
    ],
    explanationTitle: "Why stamp duty tools attract UK search demand",
    explanationBody: [
      "Property buyers often search for stamp duty estimates early in the decision process, which makes this a strong example of high-intent traffic.",
      "You can expand this page later with first-time buyer scenarios, threshold explainers, and regional notes.",
    ],
    seoTitle: "Stamp Duty Calculator | Margin Atlas",
    seoDescription:
      "Estimate UK stamp duty land tax on a property purchase with this simple stamp duty calculator.",
    supportedRegions: ["uk"],
    primaryRegion: "uk",
    currencyCode: "GBP",
    locale: "en-GB",
  },
  {
    slug: "vat-calculator",
    category: "UK business tax",
    title: "VAT Calculator",
    description:
      "Add VAT to a net price or remove VAT from a gross total with a simple UK-friendly VAT calculator.",
    intro:
      "Useful for UK invoices, seller pricing, and basic business math when people need to switch between VAT-inclusive and VAT-exclusive amounts.",
    fields: [
      { id: "amount", label: "Net price", defaultValue: 100, min: 0, step: 0.01 },
      { id: "rate", label: "VAT rate (%)", defaultValue: 20, min: 0, step: 0.01 },
    ],
    results: [
      { id: "taxAmount", label: "VAT amount", format: "currency" },
      { id: "total", label: "Total with VAT", format: "currency" },
      { id: "preTax", label: "Net price", format: "currency" },
    ],
    explanationTitle: "Why a VAT calculator is a durable UK tool",
    explanationBody: [
      "VAT is a recurring task for freelancers, agencies, e-commerce sellers, and small businesses, which keeps this type of tool useful over time.",
      "It also pairs naturally with invoice templates, pricing guides, and tax explainer content.",
    ],
    seoTitle: "VAT Calculator | Margin Atlas",
    seoDescription:
      "Add VAT to a price or remove VAT from a total with this simple UK-friendly VAT calculator.",
    supportedRegions: ["uk"],
    primaryRegion: "uk",
    currencyCode: "GBP",
    locale: "en-GB",
  },
  {
    slug: "gst-hst-calculator",
    category: "Canadian business tax",
    title: "GST/HST Calculator",
    description:
      "Estimate GST or HST on a sale amount for Canadian business, invoice, and checkout use cases.",
    intro:
      "A practical calculator for Canadian sellers and buyers who need to estimate tax on a subtotal or identify how much tax is inside a final total.",
    fields: [
      { id: "amount", label: "Price before tax", defaultValue: 140, min: 0, step: 0.01 },
      { id: "rate", label: "GST/HST rate (%)", defaultValue: 13, min: 0, step: 0.01 },
    ],
    results: [
      { id: "taxAmount", label: "Tax amount", format: "currency" },
      { id: "total", label: "Total with tax", format: "currency" },
      { id: "preTax", label: "Subtotal before tax", format: "currency" },
    ],
    explanationTitle: "Why GST/HST tools are valuable in Canada",
    explanationBody: [
      "Canadian users often need quick GST/HST estimates for invoices and checkout totals, especially when comparing provinces or quoting clients.",
      "This page can later expand into province-specific content and payroll deduction topics.",
    ],
    seoTitle: "GST HST Calculator | Margin Atlas",
    seoDescription:
      "Estimate GST or HST on a sale amount with this simple Canadian GST HST calculator.",
    supportedRegions: ["ca"],
    primaryRegion: "ca",
    currencyCode: "CAD",
    locale: "en-CA",
  },
  {
    slug: "gst-calculator-au",
    category: "Australian business tax",
    title: "GST Calculator Australia",
    description:
      "Add or remove GST from a price for Australian invoices, quotes, and basic business math.",
    intro:
      "A fast calculator for Australian businesses and freelancers who need to convert between GST-exclusive and GST-inclusive pricing.",
    fields: [
      { id: "amount", label: "Net price", defaultValue: 180, min: 0, step: 0.01 },
      { id: "rate", label: "GST rate (%)", defaultValue: 10, min: 0, step: 0.01 },
    ],
    results: [
      { id: "taxAmount", label: "GST amount", format: "currency" },
      { id: "total", label: "Total with GST", format: "currency" },
      { id: "preTax", label: "Net price", format: "currency" },
    ],
    explanationTitle: "Why GST calculators stay relevant in Australia",
    explanationBody: [
      "Australian business users repeatedly need GST-inclusive and exclusive conversions for quotes, invoices, and online sales.",
      "This type of page is lightweight to run and can lead into bookkeeping and BAS-related content later.",
    ],
    seoTitle: "GST Calculator Australia | Margin Atlas",
    seoDescription:
      "Add or remove GST from a price with this Australian GST calculator for business and freelance use.",
    supportedRegions: ["au"],
    primaryRegion: "au",
    currencyCode: "AUD",
    locale: "en-AU",
  },
  {
    slug: "gst-calculator-nz",
    category: "New Zealand business tax",
    title: "GST Calculator NZ",
    description:
      "Add or remove GST from a price for New Zealand invoices, side business pricing, and checkout totals.",
    intro:
      "A practical GST calculator for New Zealand sole traders and small businesses that need fast tax-inclusive or tax-exclusive amounts.",
    fields: [
      { id: "amount", label: "Net price", defaultValue: 180, min: 0, step: 0.01 },
      { id: "rate", label: "GST rate (%)", defaultValue: 15, min: 0, step: 0.01 },
    ],
    results: [
      { id: "taxAmount", label: "GST amount", format: "currency" },
      { id: "total", label: "Total with GST", format: "currency" },
      { id: "preTax", label: "Net price", format: "currency" },
    ],
    explanationTitle: "Why NZ GST tools fit this site",
    explanationBody: [
      "New Zealand business users often need simple GST math for pricing and invoices, which makes this a practical evergreen calculator page.",
      "It also gives the site a cleaner regional footprint across the main English-speaking markets.",
    ],
    seoTitle: "GST Calculator NZ | Margin Atlas",
    seoDescription:
      "Add or remove GST from a price with this New Zealand GST calculator for invoices and small business pricing.",
    supportedRegions: ["nz"],
    primaryRegion: "nz",
    currencyCode: "NZD",
    locale: "en-NZ",
  },
];

export const defaultRegionCode: RegionCode = "us";

export const getCalculatorBySlug = (slug: string) =>
  calculators.find((calculator) => calculator.slug === slug);

export const getRegionByCode = (code: string) =>
  regions.find((region) => region.code === code) ?? regions[0];

export const getCalculatorsForRegion = (code: RegionCode) =>
  calculators.filter((calculator) => calculator.supportedRegions.includes(code));

export const getFeaturedCalculatorsForRegion = (code: RegionCode) => {
  const region = getRegionByCode(code);
  return region.featuredSlugs
    .map((slug) => getCalculatorBySlug(slug))
    .filter((calculator): calculator is CalculatorPage => Boolean(calculator));
};
