function formatCurrency(value, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
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

function getCalculatorLabel(type) {
  const labels = {
    etsy: "Etsy Fee Calculator",
    paypal: "PayPal Fee Calculator",
    stripe: "Stripe Fee Calculator",
    freelance: "Freelance Rate Calculator",
    salary: "Salary to Hourly Calculator",
    vat: "VAT Calculator",
    "gst-hst": "GST/HST Calculator",
    "gst-au": "GST Calculator Australia",
    "gst-nz": "GST Calculator NZ",
  };

  return labels[type] || "Margin Atlas Calculator";
}

function getCalculatorCurrency(type) {
  const currencyByCalculator = {
    vat: "GBP",
    "gst-hst": "CAD",
    "gst-au": "AUD",
    "gst-nz": "NZD",
  };

  return currencyByCalculator[type] || "USD";
}

const ADSENSE_CLIENT = "ca-pub-2456404542897668";

const AD_STACK_CONFIG = {
  mode: "hybrid",
  ezoic: {
    enabled: true,
    placeholders: {
      home_banner: "",
      home_sidebar: "",
      home_mobile: "",
      calculator_sidebar: "",
      calculator_inline: "",
    },
  },
  google: {
    enabled: true,
    client: ADSENSE_CLIENT,
    slots: {
      home_banner: "",
      home_sidebar: "",
      home_mobile: "",
      calculator_sidebar: "",
      calculator_inline: "",
    },
  },
};

function getAdMode() {
  return AD_STACK_CONFIG.mode || "hybrid";
}

function getEzoicPlaceholderId(slotKey) {
  return AD_STACK_CONFIG.ezoic.placeholders[slotKey] || "";
}

function getGoogleSlotId(slotKey) {
  return AD_STACK_CONFIG.google.slots[slotKey] || "";
}

function hydrateAdSlots() {
  const slots = document.querySelectorAll(".ad-slot[data-slot-key]");
  const ezoicIds = [];
  const googleSlots = [];
  const mode = getAdMode();
  const ezoicReady = AD_STACK_CONFIG.ezoic.enabled && typeof window.ezstandalone !== "undefined";

  slots.forEach((slot) => {
    const slotKey = slot.dataset.slotKey || "";
    const ezoicId = getEzoicPlaceholderId(slotKey);
    const googleSlot = getGoogleSlotId(slotKey);

    if ((mode === "ezoic" || mode === "hybrid") && ezoicId) {
      slot.dataset.adNetwork = "ezoic";
      slot.innerHTML = `<div id="ezoic-pub-ad-placeholder-${ezoicId}"></div>`;
      ezoicIds.push(Number(ezoicId));
      return;
    }

    if ((mode === "google" || mode === "hybrid") && googleSlot) {
      slot.dataset.adNetwork = "google";
      slot.innerHTML = `
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="${AD_STACK_CONFIG.google.client}"
             data-ad-slot="${googleSlot}"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      `;
      googleSlots.push(slot);
    }
  });

  if (ezoicIds.length && ezoicReady) {
    const uniqueIds = [...new Set(ezoicIds)];
    window.ezstandalone.cmd = window.ezstandalone.cmd || [];
    window.ezstandalone.cmd.push(() => {
      window.ezstandalone.showAds(...uniqueIds);
    });
  }

  if (googleSlots.length && window.adsbygoogle) {
    googleSlots.forEach(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error("Failed to render Google ad slot:", error);
      }
    });
  }
}

function applyDeviceMode() {
  const isMobile =
    window.matchMedia("(max-width: 768px)").matches ||
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  const hasMobileDock = Boolean(document.querySelector(".mobile-ad-inner"));

  document.body.classList.remove("is-mobile", "is-desktop");
  document.body.classList.add(isMobile ? "is-mobile" : "is-desktop");
  document.body.classList.toggle("has-mobile-dock", isMobile && hasMobileDock);
}

function setCanonicalDomain() {
  const liveOrigin = "https://customer20.top";
  const canonical = document.querySelector('link[rel="canonical"]');
  const ogUrl = document.querySelector('meta[property="og:url"]');

  if (window.location.protocol !== "file:") {
    if (canonical) {
      canonical.href = `${liveOrigin}${window.location.pathname}`;
    }

    if (ogUrl) {
      ogUrl.setAttribute("content", `${liveOrigin}${window.location.pathname}`);
    }
  }
}

