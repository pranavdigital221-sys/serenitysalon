/**
 * Serenity Luxury Salon & Spa - Official Gmail API Service
 * Interacts with Google Workspace Gmail REST API using OAuth2 access tokens
 */

import { getCachedGmailAccessToken } from '../lib/firebase';
import { formatINR } from '../utils/currency';

export interface GmailUserProfile {
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
  historyId: string;
}

export interface GmailSendResult {
  success: boolean;
  messageId?: string;
  threadId?: string;
  recipient?: string;
  error?: string;
  timestamp: string;
}

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  snippet: string;
  subject: string;
  from: string;
  to: string;
  date: string;
}

/**
 * Encodes an RFC 2822 MIME message into standard URL-safe Base64 for the Gmail API
 */
export function createUrlSafeBase64MimeMessage(params: {
  to: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
  fromName?: string;
  fromEmail?: string;
}): string {
  const { to, subject, htmlBody, textBody = '', fromName = 'Serenity Luxury Salon & Spa', fromEmail } = params;
  
  const boundary = `serenity_boundary_${Date.now().toString(36)}`;
  
  const fromHeader = fromEmail ? `${fromName} <${fromEmail}>` : fromName;

  const rawMime = [
    `From: ${fromHeader}`,
    `To: ${to}`,
    `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    `Content-Transfer-Encoding: 7bit`,
    '',
    textBody || 'Serenity Luxury Salon & Spa Appointment Confirmation',
    '',
    `--${boundary}`,
    `Content-Type: text/html; charset="UTF-8"`,
    `Content-Transfer-Encoding: 7bit`,
    '',
    htmlBody,
    '',
    `--${boundary}--`,
  ].join('\r\n');

  // Convert raw MIME string to base64url safe string
  const utf8Bytes = new TextEncoder().encode(rawMime);
  let binary = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  
  const base64 = btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return base64;
}

/**
 * Generate luxury HTML email template for salon appointment confirmations
 */
export function generateAppointmentHtmlEmail(appointment: {
  id: string;
  fullName: string;
  serviceName: string;
  serviceCategory?: string;
  servicePrice?: number;
  preferredDate: string;
  preferredTime: string;
  phone?: string;
  notes?: string;
  status?: string;
}): string {
  const price = appointment.servicePrice || 1000;
  const advance = Math.round(price * 0.2);
  const remaining = Math.max(0, price - advance);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Serenity Salon Appointment Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F5F1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1A1A1A;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F7F5F1; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(31,58,38,0.08); border: 1px solid #E5E0D8;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #1F3A26; padding: 36px 30px; text-align: center;">
              <p style="margin: 0; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #C9A66B; font-weight: 700;">Exclusive Sanctuary Experience</p>
              <h1 style="margin: 8px 0 0; color: #FFFFFF; font-size: 26px; font-weight: 600; letter-spacing: -0.5px;">SERENITY</h1>
              <p style="margin: 4px 0 0; font-size: 13px; color: #A3B899;">Luxury Salon &amp; Spa</p>
            </td>
          </tr>

          <!-- Confirmation Badge -->
          <tr>
            <td style="padding: 30px 40px 20px; text-align: center;">
              <div style="display: inline-block; background-color: #EBF3ED; color: #1F3A26; font-size: 12px; font-weight: 700; padding: 6px 16px; border-radius: 50px; text-transform: uppercase; letter-spacing: 1px;">
                ✓ Booking Received
              </div>
              <h2 style="margin: 16px 0 6px; font-size: 20px; color: #1F3A26;">Hello, ${appointment.fullName}</h2>
              <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.6;">
                Your appointment reservation has been successfully registered in our concierge scheduling system.
              </p>
            </td>
          </tr>

          <!-- Appointment Details Card -->
          <tr>
            <td style="padding: 0 40px 25px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF8F5; border: 1px solid #ECE7DF; border-radius: 16px; padding: 20px;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #EAE5DC;">
                    <span style="font-size: 11px; color: #888888; text-transform: uppercase; font-weight: 600;">Booking Reference</span><br>
                    <strong style="font-size: 15px; color: #1F3A26; font-family: monospace;">${appointment.id}</strong>
                  </td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #EAE5DC; text-align: right;">
                    <span style="font-size: 11px; color: #888888; text-transform: uppercase; font-weight: 600;">Current Status</span><br>
                    <strong style="font-size: 13px; color: #B45309; background: #FEF3C7; padding: 3px 8px; border-radius: 6px;">${appointment.status || 'Pending'}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0 6px;" colspan="2">
                    <span style="font-size: 11px; color: #888888; text-transform: uppercase; font-weight: 600;">Selected Service</span><br>
                    <strong style="font-size: 16px; color: #1A1A1A;">${appointment.serviceName}</strong>
                    ${appointment.serviceCategory ? `<span style="font-size: 12px; color: #666;"> (${appointment.serviceCategory})</span>` : ''}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;" width="50%">
                    <span style="font-size: 11px; color: #888888; text-transform: uppercase; font-weight: 600;">📅 Date</span><br>
                    <strong style="font-size: 14px; color: #1F3A26;">${appointment.preferredDate}</strong>
                  </td>
                  <td style="padding: 8px 0;" width="50%" align="right">
                    <span style="font-size: 11px; color: #888888; text-transform: uppercase; font-weight: 600;">⏰ Time Slot</span><br>
                    <strong style="font-size: 14px; color: #1F3A26;">${appointment.preferredTime}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0 4px; border-top: 1px solid #EAE5DC;" colspan="2">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size: 13px; color: #555;">Estimated Service Total:</td>
                        <td style="font-size: 14px; font-weight: 700; color: #1F3A26; text-align: right;">${formatINR(price)}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #777;">Payable at Salon:</td>
                        <td style="font-size: 12px; color: #777; text-align: right;">${formatINR(price)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ${
                  appointment.notes
                    ? `
                <tr>
                  <td style="padding: 10px 0 0; border-top: 1px solid #EAE5DC;" colspan="2">
                    <span style="font-size: 11px; color: #888888; text-transform: uppercase; font-weight: 600;">Client Notes</span><br>
                    <span style="font-size: 12px; color: #555; font-style: italic;">"${appointment.notes}"</span>
                  </td>
                </tr>
                `
                    : ''
                }
              </table>
            </td>
          </tr>

          <!-- Salon Location & Contact -->
          <tr>
            <td style="padding: 0 40px 30px; font-size: 13px; color: #666666; line-height: 1.6;">
              <div style="background-color: #F4EFE6; border-radius: 12px; padding: 16px; text-align: center;">
                <p style="margin: 0 0 6px; font-weight: 700; color: #1F3A26;">📍 Serenity Sanctuary Location</p>
                <p style="margin: 0; font-size: 12px; color: #4A4A4A;">
                  Ground Floor, Luxury Pavilion, Viman Nagar, Pune, Maharashtra 411014
                </p>
                <p style="margin: 8px 0 0; font-size: 12px;">
                  Concierge Support: <a href="tel:+918108765851" style="color: #1F3A26; font-weight: 700; text-decoration: none;">+91 8108765851</a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FBF9F6; padding: 24px 30px; text-align: center; border-top: 1px solid #ECE7DF;">
              <p style="margin: 0; font-size: 11px; color: #8C827A;">
                Sent officially via Google Workspace Gmail API • Serenity Luxury Salon &amp; Spa
              </p>
              <p style="margin: 4px 0 0; font-size: 11px; color: #8C827A;">
                Please arrive 10 minutes prior to your scheduled slot for consultation and refreshments.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Fetch authenticated user's Gmail profile information
 */
export async function getGmailProfile(accessToken?: string): Promise<GmailUserProfile | null> {
  const token = accessToken || getCachedGmailAccessToken();
  if (!token) {
    throw new Error('Gmail OAuth access token is required. Please authenticate with Google.');
  }

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error?.message || `Gmail profile error (${res.status})`);
  }

  return res.json();
}

/**
 * Send an email directly using the official Gmail REST API
 */
export async function sendEmailViaGmailApi(params: {
  to: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
  fromName?: string;
  accessToken?: string;
}): Promise<GmailSendResult> {
  const token = params.accessToken || getCachedGmailAccessToken();
  if (!token) {
    return {
      success: false,
      recipient: params.to,
      error: 'Gmail access token missing. Please sign in with Google.',
      timestamp: new Date().toISOString(),
    };
  }

  try {
    const base64Message = createUrlSafeBase64MimeMessage({
      to: params.to,
      subject: params.subject,
      htmlBody: params.htmlBody,
      textBody: params.textBody,
      fromName: params.fromName || 'Serenity Luxury Salon & Spa Concierge',
    });

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: base64Message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gmail API send error:', data);
      const rawErrorMsg = data.error?.message || `Gmail API failed with status ${response.status}`;
      const isScopeError = response.status === 403 || /insufficient.*scope|permission/i.test(rawErrorMsg);
      const friendlyError = isScopeError
        ? 'Google account lacks permission to send emails via Gmail. Please sign out and sign in with Google again to grant email sending permissions.'
        : rawErrorMsg;

      return {
        success: false,
        recipient: params.to,
        error: friendlyError,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      messageId: data.id,
      threadId: data.threadId,
      recipient: params.to,
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    console.error('sendEmailViaGmailApi network error:', err);
    return {
      success: false,
      recipient: params.to,
      error: err.message || 'Network error while sending email via Gmail.',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Send an appointment confirmation email to a customer via the user's connected Gmail
 */
export async function sendAppointmentConfirmationViaGmail(
  appointment: {
    id: string;
    fullName: string;
    serviceName: string;
    serviceCategory?: string;
    servicePrice?: number;
    preferredDate: string;
    preferredTime: string;
    email?: string;
    phone?: string;
    notes?: string;
    status?: string;
  },
  accessToken?: string
): Promise<GmailSendResult> {
  if (!appointment.email || !appointment.email.trim()) {
    return {
      success: false,
      error: 'Appointment does not include a recipient email address.',
      timestamp: new Date().toISOString(),
    };
  }

  const subject = `✨ Appointment Confirmation: ${appointment.serviceName} (${appointment.id}) - Serenity Luxury Salon`;
  const htmlBody = generateAppointmentHtmlEmail(appointment);
  const textBody = `Hello ${appointment.fullName},\n\nYour appointment (${appointment.id}) for ${appointment.serviceName} on ${appointment.preferredDate} at ${appointment.preferredTime} has been registered with Serenity Luxury Salon & Spa.\n\nEstimated Total: ${formatINR(appointment.servicePrice || 1000)}\n\nLocation: Ground Floor, Luxury Pavilion, Viman Nagar, Pune.\nConcierge: +91 8108765851`;

  return sendEmailViaGmailApi({
    to: appointment.email.trim(),
    subject,
    htmlBody,
    textBody,
    accessToken,
  });
}

/**
 * List recent Serenity Salon messages from Gmail inbox/sent
 */
export async function listRecentGmailMessages(
  query = 'Serenity',
  maxResults = 10,
  accessToken?: string
): Promise<GmailMessageSummary[]> {
  const token = accessToken || getCachedGmailAccessToken();
  if (!token) {
    return [];
  }

  try {
    const listRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=${maxResults}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    );

    if (!listRes.ok) return [];

    const listData = await listRes.json();
    if (!listData.messages || !Array.isArray(listData.messages)) {
      return [];
    }

    const summaries: GmailMessageSummary[] = [];

    for (const item of listData.messages.slice(0, 5)) {
      try {
        const msgRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${item.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Date`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          }
        );

        if (msgRes.ok) {
          const msgData = await msgRes.json();
          const headers = msgData.payload?.headers || [];
          const getHeader = (name: string) => headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || '';

          summaries.push({
            id: msgData.id,
            threadId: msgData.threadId,
            snippet: msgData.snippet || '',
            subject: getHeader('Subject') || '(No Subject)',
            from: getHeader('From'),
            to: getHeader('To'),
            date: getHeader('Date'),
          });
        }
      } catch (itemErr) {
        console.debug('Error fetching single message summary:', itemErr);
      }
    }

    return summaries;
  } catch (err) {
    console.warn('listRecentGmailMessages error:', err);
    return [];
  }
}
