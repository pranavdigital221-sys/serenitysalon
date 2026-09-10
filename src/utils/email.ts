import emailjs from '@emailjs/browser';
import { Appointment } from '../types';
import { getCachedGmailAccessToken } from '../lib/firebase';
import { sendAppointmentConfirmationViaGmail } from '../services/gmailService';

export interface AppointmentConfirmationEmailDetails {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  serviceName: string;
  serviceCategory?: string;
  servicePrice?: number;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  status?: string;
  salonName?: string;
  salonAddress?: string;
  salonPhone?: string;
  advanceAmount?: number;
  remainingAmount?: number;
  paymentStatus?: string;
}

export interface EmailDispatchResult {
  success: boolean;
  message: string;
  method: 'gmail_api' | 'emailjs' | 'api' | 'simulated' | 'not_configured';
  status?: 'delivered' | 'simulated' | 'failed' | 'not_configured';
  recipient?: string;
  messageId?: string;
}

/**
 * Client-side EmailJS environment configuration & placeholders
 * Replace these placeholder values or configure them in your environment (.env.local / AI Studio Settings)
 */
export const EMAILJS_PLACEHOLDERS = {
  serviceId: 'service_serenity_salon',
  templateId: 'template_booking_receipt',
  publicKey: 'pub_key_serenity_client',
};

export const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || EMAILJS_PLACEHOLDERS.serviceId,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || EMAILJS_PLACEHOLDERS.templateId,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || EMAILJS_PLACEHOLDERS.publicKey,
};

/**
 * Checks whether active, customized EmailJS keys are provided in the environment
 */
export function isEmailJsConfigured(): boolean {
  return Boolean(
    EMAILJS_CONFIG.serviceId &&
    EMAILJS_CONFIG.serviceId !== EMAILJS_PLACEHOLDERS.serviceId &&
    EMAILJS_CONFIG.templateId &&
    EMAILJS_CONFIG.templateId !== EMAILJS_PLACEHOLDERS.templateId &&
    EMAILJS_CONFIG.publicKey &&
    EMAILJS_CONFIG.publicKey !== EMAILJS_PLACEHOLDERS.publicKey
  );
}

/**
 * Generate a luxury HTML confirmation receipt template for emails
 */