function upgradeAdPlaceholders() {
  const adSlots = document.querySelectorAll(".ad-slot");

  adSlots.forEach((slot) => {
    const label = slot.dataset.adLabel;
    const note = slot.dataset.adNote;

    if (!label && !note) {
      return;
    }

    const title = slot.querySelector("span");
    const helper = slot.querySelector("small");

    if (title && label) {
      title.textContent = label;
    }

    if (helper && note) {
      helper.textContent = note;
    }
  });
}

function detectAdNetworkMode() {
  const params = new URLSearchParams(window.location.search);
  const forcedMode = params.get("adstack");
  const validModes = new Set(["hybrid", "ezoic", "google", "placeholder"]);
  const savedMode = window.localStorage ? localStorage.getItem("margin-atlas-adstack") : "";

  if (forcedMode && validModes.has(forcedMode)) {
    AD_STACK_CONFIG.mode = forcedMode;
    try {
      localStorage.setItem("margin-atlas-adstack", forcedMode);
    } catch (error) {
      // Ignore private mode storage failures.
    }
    return;
  }

  if (savedMode && validModes.has(savedMode)) {
    AD_STACK_CONFIG.mode = savedMode;
  }
}

let latestCalculatorSummary = "";

function getCalculatorQuickNote(type) {
  const notes = {
    etsy: "Check profit after product cost first. That is usually the fastest signal for whether the listing price is usable.",
    paypal: "Use the target payout input when you know what you need to keep, not just what you want to charge.",
    stripe: "If the payout matters, compare your current charge with the required charge before sending an invoice or checkout link.",
    freelance: "If the hourly rate feels too low, reduce annual billable hours or raise the income target until the number becomes workable.",
    salary: "This is a gross-pay comparison. Taxes, benefits, bonuses, and unpaid time still need separate review.",
    vat: "You can enter either the pre-tax amount or the total including VAT to switch direction quickly.",
    "gst-hst": "Use the total-including-tax field when you need to back out GST/HST from an invoice or receipt.",
    "gst-au": "This works in both directions, which is useful when quotes and receipts show different tax formats.",
    "gst-nz": "Use this to move between GST-exclusive and GST-inclusive totals without doing manual percentage math.",
  };

  return notes[type] || "Adjust the numbers until the result looks usable for the real pricing decision in front of you.";
}

function getCalculatorNextSteps(type) {
  const steps = {
    etsy: [
      "Compare profit after product cost with your actual margin target.",
      "Test a higher item price or lower shipping subsidy if profit is thin.",
      "Review packaging, discounts, and ads separately before listing.",
    ],
    paypal: [
      "Use the required charge when you need to keep a fixed payout.",
      "Compare the fee rate against your usual payment methods.",
      "Paste the copied result into your invoice or client note.",
    ],
    stripe: [
      "Check whether the current charge still leaves enough after fees.",
      "Use the required charge when quoting or setting a payment link.",
      "Keep a note of the payout number, not just the sale price.",
    ],
    freelance: [
      "Compare the hourly rate with your current market and skill level.",
      "Revisit expenses and unpaid time if the rate seems too low.",
      "Use the copied summary as a starting point for project pricing.",
    ],
    salary: [
      "Compare this hourly view with freelance or part-time options.",
      "Check taxes, benefits, and unpaid overtime separately.",
      "Use the weekly and monthly views when comparing offers.",
    ],
    vat: [
      "Use the tax amount when checking invoice accuracy.",
      "Switch between net and gross when comparing quote formats.",
      "Copy the result into your invoice note or pricing draft.",
    ],
    "gst-hst": [
      "Confirm the rate matches your province or use case.",
      "Use the tax amount to check receipts or customer totals.",
      "Switch between gross and pre-tax figures as needed.",
    ],
    "gst-au": [
      "Check the GST amount before finalizing a quote or invoice.",
      "Use the reverse calculation when you only have the total.",
      "Copy the result into your pricing or bookkeeping note.",
    ],
    "gst-nz": [
      "Check the GST amount before sending a final total.",
      "Reverse the total when you need the GST-exclusive amount.",
      "Use the copied result for invoices, quotes, or bookkeeping.",
    ],
  };

  return steps[type] || [
    "Review the result in the context of your actual decision.",
    "Adjust the main input that changes the outcome most.",
    "Copy the summary if you need it in notes or email.",
  ];
}

