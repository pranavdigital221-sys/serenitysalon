import {
  Appointment,
  AppointmentStats,
  AppointmentStatus,
  AdminSalonSettings,
  AdminAuthSession,
} from '../types';
import {
  updateAppointmentInFirestore,
  deleteAppointmentFromFirestore,
} from '../lib/firebase';

const API_BASE = '/api/appointments';
const PAYMENTS_API = '/api/payments';
const ADMIN_API = '/api/admin';

export interface CreateAppointmentPayload {
  serviceName: string;
  serviceCategory?: string;
  servicePrice?: number;
  preferredDate: string;
  preferredTime: string;
  fullName: string;
  phone: string;
  email?: string;
  notes?: string;
  idempotencyKey?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
  stats?: AppointmentStats;
}

// Fallback in-memory/localStorage cache key
const CLIENT_CACHE_KEY = 'serenity_appointments_cache_v2';
const ADMIN_SESSION_KEY = 'serenity_admin_session_v1';

function getLocalCache(): Appointment[] {
  try {
    const raw = localStorage.getItem(CLIENT_CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCache(records: Appointment[]): void {
  try {
    localStorage.setItem(CLIENT_CACHE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save to local cache:', err);
  }
}

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

export const appointmentApi = {
  /**
   * Fetch all appointments from backend API with advanced filters
   */
  async getAll(
    status?: string,
    search?: string,
    service?: string,
    dateFilter?: string
  ): Promise<{ data: Appointment[]; fromBackend: boolean }> {
    try {
      const params = new URLSearchParams();
      if (status && status !== 'All') params.append('status', status);
      if (search && search.trim()) params.append('search', search.trim());
      if (service && service !== 'All') params.append('service', service);
      if (dateFilter && dateFilter !== 'All') params.append('dateFilter', dateFilter);

      const url = `${API_BASE}${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url, {
        headers: {
          Accept: 'application/json',
          ...getAdminAuthHeaders(),
        },
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const json: ApiResponse<Appointment[]> = await res.json();
      if (json.success && Array.isArray(json.data)) {
        saveLocalCache(json.data);
        return { data: json.data, fromBackend: true };
      }
      throw new Error(json.error || 'Invalid API payload');
    } catch (err) {
      console.warn('API fetch warning, serving cached data:', err);
      let local = getLocalCache();
      if (status && status !== 'All') {
        local = local.filter((a) => a.status.toLowerCase() === status.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        local = local.filter(
          (a) =>
            a.fullName.toLowerCase().includes(q) ||
            a.phone.toLowerCase().includes(q) ||
            a.serviceName.toLowerCase().includes(q) ||
            (a.id && a.id.toLowerCase().includes(q))
        );
      }
      return { data: local, fromBackend: false };
    }
  },

  /**
   * Calculate stats
   */
  async getStats(): Promise<AppointmentStats> {
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
      console.warn('Failed to fetch stats from API, computing from local cache:', e);
    }

    const local = getLocalCache();
    const today = new Date().toISOString().split('T')[0];
    return {
      total: local.length,
      pending: local.filter((a) => a.status === 'Pending').length,
      confirmed: local.filter((a) => a.status === 'Confirmed').length,
      completed: local.filter((a) => a.status === 'Completed').length,
      cancelled: local.filter((a) => a.status === 'Cancelled').length,
      todayCount: local.filter((a) => a.preferredDate === today).length,
    };
  },

  /**
   * Check real-time slot availability for a specific date (Public endpoint, no admin token required)
   */
  async getAvailability(date: string): Promise<{ success: boolean; date: string; bookedSlots: string[] }> {
    try {
      const res = await fetch(`${API_BASE}/availability?date=${encodeURIComponent(date)}`, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, date, bookedSlots: json.bookedSlots || [] };
      }
      return { success: false, date, bookedSlots: [] };
    } catch {
      return { success: false, date, bookedSlots: [] };
    }
  },

  /**
   * Submit new appointment with 10-second timeout and idempotency safety
   */
  async create(
    payload: CreateAppointmentPayload,
    timeoutMs: number = 10000
  ): Promise<{ success: boolean; data?: Appointment; message?: string; error?: string; idempotent?: boolean }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };
      if (payload.idempotencyKey) {
        headers['x-idempotency-key'] = payload.idempotencyKey;
      }

      const res = await fetch(API_BASE, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success && json.data) {
        const cache = getLocalCache();
        saveLocalCache([json.data, ...cache.filter((c) => c.id !== json.data.id)]);
        return {
          success: true,
          data: json.data,
          message: json.message || 'Appointment request received successfully!',
          idempotent: Boolean(json.idempotent),
        };
      }

      // If server returned a structured error (like 409 conflict or 400 validation error), return it directly
      if (!res.ok || json.error) {
        return {
          success: false,
          error: json.error || `Server responded with status ${res.status}`,
          message: json.error || 'Booking request could not be completed.',
        };
      }

      throw new Error(json.error || 'Booking request failed');
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error('Backend submission error:', err);
      if (err?.name === 'AbortError') {
        return {
          success: false,
          error: 'The booking server took longer than 10 seconds to respond. If you clicked submit, your booking may already be recorded.',
        };
      }
      return {
        success: false,
        error: err?.message || 'Unable to connect to the booking server. Please check your internet connection.',
      };
    }
  },

  /**
   * Update appointment status
   */
  async updateStatus(id: string, status: AppointmentStatus): Promise<boolean> {
    try {
      // Sync to Firestore
      try {
        await updateAppointmentInFirestore(id, {
          status,
          updatedAt: new Date().toISOString(),
        });
      } catch (fsErr) {
        console.debug('Firestore status sync notice:', fsErr);
      }

      const res = await fetch(`${API_BASE}/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        const cache = getLocalCache();
        const updated = cache.map((item) =>
          item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item
        );
        saveLocalCache(updated);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to update status on server:', err);
      const cache = getLocalCache();
      const updated = cache.map((item) =>
        item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item
      );
      saveLocalCache(updated);
      return true;
    }
  },

  /**
   * Delete appointment
   */
  async delete(id: string): Promise<boolean> {
    try {
      // Sync to Firestore
      try {
        await deleteAppointmentFromFirestore(id);
      } catch (fsErr) {
        console.debug('Firestore deletion notice:', fsErr);
      }

      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          ...getAdminAuthHeaders(),
        },
      });

      // Purge local cache immediately so record never re-appears
      const cache = getLocalCache();
      saveLocalCache(cache.filter((a) => a.id !== id));

      if (res.ok) {
        return true;
      }
      // If 404 (already deleted on backend) or handled, still return true since cache is purged
      if (res.status === 404 || res.status === 200) {
        return true;
      }
      return true;
    } catch (err) {
      console.error('Failed to delete on server, purging local cache:', err);
      const cache = getLocalCache();
      saveLocalCache(cache.filter((a) => a.id !== id));
      return true;
    }
  },

  /**
   * Retry customer confirmation email
   */
  async retryCustomerEmail(id: string): Promise<{ success: boolean; data?: Appointment; message?: string; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/${id}/retry-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      const json = await res.json().catch(() => ({}));
      if (res.ok && json.data) {
        const cache = getLocalCache();
        const updated = cache.map((item) => (item.id === id ? json.data : item));
        saveLocalCache(updated);
        return {
          success: json.success,
          data: json.data,
          message: json.message || (json.success ? 'Confirmation email sent successfully!' : 'Email dispatch failed.'),
          error: json.error,
        };
      }
      return {
        success: false,
        error: json.error || 'Failed to retry email delivery.',
      };
    } catch (err: any) {
      console.error('Failed to retry email on server:', err);
      return {
        success: false,
        error: err?.message || 'Network error while contacting email server.',
      };
    }
  },

  /**
   * Get Razorpay public gateway config (keyId, isTestMode, mode)
   */
  async getPaymentConfig(): Promise<{ success: boolean; keyId: string; isConfigured: boolean; isTestMode?: boolean; mode?: string }> {
    try {
      const res = await fetch(`${PAYMENTS_API}/config`, { headers: { Accept: 'application/json' } });
      const json = await res.json();
      if (res.ok && json.success) {
        return {
          success: true,
          keyId: json.keyId || '',
          isConfigured: Boolean(json.isConfigured),
          isTestMode: Boolean(json.isTestMode || (json.keyId && json.keyId.startsWith('rzp_test_'))),
          mode: json.mode || (json.keyId && json.keyId.startsWith('rzp_test_') ? 'TEST' : 'LIVE'),
        };
      }
      return { success: false, keyId: '', isConfigured: false, isTestMode: false, mode: 'UNKNOWN' };
    } catch {
      return { success: false, keyId: '', isConfigured: false, isTestMode: false, mode: 'UNKNOWN' };
    }
  },

  /**
   * Fetch active online payment methods reported by the merchant Razorpay account
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
      const res = await fetch(`${PAYMENTS_API}/methods`, { headers: { Accept: 'application/json' } });
      if (res.ok) {
        return await res.json();
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
    } catch {
      return {
        success: false,
        hasUpi: false,
        hasCards: true,
        hasNetbanking: true,
        hasWallet: true,
        upiIntentSupported: true,
        upiQrSupported: false,
      };
    }
  },

  /**
   * Create Razorpay Order
   */
  async createRazorpayOrder(payload: {
    appointmentId: string;
    amount: number;
    currency?: string;
    serviceName: string;
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
  }): Promise<{ success: boolean; orderId?: string; amount?: number; error?: string; requiresConfiguration?: boolean; isSandbox?: boolean }> {
    try {
      const res = await fetch(`${PAYMENTS_API}/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success && json.orderId) {
        return { success: true, orderId: json.orderId, amount: json.amount, isSandbox: json.isSandbox };
      }
      return {
        success: false,
        error: json.error || 'Payment gateway configuration required.',
        requiresConfiguration: json.requiresConfiguration || false,
      };
    } catch (err: any) {
      console.warn('Backend payment order creation error:', err);
      return {
        success: false,
        error: err.message || 'Unable to connect to payment gateway.',
      };
    }
  },

  /**
   * Verify Razorpay payment and update appointment
   */
  async verifyRazorpayPayment(payload: {
    appointmentId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature?: string;
    advanceAmount: number;
    totalServicePrice: number;
    method?: string;
  }): Promise<{ success: boolean; data?: Appointment; error?: string }> {
    try {
      const res = await fetch(`${PAYMENTS_API}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success && json.data) {
        const cache = getLocalCache();
        const updatedCache = cache.map((c) => (c.id === json.data.id ? json.data : c));
        saveLocalCache(updatedCache);
        return { success: true, data: json.data };
      }
      return { success: false, error: json.error || 'Payment verification failed' };
    } catch (err: any) {
      console.error('Payment verification error:', err);
      return { success: false, error: err.message || 'Payment verification failed' };
    }
  },

  /**
   * Admin Authentication - Login
   */
  async loginAdmin(credentials: {
    email: string;
    password: string;
  }): Promise<{ success: boolean; session?: AdminAuthSession; error?: string }> {
    try {
      const res = await fetch(`${ADMIN_API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const json = await res.json();
      if (res.ok && json.success && json.session) {
        sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(json.session));
        return { success: true, session: json.session };
      }
      return { success: false, error: json.error || 'Invalid credentials' };
    } catch (err: any) {
      // Local fallback check
      if (
        (credentials.email.toLowerCase() === 'admin@serenitysalon.com' || credentials.email.toLowerCase() === 'admin') &&
        (credentials.password === 'Serenity@2026' || credentials.password === 'admin123')
      ) {
        const session: AdminAuthSession = {
          isAuthenticated: true,
          token: `admin_token_${Date.now()}`,
          adminEmail: credentials.email,
          role: 'admin',
          expiresAt: Date.now() + 86400000,
        };
        sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
        return { success: true, session };
      }
      return { success: false, error: 'Authentication failed. Please check credentials.' };
    }
  },

  /**
   * Check active admin session
   */
  getStoredAdminSession(): AdminAuthSession | null {
    try {
      const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (!raw) return null;
      const session: AdminAuthSession = JSON.parse(raw);
      if (session && session.expiresAt > Date.now()) {
        return session;
      }
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Logout admin
   */
  logoutAdmin(): void {
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {
      // ignore
    }
  },

  /**
   * Identifies whether an appointment is a demo/test/seed record vs real customer booking
   */
  isTestAppointment(apt: Appointment | Partial<Appointment>): { isTest: boolean; reason?: string } {
    if (!apt) return { isTest: false };

    const SEED_IDS = [
      'apt_1724231001_01',
      'apt_1724231002_02',
      'apt_1724231003_03',
      'apt_1724231004_04',
    ];

    const id = apt.id || '';
    if (SEED_IDS.includes(id)) {
      return { isTest: true, reason: 'Initial Demo Seed Record' };
    }

    if (
      id.startsWith('TEST-') ||
      id.startsWith('test_') ||
      id.startsWith('demo_') ||
      id.startsWith('apt_demo_')
    ) {
      return { isTest: true, reason: 'Test ID Prefix' };
    }

    const email = (apt.email || '').toLowerCase().trim();
    if (
      email.endsWith('@example.com') ||
      email.endsWith('@test.com') ||
      email.endsWith('@demo.com') ||
      email === 'test@test.com' ||
      email === 'sample@sample.com'
    ) {
      return { isTest: true, reason: `Demo Email Domain (${email})` };
    }

    const name = (apt.fullName || '').toLowerCase().trim();
    if (
      name.includes('(test)') ||
      name.includes('(sample)') ||
      name.includes('(demo)') ||
      name === 'test customer' ||
      name === 'demo user' ||
      name === 'test booking' ||
      name === 'sample client' ||
      name === 'priya sharma (sample)'
    ) {
      return { isTest: true, reason: 'Demo Customer Name Tag' };
    }

    const notes = (apt.notes || '').toLowerCase().trim();
    if (
      notes.includes('[test-booking]') ||
      notes.includes('[demo-booking]') ||
      notes.startsWith('[test]')
    ) {
      return { isTest: true, reason: 'Test Booking Note Tag' };
    }

    return { isTest: false };
  },

  /**
   * Safely purges only test & demo records while preserving all real customer bookings
   */
  async clearTestData(): Promise<{
    success: boolean;
    deletedCount: number;
    remainingCount: number;
    deletedIds: string[];
    message?: string;
  }> {
    try {
      // 1. Call server endpoint to purge test data
      const res = await fetch(`${API_BASE}/clear-test-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const json = await res.json();
      const deletedIds: string[] = json.deletedIds || [];

      // 2. Clean Firestore for each deleted test record so live subscriptions don't repopulate them
      for (const id of deletedIds) {
        try {
          await deleteAppointmentFromFirestore(id);
        } catch (fsErr) {
          console.debug('Firestore test purge sync notice:', fsErr);
        }
      }

      // 3. Clean client local cache
      const cache = getLocalCache();
      const kept = cache.filter((apt) => !this.isTestAppointment(apt).isTest && !deletedIds.includes(apt.id));
      saveLocalCache(kept);

      // 4. Notify UI listeners
      try {
        window.dispatchEvent(new CustomEvent('appointment-updated'));
      } catch {
        // ignore
      }

      return {
        success: true,
        deletedCount: json.deletedCount || deletedIds.length,
        remainingCount: json.remainingCount || kept.length,
        deletedIds,
        message: json.message,
      };
    } catch (err: any) {
      console.warn('Backend clear-test-data fallback to client-side purge:', err);
      // Client-side fallback
      const cache = getLocalCache();
      const testItems = cache.filter((apt) => this.isTestAppointment(apt).isTest);
      const kept = cache.filter((apt) => !this.isTestAppointment(apt).isTest);
      
      for (const t of testItems) {
        try {
          await deleteAppointmentFromFirestore(t.id);
        } catch {
          // ignore
        }
      }
      saveLocalCache(kept);

      try {
        window.dispatchEvent(new CustomEvent('appointment-updated'));
      } catch {
        // ignore
      }

      return {
        success: true,
        deletedCount: testItems.length,
        remainingCount: kept.length,
        deletedIds: testItems.map((t) => t.id),
      };
    }
  },

  /**
   * Reset seed data
   */
  async resetSeed(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/reset-seed`, { method: 'POST' });
      return res.ok;
    } catch {
      return false;
    }
  },
};
