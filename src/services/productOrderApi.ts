import { ProductOrder, OrderStatus, ShippingAddress } from '../types';

const API_BASE = '/api/orders';
const ADMIN_SESSION_KEY = 'serenity_admin_auth_session_v1';

function getAdminAuthHeaders(): Record<string, string> {
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    let token = '';
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.token) token = parsed.token;
    }
    if (!token && typeof localStorage !== 'undefined') {
      token = localStorage.getItem('serenity_admin_session') || '';
    }
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
        'x-admin-token': token,
      };
    }
  } catch {
    // ignore
  }
  return {};
}

export interface CreateProductOrderPayload {
  items: Array<{ productId: string; quantity: number }>;
  customerName?: string;
  email?: string;
  phone?: string;
  customer?: {
    name: string;
    email?: string;
    phone: string;
    notes?: string;
  };
  shippingAddress: ShippingAddress;
  promoCode?: string;
  paymentMethod?: 'ONLINE' | 'COD';
}

export interface CreateProductOrderResponse {
  success: boolean;
  orderId?: string;
  razorpayOrderId?: string;
  razorpayKeyId?: string;
  amount?: number;
  grandTotal?: number;
  currency?: string;
  keyId?: string;
  order?: ProductOrder;
  error?: string;
  requiresConfiguration?: boolean;
  requiresGatewayConfig?: boolean;
  isSandbox?: boolean;
}

