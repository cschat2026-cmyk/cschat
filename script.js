function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

function formatPercent(value) {
  return `${(Number.isFinite(value) ? value : 0).toFixed(2)}%`;
}

function getNumber(id) {
  const element = document.getElementById(id);
  if (!element) {
    return 0;
  }
  return Number.parseFloat(element.value) || 0;
}

function updateText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

function runEtsyCalculator() {
  const price = getNumber("etsy-price");
  const shipping = getNumber("etsy-shipping");
  const cost = getNumber("etsy-cost");
  const transactionRate = getNumber("etsy-transaction") / 100;
  const processingRate = getNumber("etsy-processing") / 100;
  const fixedFee = getNumber("etsy-fixed");
  const listingFee = getNumber("etsy-listing");

  const gross = price + shipping;
  const transactionFee = gross * transactionRate;
  const processingFee = gross * processingRate + fixedFee;
  const totalFees = transactionFee + processingFee + listingFee;
  const net = gross - totalFees;
  const profit = net - cost;
  const feeRate = gross > 0 ? (totalFees / gross) * 100 : 0;

  updateText("etsy-gross", formatCurrency(gross));
  updateText("etsy-fees", formatCurrency(totalFees));
  updateText("etsy-net", formatCurrency(net));
  updateText("etsy-profit", formatCurrency(profit));
  updateText("etsy-rate", formatPercent(feeRate));
}

function runPayPalCalculator() {
  const amount = getNumber("paypal-amount");
  const percent = getNumber("paypal-percent") / 100;
  const fixed = getNumber("paypal-fixed");
  const target = getNumber("paypal-target");

  const fee = amount * percent + fixed;
  const netReceived = amount - fee;
  const requiredCharge = percent < 1 ? (target + fixed) / (1 - percent) : 0;
  const feeRate = amount > 0 ? (fee / amount) * 100 : 0;

  updateText("paypal-fee", formatCurrency(fee));
  updateText("paypal-net", formatCurrency(netReceived));
  updateText("paypal-received", formatCurrency(netReceived));
  updateText("paypal-required", formatCurrency(requiredCharge));
  updateText("paypal-rate", formatPercent(feeRate));
}

function runFreelanceCalculator() {
  const incomeGoal = getNumber("freelance-income");
  const expenses = getNumber("freelance-expenses");
  const taxPercent = getNumber("freelance-tax") / 100;
  const hoursPerWeek = getNumber("freelance-hours");
  const weeksPerYear = getNumber("freelance-weeks");

  const billableHours = hoursPerWeek * weeksPerYear;
  const baseTarget = incomeGoal + expenses;
  const taxReserve = baseTarget * taxPercent;
  const revenueTarget = baseTarget + taxReserve;
  const hourlyRate = billableHours > 0 ? revenueTarget / billableHours : 0;
  const dayRate = hourlyRate * 6;

  updateText("freelance-rate", `${formatCurrency(hourlyRate)}/hr`);
  updateText("freelance-billable", `${billableHours.toFixed(0)} hours`);
  updateText("freelance-target", formatCurrency(revenueTarget));
  updateText("freelance-reserve", formatCurrency(taxReserve));
  updateText("freelance-day", formatCurrency(dayRate));
}

function runSalaryCalculator() {
  const annual = getNumber("salary-annual");
  const hours = getNumber("salary-hours");
  const weeks = getNumber("salary-weeks");

  const weekly = weeks > 0 ? annual / weeks : 0;
  const hourly = hours * weeks > 0 ? annual / (hours * weeks) : 0;
  const monthly = annual / 12;

  updateText("salary-hourly", `${formatCurrency(hourly)}/hr`);
  updateText("salary-weekly", formatCurrency(weekly));
  updateText("salary-monthly", formatCurrency(monthly));
  updateText("salary-annual-result", formatCurrency(annual));
}

function runTaxStyleCalculator() {
  const amount = getNumber("tax-amount");
  const rate = getNumber("tax-rate") / 100;
  const taxAmount = amount * rate;
  const total = amount + taxAmount;

  updateText("tax-total", formatCurrency(total));
  updateText("tax-amount-result", formatCurrency(taxAmount));
  updateText("tax-total-result", formatCurrency(total));
  updateText("tax-pre-tax", formatCurrency(amount));
}

function bindCalculator(formId, callback) {
  const form = document.getElementById(formId);
  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    callback();
  });

  form.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", callback);
  });

  callback();
}

