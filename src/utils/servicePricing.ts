// Estimated base prices for Serenity Salon services for calculating advance deposit payments
export const SERVICE_BASE_PRICES: Record<string, number> = {
  // Hair Services
  'Haircut & Styling': 850,
  'Hair Spa': 1200,
  'Hair Wash & Blow Dry': 650,
  'Hair Color': 1800,
  'Global Hair Color': 2800,
  'Highlights': 3200,
  'Keratin / Hair Smoothening': 4500,

  // Skin & Facial
  'Classic Facial': 950,
  'Deep Cleansing Facial': 1400,
  'Glow Facial': 1800,
  'Hydra Facial': 2600,
  'Detan Treatment': 850,
  'Skin Consultation': 500,

  // Makeup & Beauty
  'Party Makeup': 2200,
  'Bridal Makeup': 6500,
  'Engagement Makeup': 3800,
  'Event Makeup': 2500,
  'Eye Makeup': 900,
  'Saree Draping & Styling': 600,

  // Nail Care
  'Classic Manicure': 600,
  'Classic Pedicure': 750,
  'Spa Manicure & Pedicure': 1300,
  'Gel Polish': 800,
  'Nail Art (Per Nail / Set)': 1100,

  // Spa & Wellness
  'Aromatherapy Massage': 2200,
  'Deep Tissue Massage': 2500,
  'Ayurvedic Hot Stone Massage': 2900,
  'Head, Neck & Shoulder Massage': 850,
  'Foot Reflexology': 750,
};

/**
 * Default fallback price for custom or unlisted services
 */
export const DEFAULT_SERVICE_PRICE = 1000;

/**
 * Get estimated service price in INR
 */
export function getServiceEstimatedPrice(serviceName: string): number {
  if (!serviceName) return DEFAULT_SERVICE_PRICE;

  // Direct match
  if (SERVICE_BASE_PRICES[serviceName]) {
    return SERVICE_BASE_PRICES[serviceName];
  }

  // Partial match search
  const lower = serviceName.toLowerCase();
  for (const [name, price] of Object.entries(SERVICE_BASE_PRICES)) {
    if (lower.includes(name.toLowerCase()) || name.toLowerCase().includes(lower)) {
      return price;
    }
  }

  // Fallback based on keywords
  if (lower.includes('bridal')) return 6500;
  if (lower.includes('keratin') || lower.includes('smoothening')) return 4500;
  if (lower.includes('facial') || lower.includes('hydra')) return 1800;
  if (lower.includes('color') || lower.includes('highlight')) return 2500;
  if (lower.includes('massage') || lower.includes('spa')) return 2200;
  if (lower.includes('makeup')) return 2400;
  if (lower.includes('nail') || lower.includes('pedicure') || lower.includes('manicure')) return 850;

  return DEFAULT_SERVICE_PRICE;
}

/**
 * Calculate advance payment details based on service price and configured percentage
 */
export function calculateAdvancePayment(
  serviceName: string,
  percentage: number = 40, // default 40% advance payment
  customPrice?: number
): {
  servicePrice: number;
  advanceAmount: number;
  remainingAmount: number;
  percentage: number;
} {
  const servicePrice = customPrice && customPrice > 0 ? customPrice : getServiceEstimatedPrice(serviceName);
  
  // Calculate 40% advance (integer rupee amount)
  let advance = Math.round(servicePrice * (percentage / 100));
  if (advance > servicePrice) advance = servicePrice;
  if (advance < 1 && servicePrice > 0) advance = servicePrice;

  const remaining = Math.max(0, servicePrice - advance);

  return {
    servicePrice,
    advanceAmount: advance,
    remainingAmount: remaining,
    percentage,
  };
}