function setCalculatorUtility(summary, insight, tone = "neutral") {
  latestCalculatorSummary = summary;

  const insightBox = document.getElementById("calculator-insight");
  if (insightBox) {
    insightBox.textContent = insight;
    insightBox.dataset.tone = tone;
  }

  const copyStatus = document.getElementById("calculator-copy-status");
  if (copyStatus) {
    copyStatus.textContent = "Result summary ready to copy.";
  }
}

function ensureCalculatorUtility(callback) {
  const resultCard = document.querySelector(".result-card");
  const resultList = resultCard?.querySelector(".result-list");

  if (!resultCard || !resultList || document.getElementById("calculator-utility")) {
    return;
  }

  const utility = document.createElement("div");
  utility.id = "calculator-utility";
  utility.className = "calculator-utility";
  utility.innerHTML = `
    <p id="calculator-insight" class="calculator-insight" data-tone="neutral">
      Adjust the inputs to see a clearer result note here.
    </p>
    <div class="calculator-next-steps">
      <strong>What to do with this result</strong>
      <ul id="calculator-next-steps-list"></ul>
    </div>
    <div class="calculator-actions" aria-label="Calculator result actions">
      <button id="copy-calculator-summary" class="button button-primary" type="button">Copy result</button>
      <button id="reset-calculator-example" class="button button-secondary" type="button">Reset example</button>
    </div>
    <p id="calculator-copy-status" class="calculator-copy-status">Result summary ready to copy.</p>
  `;

  resultList.insertAdjacentElement("afterend", utility);

  const stepsList = document.getElementById("calculator-next-steps-list");
  if (stepsList) {
    stepsList.innerHTML = getCalculatorNextSteps(document.body.dataset.calculator)
      .map((step) => `<li>${step}</li>`)
      .join("");
  }

  document.getElementById("copy-calculator-summary")?.addEventListener("click", async () => {
    const copyStatus = document.getElementById("calculator-copy-status");
    const text = latestCalculatorSummary || `${getCalculatorLabel(document.body.dataset.calculator)} result`;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }

      if (copyStatus) {
        copyStatus.textContent = "Copied. Paste this into notes, email, or a pricing draft.";
      }
    } catch (error) {
      console.error("Failed to copy calculator result:", error);
      if (copyStatus) {
        copyStatus.textContent = "Copy failed in this browser. You can still select and copy the result manually.";
      }
    }
  });

  document.getElementById("reset-calculator-example")?.addEventListener("click", () => {
    const form = document.querySelector(".calculator-form");
    if (!form) {
      return;
    }

    form.reset();
    form.dataset.taxMode = "net";
    callback();
  });

  callback();
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

  const tone = profit <= 0 ? "risk" : feeRate > 12 ? "warning" : "good";
  const insight =
    profit <= 0
      ? "This setup does not leave profit after product cost. Raise price, reduce cost, or review shipping before listing."
      : feeRate > 12
        ? "Fees take a noticeable share of the order. Check whether shipping, discounts, or production cost need adjustment."
        : "The estimate leaves positive profit after common Etsy fee inputs and product cost.";
  const summary = [
    "Margin Atlas - Etsy Fee Calculator",
    `Gross order value: ${formatCurrency(gross)}`,
    `Total fees: ${formatCurrency(totalFees)} (${formatPercent(feeRate)})`,
    `Net after fees: ${formatCurrency(net)}`,
    `Profit after product cost: ${formatCurrency(profit)}`,
    insight,
  ].join("\n");

  setCalculatorUtility(summary, insight, tone);
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

  const difference = netReceived - target;
  const tone = target > 0 && difference < 0 ? "risk" : feeRate > 5 ? "warning" : "good";
  const insight =
    target > 0 && difference < 0
      ? `This charge falls short of your target by ${formatCurrency(Math.abs(difference))}. Use the required charge as the safer starting point.`
      : `After estimated PayPal fees, this payment leaves ${formatCurrency(netReceived)}.`;
  const summary = [
    "Margin Atlas - PayPal Fee Calculator",
    `Amount charged: ${formatCurrency(amount)}`,
    `Processing fee: ${formatCurrency(fee)} (${formatPercent(feeRate)})`,
    `Net received: ${formatCurrency(netReceived)}`,
    `Charge needed for target: ${formatCurrency(requiredCharge)}`,
    insight,
  ].join("\n");

  setCalculatorUtility(summary, insight, tone);
}

