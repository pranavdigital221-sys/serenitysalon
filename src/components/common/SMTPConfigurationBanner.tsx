import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Server, 
  ShieldCheck, 
  Key, 
  RefreshCw,
  Send,
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';
import { getCachedGmailAccessToken, signInWithGoogleForGmail, auth } from '../../lib/firebase';
import { getGmailProfile, sendEmailViaGmailApi, GmailUserProfile } from '../../services/gmailService';

interface SmtpStatusResponse {
  smtpConfigured?: boolean;
  smtpConnectionVerified?: boolean;
  emailDispatchReady?: boolean;
  configured: boolean;
  verified: boolean;
  status: 'LIVE' | 'NEEDS CONFIGURATION';
  message?: string;
  host?: string;
  port?: number | string;
  from?: string;
  adminRecipient?: string;
  error?: string;
}

export const SMTPConfigurationBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [smtpStatus, setSmtpStatus] = useState<SmtpStatusResponse | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Gmail API Workspace OAuth state
  const [gmailUser, setGmailUser] = useState<GmailUserProfile | null>(null);
  const [isConnectingGmail, setIsConnectingGmail] = useState(false);
  const [gmailAuthError, setGmailAuthError] = useState<string | null>(null);

  // Test email sender state
  const [testEmailRecipient, setTestEmailRecipient] = useState('pranavdigital221@gmail.com');
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [testEmailFeedback, setTestEmailFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const checkGmailAuthStatus = async () => {
    const token = getCachedGmailAccessToken();
    if (token) {
      try {
        const profile = await getGmailProfile(token);
        setGmailUser(profile);
        setGmailAuthError(null);
      } catch (err: any) {
        console.debug('Cached Gmail token check notice:', err);
        setGmailUser(null);
      }
    } else if (auth?.currentUser) {
      // Check if user is logged in
      try {
        const token = await auth.currentUser.getIdToken();
        if (token) {
          // Token is present
        }
      } catch {
        // Ignore
      }
    }
  };

  const handleConnectGmail = async () => {
    setIsConnectingGmail(true);
    setGmailAuthError(null);
    try {
      const { user, accessToken } = await signInWithGoogleForGmail();
      if (accessToken) {
        const profile = await getGmailProfile(accessToken);
        setGmailUser(profile || {
          emailAddress: user.email || 'Connected Account',
          messagesTotal: 0,
          threadsTotal: 0,
          historyId: '',
        });
        setTestEmailFeedback({
          success: true,
          message: `Successfully authenticated Google Workspace for ${user.email}! Gmail API sending is now active.`,
        });
      }
    } catch (err: any) {
      console.error('Google Workspace connect error:', err);
      setGmailAuthError(err?.message || 'Failed to authenticate with Google.');
    } finally {
      setIsConnectingGmail(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailRecipient || !testEmailRecipient.includes('@')) {
      setTestEmailFeedback({ success: false, message: 'Please enter a valid recipient email.' });
      return;
    }

    setIsSendingTestEmail(true);
    setTestEmailFeedback(null);

    const token = getCachedGmailAccessToken();

    // 1. Try Gmail API if authenticated
    if (token) {
      try {
        const result = await sendEmailViaGmailApi({
          to: testEmailRecipient.trim(),
          subject: '✨ Serenity Salon — Live Email Dispatch Test',
          htmlBody: `
            <div style="font-family: sans-serif; padding: 24px; background: #F7F5F1; border-radius: 12px; color: #1F3A26;">
              <h2 style="color: #1F3A26; margin-top: 0;">✨ Live Email Dispatch Verified</h2>
              <p>This test confirmation email was dispatched securely via <strong>Google Workspace Gmail API</strong> from Serenity Luxury Salon & Spa Concierge.</p>
              <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #E5E0D8; margin: 16px 0;">
                <p style="margin: 0; font-size: 13px;"><strong>Recipient:</strong> ${testEmailRecipient}</p>
                <p style="margin: 4px 0 0; font-size: 13px;"><strong>Sender Engine:</strong> Google Workspace REST API (OAuth2)</p>
                <p style="margin: 4px 0 0; font-size: 13px;"><strong>Status:</strong> Delivered Successfully</p>
              </div>
              <p style="font-size: 12px; color: #6E6E6E;">Serenity Luxury Salon & Spa • Koregaon Park, Pune</p>
            </div>
          `,
          textBody: `Serenity Salon Live Email Dispatch Test. Dispatched successfully to ${testEmailRecipient}.`,
          fromName: 'Serenity Salon Concierge',
        });

        if (result.success) {
          setTestEmailFeedback({
            success: true,
            message: `Test email successfully dispatched to ${testEmailRecipient} via Google Workspace Gmail API! (ID: ${result.messageId || 'OK'})`,
          });
          setIsSendingTestEmail(false);
          return;
        } else {
          console.warn('Gmail API test error:', result.error);
        }
      } catch (gmailErr: any) {
        console.warn('Gmail API send test notice:', gmailErr);
      }
    }

    // 2. Try SMTP Server route
    try {
      const res = await fetch('/api/smtp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient: testEmailRecipient.trim() }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setTestEmailFeedback({
          success: true,
          message: `Test email successfully dispatched to ${testEmailRecipient} via SMTP Server!`,
        });
      } else {
        // If both failed or SMTP needs config
        setTestEmailFeedback({
          success: false,
          message: data.error || (token 
            ? 'Failed to send test email. Please check your Gmail connection.' 
            : 'SMTP server is not yet configured with an App Password. Click "Connect Google Workspace / Gmail API" to send live emails with 1 click!'),
        });
      }
    } catch (err: any) {
      setTestEmailFeedback({
        success: false,
        message: err?.message || 'Could not dispatch test email.',
      });
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  const fetchSmtpStatus = async () => {
    setIsChecking(true);
    try {
      const res = await fetch('/api/smtp/status');
      if (res.ok) {
        const data: SmtpStatusResponse = await res.json();
        setSmtpStatus(data);
      } else {
        setSmtpStatus({
          smtpConfigured: false,
          smtpConnectionVerified: false,
          emailDispatchReady: false,
          configured: false,
          verified: false,
          status: 'NEEDS CONFIGURATION',
          message: 'Unable to reach SMTP status endpoint.',
        });
      }
    } catch {
      setSmtpStatus({
        smtpConfigured: false,
        smtpConnectionVerified: false,
        emailDispatchReady: false,
        configured: false,
        verified: false,
        status: 'NEEDS CONFIGURATION',
        message: 'Could not connect to backend server.',
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    fetchSmtpStatus();
    checkGmailAuthStatus();
  }, []);

  const envVariables = [
    {
      key: 'SMTP_HOST',
      example: 'smtp.gmail.com',
      desc: 'Hostname for outbound SMTP mail server',
      required: true,
    },
    {
      key: 'SMTP_PORT',
      example: '587 (TLS) or 465 (SSL)',
      desc: 'Connection port for secure mail delivery',
      required: true,
    },
    {
      key: 'SMTP_USER',
      example: 'pranavdigital221@gmail.com',
      desc: 'Authenticated sender email username',
      required: true,
    },
    {
      key: 'SMTP_PASS',
      example: '16-character Google App Password',
      desc: 'Google App Password or SMTP token (never exposed to client)',
      required: true,
    },
    {
      key: 'SMTP_FROM',
      example: '"Serenity Salon" <pranavdigital221@gmail.com>',
      desc: 'Display name & sender header on customer receipts (defaults to Serenity Salon <SMTP_USER>)',
      required: false,
    },
  ];

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const sampleEnvConfig = `# SMTP Configuration for Live Customer Emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=pranavdigital221@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM="Serenity Salon" <pranavdigital221@gmail.com>`;

  const isConfigured = Boolean(smtpStatus?.smtpConfigured ?? smtpStatus?.configured);
  const isVerified = Boolean(smtpStatus?.smtpConnectionVerified ?? smtpStatus?.verified);
  const isSmtpLive = smtpStatus?.status === 'LIVE' && isVerified;
  const isGmailApiLive = Boolean(gmailUser?.emailAddress);
  const isOverallEmailReady = isSmtpLive || isGmailApiLive;

  return (
    <div className={`mb-6 rounded-2xl border shadow-xs overflow-hidden transition-all ${
      isOverallEmailReady
        ? 'bg-gradient-to-r from-emerald-500/10 via-[#F7FAF8] to-emerald-500/5 border-emerald-300'
        : 'bg-gradient-to-r from-amber-500/10 via-[#FDF1E4] to-amber-500/5 border-amber-300/80'
    }`}>
      {/* Main Banner Bar */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-3.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border ${
            isOverallEmailReady
              ? 'bg-emerald-500/20 text-emerald-900 border-emerald-400/40'
              : 'bg-amber-500/20 text-amber-900 border-amber-400/40'
          }`}>
            <Mail className={`w-5 h-5 ${isOverallEmailReady ? 'text-emerald-700' : 'text-amber-700'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
                isOverallEmailReady
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isOverallEmailReady ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'}`} />
                Email Engine: {isOverallEmailReady ? (isGmailApiLive ? 'GMAIL API READY' : 'SMTP LIVE') : 'READY FOR ACTIVATION'}
              </span>
              <span className={`text-xs font-medium ${isOverallEmailReady ? 'text-emerald-800' : 'text-amber-800/80'}`}>
                {isGmailApiLive
                  ? `Google Workspace OAuth Active (${gmailUser?.emailAddress})`
                  : isSmtpLive
                  ? 'Active Verified SMTP Delivery via smtp.gmail.com'
                  : 'Connect Google Workspace or provide SMTP App Password'}
              </span>
            </div>
            <h3 className="font-bold text-sm sm:text-base text-[#1F3A26] mt-1 flex items-center gap-2">
              {isOverallEmailReady
                ? 'Outbound Email Confirmation System Active'
                : 'Customer Booking Email System Ready for Dispatch'}
            </h3>
            <p className="text-xs text-gray-600 mt-0.5 max-w-3xl leading-relaxed">
              {isGmailApiLive
                ? `Customer receipts & notifications are dispatched directly via Google Workspace Gmail REST API with real OAuth authorization.`
                : isSmtpLive
                ? `Booking confirmation receipts and admin notifications are actively dispatched through your authenticated Gmail SMTP server.`
                : `You can send customer confirmation emails via Google Workspace Gmail API (1-click connect below) or standard SMTP with an App Password.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap self-end sm:self-center">
          {!isGmailApiLive && (
            <button
              type="button"
              onClick={handleConnectGmail}
              disabled={isConnectingGmail}
              className="px-3.5 py-2 rounded-xl bg-[#EA4335] hover:bg-[#D93025] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
              title="Connect your Google Account to activate instant Gmail API email dispatch"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isConnectingGmail ? 'Connecting...' : 'Connect Gmail API'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={fetchSmtpStatus}
            disabled={isChecking}
            className="px-3 py-2 rounded-xl bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold border border-gray-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
            title="Re-verify SMTP connection with server"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#C9A66B] ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Checking...' : 'Check Status'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              isOverallEmailReady
                ? 'bg-white hover:bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-white hover:bg-amber-50 text-amber-900 border-amber-300'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>{isExpanded ? 'Hide Details' : 'Email Test & Setup'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Real-time Diagnostics Bar */}
      <div className="px-4 sm:px-5 py-2.5 bg-white/60 border-t border-gray-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Gmail API Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500 font-medium">Gmail API (OAuth):</span>
            {isGmailApiLive ? (
              <span className="font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE ({gmailUser?.emailAddress})
              </span>
            ) : (
              <span className="font-bold text-gray-600 flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                AVAILABLE
              </span>
            )}
          </div>

          {/* SMTP Configured Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500 font-medium">SMTP Configured:</span>
            {isConfigured ? (
              <span className="font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> YES
              </span>
            ) : (
              <span className="font-bold text-amber-700 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5" /> OPTIONAL
              </span>
            )}
          </div>

          {/* Overall Dispatch Readiness */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500 font-medium">Email Dispatch:</span>
            {isOverallEmailReady ? (
              <span className="font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> READY ({isGmailApiLive ? 'Gmail API' : 'SMTP'})
              </span>
            ) : (
              <span className="font-bold text-amber-700 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                READY TO CONNECT
              </span>
            )}
          </div>
        </div>

        {gmailAuthError && (
          <div className="text-[11px] text-red-900 bg-red-100/70 border border-red-200 px-2.5 py-1 rounded-lg truncate max-w-full">
            <span className="font-semibold">Notice:</span> {gmailAuthError}
          </div>
        )}
      </div>

      {/* Expanded Instruction & Test Section */}
      {isExpanded && (
        <div className="px-4 sm:px-6 pb-5 pt-4 border-t border-gray-200 bg-white/80 animate-in fade-in duration-200 space-y-5">
          
          {/* Test Email Dispatcher Box */}
          <div className="p-4 rounded-xl bg-[#F7F5F1] border border-gray-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F3A26] flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-[#C9A66B]" />
                  Interactive Test Email Dispatcher
                </h4>
                <p className="text-[11px] text-gray-600">
                  Send a real test confirmation email to verify email reception in your inbox.
                </p>
              </div>
              <div className="text-xs font-bold text-[#1F3A26] bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                Active Method: <span className="text-emerald-700">{isGmailApiLive ? 'Google Workspace Gmail API' : 'SMTP Server'}</span>
              </div>
            </div>

            <form onSubmit={handleSendTestEmail} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="email"
                value={testEmailRecipient}
                onChange={(e) => setTestEmailRecipient(e.target.value)}
                placeholder="Enter recipient email (e.g. pranavdigital221@gmail.com)"
                className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-gray-300 text-xs text-[#1F3A26] focus:outline-none focus:ring-2 focus:ring-[#1F3A26]"
                required
              />
              <button
                type="submit"
                disabled={isSendingTestEmail}
                className="px-4 py-2 rounded-xl bg-[#1F3A26] hover:bg-[#4F7358] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
              >
                <Send className={`w-3.5 h-3.5 ${isSendingTestEmail ? 'animate-pulse' : ''}`} />
                <span>{isSendingTestEmail ? 'Sending Test Email...' : 'Send Live Test Email'}</span>
              </button>
            </form>

            {testEmailFeedback && (
              <div className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                testEmailFeedback.success
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border border-amber-200 text-amber-800'
              }`}>
                {testEmailFeedback.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                )}
                <span>{testEmailFeedback.message}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Checklist Table */}
            <div className="lg:col-span-7 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F3A26] flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#C9A66B]" />
                SMTP Environment Variables (For Background Server Emailing)
              </h4>
              <div className="divide-y divide-gray-200/70 rounded-xl border border-gray-200 bg-white shadow-2xs overflow-hidden text-xs">
                {envVariables.map((v) => (
                  <div key={v.key} className="p-3 flex items-start justify-between gap-2 hover:bg-amber-50/30 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#1F3A26] bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                          {v.key}
                        </span>
                        {v.required ? (
                          <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                            Required
                          </span>
                        ) : (
                          <span className="text-[9px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded">
                            Optional
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-[11px] mt-1">{v.desc}</p>
                      <span className="text-gray-400 font-mono text-[10px] block mt-0.5">Example: {v.example}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(`${v.key}=`, v.key)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-[#1F3A26] hover:bg-gray-100 transition-colors shrink-0 cursor-pointer"
                      title={`Copy ${v.key}`}
                    >
                      {copiedKey === v.key ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Copy Snippet & Tip */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F3A26] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Quick .env Template
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleCopy(sampleEnvConfig, 'all')}
                    className="text-[11px] font-bold text-[#1F3A26] hover:text-[#C9A66B] flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-gray-200 shadow-2xs"
                  >
                    {copiedKey === 'all' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy All</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 bg-[#1F3A26] text-[#F7F5F1] rounded-xl text-[11px] font-mono leading-relaxed overflow-x-auto border border-[#1F3A26]/20 shadow-inner">
                  {sampleEnvConfig}
                </pre>
              </div>

              <div className="p-3 rounded-xl bg-amber-100/60 border border-amber-200/80 text-[11px] text-amber-950 space-y-1">
                <p className="font-semibold flex items-center gap-1 text-amber-900">
                  <AlertTriangle className="w-3 h-3 text-amber-700 shrink-0" />
                  Dual-Channel Email Reliability:
                </p>
                <p className="text-amber-900/90 leading-normal">
                  You can send emails directly via <strong>Google Workspace Gmail API</strong> using the red "Connect Gmail API" button, or configure <strong>SMTP_PASS</strong> using a 16-character Google App Password for unattended background server dispatches.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
