import crypto from 'crypto';
import { getServiceEstimatedPrice, calculateAdvancePayment } from '../src/utils/servicePricing';

/**
 * Server-Side Razorpay Configuration
 * Strictly uses server-side environment variables RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.
 * Secrets are never sent to or exposed on the client.
 */
export interface RazorpayServerConfig {
  keyId: string;
  keySecret: string;
  webhookSecret?: string;
}

/**
 * Options for creating an appointment advance order on the server
 */
export interface CreateAppointmentOrderOptions {
  appointmentId: string;
  serviceName: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  requestedAmount?: number;
  advancePercentage?: number;
  customServicePrice?: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

/**
 * Options for creating an e-commerce product order on the server
 */
export interface CreateProductOrderOptions {
  orderId: string; // e.g. "SRN-ORD-84920"
  amountInINR: number; // In Rupees (e.g. 2301)
  currency?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  itemSummary?: string;
  notes?: Record<string, string>;
}

/**
 * Result of creating a Razorpay order on the server
 */
export interface CreateRazorpayOrderResult {
  success: boolean;
  orderId?: string;
  amount?: number; // In INR (e.g. 360)
  amountInPaise?: number; // In paise (e.g. 36000)
  currency?: string;
  keyId?: string;
  serviceName?: string;
  verifiedServicePrice?: number;
  advanceAmount?: number;
  remainingAmount?: number;
  error?: string;
  requiresConfiguration?: boolean;
  isSandbox?: boolean;
  isSandboxFallback?: boolean;
  authError?: string;
}

/**
 * Parameters for verifying Razorpay payment signature
 */
export interface VerifyPaymentSignatureParams {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  appointmentId?: string;
  expectedServicePrice?: number;
  claimedAmount?: number;
}

/**
 * Result of verifying Razorpay payment signature
 */
export interface VerifyPaymentSignatureResult {
  isValid: boolean;
  code: 'SIGNATURE_VALID' | 'SIGNATURE_MISMATCH' | 'MISSING_PARAMETERS' | 'SECRET_NOT_CONFIGURED';
  message: string;
  orderId: string;
  paymentId: string;
}

/**
 * Parameters for verifying Razorpay webhook signature
 */
export interface VerifyWebhookSignatureParams {
  rawBody: string | Buffer;
  signature: string;
  webhookSecret?: string;
}

/**
 * Result of live Razorpay payment query
 */
export interface RazorpayPaymentStatusResult {
  success: boolean;
  status?: string; // 'captured', 'authorized', 'failed', 'refunded'
  isCaptured: boolean;
  amount?: number; // in paise
  currency?: string;
  orderId?: string;
  method?: string;
  email?: string;
  contact?: string;
  error?: string;
}

/**
 * Result of live Razorpay order query
 */
export interface RazorpayOrderStatusResult {
  success: boolean;
  status?: string; // 'created', 'attempted', 'paid'
  isPaid: boolean;
  amount?: number; // in paise
  amountPaid?: number; // in paise
  error?: string;
}

/**
 * Retrieves and validates the server-side Razorpay configuration from process.env
 * Strictly executed on the server.
 */
export function getRazorpayServerConfig(): RazorpayServerConfig {
  const keyId = (process.env.RAZORPAY_KEY_ID || '').trim();
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
  const webhookSecret = (process.env.RAZORPAY_WEBHOOK_SECRET || '').trim();

  return {
    keyId,
    keySecret,
    webhookSecret,
  };
}

/**
 * Checks if Razorpay credentials are valid and configured on the server
 */
export function isRazorpayConfigured(): boolean {
  const { keyId, keySecret } = getRazorpayServerConfig();
  const isKeySecretMasked = /^\*+$/.test(keySecret) || keySecret.includes('*');
  const isKeyIdPlaceholder = !keyId || keyId.includes('placeholder') || /^\*+$/.test(keyId);
  const isKeySecretPlaceholder = !keySecret || keySecret.includes('placeholder') || isKeySecretMasked;
  return Boolean(!isKeyIdPlaceholder && !isKeySecretPlaceholder);
}

/**
 * Safe Razorpay diagnostics structure - NEVER exposes raw secret strings.
 */
export interface SafeRazorpayDiagnostics {
  RAZORPAY_KEY_ID_PRESENT: boolean;
  RAZORPAY_KEY_SECRET_PRESENT: boolean;
  RAZORPAY_WEBHOOK_SECRET_PRESENT: boolean;
  RAZORPAY_MODE: 'TEST' | 'LIVE' | 'NOT_CONFIGURED';
  KEY_MODE_MATCH: boolean;
  SERVER_SIDE_AUTH: boolean;
  SECRETS_ARE_DISTINCT: boolean;
  keyIdPrefix: string;
  keySecretLength: number;
  apiHttpStatus?: number;
  apiErrorCode?: string;
  apiErrorDescription?: string;
  authValid?: boolean;
}

/**
 * Generates safe diagnostics without exposing secrets.
 */
export function getSafeRazorpayDiagnostics(): SafeRazorpayDiagnostics {
  const { keyId, keySecret, webhookSecret } = getRazorpayServerConfig();
  const isMaskedSecret = /^\*+$/.test(keySecret) || keySecret.includes('*');
  const keySecretPresent = Boolean(keySecret && !isMaskedSecret);
  const keyIdPresent = Boolean(keyId && !keyId.includes('placeholder'));
  const webhookSecretPresent = Boolean(webhookSecret && !/^\*+$/.test(webhookSecret));

  const mode: 'TEST' | 'LIVE' | 'NOT_CONFIGURED' = keyId.startsWith('rzp_live_')
    ? 'LIVE'
    : keyId.startsWith('rzp_test_')
    ? 'TEST'
    : 'NOT_CONFIGURED';

  const keyIdPrefix = keyId.startsWith('rzp_live_')
    ? 'rzp_live_'
    : keyId.startsWith('rzp_test_')
    ? 'rzp_test_'
    : keyId ? 'custom' : 'none';

  // Mode match check: If Test Key ID, secret must exist and not be masked.
  // Secrets are distinct check: RAZORPAY_KEY_SECRET !== RAZORPAY_WEBHOOK_SECRET
  const secretsAreDistinct = Boolean(
    keySecretPresent && webhookSecretPresent && keySecret !== webhookSecret
  );

  return {
    RAZORPAY_KEY_ID_PRESENT: keyIdPresent,
    RAZORPAY_KEY_SECRET_PRESENT: keySecretPresent,
    RAZORPAY_WEBHOOK_SECRET_PRESENT: webhookSecretPresent,
    RAZORPAY_MODE: mode,
    KEY_MODE_MATCH: keyIdPresent && keySecretPresent,
    SERVER_SIDE_AUTH: true,
    SECRETS_ARE_DISTINCT: !webhookSecretPresent || secretsAreDistinct,
    keyIdPrefix,
    keySecretLength: keySecret.length,
  };
}

/**
 * Tests server-side authentication against Razorpay API and prints safe diagnostic report.
 * NEVER prints or leaks the secret value.
 */
export async function testRazorpayServerAuthentication(): Promise<{
  isValid: boolean;
  httpStatus: number;
  errorCode?: string;
  errorDescription?: string;
  diagnostics: SafeRazorpayDiagnostics;
}> {
  const diagnostics = getSafeRazorpayDiagnostics();
  const serverConfig = getRazorpayServerConfig();

  if (!diagnostics.RAZORPAY_KEY_ID_PRESENT || !diagnostics.RAZORPAY_KEY_SECRET_PRESENT) {
    console.log(`[RAZORPAY AUTH AUDIT]
RAZORPAY_KEY_ID_PRESENT = ${diagnostics.RAZORPAY_KEY_ID_PRESENT}
RAZORPAY_KEY_SECRET_PRESENT = ${diagnostics.RAZORPAY_KEY_SECRET_PRESENT}
RAZORPAY_WEBHOOK_SECRET_PRESENT = ${diagnostics.RAZORPAY_WEBHOOK_SECRET_PRESENT}
RAZORPAY_MODE = ${diagnostics.RAZORPAY_MODE}
Razorpay API HTTP status = 0
Razorpay error code = CREDENTIALS_MISSING
Razorpay error description = RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET missing from server environment.`);

    return {
      isValid: false,
      httpStatus: 0,
      errorCode: 'CREDENTIALS_MISSING',
      errorDescription: 'RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not configured on the server.',
      diagnostics: {
        ...diagnostics,
        authValid: false,
      },
    };
  }

  try {
    const authString = Buffer.from(
      `${serverConfig.keyId}:${serverConfig.keySecret}`
    ).toString('base64');

    const res = await fetch('https://api.razorpay.com/v1/payments?count=1', {
      method: 'GET',
      headers: {
        Authorization: `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
    });

    const httpStatus = res.status;
    let errorCode = '';
    let errorDescription = '';

    if (res.ok) {
      console.log(`[RAZORPAY AUTH AUDIT]
RAZORPAY_KEY_ID_PRESENT = ${diagnostics.RAZORPAY_KEY_ID_PRESENT}
RAZORPAY_KEY_SECRET_PRESENT = ${diagnostics.RAZORPAY_KEY_SECRET_PRESENT}
RAZORPAY_WEBHOOK_SECRET_PRESENT = ${diagnostics.RAZORPAY_WEBHOOK_SECRET_PRESENT}
RAZORPAY_MODE = ${diagnostics.RAZORPAY_MODE}
Razorpay API HTTP status = ${httpStatus}
Razorpay error code = NONE
Razorpay error description = Authentication successful`);

      return {
        isValid: true,
        httpStatus,
        diagnostics: {
          ...diagnostics,
          apiHttpStatus: httpStatus,
          authValid: true,
        },
      };
    } else {
      const data = await res.json().catch(() => ({}));
      errorCode = data.error?.code || 'AUTH_ERROR';
      errorDescription = data.error?.description || data.error?.message || res.statusText || 'Authentication failed';

      console.error(`[RAZORPAY AUTH AUDIT]
RAZORPAY_KEY_ID_PRESENT = ${diagnostics.RAZORPAY_KEY_ID_PRESENT}
RAZORPAY_KEY_SECRET_PRESENT = ${diagnostics.RAZORPAY_KEY_SECRET_PRESENT}
RAZORPAY_WEBHOOK_SECRET_PRESENT = ${diagnostics.RAZORPAY_WEBHOOK_SECRET_PRESENT}
RAZORPAY_MODE = ${diagnostics.RAZORPAY_MODE}
Razorpay API HTTP status = ${httpStatus}
Razorpay error code = ${errorCode}
Razorpay error description = ${errorDescription}`);

      return {
        isValid: false,
        httpStatus,
        errorCode,
        errorDescription,
        diagnostics: {
          ...diagnostics,
          apiHttpStatus: httpStatus,
          apiErrorCode: errorCode,
          apiErrorDescription: errorDescription,
          authValid: false,
        },
      };
    }
  } catch (netErr: any) {
    console.error(`[RAZORPAY AUTH AUDIT] Network error:`, netErr?.message || netErr);
    return {
      isValid: false,
      httpStatus: 0,
      errorCode: 'NETWORK_ERROR',
      errorDescription: netErr?.message || 'Network communication error',
      diagnostics: {
        ...diagnostics,
        authValid: false,
      },
    };
  }
}

/**
 * Emits safe diagnostic logging for server-side Razorpay order creation without leaking secrets
 */
function logSafeRazorpayOrderCreation(
  keyId: string,
  keySecret: string,
  amountInPaise: number,
  currency: string,
  internalReference: string
): void {
  const mode = keyId.startsWith('rzp_live_')
    ? 'LIVE'
    : keyId.startsWith('rzp_test_')
    ? 'TEST'
    : 'UNKNOWN';
  const keyIdPresent = Boolean(keyId);
  const keyIdPrefix = keyId.startsWith('rzp_live_')
    ? 'rzp_live_'
    : keyId.startsWith('rzp_test_')
    ? 'rzp_test_'
    : keyId
    ? 'unknown'
    : 'none';
  const isMaskedSecret = /^\*+$/.test(keySecret) || keySecret.includes('*');
  const secretPresent = Boolean(keySecret && !isMaskedSecret);

  console.log(`[SERVER RAZORPAY ORDER CREATE]
mode = ${mode}
key_id_present = ${keyIdPresent}
key_id_prefix = ${keyIdPrefix}
secret_present = ${secretPresent}
amount = ${amountInPaise} paise
currency = ${currency.toUpperCase()}
internal_reference = ${internalReference}`);

  if (isMaskedSecret) {
    console.warn(
      `[RAZORPAY CONFIG WARNING] RAZORPAY_KEY_SECRET is set to masked asterisk characters (***). It must be the real secret generated from the Razorpay Dashboard.`
    );
  }
}

/**
 * Verifies and computes the authoritative service price and required 40% advance payment amount.
 * Prevents client-side manipulation by comparing requested amount against the server-verified catalog.
 */
export function verifyAndCalculateServiceAmount(
  serviceName: string,
  requestedAmount?: number,
  customServicePrice?: number,
  advancePercentage: number = 40
): {
  verifiedServicePrice: number;
  calculatedAdvanceAmount: number;
  remainingAmount: number;
  isTampered: boolean;
} {
  const verifiedServicePrice =
    customServicePrice && customServicePrice > 0
      ? customServicePrice
      : getServiceEstimatedPrice(serviceName);

  const { advanceAmount, remainingAmount } = calculateAdvancePayment(
    serviceName,
    advancePercentage,
    verifiedServicePrice
  );

  let isTampered = false;
  if (requestedAmount !== undefined && requestedAmount !== null) {
    const numRequested = Number(requestedAmount);
    if (numRequested <= 0 || numRequested > verifiedServicePrice) {
      isTampered = true;
    }
  }

  return {
    verifiedServicePrice,
    calculatedAdvanceAmount: advanceAmount,
    remainingAmount,
    isTampered,
  };
}

/**
 * Creates a Razorpay Order server-side for salon appointment advance payments.
 * Performs POST https://api.razorpay.com/v1/orders exclusively on the server side
 * using RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.
 */
export async function createRazorpayOrder(
  options: CreateAppointmentOrderOptions
): Promise<CreateRazorpayOrderResult> {
  const {
    appointmentId,
    serviceName,
    customerName,
    customerEmail,
    customerPhone,
    requestedAmount,
    advancePercentage = 40,
    customServicePrice,
    currency = 'INR',
    receipt,
    notes = {},
  } = options;

  if (!appointmentId) {
    return {
      success: false,
      error: 'Appointment ID is required for creating a payment order.',
    };
  }

  // Verify and enforce server-authoritative pricing (40% advance deposit)
  const {
    verifiedServicePrice,
    calculatedAdvanceAmount,
    remainingAmount,
  } = verifyAndCalculateServiceAmount(
    serviceName,
    requestedAmount,
    customServicePrice,
    advancePercentage
  );

  const payableAmount = calculatedAdvanceAmount;
  const amountInPaise = Math.round(payableAmount * 100);

  const serverConfig = getRazorpayServerConfig();

  logSafeRazorpayOrderCreation(
    serverConfig.keyId,
    serverConfig.keySecret,
    amountInPaise,
    currency,
    `appointment_${appointmentId}`
  );

  if (!isRazorpayConfigured()) {
    return {
      success: false,
      requiresConfiguration: true,
      error: 'Razorpay online payment is temporarily unavailable. Please complete payment at the salon upon arrival.',
    };
  }

  try {
    const authString = Buffer.from(
      `${serverConfig.keyId}:${serverConfig.keySecret}`
    ).toString('base64');

    const sanitizedReceipt = (
      receipt ||
      `rcpt_${appointmentId.replace(/[^a-zA-Z0-9]/g, '').substring(0, 30)}`
    ).substring(0, 40);

    const orderPayload = {
      amount: amountInPaise,
      currency: currency.toUpperCase(),
      receipt: sanitizedReceipt,
      notes: {
        appointmentId,
        serviceName: serviceName || 'Salon Service',
        customerName: customerName || 'Valued Client',
        customerEmail: customerEmail || '',
        customerPhone: customerPhone || '',
        verifiedTotal: String(verifiedServicePrice),
        advancePaid: String(payableAmount),
        ...notes,
      },
    };

    // Server-side POST https://api.razorpay.com/v1/orders
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify(orderPayload),
    });

    const responseData = await response.json();

    if (response.ok && responseData.id) {
      return {
        success: true,
        orderId: responseData.id,
        amount: payableAmount,
        amountInPaise,
        currency: currency.toUpperCase(),
        keyId: serverConfig.keyId,
        serviceName,
        verifiedServicePrice,
        advanceAmount: payableAmount,
        remainingAmount,
      };
    } else {
      const httpStatus = response.status;
      const errorCode = responseData.error?.code || 'GATEWAY_ERROR';
      const errorDescription =
        responseData.error?.description ||
        responseData.error?.message ||
        response.statusText ||
        'Failed to create order with Razorpay payment gateway.';

      const mode = serverConfig.keyId.startsWith('rzp_live_') ? 'LIVE' : serverConfig.keyId.startsWith('rzp_test_') ? 'TEST' : 'NOT_CONFIGURED';
      console.error(`[RAZORPAY ORDER CREATE NOTICE]
RAZORPAY_KEY_ID_PRESENT = ${Boolean(serverConfig.keyId)}
RAZORPAY_KEY_SECRET_PRESENT = ${Boolean(serverConfig.keySecret)}
RAZORPAY_WEBHOOK_SECRET_PRESENT = ${Boolean(serverConfig.webhookSecret)}
RAZORPAY_MODE = ${mode}
Razorpay API HTTP status = ${httpStatus}
Razorpay error code = ${errorCode}
Razorpay error description = ${errorDescription}`);

      const isAuthError = httpStatus === 401 || errorCode === 'BAD_REQUEST_ERROR' || errorDescription.includes('Authentication failed');
      const customerMessage = isAuthError
        ? 'Payment gateway authentication error. Please verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server settings.'
        : errorDescription;

      return {
        success: false,
        error: customerMessage,
      };
    }
  } catch (err: any) {
    console.error('[RAZORPAY SERVER ORDER ERROR] Order creation failed:', err);
    return {
      success: false,
      error: 'Razorpay order creation failed. Check server configuration/logs.',
    };
  }
}

/**
 * Creates a Razorpay Order server-side for e-commerce product checkout.
 * Performs POST https://api.razorpay.com/v1/orders exclusively on the server side
 * using RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.
 */
export async function createRazorpayProductOrder(
  options: CreateProductOrderOptions
): Promise<CreateRazorpayOrderResult> {
  const {
    orderId,
    amountInINR,
    currency = 'INR',
    customerName,
    customerEmail,
    customerPhone,
    itemSummary,
    notes = {},
  } = options;

  const payableAmount = Math.max(1, Math.round(Number(amountInINR)));
  const amountInPaise = payableAmount * 100;

  const serverConfig = getRazorpayServerConfig();

  logSafeRazorpayOrderCreation(
    serverConfig.keyId,
    serverConfig.keySecret,
    amountInPaise,
    currency,
    `product_order_${orderId}`
  );

  if (!isRazorpayConfigured()) {
    return {
      success: false,
      requiresConfiguration: true,
      error: 'Razorpay online payment is temporarily unavailable. Please check server configuration.',
    };
  }

  try {
    const authString = Buffer.from(
      `${serverConfig.keyId}:${serverConfig.keySecret}`
    ).toString('base64');

    const sanitizedReceipt = `rcpt_${orderId.replace(/[^a-zA-Z0-9]/g, '').substring(0, 30)}`.substring(0, 40);

    const orderPayload = {
      amount: amountInPaise,
      currency: currency.toUpperCase(),
      receipt: sanitizedReceipt,
      notes: {
        orderId,
        orderType: 'PRODUCT_PURCHASE',
        customerName: customerName || 'Valued Customer',
        customerEmail: customerEmail || '',
        customerPhone: customerPhone || '',
        itemSummary: (itemSummary || 'Serenity Salon Beauty Products').substring(0, 200),
        amountPaid: String(payableAmount),
        ...notes,
      },
    };

    // Server-side POST https://api.razorpay.com/v1/orders
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify(orderPayload),
    });

    const responseData = await response.json();

    if (response.ok && responseData.id) {
      return {
        success: true,
        orderId: responseData.id,
        amount: payableAmount,
        amountInPaise,
        currency: currency.toUpperCase(),
        keyId: serverConfig.keyId,
        serviceName: itemSummary,
        verifiedServicePrice: payableAmount,
      };
    } else {
      const httpStatus = response.status;
      const errorCode = responseData.error?.code || 'GATEWAY_ERROR';
      const errorDescription =
        responseData.error?.description ||
        responseData.error?.message ||
        response.statusText ||
        'Failed to create order with Razorpay payment gateway.';

      const mode = serverConfig.keyId.startsWith('rzp_live_') ? 'LIVE' : serverConfig.keyId.startsWith('rzp_test_') ? 'TEST' : 'NOT_CONFIGURED';
      console.error(`[RAZORPAY PRODUCT ORDER CREATE NOTICE]
RAZORPAY_KEY_ID_PRESENT = ${Boolean(serverConfig.keyId)}
RAZORPAY_KEY_SECRET_PRESENT = ${Boolean(serverConfig.keySecret)}
RAZORPAY_WEBHOOK_SECRET_PRESENT = ${Boolean(serverConfig.webhookSecret)}
RAZORPAY_MODE = ${mode}
Razorpay API HTTP status = ${httpStatus}
Razorpay error code = ${errorCode}
Razorpay error description = ${errorDescription}`);

      const isAuthError = httpStatus === 401 || errorCode === 'BAD_REQUEST_ERROR' || errorDescription.includes('Authentication failed');
      const customerMessage = isAuthError
        ? 'Payment gateway authentication error. Please verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server settings.'
        : errorDescription;

      return {
        success: false,
        error: customerMessage,
      };
    }
  } catch (err: any) {
    console.error('[RAZORPAY SERVER PRODUCT ORDER ERROR]', err);
    return {
      success: false,
      error: 'Razorpay order creation failed. Check server configuration/logs.',
    };
  }
}

/**
 * Cryptographically verifies a Razorpay payment signature on the server using RAZORPAY_KEY_SECRET.
 * Formula: HMAC_SHA256(order_id + "|" + payment_id, key_secret) === signature
 * Uses timingSafeEqual to protect against timing attacks.
 */
export function verifyRazorpayPaymentSignature(
  params: VerifyPaymentSignatureParams
): VerifyPaymentSignatureResult {
  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  } = params;

  if (!razorpayOrderId || !razorpayPaymentId) {
    return {
      isValid: false,
      code: 'MISSING_PARAMETERS',
      message: 'Missing order ID or payment ID for signature verification.',
      orderId: razorpayOrderId || '',
      paymentId: razorpayPaymentId || '',
    };
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!keySecret || keySecret.includes('placeholder')) {
    console.warn('[SECURITY ALERT] RAZORPAY_KEY_SECRET is not configured on the server.');
    return {
      isValid: false,
      code: 'SECRET_NOT_CONFIGURED',
      message: 'RAZORPAY_KEY_SECRET is not configured on the server.',
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    };
  }

  try {
    const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(payload)
      .digest('hex');

    const expectedBuf = Buffer.from(expectedSignature, 'utf8');
    const actualBuf = Buffer.from(razorpaySignature || '', 'utf8');

    const isValid =
      expectedBuf.length === actualBuf.length &&
      crypto.timingSafeEqual(expectedBuf, actualBuf);

    if (!isValid) {
      console.warn(
        `[SIGNATURE MISMATCH] Expected signature does not match received signature for order ${razorpayOrderId}, payment ${razorpayPaymentId}`
      );
      return {
        isValid: false,
        code: 'SIGNATURE_MISMATCH',
        message: 'Invalid payment signature. Verification failed.',
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
      };
    }

    return {
      isValid: true,
      code: 'SIGNATURE_VALID',
      message: 'Payment signature verified successfully.',
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    };
  } catch (err: any) {
    console.error('[SIGNATURE VERIFICATION EXCEPTION]', err);
    return {
      isValid: false,
      code: 'SIGNATURE_MISMATCH',
      message: err.message || 'Error occurred during signature verification.',
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    };
  }
}

/**
 * Cryptographically verifies a Razorpay webhook signature on the server using RAZORPAY_WEBHOOK_SECRET.
 * Uses timingSafeEqual to protect against timing attacks.
 */
export function verifyRazorpayWebhookSignature(params: VerifyWebhookSignatureParams): boolean {
  const { rawBody, signature, webhookSecret: overrideSecret } = params;
  const webhookSecret = (
    overrideSecret ||
    process.env.RAZORPAY_WEBHOOK_SECRET ||
    ''
  ).trim();

  if (!webhookSecret || !signature) {
    return false;
  }

  // Reject if webhook secret is placeholder asterisks
  if (/^\*+$/.test(webhookSecret)) {
    console.error('[WEBHOOK SECURITY ERROR] RAZORPAY_WEBHOOK_SECRET contains masked placeholder characters.');
    return false;
  }

  // Enforce separate secrets rule: NEVER use RAZORPAY_KEY_SECRET as webhook secret
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
  if (keySecret && webhookSecret === keySecret) {
    console.error('[WEBHOOK SECURITY ERROR] RAZORPAY_WEBHOOK_SECRET is identical to RAZORPAY_KEY_SECRET. Refusing verification per security policy.');
    return false;
  }

  try {
    const bodyStr = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(bodyStr)
      .digest('hex');

    const expectedBuf = Buffer.from(expectedSignature, 'utf8');
    const actualBuf = Buffer.from(signature, 'utf8');

    return (
      expectedBuf.length === actualBuf.length &&
      crypto.timingSafeEqual(expectedBuf, actualBuf)
    );
  } catch (err) {
    console.error('[WEBHOOK SIGNATURE VERIFICATION ERROR]', err);
    return false;
  }
}

/**
 * Checks if RAZORPAY_WEBHOOK_SECRET is properly set and distinct from RAZORPAY_KEY_SECRET.
 */
export function isRazorpayWebhookConfigured(): boolean {
  const secret = (process.env.RAZORPAY_WEBHOOK_SECRET || '').trim();
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
  if (!secret) return false;
  if (/^\*+$/.test(secret)) return false;
  if (keySecret && secret === keySecret) return false;
  return true;
}

/**
 * Queries Razorpay API on the server for the real-time status of a payment.
 * Enforces requirement: payment.status must be 'captured'.
 */
export async function fetchRazorpayPaymentStatus(
  paymentId: string
): Promise<RazorpayPaymentStatusResult> {
  const serverConfig = getRazorpayServerConfig();
  if (!serverConfig.keyId || !serverConfig.keySecret) {
    return {
      success: false,
      isCaptured: false,
      error: 'Razorpay server credentials are not configured',
    };
  }

  try {
    const authString = Buffer.from(
      `${serverConfig.keyId}:${serverConfig.keySecret}`
    ).toString('base64');

    const res = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(`[RAZORPAY PAYMENT STATUS CHECK FAILED] HTTP ${res.status}:`, data);
      return {
        success: false,
        isCaptured: false,
        error: data.error?.description || data.error?.message || 'Failed to fetch payment status',
      };
    }

    const status = (data.status || '').toLowerCase();
    const isCaptured = status === 'captured';

    return {
      success: true,
      status,
      isCaptured,
      amount: data.amount, // paise
      currency: data.currency,
      orderId: data.order_id,
      method: data.method,
      email: data.email,
      contact: data.contact,
    };
  } catch (err: any) {
    console.error('[RAZORPAY PAYMENT STATUS EXCEPTION]', err);
    return {
      success: false,
      isCaptured: false,
      error: err.message || 'Network failure while checking payment status',
    };
  }
}

/**
 * Queries Razorpay API on the server for the status of an order.
 */
export async function fetchRazorpayOrderStatus(
  orderId: string
): Promise<RazorpayOrderStatusResult> {
  const serverConfig = getRazorpayServerConfig();
  if (!serverConfig.keyId || !serverConfig.keySecret) {
    return {
      success: false,
      isPaid: false,
      error: 'Razorpay server credentials are not configured',
    };
  }

  try {
    const authString = Buffer.from(
      `${serverConfig.keyId}:${serverConfig.keySecret}`
    ).toString('base64');

    const res = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(`[RAZORPAY ORDER STATUS CHECK FAILED] HTTP ${res.status}:`, data);
      return {
        success: false,
        isPaid: false,
        error: data.error?.description || data.error?.message || 'Failed to fetch order status',
      };
    }

    const status = (data.status || '').toLowerCase();
    const isPaid = status === 'paid';

    return {
      success: true,
      status,
      isPaid,
      amount: data.amount,
      amountPaid: data.amount_paid,
    };
  } catch (err: any) {
    console.error('[RAZORPAY ORDER STATUS EXCEPTION]', err);
    return {
      success: false,
      isPaid: false,
      error: err.message || 'Network failure while checking order status',
    };
  }
}

/**
 * Fetches available payment methods configured on the merchant account via Razorpay API.
 */
export async function fetchRazorpayPaymentMethods(): Promise<{
  success: boolean;
  methods?: any;
  hasUpi?: boolean;
  hasCards?: boolean;
  hasNetbanking?: boolean;
  hasWallet?: boolean;
  error?: string;
}> {
  const serverConfig = getRazorpayServerConfig();
  if (!isRazorpayConfigured()) {
    return { success: false, error: 'Razorpay is not configured' };
  }

  try {
    const res = await fetch(`https://api.razorpay.com/v1/methods?key_id=${encodeURIComponent(serverConfig.keyId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    if (!res.ok) {
      // In test/sandbox mode or when credentials fail authentication, return fallback methods
      return {
        success: true,
        methods: { upi: true, card: true, netbanking: true, wallet: true },
        hasUpi: true,
        hasCards: true,
        hasNetbanking: true,
        hasWallet: true,
      };
    }

    const hasUpi = Boolean(data.upi);
    const hasCards = Boolean(data.card);
    const hasNetbanking = Boolean(data.netbanking);
    const hasWallet = Boolean(data.wallet);

    return {
      success: true,
      methods: data,
      hasUpi,
      hasCards,
      hasNetbanking,
      hasWallet,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to query Razorpay methods API',
    };
  }
}