function runStripeCalculator() {
  const amount = getNumber("stripe-amount");
  const percent = getNumber("stripe-percent") / 100;
  const fixed = getNumber("stripe-fixed");
  const target = getNumber("stripe-target");

  const fee = amount * percent + fixed;
  const netReceived = amount - fee;
  const requiredCharge = percent < 1 ? (target + fixed) / (1 - percent) : 0;
  const feeRate = amount > 0 ? (fee / amount) * 100 : 0;

  updateText("stripe-fee", formatCurrency(fee));
  updateText("stripe-net", formatCurrency(netReceived));
  updateText("stripe-received", formatCurrency(netReceived));
  updateText("stripe-required", formatCurrency(requiredCharge));
  updateText("stripe-rate", formatPercent(feeRate));

  const difference = netReceived - target;
  const tone = target > 0 && difference < 0 ? "risk" : feeRate > 5 ? "warning" : "good";
  const insight =
    target > 0 && difference < 0
      ? `This charge falls short of your target by ${formatCurrency(Math.abs(difference))}. Use the required charge as the safer starting point.`
      : `After estimated Stripe fees, this payment leaves ${formatCurrency(netReceived)}.`;
  const summary = [
    "Margin Atlas - Stripe Fee Calculator",
    `Amount charged: ${formatCurrency(amount)}`,
    `Processing fee: ${formatCurrency(fee)} (${formatPercent(feeRate)})`,
    `Net received: ${formatCurrency(netReceived)}`,
    `Charge needed for target: ${formatCurrency(requiredCharge)}`,
    insight,
  ].join("\n");

  setCalculatorUtility(summary, insight, tone);
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

  const tone = hourlyRate < 40 ? "warning" : billableHours < 900 ? "warning" : "good";
  const insight =
    billableHours < 900
      ? "Your annual billable hours are relatively low, so the hourly rate needs to carry more unpaid time."
      : `This rate is built from ${billableHours.toFixed(0)} annual billable hours, expenses, and a tax buffer.`;
  const summary = [
    "Margin Atlas - Freelance Rate Calculator",
    `Suggested hourly rate: ${formatCurrency(hourlyRate)}/hr`,
    `Suggested project day rate: ${formatCurrency(dayRate)}`,
    `Billable hours per year: ${billableHours.toFixed(0)}`,
    `Pre-tax revenue target: ${formatCurrency(revenueTarget)}`,
    `Annual tax reserve: ${formatCurrency(taxReserve)}`,
    insight,
  ].join("\n");

  setCalculatorUtility(summary, insight, tone);
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

  const insight = `This converts ${formatCurrency(annual)} per year into about ${formatCurrency(hourly)}/hr before tax and benefits.`;
  const summary = [
    "Margin Atlas - Salary to Hourly Calculator",
    `Annual salary: ${formatCurrency(annual)}`,
    `Hourly equivalent: ${formatCurrency(hourly)}/hr`,
    `Weekly pay: ${formatCurrency(weekly)}`,
    `Monthly pay: ${formatCurrency(monthly)}`,
    `Hours per week: ${hours}`,
    `Working weeks per year: ${weeks}`,
    insight,
  ].join("\n");

  setCalculatorUtility(summary, insight, "good");
}

