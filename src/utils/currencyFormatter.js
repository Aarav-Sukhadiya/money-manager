export function formatCurrency(amount, currency = "INR") {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

// kept for components that haven't migrated yet
export function formatINR(amount) {
  return formatCurrency(amount, "INR");
}

export function formatAmount(amount, type, currency = "INR") {
  const formatted = formatCurrency(Math.abs(amount), currency);
  return type === "expense" ? `- ${formatted}` : `+ ${formatted}`;
}
