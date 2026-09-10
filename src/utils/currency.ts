/**
 * Utility for Indian Rupee (INR) currency formatting.
 * Formats numbers into Indian numbering system (e.g. ₹999, ₹1,299, ₹10,000, ₹1,00,000).
 */
export const formatINR = (amount: number): string => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }
  const rounded = Math.round(amount);
  return `₹${rounded.toLocaleString('en-IN')}`;
};

export const FREE_SHIPPING_THRESHOLD_INR = 999;
export const STANDARD_SHIPPING_FEE_INR = 99;