function runTaxStyleCalculator() {
  const form = document.querySelector(".calculator-form");
  const currency = getCalculatorCurrency(document.body.dataset.calculator);
  const grossInput = document.getElementById("tax-gross");
  const grossValue = grossInput ? getNumber("tax-gross") : 0;
  const rate = getNumber("tax-rate") / 100;
  const useGross = grossInput && form?.dataset.taxMode === "gross" && grossValue > 0;
  const total = useGross ? grossValue : getNumber("tax-amount") * (1 + rate);
  const amount = useGross && rate > -1 ? total / (1 + rate) : getNumber("tax-amount");
  const taxAmount = total - amount;

  if (grossInput && !useGross) {
    grossInput.value = total ? total.toFixed(2) : "";
  }

  if (grossInput && useGross) {
    const netInput = document.getElementById("tax-amount");
    if (netInput) {
      netInput.value = amount ? amount.toFixed(2) : "";
    }
  }

  updateText("tax-total", formatCurrency(total, currency));
  updateText("tax-amount-result", formatCurrency(taxAmount, currency));
  updateText("tax-total-result", formatCurrency(total, currency));
  updateText("tax-pre-tax", formatCurrency(amount, currency));

  const label = getCalculatorLabel(document.body.dataset.calculator);
  const insight = useGross
    ? `The gross total contains about ${formatCurrency(taxAmount, currency)} tax, leaving ${formatCurrency(amount, currency)} before tax.`
    : `Adding the entered tax rate gives a total of ${formatCurrency(total, currency)}.`;
  const summary = [
    `Margin Atlas - ${label}`,
    `Amount before tax: ${formatCurrency(amount, currency)}`,
    `Tax rate: ${formatPercent(rate * 100)}`,
    `Tax amount: ${formatCurrency(taxAmount, currency)}`,
    `Total with tax: ${formatCurrency(total, currency)}`,
    insight,
  ].join("\n");

  setCalculatorUtility(summary, insight, "good");
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

  form.querySelectorAll("input, select").forEach((input) => {
    input.addEventListener("input", callback);
  });

  callback();
}

function setupTaxMode(callback) {
  const form = document.querySelector(".calculator-form");
  const netInput = document.getElementById("tax-amount");
  const grossInput = document.getElementById("tax-gross");

  if (!form || !grossInput || !netInput) {
    return;
  }

  form.dataset.taxMode = "net";
  netInput.addEventListener("input", () => {
    form.dataset.taxMode = "net";
  });
  grossInput.addEventListener("input", () => {
    form.dataset.taxMode = "gross";
  });
  document.getElementById("tax-rate")?.addEventListener("input", callback);
}

const regionContent = {
  us: {
    name: "United States",
    heading: "Featured tools for United States",
    title: "Start with US pricing, salary, and seller tools",
    copy: "If you are pricing in the US, start with seller fees, payment processing, freelance pricing, and salary comparisons.",
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
        tag: "Card processing",
        title: "Stripe Fee Calculator",
        description: "Estimate Stripe fees and reverse-calculate your target payout.",
        href: "./calculators/stripe-fee-calculator.html",
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
    title: "Start with VAT, freelance, and payment tools for the UK",
    copy: "If you are pricing in the UK, start with VAT totals, freelance pricing, online payment fees, and annual-to-hourly pay conversions.",
    tools: [
      {
        tag: "UK business tax",
        title: "VAT Calculator",
        description: "Useful for invoices, quotes, and small business pricing.",
        href: "./calculators/vat-calculator.html",
      },
      {
        tag: "Payment processing",
        title: "PayPal Fee Calculator",
        description: "Useful for freelancers, online sellers, and one-off invoice planning.",
        href: "./calculators/paypal-fee-calculator.html",
      },
      {
        tag: "Card processing",
        title: "Stripe Fee Calculator",
        description: "Helpful for service businesses and online merchants estimating net payout.",
        href: "./calculators/stripe-fee-calculator.html",
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
    copy: "If you are pricing in Canada, start with GST/HST calculations, pay comparisons, seller fees, and payment processing estimates.",
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
      {
        tag: "Payment processing",
        title: "Stripe Fee Calculator",
        description: "Useful for independent businesses that accept card payments online.",
        href: "./calculators/stripe-fee-calculator.html",
      },
    ],
  },
  au: {
    name: "Australia",
    heading: "Featured tools for Australia",
    title: "Start with GST, rate planning, and business pricing for Australia",
    copy: "If you are pricing in Australia, start with GST calculations, freelance pricing, seller fee estimates, and payment processing costs.",
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
      {
        tag: "Payment processing",
        title: "PayPal Fee Calculator",
        description: "Helpful for service businesses and digital sellers taking remote payments.",
        href: "./calculators/paypal-fee-calculator.html",
      },
    ],
  },
  nz: {
    name: "New Zealand",
    heading: "Featured tools for New Zealand",
    title: "Start with GST and small business tools for New Zealand",
    copy: "If you are pricing in New Zealand, start with GST calculations, small business pricing, payment fees, and contractor rate planning.",
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
      {
        tag: "Payment processing",
        title: "Stripe Fee Calculator",
        description: "Helpful for online businesses estimating payment deductions and net revenue.",
        href: "./calculators/stripe-fee-calculator.html",
      },
    ],
  },
};

