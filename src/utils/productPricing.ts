import { PRODUCTS } from '../data/mockData';
import { STANDARD_SHIPPING_FEE_INR, FREE_SHIPPING_THRESHOLD_INR } from './currency';

export interface ValidatedOrderItem {
  productId: string;
  name: string;
  category: string;
  image: string;
  unitPrice: number;
  originalPrice?: number;
  quantity: number;
  totalPrice: number;
}

export interface OrderCalculationResult {
  items: ValidatedOrderItem[];
  subtotal: number;
  discount: number;
  appliedPromoCode?: string;
  shippingFee: number;
  grandTotal: number;
  totalQuantity: number;
  currency: 'INR';
  isFreeShipping: boolean;
}

/**
 * Server-authoritative calculation of product cart totals
 * Never trusts prices, discounts, or totals sent from client.
 */
export function calculateServerAuthoritativeOrder(
  requestedItems: Array<{ productId?: string; id?: string; quantity: number }>,
  promoCode?: string
): OrderCalculationResult {
  const validatedItems: ValidatedOrderItem[] = [];
  let subtotal = 0;
  let totalQuantity = 0;

  for (const reqItem of requestedItems) {
    const rawId = reqItem.productId || reqItem.id;
    if (!rawId || !reqItem.quantity || reqItem.quantity <= 0) {
      continue;
    }

    const matchedProduct = PRODUCTS.find((p) => p.id === rawId || (p as any).productId === rawId);
    if (!matchedProduct) {
      // Look by SKU or fallback
      const fallback = PRODUCTS.find((p) => p.sku === rawId);
      if (fallback) {
        const qty = Math.max(1, Math.min(99, Math.floor(reqItem.quantity)));
        const itemTotal = fallback.price * qty;
        subtotal += itemTotal;
        totalQuantity += qty;
        validatedItems.push({
          productId: fallback.id,
          name: fallback.name,
          category: fallback.category,
          image: fallback.image,
          unitPrice: fallback.price,
          originalPrice: fallback.originalPrice,
          quantity: qty,
          totalPrice: itemTotal,
        });
      }
      continue;
    }

    const qty = Math.max(1, Math.min(99, Math.floor(reqItem.quantity)));
    const itemTotal = matchedProduct.price * qty;
    subtotal += itemTotal;
    totalQuantity += qty;

    validatedItems.push({
      productId: matchedProduct.id,
      name: matchedProduct.name,
      category: matchedProduct.category,
      image: matchedProduct.image,
      unitPrice: matchedProduct.price,
      originalPrice: matchedProduct.originalPrice,
      quantity: qty,
      totalPrice: itemTotal,
    });
  }

  // Calculate promotional discount (e.g. GLOW20 or BEAUTY20 -> 20% discount)
  let discount = 0;
  let appliedPromoCode: string | undefined = undefined;
  if (promoCode) {
    const cleanCode = promoCode.trim().toUpperCase();
    if (cleanCode === 'GLOW20' || cleanCode === 'BEAUTY20') {
      discount = Math.round(subtotal * 0.2);
      appliedPromoCode = cleanCode;
    } else if (cleanCode === 'SERENITY10') {
      discount = Math.round(subtotal * 0.1);
      appliedPromoCode = cleanCode;
    }
  }

  // Shipping Fee calculation (Free shipping above threshold)
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD_INR || subtotal <= 0;
  const shippingFee = isFreeShipping ? 0 : STANDARD_SHIPPING_FEE_INR;

  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  return {
    items: validatedItems,
    subtotal,
    discount,
    appliedPromoCode,
    shippingFee,
    grandTotal,
    totalQuantity,
    currency: 'INR',
    isFreeShipping,
  };
}