export interface VerifyProductPaymentPayload {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyProductPaymentResponse {
  success: boolean;
  order?: ProductOrder;
  message?: string;
  error?: string;
}

export interface ProductOrderStats {
  total: number;
  pendingPayment: number;
  paid: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
}

export const productOrderApi = {
  /**
   * Create a new product order on the server and generate a Razorpay order ID
   */
  async createOrder(payload: CreateProductOrderPayload): Promise<CreateProductOrderResponse> {
    try {
      const res = await fetch(`${API_BASE}/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      return data;
    } catch (err: any) {
      console.warn('[productOrderApi] Notice creating product order:', err?.message || err);
      return {
        success: false,
        error: err?.message || 'Network error while initiating product order.',
      };
    }
  },

  /**
   * Verify Razorpay cryptographic payment signature and mark order as PAID
   */
  async verifyPayment(payload: VerifyProductPaymentPayload): Promise<VerifyProductPaymentResponse> {
    try {
      const res = await fetch(`${API_BASE}/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      return data;
    } catch (err: any) {
      console.warn('[productOrderApi] Notice verifying payment:', err?.message || err);
      return {
        success: false,
        error: err?.message || 'Network error while verifying payment.',
      };
    }
  },

  /**
   * Get all product orders with optional status or search query
   */
  async getAllOrders(status?: string, search?: string): Promise<{ success: boolean; data: ProductOrder[]; count: number }> {
    try {
      const params = new URLSearchParams();
      if (status && status !== 'All') params.append('status', status);
      if (search && search.trim()) params.append('search', search.trim());

      const url = `${API_BASE}${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url, {
        headers: {
          Accept: 'application/json',
          ...getAdminAuthHeaders(),
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const json = await res.json();
      return {
        success: json.success ?? true,
        data: json.data || [],
        count: json.count || (json.data ? json.data.length : 0),
      };
    } catch (err: any) {
      console.warn('Failed to fetch orders from server:', err);
      // Local fallback from localStorage
      try {
        const saved = localStorage.getItem('serenity_product_orders_v1');
        const list: ProductOrder[] = saved ? JSON.parse(saved) : [];
        return { success: true, data: list, count: list.length };
      } catch {
        return { success: false, data: [], count: 0 };
      }
    }
  },

  /**
   * Fetch a single order by orderId
   */
  async getOrderById(orderId: string): Promise<ProductOrder | null> {
    try {
      const res = await fetch(`${API_BASE}/${encodeURIComponent(orderId)}`);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data || null;
    } catch (err) {
      console.error('Error getting order by id:', err);
      return null;
    }
  },

  /**
   * Update order status (Processing, Shipped, Delivered, Cancelled)
   */
  async updateOrderStatus(
    orderId: string,
    statusOrPayload: OrderStatus | { status: OrderStatus; trackingNumber?: string; carrier?: string }
  ): Promise<{ success: boolean; data?: ProductOrder; order?: ProductOrder; error?: string }> {
    try {
      const body =
        typeof statusOrPayload === 'string'
          ? { status: statusOrPayload }
          : statusOrPayload;

      const res = await fetch(`${API_BASE}/${encodeURIComponent(orderId)}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminAuthHeaders(),
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      return {
        ...data,
        order: data.order || data.data,
      };
    } catch (err: any) {
      console.error('Error updating order status:', err);
      return { success: false, error: err?.message || 'Failed to update order status.' };
    }
  },

  /**
   * Retry customer confirmation email for an order
   */
  async retryOrderEmail(orderId: string): Promise<{ success: boolean; message?: string; error?: string; data?: ProductOrder; order?: ProductOrder }> {
    try {
      const res = await fetch(`${API_BASE}/${encodeURIComponent(orderId)}/retry-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminAuthHeaders(),
        },
      });
      const data = await res.json();
      return {
        ...data,
        order: data.order || data.data,
      };
    } catch (err: any) {
      console.error('Error retrying order email:', err);
      return { success: false, error: err?.message || 'Failed to retry order email.' };
    }
  },

  /**
   * Get orders statistics
   */
  async getStats(): Promise<ProductOrderStats> {
    try {
      const res = await fetch(`${API_BASE}/stats`, {
        headers: {
          Accept: 'application/json',
          ...getAdminAuthHeaders(),
        },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.stats) {
          return json.stats;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch order stats:', e);
    }

    return {
      total: 0,
      pendingPayment: 0,
      paid: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      totalRevenue: 0,
    };
  },

  /**
   * Get Razorpay payment public configuration
   */
  async getPaymentConfig(): Promise<{ keyId: string; isConfigured: boolean; isTestMode?: boolean; mode?: string; isSandbox?: boolean }> {
    try {
      const res = await fetch('/api/payment/config');
      if (res.ok) {
        const data = await res.json();
        return {
          keyId: data.keyId || data.razorpayKeyId || '',
          isConfigured: Boolean(data.isConfigured),
          isTestMode: Boolean(data.isTestMode || (data.keyId && data.keyId.startsWith('rzp_test_'))),
          mode: data.mode || (data.keyId && data.keyId.startsWith('rzp_test_') ? 'TEST' : 'LIVE'),
          isSandbox: Boolean(data.isSandbox || data.isTestMode),
        };
      }
    } catch (e) {
      console.warn('Failed to fetch payment config:', e);
    }
    return {
      keyId: '',
      isConfigured: false,
      isTestMode: false,
      mode: 'UNKNOWN',
      isSandbox: false,
    };
  },

  /**
   * Fetch active payment methods reported by the merchant Razorpay account
   */
  async getPaymentMethods(): Promise<{
    success: boolean;
    hasUpi: boolean;
    hasCards: boolean;
    hasNetbanking: boolean;
    hasWallet: boolean;
    upiIntentSupported: boolean;
    upiQrSupported: boolean;
    methods?: Record<string, boolean>;
  }> {
    try {
      const res = await fetch('/api/payments/methods');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Failed to fetch payment methods:', e);
    }
    return {
      success: false,
      hasUpi: false,
      hasCards: true,
      hasNetbanking: true,
      hasWallet: true,
      upiIntentSupported: true,
      upiQrSupported: false,
    };
  },

  /**
   * Permanently delete a product order
   */
  async deleteOrder(orderId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          ...getAdminAuthHeaders(),
        },
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success !== false) {
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to delete product order.' };
    } catch (err: any) {
      console.error('Failed to delete product order:', err);
      return { success: false, error: err?.message || 'Network error deleting product order.' };
    }
  },
};
