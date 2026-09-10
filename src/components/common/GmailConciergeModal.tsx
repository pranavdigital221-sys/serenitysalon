import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  LogOut,
  Sparkles,
  Inbox,
  User as UserIcon,
  Calendar,
  Clock,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  auth,
  onAuthChange,
  signInWithGoogleForGmail,
  signOutGoogleAndClearToken,
  getCachedGmailAccessToken,
} from '../../lib/firebase';
import {
  getGmailProfile,
  sendAppointmentConfirmationViaGmail,
  sendEmailViaGmailApi,
  listRecentGmailMessages,
  GmailUserProfile,
  GmailMessageSummary,
} from '../../services/gmailService';
import { Appointment } from '../../types';
import { formatINR } from '../../utils/currency';

interface GmailConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetAppointment?: Appointment | null;
  onEmailSentSuccessfully?: (appointmentId: string, recipient: string) => void;
}

export const GmailConciergeModal: React.FC<GmailConciergeModalProps> = ({
  isOpen,
  onClose,
  targetAppointment,
  onEmailSentSuccessfully,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [gmailProfile, setGmailProfile] = useState<GmailUserProfile | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'confirmation' | 'compose' | 'history'>('confirmation');

  // Confirmation email state
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  // Custom compose state
  const [composeTo, setComposeTo] = useState(targetAppointment?.email || '');
  const [composeSubject, setComposeSubject] = useState(
    targetAppointment
      ? `Update on your Serenity Salon Appointment (${targetAppointment.id})`
      : 'Serenity Luxury Salon & Spa Concierge Update'
  );
  const [composeBody, setComposeBody] = useState(
    targetAppointment
      ? `Dear ${targetAppointment.fullName},\n\nWe look forward to welcoming you for your ${targetAppointment.serviceName} session on ${targetAppointment.preferredDate} at ${targetAppointment.preferredTime}.\n\nWarm regards,\nSerenity Concierge Team`
      : ''
  );
  const [showConfirmationPrompt, setShowConfirmationPrompt] = useState(false);

  // Recent messages
  const [recentMessages, setRecentMessages] = useState<GmailMessageSummary[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Sync auth state
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = onAuthChange(async (user) => {
      setCurrentUser(user);
      if (user) {
        const token = getCachedGmailAccessToken();
        if (token) {
          try {
            const profile = await getGmailProfile(token);
            setGmailProfile(profile);
            loadRecentMessages(token);
          } catch (err) {
            console.debug('Profile load notice:', err);
          }
        }
      } else {
        setGmailProfile(null);
        setRecentMessages([]);
      }
    });

    return () => unsubscribe();
  }, [isOpen]);

  useEffect(() => {
    if (targetAppointment) {
      setComposeTo(targetAppointment.email || '');
      setComposeSubject(`Update on your Serenity Salon Appointment (${targetAppointment.id})`);
      setComposeBody(
        `Dear ${targetAppointment.fullName},\n\nWe look forward to welcoming you for your ${targetAppointment.serviceName} session on ${targetAppointment.preferredDate} at ${targetAppointment.preferredTime}.\n\nWarm regards,\nSerenity Concierge Team`
      );
      setSendSuccess(null);
      setSendError(null);
    }
  }, [targetAppointment]);

  const loadRecentMessages = async (token?: string) => {
    setIsLoadingMessages(true);
    try {
      const msgs = await listRecentGmailMessages('Serenity', 5, token);
      setRecentMessages(msgs);
    } catch (err) {
      console.warn('Recent message fetch error:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setIsAuthenticating(true);
    try {
      const { user, accessToken } = await signInWithGoogleForGmail();
      setCurrentUser(user);
      const profile = await getGmailProfile(accessToken);
      setGmailProfile(profile);
      await loadRecentMessages(accessToken);
    } catch (err: any) {
      console.error('Google Gmail Sign-In Error:', err);
      setAuthError(err?.message || 'Failed to authenticate with Google. Please check popup permissions.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutGoogleAndClearToken();
      setCurrentUser(null);
      setGmailProfile(null);
      setRecentMessages([]);
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  const handleSendAppointmentConfirmation = async () => {
    if (!targetAppointment || !targetAppointment.email) {
      setSendError('No recipient email address available for this appointment.');
      return;
    }

    const token = getCachedGmailAccessToken();
    if (!token) {
      setSendError('Please sign in with your Google account first to enable Gmail sending.');
      return;
    }

    setIsSending(true);
    setSendError(null);
    setSendSuccess(null);

    try {
      const result = await sendAppointmentConfirmationViaGmail(targetAppointment, token);
      if (result.success) {
        setSendSuccess(`Appointment confirmation successfully sent to ${targetAppointment.email} via Gmail!`);
        if (onEmailSentSuccessfully) {
          onEmailSentSuccessfully(targetAppointment.id, targetAppointment.email);
        }
        loadRecentMessages(token);
      } else {
        setSendError(result.error || 'Failed to send confirmation email.');
      }
    } catch (err: any) {
      setSendError(err.message || 'Error occurred while sending email.');
    } finally {
      setIsSending(false);
      setShowConfirmationPrompt(false);
    }
  };

  const handleSendCustomEmail = async () => {
    if (!composeTo.trim()) {
      setSendError('Please enter a recipient email address.');
      return;
    }

    const token = getCachedGmailAccessToken();
    if (!token) {
      setSendError('Please sign in with your Google account first.');
      return;
    }

    setIsSending(true);
    setSendError(null);
    setSendSuccess(null);

    try {
      const htmlBody = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F7F5F1; padding: 30px 15px; color: #1A1A1A;">
          <div style="max-width: 560px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E5E0D8; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <div style="background-color: #1F3A26; padding: 24px; text-align: center;">
              <h2 style="margin: 0; color: #FFFFFF; font-size: 20px; letter-spacing: 1px;">SERENITY LUXURY SALON</h2>
            </div>
            <div style="padding: 24px; line-height: 1.6; font-size: 14px; white-space: pre-wrap;">
${composeBody}
            </div>
            <div style="background-color: #FAF8F5; padding: 16px 24px; border-top: 1px solid #EAE5DC; font-size: 11px; color: #888; text-align: center;">
              Ground Floor, Luxury Pavilion, Viman Nagar, Pune • Tel: +91 8108765851
            </div>
          </div>
        </div>
      `;

      const result = await sendEmailViaGmailApi({
        to: composeTo.trim(),
        subject: composeSubject.trim(),
        htmlBody,
        textBody: composeBody,
        accessToken: token,
      });

      if (result.success) {
        setSendSuccess(`Custom email sent successfully to ${composeTo.trim()}!`);
        setShowConfirmationPrompt(false);
        loadRecentMessages(token);
      } else {
        setSendError(result.error || 'Failed to dispatch email.');
      }
    } catch (err: any) {
      setSendError(err.message || 'Error occurred while sending email.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1F3A26] px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Mail className="w-5 h-5 text-[#C9A66B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide">Gmail Concierge Integration</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#C9A66B]/20 text-[#C9A66B] text-[10px] font-bold uppercase tracking-wider border border-[#C9A66B]/30">
                  Google Workspace
                </span>
              </div>
              <p className="text-xs text-[#A3B899]">
                Send branded appointment confirmations &amp; updates directly from your verified Google account
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Account Status / Auth Bar */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#ECE7DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {currentUser && getCachedGmailAccessToken() ? (
              <div className="flex items-center gap-3">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Google User'}
                    className="w-10 h-10 rounded-full border border-emerald-300 object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    {currentUser.email?.charAt(0).toUpperCase() || 'G'}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-gray-900">
                      {currentUser.displayName || 'Google User'}
                    </span>
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Check className="w-2.5 h-2.5" /> Gmail Active
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 font-mono">{currentUser.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Gmail Not Connected</h4>
                  <p className="text-[11px] text-gray-500">Sign in to enable 1-click customer email confirmations.</p>
                </div>
              </div>
            )}

            <div>
              {currentUser && getCachedGmailAccessToken() ? (
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              ) : (
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isAuthenticating}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold border border-gray-300 shadow-sm flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isAuthenticating ? (
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 48 48">
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      />
                    </svg>
                  )}
                  <span>Sign in with Google</span>
                </button>
              )}
            </div>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('confirmation')}
              className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'confirmation'
                  ? 'border-[#1F3A26] text-[#1F3A26]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span>Booking Confirmation</span>
            </button>
            <button
              onClick={() => setActiveTab('compose')}
              className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'compose'
                  ? 'border-[#1F3A26] text-[#1F3A26]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Custom Compose</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'history'
                  ? 'border-[#1F3A26] text-[#1F3A26]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Recent Salon Emails</span>
            </button>
          </div>

          {/* Tab 1: Booking Confirmation Template */}
          {activeTab === 'confirmation' && (
            <div className="space-y-4">
              {targetAppointment ? (
                <>
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#ECE7DF] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1F3A26]">Target Appointment</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#EAE5DC] text-[#1F3A26]">
                        {targetAppointment.id}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500 block text-[10px] uppercase">Client Name</span>
                        <strong className="text-gray-900">{targetAppointment.fullName}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px] uppercase">Recipient Email</span>
                        <strong className="text-gray-900 font-mono">{targetAppointment.email || 'No email provided'}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px] uppercase">Service</span>
                        <strong className="text-gray-900">{targetAppointment.serviceName}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px] uppercase">Scheduled Time</span>
                        <strong className="text-gray-900">
                          {targetAppointment.preferredDate} at {targetAppointment.preferredTime}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Confirmation Prompt (Mandatory Workspace confirmation) */}
                  {showConfirmationPrompt ? (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-3">
                      <div className="flex items-center gap-2 font-bold text-amber-900">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>Confirm Email Dispatch</span>
                      </div>
                      <p className="text-[12px] leading-relaxed">
                        Are you sure you want to send this appointment confirmation to{' '}
                        <strong>{targetAppointment.email}</strong> from your connected Gmail address (
                        <strong>{currentUser?.email}</strong>)?
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowConfirmationPrompt(false)}
                          className="px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSendAppointmentConfirmation}
                          disabled={isSending}
                          className="px-4 py-1.5 rounded-lg bg-[#1F3A26] hover:bg-[#2C4F35] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                          <span>Confirm &amp; Send</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={!currentUser || !targetAppointment.email || isSending}
                      onClick={() => setShowConfirmationPrompt(true)}
                      className="w-full py-3 rounded-full bg-[#1F3A26] hover:bg-[#2C4F35] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Mail className="w-4 h-4 text-[#C9A66B]" />
                      <span>Send Official Confirmation via Gmail</span>
                    </button>
                  )}
                </>
              ) : (
                <div className="p-8 text-center rounded-xl bg-gray-50 border border-gray-200">
                  <Mail className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <h4 className="text-xs font-bold text-gray-700">No Target Appointment Selected</h4>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Select an appointment from the Admin Dashboard or use Custom Compose to send an email.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Custom Compose */}
          {activeTab === 'compose' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  placeholder="client@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] text-xs text-gray-900 font-medium border border-gray-200 focus:outline-none focus:border-[#1F3A26]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder="Subject..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] text-xs text-gray-900 font-medium border border-gray-200 focus:outline-none focus:border-[#1F3A26]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Message Body
                </label>
                <textarea
                  rows={5}
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  placeholder="Enter message..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] text-xs text-gray-900 font-medium border border-gray-200 focus:outline-none focus:border-[#1F3A26]"
                />
              </div>

              {showConfirmationPrompt ? (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-3">
                  <div className="flex items-center gap-2 font-bold text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Confirm Message Dispatch</span>
                  </div>
                  <p className="text-[12px]">
                    Dispatch this message to <strong>{composeTo}</strong> from your account (
                    <strong>{currentUser?.email}</strong>)?
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowConfirmationPrompt(false)}
                      className="px-3 py-1.5 rounded-lg bg-gray-200 text-gray-800 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSendCustomEmail}
                      disabled={isSending}
                      className="px-4 py-1.5 rounded-lg bg-[#1F3A26] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      <span>Send Now</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={!currentUser || !composeTo.trim() || isSending}
                  onClick={() => setShowConfirmationPrompt(true)}
                  className="w-full py-3 rounded-full bg-[#1F3A26] hover:bg-[#2C4F35] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-[#C9A66B]" />
                  <span>Send Message via Gmail API</span>
                </button>
              )}
            </div>
          )}

          {/* Tab 3: Recent Activity */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">Recent Salon Threads</span>
                <button
                  onClick={() => loadRecentMessages()}
                  disabled={isLoadingMessages || !currentUser}
                  className="p-1 rounded text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                  title="Refresh"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMessages ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {isLoadingMessages ? (
                <div className="p-8 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#1F3A26]" />
                  <span>Retrieving Gmail threads...</span>
                </div>
              ) : recentMessages.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {recentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-3 rounded-xl bg-[#FAF8F5] border border-[#ECE7DF] hover:border-gray-300 transition-all text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-gray-900 truncate max-w-[280px]">{msg.subject}</strong>
                        <span className="text-[10px] text-gray-500 shrink-0">{msg.date}</span>
                      </div>
                      <p className="text-[11px] text-gray-600 line-clamp-1">{msg.snippet}</p>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-gray-400">
                        <span>To: {msg.to}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-gray-500 bg-gray-50 rounded-xl border border-gray-200">
                  No recent salon messages found in Gmail.
                </div>
              )}
            </div>
          )}

          {/* Success Notification */}
          {sendSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{sendSuccess}</span>
            </div>
          )}

          {/* Error Notification */}
          {sendError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{sendError}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#FAF8F5] px-6 py-3 border-t border-[#ECE7DF] flex items-center justify-between text-[11px] text-gray-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Authenticated directly via Google Identity Services</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
