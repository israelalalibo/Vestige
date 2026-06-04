// Money is stored as integer cents everywhere. These helpers convert
// and format for display so we never do float math on prices.

export function centsToDollars(cents) {
  return (cents || 0) / 100;
}

export function dollarsToCents(dollars) {
  return Math.round((Number(dollars) || 0) * 100);
}

export function formatCents(cents, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format((cents || 0) / 100);
}

export function formatDollars(dollars, currency = 'USD') {
  return formatCents(dollarsToCents(dollars), currency);
}