const regionContent = {
  us: {
    name: "United States",
    heading: "Featured tools for United States",
    title: "Start with US pricing, salary, and seller tools",
    tools: [
      {
        tag: "Marketplace fees",
        title: "Etsy Fee Calculator",
        description: "Estimate listing fees and payment processing for sellers.",
        href: "./calculators/etsy-fee-calculator.html",
      },
      {
        tag: "Payment processing",
        title: "PayPal Fee Calculator",
        description: "Reverse-calculate pricing when you want to keep a target amount.",
        href: "./calculators/paypal-fee-calculator.html",
      },
      {
        tag: "Salary conversion",
        title: "Salary to Hourly Calculator",
        description: "Compare annual salary, hourly pay, and weekly income more clearly.",
        href: "./calculators/salary-to-hourly-calculator.html",
      },
    ],
  },
  uk: {
    name: "United Kingdom",
    heading: "Featured tools for United Kingdom",
    title: "Start with VAT, property, and pricing tools for the UK",
    tools: [
      {
        tag: "UK property",
        title: "Stamp Duty Calculator",
        description: "A strong UK-focused topic for homebuyers and researchers.",
        href: "./calculators/vat-calculator.html",
      },
      {
        tag: "UK business tax",
        title: "VAT Calculator",
        description: "Useful for invoices, quotes, and small business pricing.",
        href: "./calculators/vat-calculator.html",
      },
      {
        tag: "Salary conversion",
        title: "Salary to Hourly Calculator",
        description: "Useful for UK job comparisons and freelance rate planning.",
        href: "./calculators/salary-to-hourly-calculator.html",
      },
    ],
  },
  ca: {
    name: "Canada",
    heading: "Featured tools for Canada",
    title: "Start with payroll, GST/HST, and seller tools for Canada",
    tools: [
      {
        tag: "Canadian business tax",
        title: "GST/HST Calculator",
        description: "A strong recurring use case for Canadian invoices and checkout totals.",
        href: "./calculators/gst-hst-calculator.html",
      },
      {
        tag: "Salary conversion",
        title: "Salary to Hourly Calculator",
        description: "Common for Canadian payroll comparisons and offer reviews.",
        href: "./calculators/salary-to-hourly-calculator.html",
      },
      {
        tag: "Marketplace fees",
        title: "Etsy Fee Calculator",
        description: "Useful for Canadian creators and handmade sellers.",
        href: "./calculators/etsy-fee-calculator.html",
      },
    ],
  },
  au: {
    name: "Australia",
    heading: "Featured tools for Australia",
    title: "Start with GST, rate planning, and business pricing for Australia",
    tools: [
      {
        tag: "Australian business tax",
        title: "GST Calculator Australia",
        description: "Useful for quotes, invoices, and online business pricing.",
        href: "./calculators/gst-calculator-au.html",
      },
      {
        tag: "Freelance pricing",
        title: "Freelance Rate Calculator",
        description: "Helpful for contractors and independent professionals.",
        href: "./calculators/freelance-rate-calculator.html",
      },
      {
        tag: "Marketplace fees",
        title: "Etsy Fee Calculator",
        description: "Good for Australian sellers validating handmade pricing.",
        href: "./calculators/etsy-fee-calculator.html",
      },
    ],
  },
  nz: {
    name: "New Zealand",
    heading: "Featured tools for New Zealand",
    title: "Start with GST and small business tools for New Zealand",
    tools: [
      {
        tag: "New Zealand business tax",
        title: "GST Calculator NZ",
        description: "Useful for sole traders and small business pricing.",
        href: "./calculators/gst-calculator-nz.html",
      },
      {
        tag: "Salary conversion",
        title: "Salary to Hourly Calculator",
        description: "Useful for NZ pay comparisons and side-income planning.",
        href: "./calculators/salary-to-hourly-calculator.html",
      },
      {
        tag: "Freelance pricing",
        title: "Freelance Rate Calculator",
        description: "A practical baseline tool for independent workers.",
        href: "./calculators/freelance-rate-calculator.html",
      },
    ],
  },
};

function renderRegionTools(regionCode) {
  const region = regionContent[regionCode] || regionContent.us;
  const heading = document.getElementById("region-heading");
  const toolsTitle = document.getElementById("tools-title");
  const toolsGrid = document.getElementById("regional-tools");
  const switcher = document.getElementById("country-switcher");
  const pills = document.querySelectorAll(".region-pill");

  if (heading) {
    heading.textContent = region.heading;
  }

  if (toolsTitle) {
    toolsTitle.textContent = region.title;
  }

  if (switcher) {
    switcher.value = regionCode;
  }

  pills.forEach((pill) => {
    pill.classList.toggle("active", pill.dataset.region === regionCode);
  });

  if (toolsGrid) {
    toolsGrid.innerHTML = region.tools
      .map(
        (tool) => `
          <article class="tool-card">
            <p class="tool-tag">${tool.tag}</p>
            <h3>${tool.title}</h3>
            <p>${tool.description}</p>
            <a class="inline-link" href="${tool.href}">Open calculator</a>
          </article>
        `,
      )
      .join("");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const type = document.body.dataset.calculator;
  const switcher = document.getElementById("country-switcher");
  const pills = document.querySelectorAll(".region-pill");

  if (switcher) {
    const locale = (navigator.language || "").toLowerCase();
    let defaultRegion = "us";

    if (locale.includes("en-gb")) defaultRegion = "uk";
    if (locale.includes("en-ca")) defaultRegion = "ca";
    if (locale.includes("en-au")) defaultRegion = "au";
    if (locale.includes("en-nz")) defaultRegion = "nz";

    renderRegionTools(defaultRegion);
    switcher.addEventListener("change", (event) => {
      renderRegionTools(event.target.value);
    });
  }

  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      renderRegionTools(pill.dataset.region);
    });
  });

  if (type === "etsy") {
    bindCalculator("etsy-form", runEtsyCalculator);
  }

  if (type === "paypal") {
    bindCalculator("paypal-form", runPayPalCalculator);
  }

  if (type === "freelance") {
    bindCalculator("freelance-form", runFreelanceCalculator);
  }

  if (type === "salary") {
    bindCalculator("salary-form", runSalaryCalculator);
  }

  if (
    type === "vat" ||
    type === "gst-hst" ||
    type === "gst-au" ||
    type === "gst-nz"
  ) {
    bindCalculator(`${type}-form`, runTaxStyleCalculator);
  }
});
