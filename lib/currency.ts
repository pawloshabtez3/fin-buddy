// Currency formatting utilities

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
  CHF: 'CHF',
  CNY: '¥',
  INR: '₹',
  MXN: '$',
};

export function formatCurrency(amount: number, currencyCode: string = 'USD'): string {
  const symbol = CURRENCY_SYMBOLS[currencyCode] || currencyCode;
  
  // Format number with commas and 2 decimal places
  const formattedAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // For currencies that typically show symbol after amount
  if (currencyCode === 'EUR') {
    return `${formattedAmount} ${symbol}`;
  }

  // Default: symbol before amount
  return `${symbol}${formattedAmount}`;
}

export function getCurrencySymbol(currencyCode: string = 'USD'): string {
  return CURRENCY_SYMBOLS[currencyCode] || currencyCode;
}