function renderRegionTools(regionCode) {
  const region = regionContent[regionCode] || regionContent.us;
  const heading = document.getElementById("region-heading");
  const toolsTitle = document.getElementById("tools-title");
  const regionCopy = document.getElementById("region-copy");
  const toolsGrid = document.getElementById("regional-tools");
  const switcher = document.getElementById("country-switcher");
  const pills = document.querySelectorAll(".region-pill");

  if (heading) {
    heading.textContent = region.heading;
  }

  if (toolsTitle) {
    toolsTitle.textContent = region.title;
  }

  if (regionCopy) {
    regionCopy.textContent = region.copy;
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

  document.querySelectorAll("[data-region-name]").forEach((node) => {
    node.textContent = region.name;
  });

  try {
    localStorage.setItem("margin-atlas-region", regionCode);
  } catch (error) {
    // Ignore storage issues in private or restricted browsing contexts.
  }
}

document.addEventListener("DOMContentLoaded", () => {
  detectAdNetworkMode();
  applyDeviceMode();
  setCanonicalDomain();
  upgradeAdPlaceholders();
  hydrateAdSlots();
  window.addEventListener("resize", applyDeviceMode);

  const type = document.body.dataset.calculator;
  const switcher = document.getElementById("country-switcher");
  const pills = document.querySelectorAll(".region-pill");

  if (switcher) {
    const locale = (navigator.language || "").toLowerCase();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    let defaultRegion = "us";
    let savedRegion = "";

    try {
      savedRegion = localStorage.getItem("margin-atlas-region") || "";
    } catch (error) {
      savedRegion = "";
    }

    if (savedRegion && regionContent[savedRegion]) {
      defaultRegion = savedRegion;
    } else {
      if (locale.includes("en-gb") || timeZone.includes("London")) defaultRegion = "uk";
      if (locale.includes("en-ca") || timeZone.includes("Toronto") || timeZone.includes("Vancouver")) defaultRegion = "ca";
      if (locale.includes("en-au") || timeZone.includes("Sydney") || timeZone.includes("Melbourne")) defaultRegion = "au";
      if (locale.includes("en-nz") || timeZone.includes("Auckland")) defaultRegion = "nz";
    }

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

  if (type === "stripe") {
    bindCalculator("stripe-form", runStripeCalculator);
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
    setupTaxMode(runTaxStyleCalculator);
    bindCalculator(`${type}-form`, runTaxStyleCalculator);
  }

  if (type) {
    const resultCard = document.querySelector(".result-card");
    const resultHeading = resultCard?.querySelector("h2");

    if (resultCard && resultHeading && !resultCard.querySelector(".result-panel-head")) {
      const head = document.createElement("div");
      head.className = "result-panel-head";
      head.innerHTML = `
        <div>
          <p class="eyebrow">Estimated result</p>
          <p class="result-quick-note">${getCalculatorQuickNote(type)}</p>
        </div>
        <span class="result-chip">Live result</span>
      `;
      resultCard.insertBefore(head, resultHeading);

      const eyebrow = resultCard.querySelector(":scope > .eyebrow");
      if (eyebrow) {
        eyebrow.remove();
      }
    }

    const calculatorCallbacks = {
      etsy: runEtsyCalculator,
      paypal: runPayPalCalculator,
      stripe: runStripeCalculator,
      freelance: runFreelanceCalculator,
      salary: runSalaryCalculator,
      vat: runTaxStyleCalculator,
      "gst-hst": runTaxStyleCalculator,
      "gst-au": runTaxStyleCalculator,
      "gst-nz": runTaxStyleCalculator,
    };

    ensureCalculatorUtility(calculatorCallbacks[type] || (() => {}));
  }
});
