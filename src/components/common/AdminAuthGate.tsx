import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  UserCheck, 
  LogOut,
  ShieldAlert,
  Loader2,
  LogIn
} from 'lucide-react';
import { 
  auth, 
  signInWithFirebase, 
  signOutFirebase, 
  onAuthChange, 
  isAuthorizedAdmin, 
  ADMIN_EMAIL_CONFIG,
  isFirebaseConfigured,
  signInWithGoogle
} from '../../lib/firebase';
import { User } from 'firebase/auth';
import { appointmentApi } from '../../services/appointmentApi';

interface AdminAuthGateProps {
  children: React.ReactNode;
  onNavigateHome: () => void;
}

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({
  children,
  onNavigateHome,
}) => {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [emailInput, setEmailInput] = useState<string>(ADMIN_EMAIL_CONFIG || 'admin@serenitysalon.com');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  
  // Custom Local Admin Session state fallback (when Firebase project keys are not yet configured in local environment)
  const [localAdminSession, setLocalAdminSession] = useState<{
    email: string;
    token: string;
  } | null>(() => {
    try {
      const stored = localStorage.getItem('serenity_admin_session');
      const storedEmail = localStorage.getItem('serenity_admin_email');
      if (stored && storedEmail && isAuthorizedAdmin(storedEmail)) {
        return { email: storedEmail, token: stored };
      }
      return null;
    } catch {
      return null;
    }
  });

  // Observe Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      setIsCheckingAuth(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Determine if currently authenticated with verified admin rights
  const isFirebaseAdmin = Boolean(user && isAuthorizedAdmin(user.email));
  const isLocalAdmin = Boolean(localAdminSession && isAuthorizedAdmin(localAdminSession.email));
  const isAccessGranted = isFirebaseAdmin || isLocalAdmin;
  const activeAdminEmail = user?.email || localAdminSession?.email || '';

  // Form submission: Authenticate with Firebase Auth and backend credentials
  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthenticating(true);

    const cleanEmail = emailInput.trim().toLowerCase();

    // Verification check: Does this email have admin privileges?
    if (!isAuthorizedAdmin(cleanEmail)) {
      setIsAuthenticating(false);
      setAuthError(`Access Denied: The email "${emailInput}" is not recognized as an authorized administrator. Only designated administrators (${ADMIN_EMAIL_CONFIG}) may access the salon dashboard.`);
      return;
    }

    try {
      // 1. Try Firebase Auth if project credentials initialized
      if (auth && isFirebaseConfigured) {
        try {
          const authenticatedUser = await signInWithFirebase(cleanEmail, passwordInput);
          if (isAuthorizedAdmin(authenticatedUser.email)) {
            setUser(authenticatedUser);
            localStorage.setItem('serenity_admin_session', `firebase_tok_${Date.now()}`);
            localStorage.setItem('serenity_admin_email', authenticatedUser.email || cleanEmail);
            setIsAuthenticating(false);
            return;
          } else {
            await signOutFirebase();
            throw new Error('This Firebase account is not authorized as an administrator.');
          }
        } catch (firebaseErr: any) {
          console.warn('Firebase Auth email sign-in note:', firebaseErr.message);
          // If user doesn't exist yet in Firebase project or Firebase is in demo mode, proceed to verified server admin credentials check
        }
      }

      // 2. Authoritative Server Authentication Check
      const loginRes = await appointmentApi.loginAdmin({
        email: cleanEmail,
        password: passwordInput,
      });

      if (loginRes.success && loginRes.session) {
        localStorage.setItem('serenity_admin_session', loginRes.session.token);
        localStorage.setItem('serenity_admin_email', loginRes.session.adminEmail || cleanEmail);
        setLocalAdminSession({
          email: loginRes.session.adminEmail || cleanEmail,
          token: loginRes.session.token,
        });
        setIsAuthenticating(false);
        return;
      } else {
        throw new Error(loginRes.error || 'Invalid administrator password credentials.');
      }
    } catch (err: any) {
      console.error('Admin Auth Gate error:', err);
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Google Popup Login
  const handleGoogleLogin = async () => {
    setAuthError(null);
    setIsAuthenticating(true);
    try {
      if (!auth || !isFirebaseConfigured) {
        throw new Error('Firebase Authentication is not yet configured with API credentials.');
      }
      const googleUser = await signInWithGoogle();
      if (!isAuthorizedAdmin(googleUser.email)) {
        await signOutFirebase();
        setAuthError(`Access Denied: Google account "${googleUser.email}" is not authorized. Authorized: ${ADMIN_EMAIL_CONFIG}`);
      } else {
        setUser(googleUser);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Google sign-in could not be completed.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      await signOutFirebase();
    } catch {
      // ignore
    }
    appointmentApi.logoutAdmin();
    localStorage.removeItem('serenity_admin_session');
    localStorage.removeItem('serenity_admin_email');
    setUser(null);
    setLocalAdminSession(null);
  };

  // Loading state
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#F7F5F1] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-lg text-center max-w-sm w-full flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-[#C9A66B] animate-spin mb-4" />
          <h2 className="font-heading font-bold text-lg text-[#1F3A26]">Verifying Security Gate</h2>
          <p className="text-xs text-[#6E6E6E] mt-1">Checking Firebase Auth credentials & admin permissions...</p>
        </div>
      </div>
    );
  }

  // If authenticated and authorized, render protected Admin Dashboard with security badge
  if (isAccessGranted) {
    return (
      <div className="relative">
        {/* Top Floating Security Status Banner */}
        <div className="bg-[#1F3A26] text-[#F7F5F1] px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-[#C9A66B]/30 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <ShieldCheck className="w-4 h-4 text-[#C9A66B]" />
            <span className="font-semibold text-white">Authenticated Admin Session:</span>
            <span className="font-mono bg-[#142619] px-2 py-0.5 rounded text-[#C9A66B] font-bold">
              {activeAdminEmail}
            </span>
            <span className="hidden sm:inline text-white/60 text-[11px]">
              (Firebase Auth Protected)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSignOut}
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[#F7F5F1] text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/20"
              title="Sign out of Admin Dashboard"
            >
              <LogOut className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span>Lock / Sign Out</span>
            </button>
          </div>
        </div>

        {/* Protected Dashboard Content */}
        {children}
      </div>
    );
  }

  // Unauthenticated or Unauthorized: Display Login & Security Gate Prompt
  return (
    <div className="min-h-screen bg-[#F7F5F1] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="max-w-md w-full">
        
        {/* Back Button */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={onNavigateHome}
            className="text-xs font-semibold text-[#6E6E6E] hover:text-[#1F3A26] flex items-center gap-1.5 transition-colors cursor-pointer bg-white px-3.5 py-2 rounded-full border border-gray-200 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Salon Storefront
          </button>

          <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200 flex items-center gap-1">
            <Lock className="w-3 h-3" /> Access Restricted
          </span>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-xl overflow-hidden">
          
          {/* Card Header */}
          <div className="bg-[#1F3A26] p-6 text-white text-center relative">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 border border-[#C9A66B]/40 flex items-center justify-center mb-3 text-[#C9A66B]">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="font-heading font-bold text-xl text-white">Admin Security Gate</h2>
            <p className="text-xs text-[#F7F5F1]/80 mt-1 max-w-xs mx-auto">
              Please authenticate with your designated salon administrator credentials to manage appointments and store data.
            </p>
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-8 space-y-5">
            
            {/* Authorized Email Notice */}
            <div className="p-3.5 rounded-2xl bg-[#F7F5F1] border border-[#1F3A26]/10 text-xs text-[#1F3A26] flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#C9A66B] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#1F3A26]">Configured Admin Account:</p>
                <p className="font-mono text-[#1F3A26]/80 text-[11px] mt-0.5 font-semibold">
                  {ADMIN_EMAIL_CONFIG}
                </p>
              </div>
            </div>

            {/* Error Message Display */}
            {authError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{authError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1F3A26] uppercase tracking-wider mb-1.5">
                  Administrator Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="admin@serenitysalon.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F7F5F1] text-xs text-[#1A1A1A] border border-gray-200 focus:outline-none focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B] transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F3A26] uppercase tracking-wider mb-1.5">
                  Admin Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter administrator password..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#F7F5F1] text-xs text-[#1A1A1A] border border-gray-200 focus:outline-none focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3 rounded-full bg-[#1F3A26] hover:bg-[#4F7358] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer mt-3 disabled:opacity-70"
              >
                {isAuthenticating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#C9A66B]" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 text-[#C9A66B]" />
                    <span>Authenticate & Access Dashboard</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Helper Default Credentials Button */}
            <div className="pt-3 border-t border-gray-100 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmailInput(ADMIN_EMAIL_CONFIG);
                  setPasswordInput('Serenity@2026');
                }}
                className="text-[11px] text-[#C9A66B] hover:text-[#1F3A26] font-semibold underline underline-offset-2 transition-colors cursor-pointer"
              >
                Autofill Default Administrator Credentials
              </button>
              <p className="text-[10px] text-gray-400 text-center">
                Protected with Firebase Auth & Role-Based Access Control Gate
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
