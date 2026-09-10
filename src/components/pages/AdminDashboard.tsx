import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  ArrowLeft,
  ShoppingBag,
  Layers,
  IndianRupee,
  TrendingUp,
  Package,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  RefreshCw,
  Info,
  CheckCircle2,
  BarChart3,
  PieChart as PieIcon,
  ShoppingBasket,
  Zap,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Scissors,
  Search,
  Filter,
  Download,
  AlertCircle,
  Check,
  X,
  ExternalLink,
  MessageSquare,
  FileText,
  ShieldCheck,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  CalendarDays,
  List,
  Bell,
  BellRing,
  BellOff,
  Volume2,
  CreditCard,
  Loader2,
} from 'lucide-react';
import { CartItem, Product, PageView, Appointment, AppointmentStatus, AppointmentStats } from '../../types';
import { PRODUCTS } from '../../data/mockData';
import { SALON_SERVICES } from '../../data/servicesData';
import { formatINR } from '../../utils/currency';
import { SafeImage } from '../common/SafeImage';
import { appointmentApi } from '../../services/appointmentApi';
import { AppointmentWeeklyCalendar } from '../common/AppointmentWeeklyCalendar';
import { GmailConciergeModal } from '../common/GmailConciergeModal';
import { SMTPConfigurationBanner } from '../common/SMTPConfigurationBanner';
import { listenToAppointments, updateAppointmentInFirestore, signInWithGoogleForGmail, getCachedGmailAccessToken } from '../../lib/firebase';
import { sendAppointmentConfirmationViaGmail } from '../../services/gmailService';
import { 
  requestFCMNotificationPermission, 
  setupFCMForegroundListener, 
  triggerNativeNotification, 
  playNotificationChime,
  NotificationPermissionState 
} from '../../services/fcmService';

import { AdminOrdersManager } from '../admin/AdminOrdersManager';
import { AdminPaymentsManager } from '../admin/AdminPaymentsManager';

interface AdminDashboardProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onNavigate: (page: PageView) => void;
  onOpenCart: () => void;
  onOpenBooking?: () => void;
}

/* ========================================================================== */
/* SKELETON LOADING COMPONENTS FOR ADMIN DASHBOARD                            */
/* ========================================================================== */

const StatCardsSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 animate-pulse">
    {[
      { bg: 'bg-white', border: 'border-gray-200/80' },
      { bg: 'bg-amber-50/60', border: 'border-amber-200/70' },
      { bg: 'bg-emerald-50/60', border: 'border-emerald-200/70' },
      { bg: 'bg-blue-50/60', border: 'border-blue-200/70' },
      { bg: 'bg-white', border: 'border-gray-200/80' },
    ].map((card, idx) => (
      <div key={idx} className={`${card.bg} p-4 rounded-2xl border ${card.border} shadow-xs space-y-3`}>
        <div className="flex items-center justify-between">
          <div className="h-3 w-16 bg-gray-200/90 rounded-md"></div>
          <div className="w-7 h-7 rounded-lg bg-gray-200/80"></div>
        </div>
        <div className="h-7 w-12 bg-gray-300 rounded-lg"></div>
        <div className="h-2.5 w-24 bg-gray-200/70 rounded-md"></div>
      </div>
    ))}
  </div>
);

const AppointmentsTableSkeleton: React.FC = () => (
  <div className="animate-pulse">
    {/* Desktop Skeleton Table */}
    <div className="hidden lg:block overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="bg-[#F7F5F1] text-gray-600 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
            <th className="py-3.5 px-4">Customer Details</th>
            <th className="py-3.5 px-4">Service Selected</th>
            <th className="py-3.5 px-4">Date & Time</th>
            <th className="py-3.5 px-4">Booking Status</th>
            <th className="py-3.5 px-4">Quick Contact</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <tr key={item} className="bg-white">
              {/* Customer Skeleton */}
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0"></div>
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3.5 w-28 bg-gray-300 rounded-md"></div>
                    <div className="h-2.5 w-24 bg-gray-200 rounded-md"></div>
                  </div>
                </div>
              </td>
              {/* Service Skeleton */}
              <td className="py-3.5 px-4">
                <div className="space-y-1.5">
                  <div className="h-3.5 w-32 bg-gray-300 rounded-md"></div>
                  <div className="h-2.5 w-16 bg-gray-200 rounded-md"></div>
                </div>
              </td>
              {/* Date & Time Skeleton */}
              <td className="py-3.5 px-4">
                <div className="space-y-1.5">
                  <div className="h-3.5 w-24 bg-gray-300 rounded-md"></div>
                  <div className="h-2.5 w-16 bg-gray-200 rounded-md"></div>
                </div>
              </td>
              {/* Status Skeleton */}
              <td className="py-3.5 px-4">
                <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
              </td>
              {/* Quick Contact Skeleton */}
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-1.5">
                  <div className="h-6 w-16 bg-gray-200 rounded-lg"></div>
                  <div className="h-6 w-14 bg-gray-200 rounded-lg"></div>
                </div>
              </td>
              {/* Actions Skeleton */}
              <td className="py-3.5 px-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <div className="w-7 h-7 bg-gray-200 rounded-lg"></div>
                  <div className="w-7 h-7 bg-gray-200 rounded-lg"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Mobile Card Skeletons */}
    <div className="lg:hidden p-4 space-y-3">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="p-4 rounded-2xl border border-gray-200 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gray-200"></div>
              <div className="space-y-1">
                <div className="h-3.5 w-24 bg-gray-300 rounded-md"></div>
                <div className="h-2.5 w-20 bg-gray-200 rounded-md"></div>
              </div>
            </div>
            <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
          </div>
          <div className="h-3 w-36 bg-gray-200 rounded-md"></div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="h-3 w-28 bg-gray-200 rounded-md"></div>
            <div className="flex gap-1.5">
              <div className="h-6 w-14 bg-gray-200 rounded-lg"></div>
              <div className="h-6 w-14 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const OverviewMetricsSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
    {[1, 2, 3, 4].map((idx) => (
      <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-3 w-20 bg-gray-200 rounded-md"></div>
          <div className="w-8 h-8 rounded-lg bg-gray-200"></div>
        </div>
        <div className="h-8 w-24 bg-gray-300 rounded-lg"></div>
        <div className="h-2.5 w-32 bg-gray-200 rounded-md"></div>
      </div>
    ))}
  </div>
);

const OverviewChartsSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
    {/* Bar Chart Skeleton */}
    <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
      <div className="space-y-1.5">
        <div className="h-4 w-48 bg-gray-300 rounded-md"></div>
        <div className="h-3 w-64 bg-gray-200 rounded-md"></div>
      </div>
      <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 px-4 border-b border-gray-100">
        {[40, 75, 55, 90, 60, 30, 80].map((h, i) => (
          <div key={i} className="w-full flex flex-col items-center gap-2">
            <div
              className="w-full bg-[#1F3A26]/15 rounded-t-lg transition-all"
              style={{ height: `${h}%` }}
            ></div>
            <div className="h-2 w-6 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>

    {/* Pie Chart Skeleton */}
    <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
      <div className="space-y-1.5">
        <div className="h-4 w-44 bg-gray-300 rounded-md"></div>
        <div className="h-3 w-56 bg-gray-200 rounded-md"></div>
      </div>
      <div className="h-64 flex items-center justify-center">
        <div className="w-44 h-44 rounded-full border-8 border-[#C9A66B]/20 border-t-[#1F3A26]/40 flex items-center justify-center animate-spin">
          <div className="w-24 h-24 rounded-full bg-gray-50 border border-gray-200"></div>
        </div>
      </div>
    </div>
  </div>
);

const CATEGORY_COLORS: Record<string, string> = {
  'Skin Care': '#1F3A26', // Deep Forest Green
  'Make Up': '#C9A66B', // Warm Gold
  'Hair Care': '#D97757', // Terracotta
  'Fragrances': '#8B5E3C', // Warm Amber/Bronze
  'Nail Care': '#7B4B94', // Muted Plum
  'Body Care': '#4A7C59', // Earthy Sage
  'Accessories & Tools': '#457B9D', // Slate Teal
  'Uncategorized': '#6E6E6E',
};

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  Pending: {
    label: 'Pending',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  Confirmed: {
    label: 'Confirmed',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  Completed: {
    label: 'Completed',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  Cancelled: {
    label: 'Cancelled',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
  },
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onAddToCart,
  onNavigate,
  onOpenCart,
  onOpenBooking,
}) => {
  // Main view navigation tabs
  const [activeTab, setActiveTab] = useState<'appointments' | 'orders' | 'payments' | 'overview' | 'distribution' | 'cart-manager'>('appointments');
  
  // Appointments state
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [appointmentViewMode, setAppointmentViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedAppointmentForDetail, setSelectedAppointmentForDetail] = useState<Appointment | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [stats, setStats] = useState<AppointmentStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    todayCount: 0,
  });

  // Clear Test / Demo Data Modal State
  const [showClearTestDataModal, setShowClearTestDataModal] = useState(false);
  const [isClearingTestData, setIsClearingTestData] = useState(false);

  // Gmail Workspace Concierge Modal State
  const [showGmailModal, setShowGmailModal] = useState(false);
  const [gmailTargetAppointment, setGmailTargetAppointment] = useState<Appointment | null>(null);

  // Manual Walk-in Quick Booking Form modal state
  const [showWalkinModal, setShowWalkinModal] = useState(false);
  const [walkinForm, setWalkinForm] = useState({
    serviceName: SALON_SERVICES[0]?.name || 'Hair Styling & Cut',
    preferredDate: new Date().toISOString().split('T')[0],
    preferredTime: '12:30 PM',
    fullName: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [isSubmittingWalkin, setIsSubmittingWalkin] = useState(false);

  const handleOpenWalkinModal = (prefillDate?: string) => {
    if (prefillDate) {
      setWalkinForm((prev) => ({
        ...prev,
        preferredDate: prefillDate,
      }));
    }
    setShowWalkinModal(true);
  };

  // Store Analytics state
  const [highlightedCategory, setHighlightedCategory] = useState<string | null>(null);

  // Appointment deletion dialog state (in-app confirmation, avoids iframe window.confirm blocks)
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  const [isDeletingAppointment, setIsDeletingAppointment] = useState(false);

  // FCM & Push Notification state
  const [pushPermission, setPushPermission] = useState<NotificationPermissionState>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission as NotificationPermissionState;
    }
    return 'unsupported';
  });
  const [isEnablingPush, setIsEnablingPush] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('serenity_fcm_token') : null;
  });
  const [newBookingAlert, setNewBookingAlert] = useState<{
    id: string;
    customerName: string;
    serviceName: string;
    preferredDate: string;
    preferredTime: string;
  } | null>(null);

  // Email retry loading state
  const [isRetryingEmail, setIsRetryingEmail] = useState<string | null>(null);

  // Handle Safe Customer Confirmation Email Retry via SMTP
  const handleRetryCustomerEmail = async (appointmentId: string) => {
    setIsRetryingEmail(appointmentId);
    try {
      const res = await appointmentApi.retryCustomerEmail(appointmentId);
      if (res.success && res.data) {
        setAppointments((prev) => prev.map((a) => (a.id === appointmentId ? res.data! : a)));
        if (selectedAppointmentForDetail?.id === appointmentId) {
          setSelectedAppointmentForDetail(res.data);
        }
        setActionFeedback(`Confirmation email dispatched to ${res.data.email}!`);
      } else {
        if (res.data) {
          setAppointments((prev) => prev.map((a) => (a.id === appointmentId ? res.data! : a)));
          if (selectedAppointmentForDetail?.id === appointmentId) {
            setSelectedAppointmentForDetail(res.data);
          }
        }
        setActionFeedback(`Email status: ${res.error || res.message || 'Could not verify delivery.'}`);
      }
      setTimeout(() => setActionFeedback(null), 4000);
    } catch (err: any) {
      console.error('Error retrying email:', err);
      setActionFeedback('Network error while retrying email.');
      setTimeout(() => setActionFeedback(null), 3000);
    } finally {
      setIsRetryingEmail(null);
    }
  };

  // Handle Instant Customer Email Dispatch via Google Workspace Gmail API (OAuth)
  const handleSendEmailViaGmail = async (apt: Appointment) => {
    if (!apt.email || !apt.email.trim()) {
      setActionFeedback('Appointment does not have a customer email address.');
      setTimeout(() => setActionFeedback(null), 3000);
      return;
    }
    setIsRetryingEmail(apt.id);
    try {
      let token = getCachedGmailAccessToken();
      if (!token) {
        // Authenticate with Google OAuth if not already cached
        const authRes = await signInWithGoogleForGmail();
        token = authRes.accessToken;
      }
      if (!token) {
        throw new Error('Google Workspace OAuth access token is required.');
      }

      const result = await sendAppointmentConfirmationViaGmail(apt, token);
      if (result.success) {
        const updatedApt: Appointment = {
          ...apt,
          emailStatus: 'SENT',
          emailSentAt: result.timestamp || new Date().toISOString(),
          emailError: undefined,
        };
        setAppointments((prev) => prev.map((a) => (a.id === apt.id ? updatedApt : a)));
        if (selectedAppointmentForDetail?.id === apt.id) {
          setSelectedAppointmentForDetail(updatedApt);
        }
        try {
          await updateAppointmentInFirestore(apt.id, {
            emailStatus: 'SENT',
            emailSentAt: updatedApt.emailSentAt,
          });
        } catch (fsErr) {
          console.debug('Firestore email status update notice:', fsErr);
        }
        setActionFeedback(`Confirmation email successfully dispatched to ${apt.email} via Google Workspace Gmail API!`);
      } else {
        setActionFeedback(`Gmail API send status: ${result.error || 'Failed to dispatch'}`);
      }
      setTimeout(() => setActionFeedback(null), 4000);
    } catch (err: any) {
      console.error('Error sending via Gmail API:', err);
      setActionFeedback(`Gmail API error: ${err?.message || 'Authentication error'}`);
      setTimeout(() => setActionFeedback(null), 4000);
    } finally {
      setIsRetryingEmail(null);
    }
  };

  // Enable Push Notifications & FCM Device Registration
  const handleEnablePushNotifications = async () => {
    setIsEnablingPush(true);
    try {
      const res = await requestFCMNotificationPermission();
      setPushPermission(res.status);
      if (res.token) {
        setFcmToken(res.token);
      }
      setActionFeedback(res.message);
      setTimeout(() => setActionFeedback(null), 4000);
    } catch (err: any) {
      console.error('Error enabling push:', err);
      setActionFeedback('Could not enable push notifications.');
      setTimeout(() => setActionFeedback(null), 3000);
    } finally {
      setIsEnablingPush(false);
    }
  };

  // Test Push Notification Chime & Banner
  const handleTestNotification = () => {
    playNotificationChime();
    triggerNativeNotification('✨ Serenity Salon: Test Notification', {
      body: 'Firebase Cloud Messaging & browser push alerts are operational for new bookings.',
    });
    setNewBookingAlert({
      id: 'TEST-' + Math.floor(1000 + Math.random() * 9000),
      customerName: 'Priya Sharma (Sample)',
      serviceName: 'Hydra-Glow Facial & Spa',
      preferredDate: new Date().toISOString().split('T')[0],
      preferredTime: '03:00 PM',
    });
    setActionFeedback('Sent test push notification & audio alert.');
    setTimeout(() => setActionFeedback(null), 3500);
  };

  // Fetch appointments from backend API
  const fetchAppointments = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoadingAppointments(true);
    try {
      const result = await appointmentApi.getAll(statusFilter, searchQuery);
      setAppointments(result.data);
      const computedStats = await appointmentApi.getStats();
      setStats(computedStats);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      if (showLoading) setIsLoadingAppointments(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    fetchAppointments();

    // 1. Listen for Firestore real-time updates directly
    let unsubscribeFirestore: (() => void) | null = null;
    try {
      unsubscribeFirestore = listenToAppointments((_docs) => {
        // Automatically sync latest appointments and stats silently without layout flashes
        fetchAppointments(false);
      });
    } catch (fsErr) {
      console.debug('Firestore live subscription fallback:', fsErr);
    }

    const handleAppointmentUpdated = () => {
      fetchAppointments(false);
    };

    window.addEventListener('appointment-updated', handleAppointmentUpdated);
    return () => {
      if (unsubscribeFirestore) unsubscribeFirestore();
      window.removeEventListener('appointment-updated', handleAppointmentUpdated);
    };
  }, [fetchAppointments]);

  // Setup FCM Foreground Listener & Cross-Tab BroadcastChannel for real-time customer bookings
  useEffect(() => {
    let unsubscribeFCM: (() => void) | null = null;

    // 1. Listen for FCM foreground push notifications
    setupFCMForegroundListener((payload) => {
      fetchAppointments(false);
      if (payload.customerName && payload.serviceName) {
        setNewBookingAlert({
          id: payload.appointmentId || 'NEW',
          customerName: payload.customerName,
          serviceName: payload.serviceName,
          preferredDate: payload.preferredDate || '',
          preferredTime: payload.preferredTime || '',
        });
      }
    }).then((unsub) => {
      unsubscribeFCM = unsub;
    });

    // 2. Listen for same-window booking submissions
    const handleNewBookingCustomEvent = (event: any) => {
      const apt = event.detail;
      fetchAppointments(false);
      playNotificationChime();
      triggerNativeNotification(`✨ New Booking: ${apt?.fullName || 'Customer'}`, {
        body: `${apt?.serviceName || 'Salon Service'} on ${apt?.preferredDate || ''} at ${apt?.preferredTime || ''}`,
      });
      if (apt) {
        setNewBookingAlert({
          id: apt.id || 'NEW',
          customerName: apt.fullName || 'Valued Client',
          serviceName: apt.serviceName || 'Luxury Treatment',
          preferredDate: apt.preferredDate || '',
          preferredTime: apt.preferredTime || '',
        });
      }
    };

    window.addEventListener('serenity:new-appointment', handleNewBookingCustomEvent);

    // 3. Listen for BroadcastChannel messages across other tabs
    let broadcastChannel: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        broadcastChannel = new BroadcastChannel('serenity_appointments_channel');
        broadcastChannel.onmessage = (messageEvent) => {
          if (messageEvent.data?.type === 'NEW_APPOINTMENT_BOOKED') {
            const apt = messageEvent.data.payload;
            fetchAppointments(false);
            playNotificationChime();
            triggerNativeNotification(`✨ New Booking: ${apt?.fullName || 'Customer'}`, {
              body: `${apt?.serviceName || 'Salon Service'} on ${apt?.preferredDate || ''} at ${apt?.preferredTime || ''}`,
            });
            if (apt) {
              setNewBookingAlert({
                id: apt.id || 'NEW',
                customerName: apt.fullName || 'Valued Client',
                serviceName: apt.serviceName || 'Luxury Treatment',
                preferredDate: apt.preferredDate || '',
                preferredTime: apt.preferredTime || '',
              });
            }
          }
        };
      } catch (bcErr) {
        console.debug('BroadcastChannel listener omitted:', bcErr);
      }
    }

    return () => {
      if (unsubscribeFCM) unsubscribeFCM();
      window.removeEventListener('serenity:new-appointment', handleNewBookingCustomEvent);
      if (broadcastChannel) broadcastChannel.close();
    };
  }, [fetchAppointments]);

  // Handle status update
  const handleStatusChange = async (appointmentId: string, newStatus: AppointmentStatus) => {
    setIsUpdatingStatus(appointmentId);
    try {
      const success = await appointmentApi.updateStatus(appointmentId, newStatus);
      if (success) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === appointmentId ? { ...a, status: newStatus } : a))
        );
        setActionFeedback(`Updated appointment status to "${newStatus}"`);
        setTimeout(() => setActionFeedback(null), 3000);
        
        // Refresh stats
        const updatedStats = await appointmentApi.getStats();
        setStats(updatedStats);
      }
    } catch (err) {
      console.error('Failed to change status:', err);
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  // Handle appointment deletion (opens reliable in-app modal instead of browser window.confirm)
  const handleDeleteAppointment = (appointmentId: string) => {
    const found = appointments.find((a) => a.id === appointmentId);
    if (found) {
      setAppointmentToDelete(found);
    } else {
      setAppointmentToDelete({
        id: appointmentId,
        fullName: 'Client Booking',
        serviceName: 'Appointment',
        preferredDate: '',
        preferredTime: '',
        phone: '',
        status: 'Pending',
        createdAt: new Date().toISOString(),
      });
    }
  };

  // Confirm appointment deletion
  const handleConfirmDeleteAppointment = async () => {
    if (!appointmentToDelete) return;
    const targetId = appointmentToDelete.id;
    const clientName = appointmentToDelete.fullName;

    setIsDeletingAppointment(true);
    try {
      // Optimistic update so UI responds instantly
      setAppointments((prev) => prev.filter((a) => a.id !== targetId));
      if (selectedAppointmentForDetail?.id === targetId) {
        setSelectedAppointmentForDetail(null);
      }

      await appointmentApi.delete(targetId);
      setActionFeedback(`Appointment #${targetId} for ${clientName} deleted successfully.`);
      setTimeout(() => setActionFeedback(null), 3500);

      const updatedStats = await appointmentApi.getStats();
      setStats(updatedStats);
    } catch (err) {
      console.error('Failed to delete appointment:', err);
      setActionFeedback('Failed to delete appointment.');
      setTimeout(() => setActionFeedback(null), 3000);
    } finally {
      setIsDeletingAppointment(false);
      setAppointmentToDelete(null);
    }
  };

  // Handle submit manual walk-in
  const handleCreateWalkin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinForm.fullName || !walkinForm.phone || !walkinForm.preferredDate || !walkinForm.preferredTime) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmittingWalkin(true);
    try {
      const result = await appointmentApi.create({
        serviceName: walkinForm.serviceName,
        preferredDate: walkinForm.preferredDate,
        preferredTime: walkinForm.preferredTime,
        fullName: walkinForm.fullName,
        phone: walkinForm.phone,
        email: walkinForm.email || undefined,
        notes: walkinForm.notes ? `[Direct Walk-in / Reception entry] ${walkinForm.notes}` : '[Direct Walk-in / Reception entry]',
      });

      if (result.success) {
        setShowWalkinModal(false);
        setWalkinForm({
          serviceName: SALON_SERVICES[0]?.name || 'Hair Styling & Cut',
          preferredDate: new Date().toISOString().split('T')[0],
          preferredTime: '12:30 PM',
          fullName: '',
          phone: '',
          email: '',
          notes: '',
        });
        setActionFeedback('New appointment saved permanently & notification sent to pranavdigital221@gmail.com!');
        setTimeout(() => setActionFeedback(null), 4000);
        fetchAppointments(false);
      }
    } catch (err) {
      console.error('Error creating walk-in booking:', err);
    } finally {
      setIsSubmittingWalkin(false);
    }
  };

  // Export to CSV
  const handleExportCSV = (onlyFiltered = false) => {
    const listToExport = onlyFiltered && (searchQuery.trim() || statusFilter !== 'All') ? filteredAppointments : appointments;

    if (listToExport.length === 0) {
      alert('No appointments found to export.');
      return;
    }

    const headers = [
      'Booking ID',
      'Customer Name',
      'Phone',
      'Email',
      'Service Selected',
      'Category',
      'Preferred Date',
      'Preferred Time',
      'Status',
      'Notes',
      'Date Submitted',
      'Notification Sent',
    ];

    const rows = listToExport.map((a) => [
      `"${a.id}"`,
      `"${a.fullName.replace(/"/g, '""')}"`,
      `"${a.phone.replace(/"/g, '""')}"`,
      `"${(a.email || '').replace(/"/g, '""')}"`,
      `"${a.serviceName.replace(/"/g, '""')}"`,
      `"${(a.serviceCategory || '').replace(/"/g, '""')}"`,
      `"${a.preferredDate}"`,
      `"${a.preferredTime}"`,
      `"${a.status}"`,
      `"${(a.notes || '').replace(/"/g, '""')}"`,
      `"${a.createdAt}"`,
      `"${a.notificationSent ? 'Yes (pranavdigital221@gmail.com)' : 'No'}"`,
    ]);

    // Use Blob with UTF-8 BOM for universal Excel / Numbers compatibility
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const dateStamp = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `serenity_salon_appointments_${dateStamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setActionFeedback(`Exported ${listToExport.length} appointment records to CSV.`);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  // Categorize appointments into test/demo records vs real customer bookings
  const { testAppointments, realAppointments } = useMemo(() => {
    const testList: Array<{ appointment: Appointment; reason: string }> = [];
    const realList: Appointment[] = [];

    appointments.forEach((apt) => {
      const check = appointmentApi.isTestAppointment(apt);
      if (check.isTest) {
        testList.push({ appointment: apt, reason: check.reason || 'Demo Record' });
      } else {
        realList.push(apt);
      }
    });

    return { testAppointments: testList, realAppointments: realList };
  }, [appointments]);

  // Handle Safe Test Data Deletion
  const handleConfirmClearTestData = async () => {
    setIsClearingTestData(true);
    try {
      const result = await appointmentApi.clearTestData();
      if (result.success) {
        setShowClearTestDataModal(false);
        setActionFeedback(
          `Purged ${result.deletedCount} test records. All ${result.remainingCount} real customer bookings are safe.`
        );
        setTimeout(() => setActionFeedback(null), 5000);
        fetchAppointments(false);
      } else {
        alert('Could not clear test records.');
      }
    } catch (err) {
      console.error('Error clearing test data:', err);
      alert('An error occurred while clearing test data.');
    } finally {
      setIsClearingTestData(false);
    }
  };

  // Reset database to seed
  const handleResetDatabase = async () => {
    if (!window.confirm('Reset appointment database to initial seed data for testing?')) {
      return;
    }
    await appointmentApi.resetSeed();
    fetchAppointments(true);
    setActionFeedback('Appointments database reloaded with default seed entries.');
    setTimeout(() => setActionFeedback(null), 3000);
  };

  // Filtered appointments computation
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchesStatus = statusFilter === 'All' || apt.status.toLowerCase() === statusFilter.toLowerCase();
      if (!matchesStatus) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        apt.fullName.toLowerCase().includes(q) ||
        apt.phone.toLowerCase().includes(q) ||
        (apt.email && apt.email.toLowerCase().includes(q)) ||
        apt.serviceName.toLowerCase().includes(q) ||
        (apt.notes && apt.notes.toLowerCase().includes(q)) ||
        apt.id.toLowerCase().includes(q)
      );
    });
  }, [appointments, statusFilter, searchQuery]);

  // Compute aggregate statistics by Category (Store Analytics)
  const categoryStats = useMemo(() => {
    const map = new Map<
      string,
      {
        category: string;
        itemCount: number;
        totalUnits: number;
        totalValue: number;
        color: string;
        products: { name: string; quantity: number; price: number; subtotal: number }[];
      }
    >();

    let grandTotalUnits = 0;
    let grandTotalValue = 0;

    cartItems.forEach((item) => {
      const cat = item.product.category || 'Uncategorized';
      const existing = map.get(cat) || {
        category: cat,
        itemCount: 0,
        totalUnits: 0,
        totalValue: 0,
        color: CATEGORY_COLORS[cat] || '#8884d8',
        products: [],
      };

      const itemSubtotal = item.product.price * item.quantity;
      existing.itemCount += 1;
      existing.totalUnits += item.quantity;
      existing.totalValue += itemSubtotal;
      existing.products.push({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        subtotal: itemSubtotal,
      });

      grandTotalUnits += item.quantity;
      grandTotalValue += itemSubtotal;
      map.set(cat, existing);
    });

    const data = Array.from(map.values()).map((entry) => ({
      ...entry,
      percentageOfUnits: grandTotalUnits > 0 ? ((entry.totalUnits / grandTotalUnits) * 100).toFixed(1) : '0',
      percentageOfValue: grandTotalValue > 0 ? ((entry.totalValue / grandTotalValue) * 100).toFixed(1) : '0',
      averagePricePerUnit: entry.totalUnits > 0 ? (entry.totalValue / entry.totalUnits).toFixed(2) : '0.00',
    }));

    return {
      distribution: data,
      grandTotalUnits,
      grandTotalValue: Number(grandTotalValue.toFixed(2)),
      totalDistinctProducts: cartItems.length,
      categoryCount: data.length,
    };
  }, [cartItems]);

  const topCategoryByUnits = useMemo(() => {
    if (categoryStats.distribution.length === 0) return null;
    return [...categoryStats.distribution].sort((a, b) => b.totalUnits - a.totalUnits)[0];
  }, [categoryStats]);

  return (
    <div className="bg-[#F7F5F1] min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header & Navigation Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b border-[#1F3A26]/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => onNavigate('home')}
                className="text-xs font-semibold text-[#6E6E6E] hover:text-[#1F3A26] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
              </button>
              <span className="text-gray-300">/</span>
              <span className="text-xs font-bold text-[#C9A66B] uppercase tracking-wider">
                Management Control Center
              </span>
            </div>
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#1F3A26] flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-[#C9A66B]" />
              Serenity Salon & Spa Admin Portal
            </h1>
            <p className="text-xs sm:text-sm text-[#6E6E6E] mt-1">
              Real-time persistent appointment bookings, instant notifications to <span className="font-mono font-semibold text-[#1F3A26]">pranavdigital221@gmail.com</span>, and store operations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleEnablePushNotifications}
              disabled={isEnablingPush}
              className={`px-3.5 py-2.5 rounded-full border text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ${
                pushPermission === 'granted'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                  : pushPermission === 'denied'
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-[#FDF1E4] border-[#C9A66B]/40 text-[#1F3A26] hover:bg-[#faebd7]'
              }`}
              title={
                pushPermission === 'granted'
                  ? 'Push Notifications & FCM are Active'
                  : pushPermission === 'denied'
                  ? 'Notifications are blocked in browser settings'
                  : 'Enable Firebase Cloud Messaging browser push notifications'
              }
            >
              {pushPermission === 'granted' ? (
                <>
                  <BellRing className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span>FCM Push: Active</span>
                </>
              ) : pushPermission === 'denied' ? (
                <>
                  <BellOff className="w-4 h-4 text-amber-700" />
                  <span>Push Blocked</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 text-[#C9A66B]" />
                  <span>{isEnablingPush ? 'Enabling Push...' : 'Enable FCM Push'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleTestNotification}
              className="px-3 py-2.5 rounded-full bg-white border border-gray-200 hover:border-[#1F3A26]/40 hover:bg-[#F7F5F1] text-[#1F3A26] text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              title="Test audio chime & push alert preview"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span className="hidden sm:inline">Test Alert</span>
            </button>

            <button
              onClick={() => {
                setGmailTargetAppointment(null);
                setShowGmailModal(true);
              }}
              className="px-3.5 py-2.5 rounded-full bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50/40 text-[#1F3A26] text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              title="Open Google Workspace Gmail Concierge & Inbox"
            >
              <Mail className="w-4 h-4 text-[#EA4335]" />
              <span>Gmail Concierge</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-100 text-red-700">API</span>
            </button>

            <button
              onClick={() => handleExportCSV(false)}
              className="px-3.5 py-2.5 rounded-full bg-white border border-gray-200 hover:border-[#1F3A26]/40 hover:bg-[#F7F5F1] text-[#1F3A26] text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              title="Download full appointment records in CSV format"
            >
              <Download className="w-4 h-4 text-[#C9A66B]" />
              <span>Download CSV</span>
            </button>

            <button
              onClick={() => setShowClearTestDataModal(true)}
              className="px-3.5 py-2.5 rounded-full bg-white border border-gray-200 hover:border-rose-300 hover:bg-rose-50/60 text-gray-700 hover:text-rose-700 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              title="Safely clear test/demo appointments while protecting all real customer bookings"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Clear Test Data</span>
              {testAppointments.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                  {testAppointments.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowWalkinModal(true)}
              className="px-4 py-2.5 rounded-full bg-[#1F3A26] hover:bg-[#4F7358] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#C9A66B]" />
              <span>+ New Walk-in Booking</span>
            </button>

            <button
              onClick={() => fetchAppointments(true)}
              disabled={isLoadingAppointments}
              className="p-2.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:text-[#1F3A26] hover:border-[#1F3A26]/40 transition-colors shadow-xs cursor-pointer"
              title="Refresh Appointments Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingAppointments ? 'animate-spin text-[#C9A66B]' : ''}`} />
            </button>
          </div>
        </div>

        {/* SMTP Real-time Configuration & Status Checklist Banner */}
        <SMTPConfigurationBanner />

        {/* Global Toast Action Feedback */}
        {actionFeedback && (
          <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionFeedback}</span>
            </div>
            <button onClick={() => setActionFeedback(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Real-time Push Alert Banner */}
        {newBookingAlert && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#1F3A26] to-[#2e5437] text-white shadow-lg border border-[#C9A66B]/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-in fade-in slide-in-from-top-3 duration-300">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C9A66B] text-[#1F3A26] flex items-center justify-center font-bold shrink-0 shadow-sm animate-bounce">
                <BellRing className="w-5 h-5 text-[#1F3A26]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#C9A66B] bg-white/10 px-2 py-0.5 rounded">
                    Instant Push Alert
                  </span>
                  <span className="text-xs text-emerald-300 font-mono">Ref: {newBookingAlert.id}</span>
                </div>
                <h4 className="font-bold text-sm sm:text-base text-white mt-0.5">
                  {newBookingAlert.customerName} booked <span className="text-[#C9A66B]">{newBookingAlert.serviceName}</span>
                </h4>
                <p className="text-xs text-gray-200">
                  Scheduled for: <strong className="text-white">{newBookingAlert.preferredDate}</strong> at <strong className="text-white">{newBookingAlert.preferredTime}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => {
                  setActiveTab('appointments');
                  fetchAppointments(true);
                  setNewBookingAlert(null);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#C9A66B] hover:bg-[#b59358] text-[#1F3A26] text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                View in Schedule
              </button>
              <button
                onClick={() => setNewBookingAlert(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Dismiss alert"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Main Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 mb-6 bg-white p-1.5 rounded-2xl border border-gray-200/80 shadow-xs">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'appointments'
                ? 'bg-[#1F3A26] text-white shadow-sm'
                : 'text-gray-600 hover:text-[#1F3A26] hover:bg-[#F7F5F1]'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#C9A66B]" />
            <span>Appointment Requests</span>
            {stats.pending > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'appointments' ? 'bg-[#C9A66B] text-[#1F3A26]' : 'bg-amber-100 text-amber-800'
              }`}>
                {stats.pending} pending
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#1F3A26] text-white shadow-sm'
                : 'text-gray-600 hover:text-[#1F3A26] hover:bg-[#F7F5F1]'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#C9A66B]" />
            <span>Product Orders</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-[#1F3A26] text-white shadow-sm'
                : 'text-gray-600 hover:text-[#1F3A26] hover:bg-[#F7F5F1]'
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#C9A66B]" />
            <span>Payments Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#1F3A26] text-white shadow-sm'
                : 'text-gray-600 hover:text-[#1F3A26] hover:bg-[#F7F5F1]'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-[#C9A66B]" />
            <span>Sales & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('distribution')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'distribution'
                ? 'bg-[#1F3A26] text-white shadow-sm'
                : 'text-gray-600 hover:text-[#1F3A26] hover:bg-[#F7F5F1]'
            }`}
          >
            <PieIcon className="w-4 h-4 text-[#C9A66B]" />
            <span>Category Insights</span>
          </button>

          <button
            onClick={() => setActiveTab('cart-manager')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'cart-manager'
                ? 'bg-[#1F3A26] text-white shadow-sm'
                : 'text-gray-600 hover:text-[#1F3A26] hover:bg-[#F7F5F1]'
            }`}
          >
            <ShoppingBasket className="w-4 h-4 text-[#C9A66B]" />
            <span>Active Bag Items ({cartItems.length})</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: APPOINTMENT REQUESTS & CLIENT MANAGEMENT           */}
        {/* ========================================================= */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            
            {/* KPI Summary Cards */}
            {isLoadingAppointments ? (
              <StatCardsSkeleton />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                
                {/* Total Appointments */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Bookings</span>
                    <div className="w-7 h-7 rounded-lg bg-[#F7F5F1] text-[#1F3A26] flex items-center justify-center">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="font-heading font-bold text-2xl text-[#1F3A26]">{stats.total}</div>
                  <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#C9A66B]" /> Persistent Storage
                  </div>
                </div>

                {/* Pending Action */}
                <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Pending Action</span>
                    <div className="w-7 h-7 rounded-lg bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-xs">
                      !
                    </div>
                  </div>
                  <div className="font-heading font-bold text-2xl text-amber-900">{stats.pending}</div>
                  <div className="text-[11px] text-amber-700 mt-1">Requires confirmation</div>
                </div>

                {/* Confirmed */}
                <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Confirmed</span>
                    <div className="w-7 h-7 rounded-lg bg-emerald-200 text-emerald-800 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="font-heading font-bold text-2xl text-emerald-900">{stats.confirmed}</div>
                  <div className="text-[11px] text-emerald-700 mt-1">Ready for service</div>
                </div>

                {/* Completed */}
                <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Completed</span>
                    <div className="w-7 h-7 rounded-lg bg-blue-200 text-blue-800 flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="font-heading font-bold text-2xl text-blue-900">{stats.completed}</div>
                  <div className="text-[11px] text-blue-700 mt-1">Serviced & closed</div>
                </div>

                {/* Today's Schedule */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Today's Schedule</span>
                    <div className="w-7 h-7 rounded-lg bg-[#FDF1E4] text-[#C9A66B] flex items-center justify-center">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="font-heading font-bold text-2xl text-[#1F3A26]">{stats.todayCount}</div>
                  <div className="text-[11px] text-gray-500 mt-1">Scheduled for today</div>
                </div>

              </div>
            )}

            {/* Notification Delivery Notice Banner */}
            <div className="bg-white p-4 rounded-2xl border border-[#1F3A26]/10 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FDF1E4] text-[#1F3A26] flex items-center justify-center border border-[#C9A66B]/30 shrink-0">
                  <Mail className="w-4 h-4 text-[#C9A66B]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#1F3A26] block">
                    Instant Booking Dispatch Channel: <span className="text-[#C9A66B] font-mono">pranavdigital221@gmail.com</span>
                  </span>
                  <p className="text-[11px] text-gray-500">
                    Every online booking submission is permanently archived in the database and dispatches full customer and styling details to this notification address.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleExportCSV(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1F3A26] hover:bg-[#4F7358] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  title="Export all appointment records to CSV"
                >
                  <Download className="w-3.5 h-3.5 text-[#C9A66B]" />
                  <span>Download CSV</span>
                </button>
                <button
                  onClick={() => setShowClearTestDataModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-rose-50 hover:text-rose-700 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-transparent hover:border-rose-200"
                  title="Safely clear test/demo appointments while protecting all real customer bookings"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Clear Test Data</span>
                  {testAppointments.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-100 text-rose-700">
                      {testAppointments.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              
              {/* Search input */}
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search customer name, phone, email, service..."
                  className="w-full pl-9.5 pr-4 py-2 rounded-xl bg-[#F7F5F1] text-xs text-[#1A1A1A] border border-transparent focus:border-[#C9A66B] focus:bg-white outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1">
                {(['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'] as const).map((st) => {
                  const isActive = statusFilter === st;
                  return (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#1F3A26] text-white shadow-xs'
                          : 'bg-[#F7F5F1] text-gray-600 hover:text-[#1F3A26] hover:bg-gray-200'
                      }`}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>

              {/* View Mode Switch (List vs Weekly Calendar) */}
              <div className="flex items-center bg-[#F7F5F1] p-1 rounded-xl border border-gray-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setAppointmentViewMode('list')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    appointmentViewMode === 'list'
                      ? 'bg-white text-[#1F3A26] shadow-xs'
                      : 'text-gray-500 hover:text-[#1F3A26]'
                  }`}
                  title="List Table View"
                >
                  <List className="w-3.5 h-3.5 text-[#C9A66B]" />
                  <span>List</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAppointmentViewMode('calendar')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    appointmentViewMode === 'calendar'
                      ? 'bg-[#1F3A26] text-white shadow-xs'
                      : 'text-gray-500 hover:text-[#1F3A26]'
                  }`}
                  title="Weekly Calendar Schedule View"
                >
                  <CalendarDays className="w-3.5 h-3.5 text-[#C9A66B]" />
                  <span>Weekly Calendar</span>
                </button>
              </div>

            </div>

            {/* View Mode: Calendar View */}
            {appointmentViewMode === 'calendar' && (
              <AppointmentWeeklyCalendar
                appointments={filteredAppointments}
                onSelectAppointment={(apt) => setSelectedAppointmentForDetail(apt)}
                onStatusChange={handleStatusChange}
                onDeleteAppointment={handleDeleteAppointment}
                onOpenNewBooking={(prefillDate) => handleOpenWalkinModal(prefillDate)}
                onExportCSV={() => handleExportCSV(false)}
                isUpdatingStatus={isUpdatingStatus}
                isLoading={isLoadingAppointments}
              />
            )}

            {/* View Mode: List / Table View */}
            {appointmentViewMode === 'list' && (
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
              
              {isLoadingAppointments ? (
                <AppointmentsTableSkeleton />
              ) : filteredAppointments.length === 0 ? (
                <div className="p-12 text-center">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="font-heading font-bold text-lg text-[#1F3A26] mb-1">No Appointments Found</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
                    {searchQuery || statusFilter !== 'All'
                      ? 'No appointment matching the applied search query or status filter.'
                      : 'No appointment requests in the database yet. Click below to add a new booking.'}
                  </p>
                  <button
                    onClick={() => setShowWalkinModal(true)}
                    className="px-5 py-2.5 rounded-full bg-[#1F3A26] text-white text-xs font-bold shadow-sm hover:bg-[#4F7358] transition-colors cursor-pointer"
                  >
                    + Create First Appointment
                  </button>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[#F7F5F1] text-gray-600 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
                          <th className="py-3.5 px-4">Customer Details & ID</th>
                          <th className="py-3.5 px-4">Service Selected</th>
                          <th className="py-3.5 px-4">Date & Time</th>
                          <th className="py-3.5 px-4">Amount & 40% Advance</th>
                          <th className="py-3.5 px-4">Booking Status</th>
                          <th className="py-3.5 px-4">Payment Status</th>
                          <th className="py-3.5 px-4">Email Status</th>
                          <th className="py-3.5 px-4">Quick Contact</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredAppointments.map((apt) => {
                          const statusConf = STATUS_CONFIG[apt.status] || STATUS_CONFIG.Pending;
                          const isToday = apt.preferredDate === new Date().toISOString().split('T')[0];
                          const cleanPhone = apt.phone.replace(/[^0-9+]/g, '');
                          const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(
                            `Hello ${apt.fullName}, this is Serenity Salon regarding your booking for "${apt.serviceName}" on ${apt.preferredDate} at ${apt.preferredTime}.`
                          )}`;

                          const totalCost = Number(apt.payment?.amount) || Number(apt.servicePrice) || 1000;
                          const advanceCost = Number(apt.payment?.advanceAmount) || Math.round(totalCost * 0.40);
                          const remainingCost = Math.max(0, totalCost - advanceCost);

                          return (
                            <tr key={apt.id} className="hover:bg-[#F7F5F1]/50 transition-colors group">
                              {/* Customer Column */}
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-[#1F3A26] text-[#C9A66B] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                                    {apt.fullName.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-bold text-[#1F3A26] flex items-center gap-1.5">
                                      <span>{apt.fullName}</span>
                                    </div>
                                    <div className="text-gray-400 font-mono text-[10px] mt-0.5">
                                      ID: #{apt.id.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}
                                    </div>
                                    <div className="text-gray-500 font-mono text-[11px] flex items-center gap-1 mt-0.5">
                                      <Phone className="w-3 h-3 text-[#C9A66B]" /> {apt.phone}
                                    </div>
                                    {apt.email && (
                                      <div className="text-gray-400 text-[10px] flex items-center gap-1 mt-0.5">
                                        <Mail className="w-2.5 h-2.5" /> {apt.email}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Service Column */}
                              <td className="py-3.5 px-4">
                                <div className="font-semibold text-[#1F3A26]">{apt.serviceName}</div>
                                {apt.serviceCategory && (
                                  <span className="inline-block text-[10px] text-gray-500 bg-[#F7F5F1] px-2 py-0.5 rounded-md mt-0.5 border border-gray-200">
                                    {apt.serviceCategory}
                                  </span>
                                )}
                                {apt.notes && (
                                  <div 
                                    onClick={() => setSelectedAppointmentForDetail(apt)}
                                    className="text-[11px] text-[#C9A66B] hover:underline cursor-pointer flex items-center gap-1 mt-1 font-medium truncate max-w-[200px]"
                                    title={apt.notes}
                                  >
                                    <FileText className="w-3 h-3 shrink-0" />
                                    <span>{apt.notes}</span>
                                  </div>
                                )}
                              </td>

                              {/* Date & Time Column */}
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-1.5 font-bold text-[#1F3A26]">
                                  <Calendar className="w-3.5 h-3.5 text-[#C9A66B]" />
                                  <span>{apt.preferredDate}</span>
                                  {isToday && (
                                    <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                      TODAY
                                    </span>
                                  )}
                                </div>
                                <div className="text-gray-500 flex items-center gap-1 text-[11px] mt-0.5">
                                  <Clock className="w-3 h-3" />
                                  <span>{apt.preferredTime}</span>
                                </div>
                              </td>

                              {/* Amount & 40% Advance Breakdown */}
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-[#1F3A26] text-xs">
                                  Total: {formatINR(totalCost)}
                                </div>
                                <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                                  40% Advance: {formatINR(advanceCost)}
                                </div>
                                <div className="text-[10px] text-amber-800 font-medium">
                                  60% at Salon: {formatINR(remainingCost)}
                                </div>
                              </td>

                              {/* Status Dropdown Column */}
                              <td className="py-3.5 px-4">
                                <div className="relative inline-block">
                                  <select
                                    value={apt.status}
                                    disabled={isUpdatingStatus === apt.id}
                                    onChange={(e) => handleStatusChange(apt.id, e.target.value as AppointmentStatus)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold border ${statusConf.bg} ${statusConf.text} ${statusConf.border} focus:outline-none focus:ring-2 focus:ring-[#C9A66B]/50 cursor-pointer transition-all`}
                                  >
                                    <option value="Pending">🟡 Pending</option>
                                    <option value="Confirmed">🟢 Confirmed</option>
                                    <option value="Completed">🔵 Completed</option>
                                    <option value="Cancelled">🔴 Cancelled</option>
                                  </select>
                                </div>
                              </td>

                              {/* Payment Status Column */}
                              <td className="py-3.5 px-4">
                                {apt.payment?.status === 'Paid' ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span>Advance Paid ({formatINR(advanceCost)})</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                    <span>Pending (At Counter)</span>
                                  </span>
                                )}
                              </td>

                              {/* Email Status Column */}
                              <td className="py-3.5 px-4">
                                {!apt.email ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                                    <span>—</span>
                                  </span>
                                ) : apt.emailStatus === 'SENT' ? (
                                  <div className="flex items-center gap-1.5">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      <span>Sent</span>
                                    </span>
                                    <button
                                      onClick={() => handleSendEmailViaGmail(apt)}
                                      disabled={isRetryingEmail === apt.id}
                                      className="p-1 rounded-md text-gray-500 hover:text-[#EA4335] hover:bg-red-50 transition-colors cursor-pointer"
                                      title="Resend confirmation via Gmail API"
                                    >
                                      <RefreshCw className={`w-3 h-3 ${isRetryingEmail === apt.id ? 'animate-spin text-[#EA4335]' : ''}`} />
                                    </button>
                                  </div>
                                ) : apt.emailStatus === 'SENDING' || isRetryingEmail === apt.id ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 animate-pulse">
                                    <RefreshCw className="w-3 h-3 animate-spin text-blue-600" />
                                    <span>Sending...</span>
                                  </span>
                                ) : apt.emailStatus === 'FAILED' ? (
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200" title={apt.emailError || 'Failed to send confirmation email'}>
                                      <AlertCircle className="w-3 h-3 text-red-600" />
                                      <span>Failed</span>
                                    </span>
                                    <button
                                      onClick={() => handleSendEmailViaGmail(apt)}
                                      disabled={isRetryingEmail === apt.id}
                                      className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#EA4335] text-white hover:bg-[#D93025] transition-colors cursor-pointer"
                                      title="Send via Google Workspace Gmail API"
                                    >
                                      Gmail API
                                    </button>
                                    <button
                                      onClick={() => handleRetryCustomerEmail(apt.id)}
                                      disabled={isRetryingEmail === apt.id}
                                      className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                                      title="Retry sending via SMTP server"
                                    >
                                      SMTP
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                      <span>Pending</span>
                                    </span>
                                    <button
                                      onClick={() => handleSendEmailViaGmail(apt)}
                                      disabled={isRetryingEmail === apt.id}
                                      className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#EA4335] text-white hover:bg-[#D93025] transition-colors cursor-pointer"
                                      title="Send confirmation via Google Workspace Gmail API"
                                    >
                                      Send (Gmail)
                                    </button>
                                    <button
                                      onClick={() => handleRetryCustomerEmail(apt.id)}
                                      disabled={isRetryingEmail === apt.id}
                                      className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                                      title="Send via SMTP server"
                                    >
                                      SMTP
                                    </button>
                                  </div>
                                )}
                              </td>

                              {/* Quick Contact Buttons */}
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-1.5">
                                  {apt.email && (
                                    <button
                                      onClick={() => {
                                        setGmailTargetAppointment(apt);
                                        setShowGmailModal(true);
                                      }}
                                      className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors border border-red-200 flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                                      title="Send official appointment confirmation via Gmail API"
                                    >
                                      <Mail className="w-3.5 h-3.5 text-red-600" />
                                      <span>Gmail</span>
                                    </button>
                                  )}
                                  <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-200 flex items-center gap-1 text-[11px] font-semibold"
                                    title="Open WhatsApp chat with client"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>WhatsApp</span>
                                  </a>
                                  <a
                                    href={`tel:${cleanPhone}`}
                                    className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                                    title="Call client"
                                  >
                                    <Phone className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              </td>

                              {/* Actions Column */}
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setSelectedAppointmentForDetail(apt)}
                                    className="p-1.5 rounded-lg bg-[#F7F5F1] text-gray-700 hover:bg-[#1F3A26] hover:text-white transition-colors cursor-pointer"
                                    title="View Full Booking Dossier & Email Audit"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAppointment(apt.id)}
                                    className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                                    title="Delete appointment permanently"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards List View */}
                  <div className="lg:hidden divide-y divide-gray-100">
                    {filteredAppointments.map((apt) => {
                      const statusConf = STATUS_CONFIG[apt.status] || STATUS_CONFIG.Pending;
                      const cleanPhone = apt.phone.replace(/[^0-9+]/g, '');
                      const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(
                        `Hello ${apt.fullName}, this is Serenity Salon regarding your booking for "${apt.serviceName}" on ${apt.preferredDate} at ${apt.preferredTime}.`
                      )}`;

                      return (
                        <div key={apt.id} className="p-4 space-y-3">
                          {/* Header: Name + Status */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-full bg-[#1F3A26] text-[#C9A66B] flex items-center justify-center font-bold text-xs shrink-0">
                                {apt.fullName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-[#1F3A26]">{apt.fullName}</h4>
                                <div className="text-gray-500 text-xs flex items-center gap-1 font-mono">
                                  <Phone className="w-3 h-3 text-[#C9A66B]" /> {apt.phone}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-1">
                              <select
                                value={apt.status}
                                disabled={isUpdatingStatus === apt.id}
                                onChange={(e) => handleStatusChange(apt.id, e.target.value as AppointmentStatus)}
                                className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusConf.bg} ${statusConf.text} ${statusConf.border}`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>

                              {apt.payment?.status === 'Paid' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                  <span>Paid</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                  <span>Pending</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Service & Schedule */}
                          <div className="bg-[#F7F5F1] p-3 rounded-xl text-xs space-y-1.5">
                            <div className="font-bold text-[#1F3A26] flex items-center justify-between">
                              <span>{apt.serviceName}</span>
                              <span className="text-[10px] text-gray-500 font-normal">{apt.serviceCategory}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 text-[11px]">
                              <span className="flex items-center gap-1 font-semibold text-[#1F3A26]">
                                <Calendar className="w-3.5 h-3.5 text-[#C9A66B]" /> {apt.preferredDate}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> {apt.preferredTime}
                              </span>
                            </div>
                            {apt.email && (
                              <div className="flex items-center justify-between pt-1 border-t border-gray-200/60 text-[11px]">
                                <span className="text-gray-500">Email Status:</span>
                                {apt.emailStatus === 'SENT' ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Sent
                                  </span>
                                ) : apt.emailStatus === 'FAILED' ? (
                                  <div className="flex items-center gap-1">
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700">
                                      <AlertCircle className="w-3 h-3 text-red-600" /> Failed
                                    </span>
                                    <button
                                      onClick={() => handleRetryCustomerEmail(apt.id)}
                                      disabled={isRetryingEmail === apt.id}
                                      className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#1F3A26] text-white"
                                    >
                                      Retry
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-amber-700 font-semibold text-[10px]">
                                    {apt.emailStatus === 'SENDING' ? 'Sending...' : 'Pending'}
                                  </span>
                                )}
                              </div>
                            )}
                            {apt.notes && (
                              <p className="text-gray-500 text-[11px] italic pt-1 border-t border-gray-200">
                                "{apt.notes}"
                              </p>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-between gap-2 pt-1">
                            <div className="flex items-center gap-2">
                              {apt.email && (
                                <button
                                  onClick={() => {
                                    setGmailTargetAppointment(apt);
                                    setShowGmailModal(true);
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold flex items-center gap-1 border border-red-200 cursor-pointer"
                                >
                                  <Mail className="w-3.5 h-3.5 text-red-600" />
                                  <span>Gmail</span>
                                </button>
                              )}
                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1 border border-emerald-200"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                                <span>WhatsApp</span>
                              </a>
                              <a
                                href={`tel:${cleanPhone}`}
                                className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold flex items-center gap-1"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>Call</span>
                              </a>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setSelectedAppointmentForDetail(apt)}
                                className="p-1.5 rounded-lg bg-[#F7F5F1] text-gray-700"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteAppointment(apt.id)}
                                className="p-1.5 rounded-lg bg-red-50 text-red-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Table Footer */}
              <div className="p-4 bg-[#F7F5F1] border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
                <div className="flex items-center gap-2">
                  <span>
                    Showing <strong className="text-[#1F3A26]">{filteredAppointments.length}</strong> of{' '}
                    <strong className="text-[#1F3A26]">{appointments.length}</strong> total appointment records
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="text-[11px] text-gray-400">
                    Auto-synced with server database at <code className="text-gray-600">/data/appointments.json</code>
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {filteredAppointments.length !== appointments.length && (
                    <button
                      onClick={() => handleExportCSV(true)}
                      className="px-3 py-1 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-[#1F3A26] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Download only the currently filtered/searched list"
                    >
                      <Download className="w-3 h-3 text-[#C9A66B]" />
                      <span>Export Filtered ({filteredAppointments.length})</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleExportCSV(false)}
                    className="px-3 py-1 rounded-lg bg-[#1F3A26] hover:bg-[#4F7358] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    title="Download complete appointment database in CSV"
                  >
                    <Download className="w-3 h-3 text-[#C9A66B]" />
                    <span>Download All CSV</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: PRODUCT ORDERS MANAGEMENT                            */}
        {/* ========================================================= */}
        {activeTab === 'orders' && (
          <AdminOrdersManager />
        )}

        {/* ========================================================= */}
        {/* TAB: PAYMENTS & FINANCIAL LEDGER                          */}
        {/* ========================================================= */}
        {activeTab === 'payments' && (
          <AdminPaymentsManager />
        )}

        {/* ========================================================= */}
        {/* TAB 2: OVERVIEW SALES & RECHARTS ANALYTICS                 */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {isLoadingAppointments ? (
              <>
                <OverviewMetricsSkeleton />
                <OverviewChartsSkeleton />
              </>
            ) : (
              <>
                {/* Top Cards for Store Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bag Revenue</span>
                      <div className="w-8 h-8 rounded-lg bg-[#F7F5F1] text-[#1F3A26] flex items-center justify-center font-bold">
                        <IndianRupee className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="font-heading font-bold text-2xl text-[#1F3A26]">
                      {formatINR(categoryStats.grandTotalValue)}
                    </div>
                    <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Live Cart Valuation</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Units</span>
                      <div className="w-8 h-8 rounded-lg bg-[#F7F5F1] text-[#1F3A26] flex items-center justify-center">
                        <Package className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="font-heading font-bold text-2xl text-[#1F3A26]">{categoryStats.grandTotalUnits}</div>
                    <span className="text-[11px] text-gray-500 mt-1 block">Across {categoryStats.totalDistinctProducts} distinct products</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Categories</span>
                      <div className="w-8 h-8 rounded-lg bg-[#F7F5F1] text-[#1F3A26] flex items-center justify-center">
                        <Layers className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="font-heading font-bold text-2xl text-[#1F3A26]">{categoryStats.categoryCount}</div>
                    <span className="text-[11px] text-gray-500 mt-1 block">Represented in catalog bag</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Appointments</span>
                      <div className="w-8 h-8 rounded-lg bg-[#FDF1E4] text-[#C9A66B] flex items-center justify-center">
                        <Calendar className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="font-heading font-bold text-2xl text-[#1F3A26]">{stats.total}</div>
                    <span className="text-[11px] text-amber-700 font-semibold mt-1 block">{stats.pending} pending confirmation</span>
                  </div>
                </div>

                {/* Recharts Analytics Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Category Value Recharts Bar Chart */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
                    <h3 className="font-heading font-bold text-base text-[#1F3A26] mb-1">
                      Bag Subtotal Valuation by Category
                    </h3>
                    <p className="text-xs text-gray-500 mb-6">Revenue density breakdown across cosmetic & spa product categories</p>
                    <div className="h-64 sm:h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryStats.distribution} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ede6" />
                          <XAxis
                            dataKey="category"
                            stroke="#8c8c8c"
                            fontSize={11}
                            tickLine={false}
                            interval={0}
                            angle={-20}
                            textAnchor="end"
                          />
                          <YAxis
                            stroke="#8c8c8c"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => `₹${val}`}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1F3A26',
                              borderColor: '#C9A66B',
                              borderRadius: '12px',
                              color: '#fff',
                              fontSize: '12px',
                            }}
                            formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Subtotal Value']}
                          />
                          <Bar dataKey="totalValue" radius={[6, 6, 0, 0]}>
                            {categoryStats.distribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Units Distribution Pie Chart */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-base text-[#1F3A26] mb-1">
                        Inventory Unit Distribution
                      </h3>
                      <p className="text-xs text-gray-500 mb-4">Volume split of selected items in shopper carts</p>
                    </div>

                    <div className="h-64 sm:h-72 w-full flex items-center justify-center">
                      {categoryStats.distribution.length === 0 ? (
                        <div className="text-xs text-gray-400 text-center">Add items to bag to see distribution chart</div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categoryStats.distribution}
                              dataKey="totalUnits"
                              nameKey="category"
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={95}
                              paddingAngle={3}
                            >
                              {categoryStats.distribution.map((entry, index) => (
                                <Cell key={`pie-cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#1F3A26',
                                borderColor: '#C9A66B',
                                borderRadius: '12px',
                                color: '#fff',
                                fontSize: '12px',
                              }}
                              formatter={(val: any, name: any) => [`${val} Units (${categoryStats.distribution.find(d => d.category === name)?.percentageOfUnits}%)`, name]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center pt-2">
                      {categoryStats.distribution.map((cat) => (
                        <div key={cat.category} className="flex items-center gap-1.5 text-xs text-gray-600">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                          <span>{cat.category} ({cat.totalUnits})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: CATEGORY DEEP DIVE                                 */}
        {/* ========================================================= */}
        {activeTab === 'distribution' && (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
            <h3 className="font-heading font-bold text-lg text-[#1F3A26] mb-1">
              Category Metric Tables & Share
            </h3>
            <p className="text-xs text-gray-500 mb-6">Unit percentages, valuation shares, and average price per unit</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F7F5F1] text-gray-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 rounded-l-xl">Category</th>
                    <th className="py-3 px-4">Distinct Items</th>
                    <th className="py-3 px-4">Total Units</th>
                    <th className="py-3 px-4">Unit Share</th>
                    <th className="py-3 px-4">Subtotal Value</th>
                    <th className="py-3 px-4 rounded-r-xl">Revenue Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categoryStats.distribution.map((cat) => (
                    <tr key={cat.category} className="hover:bg-[#F7F5F1]/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-[#1F3A26] flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                        <span>{cat.category}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{cat.itemCount} items</td>
                      <td className="py-3 px-4 font-semibold text-[#1F3A26]">{cat.totalUnits}</td>
                      <td className="py-3 px-4 font-mono text-gray-600">{cat.percentageOfUnits}%</td>
                      <td className="py-3 px-4 font-bold text-[#1F3A26]">{formatINR(cat.totalValue)}</td>
                      <td className="py-3 px-4 font-mono text-[#C9A66B] font-bold">{cat.percentageOfValue}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: ACTIVE SHOPPING BAG MANAGER                        */}
        {/* ========================================================= */}
        {activeTab === 'cart-manager' && (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#1F3A26]">
                  Active Cart Items ({cartItems.length})
                </h3>
                <p className="text-xs text-gray-500">Live quantity manipulation synchronized with client storage</p>
              </div>
              <button
                onClick={onOpenCart}
                className="px-4 py-2 rounded-full bg-[#1F3A26] text-white text-xs font-bold shadow-xs hover:bg-[#4F7358] transition-colors cursor-pointer"
              >
                Open Slideout Cart Drawer
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <ShoppingBag className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                <p className="text-sm font-semibold">Shopping bag is currently empty.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <SafeImage
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-14 rounded-xl object-cover bg-[#F7F5F1] shrink-0 border border-gray-200"
                        fallbackType="product"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-bold text-[#C9A66B] block">
                          {item.product.category}
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-[#1F3A26] truncate">
                          {item.product.name}
                        </h4>
                        <div className="text-xs font-bold text-[#1F3A26] mt-0.5">
                          {formatINR(item.product.price)} each
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center bg-[#F7F5F1] rounded-lg border border-gray-200 p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-black cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-[#1F3A26]">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-black cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* MODAL 1: APPOINTMENT DOSSIER & NOTIFICATION AUDIT VIEW    */}
      {/* ========================================================= */}
      {selectedAppointmentForDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div
            onClick={() => setSelectedAppointmentForDetail(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />
          <div className="relative bg-white rounded-[24px] max-w-lg w-full p-6 shadow-2xl border border-[#1F3A26]/10 z-10 animate-in zoom-in-95 duration-200 space-y-4">
            
            <button
              onClick={() => setSelectedAppointmentForDetail(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F7F5F1] text-gray-700 flex items-center justify-center hover:bg-[#1F3A26] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#1F3A26] text-[#C9A66B] flex items-center justify-center font-bold text-base">
                {selectedAppointmentForDetail.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#C9A66B] tracking-wider block">
                  Booking Dossier & Audit Log
                </span>
                <h3 className="font-heading font-bold text-xl text-[#1F3A26]">
                  {selectedAppointmentForDetail.fullName}
                </h3>
              </div>
            </div>

            {/* Details List */}
            <div className="bg-[#F7F5F1] p-4 rounded-2xl space-y-2.5 text-xs text-[#1F3A26]">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-500 font-medium">Service Selected:</span>
                <span className="font-bold">{selectedAppointmentForDetail.serviceName}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-500 font-medium">Category:</span>
                <span>{selectedAppointmentForDetail.serviceCategory || 'General Beauty & Salon'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-500 font-medium">Preferred Date & Time:</span>
                <span className="font-bold text-[#C9A66B]">
                  {selectedAppointmentForDetail.preferredDate} at {selectedAppointmentForDetail.preferredTime}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-500 font-medium">Phone / WhatsApp:</span>
                <span className="font-mono font-semibold">{selectedAppointmentForDetail.phone}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-500 font-medium">Email Address:</span>
                <span>{selectedAppointmentForDetail.email || 'Not provided'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-500 font-medium">Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  STATUS_CONFIG[selectedAppointmentForDetail.status]?.bg || 'bg-gray-100'
                } ${STATUS_CONFIG[selectedAppointmentForDetail.status]?.text || 'text-gray-800'}`}>
                  {selectedAppointmentForDetail.status}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 text-[11px] text-gray-500">
                <span>Unique Booking ID:</span>
                <span className="font-mono text-gray-700">{selectedAppointmentForDetail.id}</span>
              </div>
            </div>

            {/* Notes Section */}
            {selectedAppointmentForDetail.notes && (
              <div>
                <label className="block text-xs font-bold text-[#1F3A26] uppercase tracking-wider mb-1.5">
                  Client Styling / Health Notes
                </label>
                <div className="p-3 bg-[#FFF9F0] border border-[#EED8B5] rounded-xl text-xs text-[#5C431F] leading-relaxed">
                  {selectedAppointmentForDetail.notes}
                </div>
              </div>
            )}

            {/* Email Notification Audit Badge */}
            <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Salon Admin Notification</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                  Instant
                </span>
              </div>
              <p className="text-[11px] text-emerald-700">
                Dispatched to: <strong className="font-mono">pranavdigital221@gmail.com</strong>
              </p>
              <p className="text-[10px] text-emerald-600">
                Registered at: {new Date(selectedAppointmentForDetail.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Customer Email Delivery Audit Badge */}
            {selectedAppointmentForDetail.email && (
              <div className={`p-3.5 rounded-xl text-xs space-y-2 border ${
                selectedAppointmentForDetail.emailStatus === 'SENT'
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                  : selectedAppointmentForDetail.emailStatus === 'FAILED'
                  ? 'bg-red-50/80 border-red-200 text-red-800'
                  : 'bg-amber-50/80 border-amber-200 text-amber-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span>Customer Email Confirmation</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedAppointmentForDetail.emailStatus === 'SENT'
                      ? 'bg-emerald-200/60 text-emerald-800'
                      : selectedAppointmentForDetail.emailStatus === 'FAILED'
                      ? 'bg-red-200/60 text-red-800'
                      : 'bg-amber-200/60 text-amber-800'
                  }`}>
                    {selectedAppointmentForDetail.emailStatus || 'PENDING'}
                  </span>
                </div>
                <p className="text-[11px]">
                  Customer: <strong className="font-mono">{selectedAppointmentForDetail.email}</strong>
                </p>
                {selectedAppointmentForDetail.emailError && (
                  <p className="text-[10px] text-red-600 font-mono bg-red-100/50 p-1.5 rounded">
                    Error: {selectedAppointmentForDetail.emailError}
                  </p>
                )}
                {selectedAppointmentForDetail.emailSentAt && (
                  <p className="text-[10px] text-gray-500">
                    Dispatched at: {new Date(selectedAppointmentForDetail.emailSentAt).toLocaleString()}
                  </p>
                )}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSendEmailViaGmail(selectedAppointmentForDetail)}
                    disabled={isRetryingEmail === selectedAppointmentForDetail.id}
                    className="py-2.5 px-3 rounded-xl bg-[#EA4335] hover:bg-[#D93025] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
                    title="Send official confirmation directly via Google Workspace Gmail API (OAuth)"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{isRetryingEmail === selectedAppointmentForDetail.id ? 'Sending...' : 'Send via Gmail API'}</span>
                  </button>
                  <button
                    onClick={() => handleRetryCustomerEmail(selectedAppointmentForDetail.id)}
                    disabled={isRetryingEmail === selectedAppointmentForDetail.id}
                    className="py-2.5 px-3 rounded-xl bg-[#1F3A26] hover:bg-[#4F7358] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    title="Send or retry via configured SMTP server"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRetryingEmail === selectedAppointmentForDetail.id ? 'animate-spin' : ''}`} />
                    <span>Send via SMTP</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Contact & Action Buttons */}
            <div className="space-y-2 pt-2">
              {selectedAppointmentForDetail.email && (
                <button
                  onClick={() => {
                    setGmailTargetAppointment(selectedAppointmentForDetail);
                    setShowGmailModal(true);
                  }}
                  className="w-full py-2.5 rounded-full bg-[#EA4335] hover:bg-[#D93025] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Custom Follow-up via Gmail API</span>
                </button>
              )}
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${selectedAppointmentForDetail.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello ${selectedAppointmentForDetail.fullName}, confirming your Serenity Salon appointment for ${selectedAppointmentForDetail.serviceName} on ${selectedAppointmentForDetail.preferredDate} at ${selectedAppointmentForDetail.preferredTime}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Client</span>
                </a>
                <a
                  href={`tel:${selectedAppointmentForDetail.phone}`}
                  className="flex-1 py-2.5 rounded-full bg-[#1F3A26] hover:bg-[#4F7358] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Client</span>
                </a>
              </div>

              {/* Delete Booking Option */}
              <button
                type="button"
                onClick={() => {
                  const toDelete = selectedAppointmentForDetail;
                  setSelectedAppointmentForDetail(null);
                  setAppointmentToDelete(toDelete);
                }}
                className="w-full py-2.5 rounded-full border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Delete Booking Record Permanently</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: WALK-IN / DIRECT RECEPTION BOOKING MODAL         */}
      {/* ========================================================= */}
      {showWalkinModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div
            onClick={() => setShowWalkinModal(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />
          <div className="relative bg-white rounded-[24px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#1F3A26]/10 z-10 animate-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setShowWalkinModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F7F5F1] text-gray-700 flex items-center justify-center hover:bg-[#1F3A26] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#FDF1E4] text-[#1F3A26] flex items-center justify-center border border-[#C9A66B]/30 shrink-0">
                <Scissors className="w-5 h-5 text-[#C9A66B]" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#C9A66B] block">
                  Admin Reception Portal
                </span>
                <h3 className="font-heading font-bold text-xl text-[#1F3A26]">
                  Record Walk-in Booking
                </h3>
              </div>
            </div>

            <form onSubmit={handleCreateWalkin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#1F3A26] uppercase tracking-wider mb-1">
                  Service Selection *
                </label>
                <select
                  value={walkinForm.serviceName}
                  onChange={(e) => setWalkinForm({ ...walkinForm, serviceName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F7F5F1] text-xs text-[#1A1A1A] border border-gray-200 font-medium focus:outline-none focus:border-[#C9A66B]"
                >
                  {SALON_SERVICES.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.category}) — {s.priceText}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1F3A26] uppercase tracking-wider mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={walkinForm.preferredDate}
                    onChange={(e) => setWalkinForm({ ...walkinForm, preferredDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F7F5F1] text-xs text-[#1A1A1A] border border-gray-200 focus:outline-none focus:border-[#C9A66B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F3A26] uppercase tracking-wider mb-1">
                    Time Slot *
                  </label>
                  <select
                    value={walkinForm.preferredTime}
                    onChange={(e) => setWalkinForm({ ...walkinForm, preferredTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F7F5F1] text-xs text-[#1A1A1A] border border-gray-200 focus:outline-none focus:border-[#C9A66B]"
                  >
                    {['10:00 AM', '11:00 AM', '12:30 PM', '02:00 PM', '03:30 PM', '05:00 PM', '06:30 PM', '07:30 PM'].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1F3A26] uppercase tracking-wider mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={walkinForm.fullName}
                    onChange={(e) => setWalkinForm({ ...walkinForm, fullName: e.target.value })}
                    placeholder="Deepika Rao"
                    className="w-full px-3 py-2 rounded-xl bg-[#F7F5F1] text-xs text-[#1A1A1A] border border-gray-200 focus:outline-none focus:border-[#C9A66B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F3A26] uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={walkinForm.phone}
                    onChange={(e) => setWalkinForm({ ...walkinForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl bg-[#F7F5F1] text-xs text-[#1A1A1A] border border-gray-200 focus:outline-none focus:border-[#C9A66B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F3A26] uppercase tracking-wider mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={walkinForm.email}
                  onChange={(e) => setWalkinForm({ ...walkinForm, email: e.target.value })}
                  placeholder="deepika@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F5F1] text-xs text-[#1A1A1A] border border-gray-200 focus:outline-none focus:border-[#C9A66B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F3A26] uppercase tracking-wider mb-1">
                  Reception Notes
                </label>
                <textarea
                  rows={2}
                  value={walkinForm.notes}
                  onChange={(e) => setWalkinForm({ ...walkinForm, notes: e.target.value })}
                  placeholder="Walk-in notes or stylist assigned..."
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F5F1] text-xs text-[#1A1A1A] border border-gray-200 focus:outline-none focus:border-[#C9A66B] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingWalkin}
                className="w-full py-3 rounded-full bg-[#1F3A26] hover:bg-[#4F7358] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer mt-2 disabled:opacity-75"
              >
                <Check className="w-4 h-4 text-[#C9A66B]" />
                <span>{isSubmittingWalkin ? 'Recording & Notifying...' : 'Save Walk-in Appointment'}</span>
              </button>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: CLEAR TEST / DEMO DATA CONFIRMATION DIALOG       */}
      {/* ========================================================= */}
      {showClearTestDataModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div
            onClick={() => {
              if (!isClearingTestData) setShowClearTestDataModal(false);
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />
          <div className="relative bg-white rounded-[24px] max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#1F3A26]/10 z-10 animate-in zoom-in-95 duration-200 space-y-4">
            
            <button
              onClick={() => setShowClearTestDataModal(false)}
              disabled={isClearingTestData}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F7F5F1] text-gray-700 flex items-center justify-center hover:bg-[#1F3A26] hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0 shadow-xs">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-rose-700 block">
                  Admin Maintenance Tool
                </span>
                <h3 className="font-heading font-bold text-xl text-[#1F3A26]">
                  Clear Test & Demo Data
                </h3>
              </div>
            </div>

            {/* Critical Warning Banner */}
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-rose-900 font-bold">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Warning: This action cannot be undone</span>
              </div>
              <p className="text-[11px] text-rose-800 leading-relaxed">
                Clearing test data permanently removes identified demo and sample appointments from the database and live Firestore storage.
              </p>
            </div>

            {/* Real Customer Data Protection Guarantee Banner */}
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Protected: Real Customer Bookings Are Kept Safe</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Only identified test records will be removed. All active reservations made by genuine customers remain untouched and secured.
              </p>
            </div>

            {/* Impact Metric Summary */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-[#F7F5F1] rounded-xl border border-gray-200 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                  Test Records to Purge
                </span>
                <span className="font-heading font-bold text-2xl text-rose-700 block">
                  {testAppointments.length}
                </span>
                <span className="text-[10px] text-gray-500">
                  Demo & sample entries
                </span>
              </div>
              <div className="p-3 bg-[#F7F5F1] rounded-xl border border-gray-200 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                  Real Customer Bookings
                </span>
                <span className="font-heading font-bold text-2xl text-emerald-700 block">
                  {realAppointments.length}
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">
                  Guarded & preserved
                </span>
              </div>
            </div>

            {/* Identified Test Items Preview List */}
            {testAppointments.length > 0 ? (
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-[#1F3A26] uppercase tracking-wider">
                  Identified Test Records ({testAppointments.length}):
                </label>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 border border-gray-200 rounded-xl p-2 bg-[#FAFAF8]">
                  {testAppointments.map(({ appointment: apt, reason }) => (
                    <div
                      key={apt.id}
                      className="p-2 bg-white rounded-lg border border-gray-200 text-xs flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-[#1F3A26] truncate">{apt.fullName}</div>
                        <div className="text-[11px] text-gray-500 truncate">
                          {apt.serviceName} • {apt.preferredDate} ({apt.preferredTime})
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                        {reason}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-[#1F3A26]">No Test Records Present</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  All {appointments.length} records in your system are active customer bookings.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearTestDataModal(false)}
                disabled={isClearingTestData}
                className="flex-1 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel / Keep Data
              </button>
              
              {testAppointments.length > 0 && (
                <button
                  type="button"
                  onClick={handleConfirmClearTestData}
                  disabled={isClearingTestData}
                  className="flex-1 py-2.5 rounded-full bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-70"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>
                    {isClearingTestData
                      ? 'Purging Test Data...'
                      : `Confirm & Clear ${testAppointments.length} Test Records`}
                  </span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Gmail Concierge & Inbox Integration Modal */}
      <GmailConciergeModal
        isOpen={showGmailModal}
        onClose={() => setShowGmailModal(false)}
        targetAppointment={gmailTargetAppointment}
        onEmailSentSuccessfully={(id, recipient) => {
          setActionFeedback(`Dispatched booking confirmation to ${recipient} via Gmail API!`);
          setTimeout(() => setActionFeedback(null), 4500);
        }}
      />

      {/* In-App Appointment Deletion Confirmation Modal */}
      {appointmentToDelete && (
        <div className="fixed inset-0 z-60 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-rose-200 flex flex-col animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-rose-50 p-5 border-b border-rose-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-rose-950">Delete Appointment Record?</h4>
                <p className="text-[11px] text-rose-800">This action will remove the booking permanently.</p>
              </div>
            </div>

            {/* Details */}
            <div className="p-5 space-y-3 text-xs text-gray-700">
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Booking ID:</span>
                  <span className="font-mono font-bold text-[#1F3A26]">#{appointmentToDelete.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Client:</span>
                  <span className="font-semibold text-gray-900">{appointmentToDelete.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Service:</span>
                  <span className="font-medium text-gray-800">{appointmentToDelete.serviceName}</span>
                </div>
                {appointmentToDelete.preferredDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Date & Time:</span>
                    <span className="font-semibold text-[#C9A66B]">
                      {appointmentToDelete.preferredDate} {appointmentToDelete.preferredTime ? `at ${appointmentToDelete.preferredTime}` : ''}
                    </span>
                  </div>
                )}
                {appointmentToDelete.phone && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Phone:</span>
                    <span className="text-gray-700">{appointmentToDelete.phone}</span>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-gray-500 leading-relaxed">
                Deleting this appointment will permanently remove it from both the dashboard and the database.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAppointmentToDelete(null)}
                  disabled={isDeletingAppointment}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold text-xs cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteAppointment}
                  disabled={isDeletingAppointment}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors disabled:opacity-50"
                >
                  {isDeletingAppointment ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Permanently</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