export function generateConfirmationEmailHtml(details: AppointmentConfirmationEmailDetails): string {
  const salonName = details.salonName || 'Serenity Luxury Salon & Spa';
  const salonAddress = details.salonAddress || '108 Serenity Boulevard, Koregaon Park, Pune, Maharashtra 411001';
  const salonPhone = details.salonPhone || '+91 8108765851';
  const bookingRef = details.id.startsWith('#') ? details.id : `#${details.id}`;

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAFAF8; border: 1px solid #EAE6DE; border-radius: 20px; overflow: hidden; color: #2D2D2D; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
      <!-- Header -->
      <div style="background-color: #1F3A26; padding: 36px 28px; text-align: center; color: #FFFFFF;">
        <span style="display: inline-block; font-size: 11px; letter-spacing: 3px; color: #C9A66B; text-transform: uppercase; font-weight: 700; margin-bottom: 6px;">Official Booking Receipt</span>
        <h1 style="margin: 0; font-size: 26px; font-weight: 400; letter-spacing: 4px; color: #FDFBF7;">${salonName.toUpperCase()}</h1>
        <p style="margin: 6px 0 0; font-size: 13px; color: #D1DED5; letter-spacing: 0.5px;">Luxury Hair, Skincare, Makeup & Wellness</p>
      </div>

      <!-- Main Body -->
      <div style="padding: 32px 28px;">
        <div style="text-align: center; margin-bottom: 28px;">
          <h2 style="margin: 0 0 8px; font-size: 22px; color: #1F3A26; font-weight: 700;">Appointment Confirmed</h2>
          <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.5;">
            Dear <strong>${details.fullName}</strong>, thank you for choosing Serenity Salon. Your luxury treatment has been reserved.
          </p>
        </div>

        <!-- Receipt Card -->
        <div style="background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E5DFD5; padding: 24px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #E2DDD5; padding-bottom: 14px; margin-bottom: 16px;">
            <span style="font-size: 11px; font-weight: 700; color: #C9A66B; text-transform: uppercase; letter-spacing: 1px;">Booking Reference</span>
            <span style="font-size: 14px; font-family: monospace; font-weight: 700; color: #1F3A26; background: #F7F5F1; padding: 4px 10px; border-radius: 8px;">${bookingRef}</span>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 9px 0; color: #78716C; width: 38%;">Treatment / Service:</td>
              <td style="padding: 9px 0; font-weight: 700; color: #1F3A26;">${details.serviceName}</td>
            </tr>
            ${details.serviceCategory ? `
            <tr>
              <td style="padding: 9px 0; color: #78716C;">Category:</td>
              <td style="padding: 9px 0; color: #44403C;">${details.serviceCategory}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 9px 0; color: #78716C;">Appointment Date:</td>
              <td style="padding: 9px 0; font-weight: 700; color: #C9A66B;">${details.preferredDate}</td>
            </tr>
            <tr>
              <td style="padding: 9px 0; color: #78716C;">Scheduled Time:</td>
              <td style="padding: 9px 0; font-weight: 700; color: #1F3A26;">${details.preferredTime}</td>
            </tr>
            <tr>
              <td style="padding: 9px 0; color: #78716C;">Contact Phone:</td>
              <td style="padding: 9px 0; color: #44403C;">${details.phone}</td>
            </tr>
            ${details.notes ? `
            <tr>
              <td style="padding: 9px 0; color: #78716C; vertical-align: top;">Special Requests:</td>
              <td style="padding: 9px 0; color: #57534E; font-style: italic;">${details.notes}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 9px 0; color: #78716C;">Status:</td>
              <td style="padding: 9px 0;">
                <span style="display: inline-block; background-color: #ECFDF5; color: #065F46; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 12px; text-transform: uppercase;">
                  ${details.status || 'Confirmed'}
                </span>
              </td>
            </tr>
          </table>
        </div>

        <!-- Salon Info Card -->
        <div style="background-color: #F7F5F1; border-radius: 14px; padding: 20px; margin-bottom: 24px; font-size: 13px; color: #444444; border: 1px solid #E8E3DA;">
          <h4 style="margin: 0 0 10px; color: #1F3A26; font-size: 14px; font-weight: 700;">📍 Salon Location &amp; Concierge</h4>
          <p style="margin: 0 0 6px; line-height: 1.5;"><strong>Address:</strong> ${salonAddress}</p>
          <p style="margin: 0 0 6px;"><strong>Direct Concierge:</strong> <a href="tel:${salonPhone}" style="color: #1F3A26; text-decoration: none; font-weight: 600;">${salonPhone}</a></p>
          <p style="margin: 0; color: #78716C; font-size: 12px;">✨ Complimentary organic herbal teas &amp; valet parking available upon arrival.</p>
        </div>

        <!-- Footer Notice -->
        <div style="text-align: center; font-size: 12px; color: #8C8C8C; line-height: 1.6; border-top: 1px solid #EAE6DE; padding-top: 20px;">
          <p style="margin: 0 0 4px;">Need to reschedule? Please contact our reception at least 4 hours before your slot.</p>
          <p style="margin: 0;">© ${new Date().getFullYear()} ${salonName}. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Send a professional confirmation email to the customer with appointment receipt
 */
export async function sendAppointmentConfirmationEmail(
  details: AppointmentConfirmationEmailDetails | Appointment
): Promise<EmailDispatchResult> {
  const recipientEmail = details.email ? details.email.trim() : '';

  if (!recipientEmail) {
    return {
      success: false,
      message: 'No recipient customer email provided',
      method: 'simulated',
      status: 'failed',
    };
  }

  const normalizedDetails: AppointmentConfirmationEmailDetails = {
    id: details.id,
    fullName: details.fullName,
    email: recipientEmail,
    phone: details.phone,
    serviceName: details.serviceName,
    serviceCategory: details.serviceCategory || (details as any).category || 'Luxury Salon Treatment',
    servicePrice: details.servicePrice,
    preferredDate: details.preferredDate,
    preferredTime: details.preferredTime,
    notes: details.notes,
    status: details.status || 'Confirmed',
    salonName: 'Serenity Luxury Salon & Spa',
    salonAddress: '108 Serenity Boulevard, Koregaon Park, Pune, Maharashtra 411001',
    salonPhone: '+91 8108765851',
  };

  const templateParams = {
    to_name: normalizedDetails.fullName,
    to_email: normalizedDetails.email,
    customer_name: normalizedDetails.fullName,
    customer_email: normalizedDetails.email,
    customer_phone: normalizedDetails.phone,
    appointment_id: normalizedDetails.id,
    booking_id: normalizedDetails.id,
    booking_reference: normalizedDetails.id.startsWith('#') ? normalizedDetails.id : `#${normalizedDetails.id}`,
    service_name: normalizedDetails.serviceName,
    service_category: normalizedDetails.serviceCategory,
    service_price: normalizedDetails.servicePrice ? `₹${normalizedDetails.servicePrice}` : 'Standard Consultation',
    appointment_date: normalizedDetails.preferredDate,
    appointment_time: normalizedDetails.preferredTime,
    notes: normalizedDetails.notes || 'None specified',
    special_requests: normalizedDetails.notes || 'None specified',
    salon_name: normalizedDetails.salonName,
    salon_address: normalizedDetails.salonAddress,
    salon_phone: normalizedDetails.salonPhone,
    status: normalizedDetails.status,
    html_receipt: generateConfirmationEmailHtml(normalizedDetails),
    current_year: new Date().getFullYear().toString(),
  };

  // 1. Try Official Google Workspace Gmail API if authenticated with OAuth access token
  const gmailToken = getCachedGmailAccessToken();
  if (gmailToken) {
    try {
      const gmailRes = await sendAppointmentConfirmationViaGmail({
        id: normalizedDetails.id,
        fullName: normalizedDetails.fullName,
        serviceName: normalizedDetails.serviceName,
        serviceCategory: normalizedDetails.serviceCategory,
        servicePrice: normalizedDetails.servicePrice,
        preferredDate: normalizedDetails.preferredDate,
        preferredTime: normalizedDetails.preferredTime,
        email: normalizedDetails.email,
        phone: normalizedDetails.phone,
        notes: normalizedDetails.notes,
        status: normalizedDetails.status,
      }, gmailToken);

      if (gmailRes.success) {
        console.log(`[GMAIL API DISPATCH SUCCESS] Message ID: ${gmailRes.messageId} to ${normalizedDetails.email}`);
        return {
          success: true,
          method: 'gmail_api',
          status: 'delivered',
          recipient: normalizedDetails.email,
          messageId: gmailRes.messageId,
          message: `Official booking confirmation sent via Google Workspace Gmail API (${gmailRes.messageId})`,
        };
      }
    } catch (gmailErr) {
      console.warn('Gmail API dispatch attempt notice, checking fallbacks:', gmailErr);
    }
  }

  // 2. Try EmailJS client-side dispatch if credentials are configured
  if (isEmailJsConfigured()) {
    try {
      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      );
      console.log('EmailJS customer confirmation sent successfully:', response.status, response.text);
      return {
        success: true,
        method: 'emailjs',
        status: 'delivered',
        recipient: normalizedDetails.email,
        message: `Confirmation email receipt dispatched to ${normalizedDetails.email}`,
      };
    } catch (emailjsErr) {
      console.warn('EmailJS direct dispatch failed, attempting backend server delivery fallback:', emailjsErr);
    }
  }

  // 3. Call backend endpoint for dual SMTP delivery fallback
  try {
    const res = await fetch('/api/appointments/confirmation-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(normalizedDetails),
    });

    if (res.ok) {
      const resJson = await res.json();
      if (resJson.status === 'delivered') {
        return {
          success: true,
          method: 'api',
          status: 'delivered',
          recipient: normalizedDetails.email,
          message: resJson.message || `Confirmation email sent to ${normalizedDetails.email}`,
        };
      } else if (resJson.status === 'not_configured') {
        return {
          success: false,
          method: 'api',
          status: 'not_configured',
          recipient: normalizedDetails.email,
          message: 'Email service not configured on server (SMTP_HOST, SMTP_USER, SMTP_PASS required).',
        };
      }
    }
  } catch (apiErr) {
    console.debug('Backend confirmation email endpoint notice:', apiErr);
  }

  // 4. Email service not configured (Truthful reporting - do not claim false delivery)
  console.log(`[EMAIL DISPATCH NOTICE] Email service not configured. Booking is safely recorded.`);
  console.log(`  To: ${normalizedDetails.email}`);
  console.log(`  Booking ID: ${normalizedDetails.id}`);
  console.log(`  Customer: ${normalizedDetails.fullName}`);

  return {
    success: false,
    method: 'simulated',
    status: 'not_configured',
    recipient: normalizedDetails.email,
    message: `Email service not configured. Booking is safely saved in the database.`,
  };
}
