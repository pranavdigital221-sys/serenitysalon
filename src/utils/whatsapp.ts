import { Appointment } from '../types';

export const SALON_ADMIN_PHONE = '+91 8108765851';
export const SALON_ADMIN_PHONE_RAW = '918108765851';

/**
 * Strict Indian phone number validator & formatter for +91 WhatsApp compatibility.
 * Validates 10-digit Indian mobile numbers (starting with 6, 7, 8, 9),
 * accepting user input with optional +91, 91, 0, spaces, dashes, or parentheses.
 * Returns clean +91 formatted string for display and WhatsApp deep-links.
 */
export function validateAndFormatIndianPhone(input: string): {
  isValid: boolean;
  formatted: string;
  rawDigits: string;
  internationalRaw: string;
  errorMessage?: string;
} {
  if (!input || !input.trim()) {
    return {
      isValid: false,
      formatted: '',
      rawDigits: '',
      internationalRaw: '',
      errorMessage: 'Phone number is required.',
    };
  }

  // Strip all non-digit characters except leading +
  const digitsOnly = input.replace(/\D/g, '');

  let base10Digits = '';

  if (digitsOnly.length === 10) {
    base10Digits = digitsOnly;
  } else if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
    base10Digits = digitsOnly.slice(1);
  } else if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    base10Digits = digitsOnly.slice(2);
  } else if (digitsOnly.length === 13 && digitsOnly.startsWith('091')) {
    base10Digits = digitsOnly.slice(3);
  } else {
    return {
      isValid: false,
      formatted: input,
      rawDigits: digitsOnly,
      internationalRaw: digitsOnly,
      errorMessage: 'Please enter a valid 10-digit Indian mobile number (e.g. +91 98765 43210).',
    };
  }

  // Check valid Indian mobile starting prefix (6, 7, 8, or 9)
  if (!/^[6-9]/.test(base10Digits)) {
    return {
      isValid: false,
      formatted: input,
      rawDigits: base10Digits,
      internationalRaw: `91${base10Digits}`,
      errorMessage: 'Indian mobile numbers must begin with 6, 7, 8, or 9.',
    };
  }

  // Check for dummy repeating sequences (e.g. 9999999999, 1111111111, 0000000000)
  if (/^(\d)\1{9}$/.test(base10Digits)) {
    return {
      isValid: false,
      formatted: input,
      rawDigits: base10Digits,
      internationalRaw: `91${base10Digits}`,
      errorMessage: 'Please enter a valid, active contact phone number.',
    };
  }

  // Check for obvious invalid ascending/descending sequences
  if (base10Digits === '1234567890' || base10Digits === '9876543210' || base10Digits === '0123456789') {
    return {
      isValid: false,
      formatted: input,
      rawDigits: base10Digits,
      internationalRaw: `91${base10Digits}`,
      errorMessage: 'Please provide a genuine contact mobile number.',
    };
  }

  const formatted = `+91 ${base10Digits.slice(0, 5)} ${base10Digits.slice(5)}`;
  const internationalRaw = `91${base10Digits}`;

  return {
    isValid: true,
    formatted,
    rawDigits: base10Digits,
    internationalRaw,
  };
}

/**
 * Formats the exact required WhatsApp notification message for the Serenity Salon admin
 */
export function formatAdminWhatsAppMessage(appointment: {
  id: string;
  fullName: string;
  phone: string;
  serviceName: string;
  preferredDate: string;
  preferredTime: string;
  email?: string;
  notes?: string;
}): string {
  // Format matching the exact prompt specification:
  // NEW SERENITY SALON APPOINTMENT
  // Appointment ID: #{ID}
  // Customer: {Customer Name}
  // Phone: {Phone}
  // Service: {Service Name}
  // Date: {Preferred Date}
  // Time: {Preferred Time}
  // Email: {Email}
  // Notes: {Special Notes}
  // Please check the Admin Dashboard for complete booking details.

  const idFormatted = appointment.id.startsWith('#') ? appointment.id.substring(1) : appointment.id;
  const emailText = appointment.email && appointment.email.trim() ? appointment.email : 'Not provided';
  const notesText = appointment.notes && appointment.notes.trim() ? appointment.notes : 'None provided';

  return `NEW SERENITY SALON APPOINTMENT

Appointment ID: #${idFormatted}

Customer: ${appointment.fullName}
Phone: ${appointment.phone}
Service: ${appointment.serviceName}
Date: ${appointment.preferredDate}
Time: ${appointment.preferredTime}

Email: ${emailText}
Notes: ${notesText}

Please check the Admin Dashboard for complete booking details.`;
}

/**
 * Generate deep link to message the Serenity Salon Admin on WhatsApp (+91 8108765851)
 */
export function getAdminWhatsAppUrl(
  input:
    | string
    | {
        id: string;
        fullName: string;
        phone: string;
        serviceName: string;
        preferredDate: string;
        preferredTime: string;
        email?: string;
        notes?: string;
      }
): string {
  const text = typeof input === 'string' ? input : formatAdminWhatsAppMessage(input);
  return `https://wa.me/${SALON_ADMIN_PHONE_RAW}?text=${encodeURIComponent(text)}`;
}

/**
 * Generate WhatsApp message for Product Order to admin
 */
export function formatProductOrderWhatsAppMessage(order: {
  orderId: string;
  customerName: string;
  phone: string;
  grandTotal: number;
  items: Array<{ name: string; quantity: number }>;
  city?: string;
  paymentStatus?: string;
}): string {
  const itemsList = order.items.map((i) => `• ${i.quantity}x ${i.name}`).join('\n');
  return `🛍️ *NEW PRODUCT ORDER - SERENITY SALON*

*Order ID:* #${order.orderId}
*Customer:* ${order.customerName}
*Phone:* ${order.phone}
*City:* ${order.city || 'Standard Delivery'}
*Amount:* ₹${order.grandTotal.toLocaleString('en-IN')} (${order.paymentStatus || 'VERIFIED'})

*Items:*
${itemsList}

Please check the Admin Dashboard to prepare fulfillment!`;
}

/**
 * Generate WhatsApp URL for customer regarding their order
 */
export function getCustomerOrderWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const targetPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone.replace(/^0+/, '')}`;
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate deep link for the Salon to directly message the customer
 */
export function getCustomerWhatsAppUrl(appointment: {
  fullName: string;
  phone: string;
  serviceName: string;
  preferredDate: string;
  preferredTime: string;
  id: string;
}): string {
  const cleanPhone = appointment.phone.replace(/[^0-9]/g, '');
  const targetPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone.replace(/^0+/, '')}`;
  
  const text = `Hello ${appointment.fullName}! Greetings from Serenity Salon & Sanctuary. 🌿

We have received your appointment request for *${appointment.serviceName}* on *${appointment.preferredDate}* at *${appointment.preferredTime}* (Ref: #${appointment.id.replace('#', '')}).

Our concierge team is looking forward to hosting you! Please let us know if you have any questions or additional preferences.`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Generate standard telephone call link
 */
export function getCallTelUrl(phone: string): string {
  const clean = phone.replace(/[^0-9+]/g, '');
  return `tel:${clean}`;
}
