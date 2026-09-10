import React, { useEffect } from 'react';
import { PageView } from '../../types';
import { RefreshCw, Calendar, ShoppingBag, CheckCircle, AlertTriangle, ArrowLeft, Mail, Phone, MapPin, CreditCard, ShieldCheck } from 'lucide-react';
import { updatePageSEO } from '../../utils/seo';

interface CancellationRefundPolicyPageProps {
  onNavigate: (page: PageView) => void;
}

export const CancellationRefundPolicyPage: React.FC<CancellationRefundPolicyPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    updatePageSEO(
      'Cancellation & Refund Policy | Serenity Salon — Beauty & Services',
      'Understand Serenity Salon cancellation rules and refund processing timelines for salon appointments (40% advance deposit) and retail physical product orders via Razorpay.',
      '/cancellation-refund-policy'
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-[#F7F5F1] min-h-screen pb-16">
      {/* Top Breadcrumb & Hero Header */}
      <section className="bg-[#1F3A26] text-white py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-[#C9A66B] mb-3">
            <button
              onClick={() => onNavigate('home')}
              className="hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Home
            </button>
            <span>/</span>
            <span className="text-white/70">Policies</span>
            <span>/</span>
            <span className="text-white font-medium">Cancellation &amp; Refund</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A66B] text-xs font-semibold uppercase tracking-wider mb-3">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Fair &amp; Transparent Policy</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold leading-tight mb-3">
            Cancellation &amp; Refund Policy
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed">
            Clear guidelines for salon appointment bookings and physical product purchases.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 space-y-8">
        
        {/* PART 1: SALON APPOINTMENTS */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#1F3A26]/10 p-6 sm:p-10 space-y-6 text-[#1A1A1A]">
          <div className="flex items-center gap-3 border-b border-[#1F3A26]/10 pb-4">
            <div className="w-10 h-10 rounded-full bg-[#1F3A26] text-[#C9A66B] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#C9A66B]">Part I</span>
              <h2 className="font-heading text-2xl font-bold text-[#1F3A26]">
                Salon Appointment Bookings
              </h2>
            </div>
          </div>

          <p className="text-sm text-[#4A4A4A] leading-relaxed">
            At Serenity Salon, our specialists and private treatment suites are prepared exclusively for your scheduled reservation. To ensure fairness to both our clients and our styling team, our appointment cancellation and advance payment policies operate as follows:
          </p>

          {/* Advance Deposit & Remaining Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm">
                <CreditCard className="w-4 h-4 text-emerald-700" />
                40% Online Advance Deposit
              </div>
              <p className="text-xs text-emerald-900/90 leading-relaxed">
                When scheduling online, a <strong>40% advance deposit</strong> of the estimated service total is collected via Razorpay to confirm your appointment time and lock your specialist station.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#1F3A26]/10 bg-[#FBF9F5] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-[#1F3A26] text-sm">
                <CheckCircle className="w-4 h-4 text-[#C9A66B]" />
                Remaining 60% Payable at Salon
              </div>
              <p className="text-xs text-[#4A4A4A] leading-relaxed">
                The balance <strong>60% of the service fee</strong> is payable in person at our salon counter after completion of your service via Cash, UPI, Card, or Net Banking.
              </p>
            </div>
          </div>

          {/* Cancellation Rules & Refundability Matrix */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-base text-[#1F3A26]">
              Appointment Cancellation &amp; Rescheduling Timeline
            </h3>

            <div className="space-y-3 text-sm text-[#4A4A4A]">
              <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#1F3A26]/10 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1F3A26] font-semibold">
                    Cancellation 12+ Hours in Advance — 100% Full Refund
                  </strong>
                  <p className="text-xs text-[#4A4A4A] mt-1 leading-relaxed">
                    If you cancel or reschedule your appointment at least <strong>12 hours</strong> prior to your scheduled time slot, your 40% advance deposit is <strong>100% refundable</strong>. The full deposit will be refunded directly to your original payment method via Razorpay.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#1F3A26]/10 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1F3A26] font-semibold">
                    Cancellation within 12 Hours or No-Show — Deposit Retained
                  </strong>
                  <p className="text-xs text-[#4A4A4A] mt-1 leading-relaxed">
                    If an appointment is cancelled less than 12 hours prior to the slot, or in the event of a client <strong>No-Show</strong>, the 40% advance deposit is <strong>non-refundable</strong>. This covers the reserved specialist time and reserved styling station costs that could not be reallocated.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#1F3A26]/10 flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-[#1F3A26] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1F3A26] font-semibold">
                    Rescheduling an Appointment
                  </strong>
                  <p className="text-xs text-[#4A4A4A] mt-1 leading-relaxed">
                    You may reschedule your appointment to any available future date without any extra charge by calling our reception at{' '}
                    <a href="tel:+918108765851" className="text-[#1F3A26] font-medium underline">+91 8108765851</a>{' '}
                    at least 12 hours prior to your booked slot. Your 40% advance deposit will seamlessly transfer to the rescheduled appointment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PART 2: PRODUCT ORDERS */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#1F3A26]/10 p-6 sm:p-10 space-y-6 text-[#1A1A1A]">
          <div className="flex items-center gap-3 border-b border-[#1F3A26]/10 pb-4">
            <div className="w-10 h-10 rounded-full bg-[#1F3A26] text-[#C9A66B] flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#C9A66B]">Part II</span>
              <h2 className="font-heading text-2xl font-bold text-[#1F3A26]">
                Retail Product Orders (Online Boutique)
              </h2>
            </div>
          </div>

          <p className="text-sm text-[#4A4A4A] leading-relaxed">
            We take utmost care in handcrafting, inspecting, and packaging all botanical skincare, haircare, and beauty tools before dispatch. Here is how order cancellations, returns, and refunds are handled:
          </p>

          <div className="space-y-4 text-sm text-[#4A4A4A]">
            {/* Order Cancellation */}
            <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#1F3A26]/5 space-y-1.5">
              <strong className="text-[#1F3A26] block font-semibold">1. Order Cancellation (Pre-Dispatch)</strong>
              <p className="leading-relaxed">
                You may cancel a product order within <strong>24 hours</strong> of placing it, or before our warehouse has generated the courier shipping label and dispatched the parcel (whichever occurs first). Upon cancellation approval, a 100% refund is initiated immediately to your original payment method.
              </p>
            </div>

            {/* Return / Replacement Window */}
            <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#1F3A26]/5 space-y-1.5">
              <strong className="text-[#1F3A26] block font-semibold">2. 7-Day Return &amp; Replacement Eligibility</strong>
              <p className="leading-relaxed">
                Due to hygiene and organic cosmetic safety standards, beauty and cosmetic items can only be returned if they meet one of the following criteria within <strong>7 calendar days</strong> of parcel delivery:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-[#4A4A4A] pt-1">
                <li>The package arrived physically damaged or leaking during transit.</li>
                <li>The product is defective or malfunctioning (for styling tools/appliances).</li>
                <li>The incorrect variant or wrong product SKU was delivered.</li>
              </ul>
              <p className="text-xs text-[#6E6E6E] pt-1">
                Note: Products must be returned in their original packaging, unopened, with tamper-proof seals and invoices intact.
              </p>
            </div>

            {/* Refund Process & Timeline */}
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Refund Processing Timeline via Razorpay
              </div>
              <p className="text-xs text-emerald-900/90 leading-relaxed">
                Once the returned merchandise is received at our fulfillment center and passes quality inspection (usually within 1 to 2 business days), our finance desk issues the refund via the <strong>Razorpay Payment Gateway</strong>.
              </p>
              <p className="text-xs text-emerald-900 font-semibold">
                Timeline: The refunded funds typically reflect in your bank account, card statement, or UPI wallet within <strong>5 to 7 business days</strong>, in accordance with standard inter-bank clearing cycles.
              </p>
            </div>
          </div>
        </div>

        {/* Support & Contact Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#1F3A26]/10 p-6 sm:p-8 space-y-3">
          <h2 className="font-heading text-lg font-bold text-[#1F3A26]">
            Need Assistance with a Cancellation or Refund?
          </h2>
          <p className="text-sm text-[#4A4A4A] leading-relaxed">
            Our guest concierge team is available to assist you with any refund inquiry or appointment rescheduling:
          </p>
          
          <div className="bg-[#F7F5F1] p-5 rounded-xl border border-[#1F3A26]/10 text-sm space-y-2">
            <div className="font-bold text-[#1F3A26]">Serenity Luxury Salon &amp; Spa Concierge</div>
            <div className="flex items-center gap-2 text-[#4A4A4A]">
              <MapPin className="w-4 h-4 text-[#C9A66B] shrink-0" />
              <span>802 Botanical Horizon Towers, BKC, Mumbai, Maharashtra 400051, India</span>
            </div>
            <div className="flex items-center gap-2 text-[#4A4A4A]">
              <Phone className="w-4 h-4 text-[#C9A66B] shrink-0" />
              <a href="tel:+918108765851" className="hover:text-[#1F3A26] font-medium">+91 8108765851</a>
            </div>
            <div className="flex items-center gap-2 text-[#4A4A4A]">
              <Mail className="w-4 h-4 text-[#C9A66B] shrink-0" />
              <a href="mailto:care@serenitysalon.in" className="hover:text-[#1F3A26]">care@serenitysalon.in</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
