import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  User,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  Package,
  Sparkles,
  Gift,
  Crown,
  LogOut,
  MapPin,
  Phone,
  ShieldCheck,
  ChevronRight,
  Edit3,
  Bell,
  Check,
  MessageCircle,
  Smartphone,
  Send,
  Calendar,
  Clock,
  Scissors,
  AlertTriangle,
} from 'lucide-react';
import { CartItem, UserNotificationPreferences, UpcomingAppointmentReminder } from '../../types';
import { OrderHistoryTab } from '../account/OrderHistoryTab';
import { LoyaltyRewardsTab } from '../account/LoyaltyRewardsTab';
import { ReferAFriend } from '../account/ReferAFriend';
import {
  getUserLoyalty,
  getUserOrders,
  getUserReferral,
  getUserNotifications,
  saveUserNotifications,
  getUpcomingAppointmentReminder,
  dismissAppointmentReminder,
} from '../../utils/accountData';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'orders' | 'loyalty' | 'referral' | 'profile';
  onReorderItems?: (items: CartItem[]) => void;
  onNavigateToShop?: () => void;
  onOpenBooking?: () => void;
  onShowToast?: (msg: string, type?: 'cart' | 'wishlist' | 'info') => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'orders',
  onReorderItems,
  onNavigateToShop,
  onOpenBooking,
  onShowToast,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Notification Preferences State
  const [notifications, setNotifications] = useState<UserNotificationPreferences>(getUserNotifications);
  const [appointmentReminder, setAppointmentReminder] = useState<UpcomingAppointmentReminder | null>(getUpcomingAppointmentReminder);
  const hasTriggeredAppointmentToast = useRef(false);

  // Default to logged-in state with stored session or demo user
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('serenity_user_session_v1');
      return saved ? JSON.parse(saved).isLoggedIn : true; // Default true for seamless experience
    } catch {
      return true;
    }
  });

  const [activeTab, setActiveTab] = useState<'orders' | 'loyalty' | 'referral' | 'profile'>(initialTab);

  const [userName, setUserName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('serenity_user_session_v1');
      return saved ? JSON.parse(saved).name : 'Aasha Gandal';
    } catch {
      return 'Aasha Gandal';
    }
  });

  const [userEmail, setUserEmail] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('serenity_user_session_v1');
      return saved ? JSON.parse(saved).email : 'aasha.gandal@example.com';
    } catch {
      return 'aasha.gandal@example.com';
    }
  });

  // Sync initialTab when modal opens
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Sync notifications and trigger 24-hour appointment reminder toast
  useEffect(() => {
    if (isOpen) {
      setNotifications(getUserNotifications());
      const rem = getUpcomingAppointmentReminder();
      setAppointmentReminder(rem);

      if (rem && !rem.dismissed && !hasTriggeredAppointmentToast.current && onShowToast) {
        hasTriggeredAppointmentToast.current = true;
        onShowToast(
          `🔔 Reminder: Your ${rem.serviceName} appointment is in ${rem.hoursRemaining} hours (${rem.preferredDate} at ${rem.preferredTime})!`,
          'info'
        );
      }
    }
  }, [isOpen, onShowToast]);

  const handleDismissReminder = () => {
    dismissAppointmentReminder();
    setAppointmentReminder(null);
    if (onShowToast) {
      onShowToast('Appointment reminder dismissed.', 'info');
    }
  };

  if (!isOpen) return null;

  const handleToggleNotification = (key: keyof Omit<UserNotificationPreferences, 'preferredChannel'>) => {
    const updated: UserNotificationPreferences = {
      ...notifications,
      [key]: !notifications[key],
    };
    setNotifications(updated);
    saveUserNotifications(updated);

    if (onShowToast) {
      const stateName = updated[key] ? 'Enabled' : 'Disabled';
      const label =
        key === 'emailOrderConfirmation'
          ? 'Automatic Email Order Confirmations'
          : key === 'whatsappDispatchAlerts'
          ? 'WhatsApp Dispatch Alerts'
          : key === 'smsDeliveryUpdates'
          ? 'SMS Delivery Updates'
          : key === 'emailAppointmentReminder'
          ? 'Email Appointment Reminders'
          : 'Promotions & Multiplier Alerts';
      onShowToast(`${label} ${stateName.toLowerCase()}`, 'info');
    }
  };

  const handleChangePreferredChannel = (channel: UserNotificationPreferences['preferredChannel']) => {
    const updated: UserNotificationPreferences = {
      ...notifications,
      preferredChannel: channel,
    };
    setNotifications(updated);
    saveUserNotifications(updated);
    if (onShowToast) {
      onShowToast(`Primary notification channel set to ${channel.toUpperCase()}`, 'info');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    const displayName = name || email.split('@')[0];
    setUserName(displayName);
    setUserEmail(email);
    setIsLoggedIn(true);

    try {
      localStorage.setItem(
        'serenity_user_session_v1',
        JSON.stringify({ isLoggedIn: true, name: displayName, email })
      );
    } catch {
      // ignore
    }

    if (onShowToast) {
      onShowToast(`Welcome back, ${displayName}!`, 'info');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    try {
      localStorage.setItem(
        'serenity_user_session_v1',
        JSON.stringify({ isLoggedIn: false, name: '', email: '' })
      );
    } catch {
      // ignore
    }
    if (onShowToast) {
      onShowToast('Signed out of your Serenity account.', 'info');
    }
  };

  const loyaltyData = getUserLoyalty();
  const ordersData = getUserOrders();
  const referralData = getUserReferral();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-[28px] max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#1F3A26]/10 z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#FAF8F5] text-gray-700 flex items-center justify-center hover:bg-[#1F3A26] hover:text-white transition-colors cursor-pointer z-20 shadow-xs border border-gray-200"
        >
          <X className="w-4 h-4" />
        </button>

        {isLoggedIn ? (
          <div className="flex flex-col h-full overflow-hidden">
            
            {/* User Header Profile Bar */}
            <div className="bg-gradient-to-r from-[#1F3A26] via-[#2A4D35] to-[#1F3A26] p-5 sm:p-6 text-white border-b border-[#C9A66B]/30 shrink-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                {/* User Avatar & Name */}
                <div className="flex items-center gap-3.5">
                  <div className="relative w-12 h-12 rounded-2xl bg-[#C9A66B]/20 border border-[#C9A66B]/40 flex items-center justify-center text-[#E5C78A] font-extrabold text-lg font-heading shadow-inner">
                    {userName.charAt(0).toUpperCase()}
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-[#1F3A26]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-lg text-white">
                        {userName}
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C9A66B]/20 text-[#E5C78A] text-[10px] font-bold tracking-wide uppercase border border-[#C9A66B]/30">
                        <Crown className="w-3 h-3 text-[#E5C78A]" />
                        {loyaltyData.tier} VIP
                      </span>
                    </div>
                    <p className="text-xs text-[#E5E0D8]">{userEmail}</p>
                  </div>
                </div>

                {/* Points & Referral Stats Pills */}
                <div className="flex items-center gap-2 self-stretch sm:self-auto">
                  <button
                    onClick={() => setActiveTab('loyalty')}
                    className="flex-1 sm:flex-none bg-white/10 hover:bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 text-left transition-colors cursor-pointer"
                  >
                    <span className="text-[10px] uppercase font-bold text-gray-300 tracking-wider block">
                      Aura Points
                    </span>
                    <span className="text-sm font-extrabold text-[#E5C78A] font-heading flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      {loyaltyData.pointsBalance.toLocaleString()} <span className="text-[11px] font-normal text-white">pts</span>
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('referral')}
                    className="flex-1 sm:flex-none bg-white/10 hover:bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 text-left transition-colors cursor-pointer"
                  >
                    <span className="text-[10px] uppercase font-bold text-gray-300 tracking-wider block">
                      Referral Rewards
                    </span>
                    <span className="text-sm font-extrabold text-[#E5C78A] font-heading flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5" />
                      {referralData.successfulOrders} <span className="text-[11px] font-normal text-white">active</span>
                    </span>
                  </button>
                </div>

              </div>

              {/* Quick Visual Tier Progress Indicator */}
              <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-[#E5E0D8]">
                  <span className="font-semibold text-white">{loyaltyData.pointsBalance} pts</span>
                  <span className="text-[#C9A66B]">•</span>
                  <span>
                    Need <span className="text-[#E5C78A] font-bold">{loyaltyData.pointsToNextTier} more points</span> for{' '}
                    <span className="text-white font-semibold">
                      {loyaltyData.tier === 'Bronze' ? 'Silver Radiance' : loyaltyData.tier === 'Silver' ? 'Gold VIP' : 'Emerald Platinum Elite'}
                    </span>
                  </span>
                </div>
                <div className="w-full sm:w-44 h-2 bg-black/30 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-[#E5C78A] rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(8, loyaltyData.tierProgress)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-[#FAF8F5] px-4 sm:px-6 border-b border-gray-200 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-3.5 px-3.5 border-b-2 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'orders'
                    ? 'border-[#1F3A26] text-[#1F3A26]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Package className="w-4 h-4 text-[#C9A66B]" />
                <span>Order History</span>
                <span className="px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-700 text-[10px] font-bold">
                  {ordersData.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('loyalty')}
                className={`py-3.5 px-3.5 border-b-2 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'loyalty'
                    ? 'border-[#1F3A26] text-[#1F3A26]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Crown className="w-4 h-4 text-[#C9A66B]" />
                <span>Loyalty Points &amp; Tiers</span>
                <span className="px-1.5 py-0.5 rounded-full bg-[#FDF8EC] text-[#9E7A3E] text-[10px] font-bold border border-[#EADBBA]">
                  {loyaltyData.tier}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('referral')}
                className={`py-3.5 px-3.5 border-b-2 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'referral'
                    ? 'border-[#1F3A26] text-[#1F3A26]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Gift className="w-4 h-4 text-[#C9A66B]" />
                <span>Referral Rewards</span>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Get ₹500
                </span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`py-3.5 px-3.5 border-b-2 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'profile'
                    ? 'border-[#1F3A26] text-[#1F3A26]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <User className="w-4 h-4 text-gray-400" />
                <span>Settings &amp; Profile</span>
              </button>
            </div>

            {/* Scrollable Tab Content Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

              {/* 24-HOUR UPCOMING APPOINTMENT ALERT BANNER */}
              {appointmentReminder && !appointmentReminder.dismissed && (
                <div className="relative overflow-hidden bg-gradient-to-r from-[#FDF8EC] via-[#FAF3E0] to-[#FDF8EC] border-2 border-[#C9A66B]/60 p-4 sm:p-4.5 rounded-2xl shadow-sm animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="relative w-10 h-10 rounded-xl bg-[#1F3A26] text-[#E5C78A] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                        <Calendar className="w-5 h-5 text-[#E5C78A]" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1F3A26] text-[#E5C78A] text-[10px] font-bold tracking-wide uppercase">
                            <Clock className="w-3 h-3 text-[#E5C78A]" />
                            In {appointmentReminder.hoursRemaining} Hours
                          </span>
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200">
                            ✓ {appointmentReminder.status}
                          </span>
                        </div>

                        <h4 className="font-heading font-bold text-sm sm:text-base text-[#1F3A26]">
                          Upcoming Appointment: {appointmentReminder.serviceName}
                        </h4>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6E6E6E] pt-0.5">
                          <span className="flex items-center gap-1 font-semibold text-[#1F3A26]">
                            <Calendar className="w-3.5 h-3.5 text-[#C9A66B]" />
                            {appointmentReminder.preferredDate} at {appointmentReminder.preferredTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Scissors className="w-3.5 h-3.5 text-[#C9A66B]" />
                            Stylist: <span className="font-semibold text-gray-800">{appointmentReminder.stylistName}</span>
                          </span>
                        </div>

                        <p className="text-[11px] text-gray-500 flex items-center gap-1 pt-0.5">
                          <MapPin className="w-3 h-3 text-[#C9A66B] shrink-0" />
                          <span>{appointmentReminder.salonBranch}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleDismissReminder}
                      aria-label="Dismiss appointment reminder"
                      className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-black/5 transition-colors cursor-pointer shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#C9A66B]/20 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-[#8C6D37] font-medium">
                      Advance deposit paid: ₹{appointmentReminder.advancePaidINR} • Please arrive 10 mins prior.
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (onShowToast) {
                            onShowToast('Appointment saved to your system calendar (.ics generated)!', 'info');
                          }
                        }}
                        className="px-3 py-1 rounded-lg bg-[#1F3A26] hover:bg-[#2D4D36] text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Sparkles className="w-3 h-3 text-[#E5C78A]" />
                        <span>Add to Calendar</span>
                      </button>
                      <button
                        onClick={handleDismissReminder}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200 transition-colors cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* TAB 1: ORDER HISTORY */}
              {activeTab === 'orders' && (
                <OrderHistoryTab
                  onReorderItems={(items) => {
                    if (onReorderItems) {
                      onReorderItems(items);
                      onClose();
                    }
                  }}
                  onNavigateToShop={() => {
                    onClose();
                    if (onNavigateToShop) onNavigateToShop();
                  }}
                  onShowToast={onShowToast}
                />
              )}

              {/* TAB 2: LOYALTY & REWARDS */}
              {activeTab === 'loyalty' && (
                <LoyaltyRewardsTab
                  onShowToast={onShowToast}
                  onOpenBooking={() => {
                    onClose();
                    if (onOpenBooking) onOpenBooking();
                  }}
                  onNavigateToShop={() => {
                    onClose();
                    if (onNavigateToShop) onNavigateToShop();
                  }}
                />
              )}

              {/* TAB 3: REFERRAL REWARDS */}
              {activeTab === 'referral' && (
                <ReferAFriend
                  onCopySuccess={(msg) => onShowToast && onShowToast(msg, 'info')}
                  onNavigateToShop={() => {
                    onClose();
                    if (onNavigateToShop) onNavigateToShop();
                  }}
                />
              )}

              {/* TAB 4: PROFILE & NOTIFICATION SETTINGS */}
              {activeTab === 'profile' && (
                <div className="space-y-6 max-w-lg mx-auto">
                  
                  {/* Notification Preferences Section */}
                  <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#1F3A26]/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-bold text-sm text-[#1F3A26] flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#C9A66B]" />
                        <span>Order &amp; Delivery Notifications</span>
                      </h4>
                      <span className="text-[10px] font-bold text-[#1F3A26] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                        Preferences Saved
                      </span>
                    </div>

                    <p className="text-xs text-[#6E6E6E]">
                      Choose your preferred communication channels and toggle order confirmations.
                    </p>

                    <div className="space-y-3 divide-y divide-gray-200/60 pt-1">
                      
                      {/* TOGGLE 1: Automatic Email Order Confirmations */}
                      <div className="flex items-center justify-between gap-3 pt-3">
                        <div className="space-y-0.5 pr-2">
                          <label className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-[#C9A66B]" />
                            Automatic Email Order Confirmations
                          </label>
                          <p className="text-[11px] text-gray-500 leading-tight">
                            Receive instant order receipts, PDF tax invoices, and dispatch confirmations to <span className="font-mono text-[#1F3A26]">{userEmail}</span>.
                          </p>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={notifications.emailOrderConfirmation}
                          onClick={() => handleToggleNotification('emailOrderConfirmation')}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            notifications.emailOrderConfirmation ? 'bg-[#1F3A26]' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                              notifications.emailOrderConfirmation ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {/* TOGGLE 2: WhatsApp Delivery Tracking */}
                      <div className="flex items-center justify-between gap-3 pt-3">
                        <div className="space-y-0.5 pr-2">
                          <label className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                            WhatsApp Live Courier Alerts
                          </label>
                          <p className="text-[11px] text-gray-500 leading-tight">
                            Receive direct WhatsApp notifications with live courier GPS tracking links upon shipment dispatch.
                          </p>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={notifications.whatsappDispatchAlerts}
                          onClick={() => handleToggleNotification('whatsappDispatchAlerts')}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            notifications.whatsappDispatchAlerts ? 'bg-[#1F3A26]' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                              notifications.whatsappDispatchAlerts ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {/* TOGGLE 3: SMS Out for Delivery Updates */}
                      <div className="flex items-center justify-between gap-3 pt-3">
                        <div className="space-y-0.5 pr-2">
                          <label className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                            <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                            SMS Delivery Updates
                          </label>
                          <p className="text-[11px] text-gray-500 leading-tight">
                            Receive text message reminders when your package is out for delivery with delivery agent details.
                          </p>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={notifications.smsDeliveryUpdates}
                          onClick={() => handleToggleNotification('smsDeliveryUpdates')}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            notifications.smsDeliveryUpdates ? 'bg-[#1F3A26]' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                              notifications.smsDeliveryUpdates ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {/* TOGGLE 4: VIP Point Multipliers & Exclusive Offers */}
                      <div className="flex items-center justify-between gap-3 pt-3">
                        <div className="space-y-0.5 pr-2">
                          <label className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#C9A66B]" />
                            VIP Loyalty &amp; Multiplier Alerts
                          </label>
                          <p className="text-[11px] text-gray-500 leading-tight">
                            Get early alerts for 2x points booking weekends, birthday gifts, and private seasonal cosmetic drops.
                          </p>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={notifications.promotionsAndMultipliers}
                          onClick={() => handleToggleNotification('promotionsAndMultipliers')}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            notifications.promotionsAndMultipliers ? 'bg-[#1F3A26]' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                              notifications.promotionsAndMultipliers ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                    </div>

                    {/* Preferred Method Selector */}
                    <div className="pt-3 border-t border-gray-200/80">
                      <label className="text-[11px] font-bold uppercase text-gray-500 block mb-2">
                        Preferred Notification Method
                      </label>
                      <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
                        {(
                          [
                            { id: 'email', label: 'Email' },
                            { id: 'whatsapp', label: 'WhatsApp' },
                            { id: 'sms', label: 'SMS' },
                            { id: 'all', label: 'All Channels' },
                          ] as const
                        ).map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleChangePreferredChannel(opt.id)}
                            className={`py-2 px-1 rounded-xl text-[11px] text-center transition-all cursor-pointer border ${
                              notifications.preferredChannel === opt.id
                                ? 'bg-[#1F3A26] text-white border-[#1F3A26] shadow-xs'
                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Personal Information */}
                  <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#1F3A26]/10 space-y-4">
                    <h4 className="font-heading font-bold text-sm text-[#1F3A26] flex items-center justify-between">
                      <span>Personal Information</span>
                      <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified Member
                      </span>
                    </h4>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Full Name</label>
                        <div className="px-3.5 py-2.5 bg-white rounded-xl border border-gray-200 font-semibold text-[#1A1A1A]">
                          {userName}
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Email Address</label>
                        <div className="px-3.5 py-2.5 bg-white rounded-xl border border-gray-200 text-[#1A1A1A]">
                          {userEmail}
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Primary Delivery Address</label>
                        <div className="px-3.5 py-2.5 bg-white rounded-xl border border-gray-200 text-gray-700 leading-relaxed">
                          402, Lotus Grand Residences, Linking Road, Bandra West, Mumbai, Maharashtra - 400050
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>

                    <button
                      onClick={onClose}
                      className="px-5 py-2.5 rounded-xl bg-[#1F3A26] hover:bg-[#2D4D36] text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Back to Shopping
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        ) : (
          /* Sign In / Sign Up Form (When Logged Out) */
          <div className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-[#FDF1E4] text-[#1F3A26] mx-auto flex items-center justify-center mb-3">
                <User className="w-6 h-6 text-[#C9A66B]" />
              </div>
              <h2 className="font-heading font-bold text-2xl text-[#1F3A26]">
                {isRegister ? 'Create Your Botanical Account' : 'Welcome to Serenity Salon'}
              </h2>
              <p className="text-xs text-[#6E6E6E] mt-1 max-w-sm mx-auto">
                {isRegister 
                  ? 'Join our botanical circle to earn 500 welcome points, enjoy 20% off, and track your orders.' 
                  : 'Sign in to access your order history, loyalty points, wishlist, and referral rewards.'}
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3.5 max-w-md mx-auto">
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aasha Gandal"
                    className="w-full px-4 py-2.5 rounded-full bg-[#F7F5F1] text-sm text-[#1A1A1A] border border-gray-200 focus:outline-none focus:border-[#C9A66B]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aasha.gandal@example.com"
                    className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#F7F5F1] text-sm text-[#1A1A1A] border border-gray-200 focus:outline-none focus:border-[#C9A66B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#F7F5F1] text-sm text-[#1A1A1A] border border-gray-200 focus:outline-none focus:border-[#C9A66B]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#1F3A26] hover:bg-[#4F7358] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer mt-3"
              >
                <span>{isRegister ? 'Join Clean Beauty Club' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4 text-[#C9A66B]" />
              </button>

              {/* Quick Guest / Demo 1-Click Access Button */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setUserName('Aasha Gandal');
                    setUserEmail('aasha.gandal@example.com');
                    setIsLoggedIn(true);
                    try {
                      localStorage.setItem(
                        'serenity_user_session_v1',
                        JSON.stringify({ isLoggedIn: true, name: 'Aasha Gandal', email: 'aasha.gandal@example.com' })
                      );
                    } catch {}
                    if (onShowToast) onShowToast('Signed in as Aasha Gandal (Gold VIP)', 'info');
                  }}
                  className="text-xs text-[#C9A66B] hover:text-[#9E7A3E] font-bold underline cursor-pointer"
                >
                  Instant 1-Click Demo Login as Aasha Gandal (Gold VIP)
                </button>
              </div>
            </form>

            <div className="mt-5 text-center text-xs text-[#6E6E6E]">
              {isRegister ? (
                <p>
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsRegister(false)}
                    className="text-[#1F3A26] font-bold hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              ) : (
                <p>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setIsRegister(true)}
                    className="text-[#1F3A26] font-bold hover:underline cursor-pointer"
                  >
                    Sign Up for 20% OFF &amp; 500 Points
                  </button>
                </p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

