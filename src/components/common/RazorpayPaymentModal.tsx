import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Appointment } from '../../types';
import { formatINR } from '../../utils/currency';
import { appointmentApi } from '../../services/appointmentApi';

interface RazorpayPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment;
  onPaymentSuccess: (updatedAppointment: Appointment) => void;
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const RazorpayPaymentModal: React.FC<RazorpayPaymentModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onPaymentSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [razorpayKeyId, setRazorpayKeyId] = useState<string>(() => {
    return (
      (window as any).__SERENITY_RAZORPAY_KEY ||
      (import.meta as any).env?.VITE_RAZORPAY_KEY_ID ||
      ''
    );
  });
  const [isGatewayConfigured, setIsGatewayConfigured] = useState<boolean>(() => {
    const k = (window as any).__SERENITY_RAZORPAY_KEY || (import.meta as any).env?.VITE_RAZORPAY_KEY_ID;
    return Boolean(k && !k.includes('placeholder'));
  });
  const [isTestMode, setIsTestMode] = useState<boolean>(() => {
    const k = (window as any).__SERENITY_RAZORPAY_KEY || (import.meta as any).env?.VITE_RAZORPAY_KEY_ID;
    return Boolean(k && k.startsWith('rzp_test_'));
  });

  const [paymentSuccessData, setPaymentSuccessData] = useState<{
    paymentId: string;
    orderId: string;
    amount: number;
  } | null>(null);

  // Fetch gateway configuration on modal mount
  useEffect(() => {
    if (isOpen) {
      loadRazorpayScript();
      appointmentApi.getPaymentConfig().then((cfg) => {
        const live = Boolean(cfg.isConfigured && cfg.keyId);
        setRazorpayKeyId(cfg.keyId || '');
        setIsGatewayConfigured(live);
        setIsTestMode(Boolean(cfg.isTestMode));
      });
    }
  }, [isOpen]);

  if (!isOpen || !appointment) return null;

  // Calculate pricing breakdown
  const servicePrice = appointment.payment?.amount || appointment.servicePrice || 1000;
  const advanceAmount = appointment.payment?.advanceAmount || Math.round(servicePrice * 0.40);
  const remainingAmount = Math.max(0, servicePrice - advanceAmount);

  const handleConfirmAndPay = async () => {
    setPaymentError(null);
    setIsProcessing(true);

    try {
      if (!isGatewayConfigured) {
        throw new Error(
          'Razorpay online payment is temporarily unavailable. You may complete your payment at the salon upon arrival.'
        );
      }

      // Ensure script loaded
      const scriptReady = await loadRazorpayScript();
      if (!scriptReady || !(window as any).Razorpay) {
        throw new Error('Could not load Razorpay payment SDK. Please check your network connection.');
      }

      // 1. Create order on server side
      const orderRes = await appointmentApi.createRazorpayOrder({
        appointmentId: appointment.id,
        amount: advanceAmount,
        currency: 'INR',
        serviceName: appointment.serviceName,
        customerName: appointment.fullName,
        customerEmail: appointment.email,
        customerPhone: appointment.phone,
      });

      if (!orderRes.success || !orderRes.orderId) {
        setPaymentError(orderRes.error || 'Failed to initiate secure payment order with gateway.');
        setIsProcessing(false);
        return;
      }

      const activeKey = razorpayKeyId || (orderRes as any).keyId || (import.meta as any).env?.VITE_RAZORPAY_KEY_ID;

      // Real Razorpay Standard Checkout - shows all enabled methods (UPI, Cards, Netbanking, Wallets)
      const options = {
        key: activeKey,
        amount: advanceAmount * 100, // paise
        currency: 'INR',
        name: 'Serenity Salon & Spa',
        description: `Advance deposit (40%) for ${appointment.serviceName}`,
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=128&q=80',
        order_id: orderRes.orderId,
        prefill: {
          name: appointment.fullName,
          email: appointment.email || 'guest@serenitysalon.in',
          contact: appointment.phone,
        },
        theme: {
          color: '#1F3A26',
        },
        handler: async (response: any) => {
          await verifyAndComplete(
            orderRes.orderId,
            response.razorpay_payment_id,
            response.razorpay_signature
          );
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setPaymentError('Payment was cancelled. You may retry or pay upon arrival at the salon.');
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (failRes: any) => {
        setPaymentError(failRes.error?.description || 'Payment was unsuccessful. Please try again.');
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err: any) {
      console.warn('[Appointment payment notice]:', err?.message || err);
      setPaymentError(err?.message || 'Payment processing failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const verifyAndComplete = async (
    orderId: string,
    paymentId: string,
    signature: string
  ) => {
    try {
      const verifyRes = await appointmentApi.verifyRazorpayPayment({
        appointmentId: appointment.id,
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
        advanceAmount,
        totalServicePrice: servicePrice,
        method: 'ONLINE',
      });

      if (verifyRes.success && verifyRes.data) {
        setPaymentSuccessData({
          paymentId,
          orderId,
          amount: advanceAmount,
        });
        setIsProcessing(false);
        onPaymentSuccess(verifyRes.data);
      } else {
        throw new Error(verifyRes.error || 'Payment signature verification failed.');
      }
    } catch (verErr: any) {
      setPaymentError(verErr.message || 'Could not verify payment.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={isProcessing ? undefined : onClose}
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-[24px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#1F3A26]/10 z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Close Button */}
        {!isProcessing && (
          <button
            onClick={onClose}
            aria-label="Close payment modal"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#F7F5F1] text-gray-700 flex items-center justify-center hover:bg-[#1F3A26] hover:text-white transition-colors cursor-pointer z-10"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {paymentSuccessData ? (
          /* Payment Success State */
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-[#1F3A26] text-[#C9A66B] mx-auto flex items-center justify-center mb-4 shadow-lg animate-in zoom-in-50 duration-300">
              <CheckCircle2 className="w-9 h-9 text-[#C9A66B]" />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A66B] block mb-1">
              Payment Verified &amp; Confirmed
            </span>

            <h3 className="font-heading font-bold text-2xl text-[#1F3A26] mb-2">
              Advance Deposit Paid!
            </h3>

            <p className="text-xs text-gray-600 mb-6 max-w-sm mx-auto">
              Your advance payment of <span className="font-bold text-[#1F3A26]">{formatINR(paymentSuccessData.amount)}</span> was successful via Razorpay. Your appointment slot is now officially marked as <strong>Confirmed</strong>.
            </p>

            {/* Payment receipt card */}
            <div className="bg-[#F7F5F1] rounded-2xl p-4 border border-[#1F3A26]/10 text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between items-center border-b border-gray-200/80 pb-2">
                <span className="text-gray-500">Service Reserved</span>
                <span className="font-bold text-[#1F3A26]">{appointment.serviceName}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200/80 pb-2">
                <span className="text-gray-500">Advance Paid</span>
                <span className="font-bold text-emerald-700">{formatINR(paymentSuccessData.amount)} (Paid)</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200/80 pb-2">
                <span className="text-gray-500">Balance at Salon</span>
                <span className="font-bold text-amber-800">{formatINR(remainingAmount)}</span>
              </div>
              <div className="flex justify-between items-center pt-1 text-[11px] text-gray-500 font-mono">
                <span>Razorpay Txn ID</span>
                <span className="font-bold text-gray-700">{paymentSuccessData.paymentId}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-full bg-[#1F3A26] hover:bg-[#4F7358] text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
            >
              Done &amp; View Appointment
            </button>
          </div>
        ) : (
          /* Payment Breakdown & Selection Form */
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-5 pr-8">
              <div className="w-11 h-11 rounded-2xl bg-[#1F3A26] text-[#C9A66B] flex items-center justify-center shrink-0 shadow-xs">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#C9A66B] block">
                  Secure payment powered by Razorpay
                </span>
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#1F3A26] leading-tight">
                  Pay Advance &amp; Confirm
                </h2>
              </div>
            </div>

            {/* Test Mode Banner (when using sandbox test keys) */}
            {isTestMode && (
              <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-300 text-amber-950 text-xs mb-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>RAZORPAY TEST MODE</span>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-200/80 text-amber-900 rounded">
                    Standard Checkout
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Connected to Razorpay Test Mode. Official Razorpay Standard Checkout will open. You can test UPI (e.g. success@razorpay), Cards, or Netbanking. No real money will be charged.
                </p>
                <div className="text-[10px] text-amber-950 font-mono bg-amber-100/70 p-2 rounded-lg space-y-1">
                  <div>• <span className="font-semibold">Test UPI:</span> Enter VPA <span className="font-bold underline">success@razorpay</span> (or <span className="underline">failure@razorpay</span>).</div>
                  <div>• <span className="font-semibold">Netbanking:</span> Razorpay presents official test bank page.</div>
                  <div>• <span className="font-semibold">Cards:</span> Standard Razorpay test cards are supported.</div>
                </div>
              </div>
            )}

            {/* Clear, Transparent Price Breakdown (Mandatory before charging) */}
            <div className="bg-[#F7F5F1] rounded-2xl p-4 border border-[#1F3A26]/10 mb-4">
              <span className="text-[11px] font-bold text-[#1F3A26] uppercase tracking-wider block mb-2">
                Transparent Pricing Breakdown
              </span>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Estimated Service Price ({appointment.serviceName}):</span>
                  <span className="font-semibold text-gray-800">{formatINR(servicePrice)}</span>
                </div>

                <div className="flex justify-between items-center text-emerald-800 font-medium bg-emerald-50/70 px-2.5 py-1.5 rounded-lg border border-emerald-200/60">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A66B]" />
                    Advance Deposit (40% Payable Now):
                  </span>
                  <span className="font-bold text-sm">{formatINR(advanceAmount)}</span>
                </div>

                <div className="flex justify-between items-center text-gray-600 pt-1 border-t border-gray-200/70 text-[11px]">
                  <span>Remaining Balance (60% Payable at Salon after service):</span>
                  <span className="font-semibold text-amber-900">{formatINR(remainingAmount)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method - Official Razorpay Standard Checkout */}
            <div className="mb-4">
              <div className="p-4 rounded-2xl bg-[#EBF3ED]/40 border-2 border-[#1F3A26] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#1F3A26]" />
                    <span className="font-bold text-xs text-[#1F3A26]">Razorpay Standard Checkout</span>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded-md">
                    Official Gateway
                  </span>
                </div>

                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Clicking below opens the official Razorpay Checkout window. Razorpay securely controls and displays all payment methods enabled for your account:
                </p>

                <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-gray-700 font-medium">
                  <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg shadow-2xs">
                    Debit &amp; Credit Cards
                  </span>
                  <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg shadow-2xs">
                    NetBanking (All Major Banks)
                  </span>
                  <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg shadow-2xs">
                    Wallets
                  </span>
                  <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg shadow-2xs">
                    UPI Intent (Supported UPI Apps)
                  </span>
                </div>

                <p className="text-[10px] text-gray-500 pt-1 border-t border-emerald-900/10 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Secure payment powered by Razorpay. Zero credential storage on salon servers.</span>
                </p>
              </div>
            </div>

            {/* Gateway Configuration Notice if not set */}
            {!isGatewayConfigured && (
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs mb-5 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Online Advance Payment Gateway Notice</span>
                </div>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Live Razorpay keys are not configured in this environment. Your appointment is reserved in our database and you can pay the full amount ({formatINR(servicePrice)}) upon arrival at the salon.
                </p>
              </div>
            )}

            {/* Error Message */}
            {paymentError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                <span>{paymentError}</span>
              </div>
            )}

            {/* Security & Confirmation statement */}
            <div className="flex items-center justify-between text-[11px] text-gray-500 mb-5 px-1">
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>128-bit SSL Razorpay Protection</span>
              </div>
              <span className="text-gray-400">
                {isGatewayConfigured ? 'Live Gateway Connected' : 'In-Salon Payment Available'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="w-1/3 py-3 rounded-full bg-[#F7F5F1] hover:bg-gray-200 text-[#1F3A26] text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                {isGatewayConfigured ? 'Cancel' : 'Pay at Salon'}
              </button>

              {isGatewayConfigured ? (
                <button
                  type="button"
                  onClick={handleConfirmAndPay}
                  disabled={isProcessing}
                  className="w-2/3 py-3 rounded-full bg-[#1F3A26] hover:bg-[#4F7358] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#C9A66B]" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-[#C9A66B]" />
                      <span>Pay {formatINR(advanceAmount)} &amp; Confirm</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-2/3 py-3 rounded-full bg-[#1F3A26] hover:bg-[#4F7358] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A66B]" />
                  <span>Done • Pay at Salon</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
