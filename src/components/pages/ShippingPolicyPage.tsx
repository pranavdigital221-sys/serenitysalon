import React, { useEffect } from 'react';
import { PageView } from '../../types';
import { Truck, Package, Clock, ShieldCheck, AlertCircle, ArrowLeft, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';
import { updatePageSEO } from '../../utils/seo';

interface ShippingPolicyPageProps {
  onNavigate: (page: PageView) => void;
}

export const ShippingPolicyPage: React.FC<ShippingPolicyPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    updatePageSEO(
      'Shipping & Delivery Policy | Serenity Salon — Luxury Beauty Products',
      'Detailed shipping policy for Serenity Salon retail beauty products. Pan-India courier delivery timelines, free shipping above ₹999, order processing, and tracking information.',
      '/shipping-policy'
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
            <span className="text-white font-medium">Shipping Policy</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A66B] text-xs font-semibold uppercase tracking-wider mb-3">
            <Truck className="w-3.5 h-3.5" />
            <span>Pan-India Order Fulfillment</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold leading-tight mb-3">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed">
            Fast, secure, and eco-conscious botanical product delivery across India.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
        <div className="bg-white rounded-2xl shadow-sm border border-[#1F3A26]/10 p-6 sm:p-10 space-y-8 text-[#1A1A1A]">
          
          {/* Important Distinction Notice */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-5 text-amber-900 text-sm space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
              Scope of Shipping Policy: Physical Retail Products Only
            </div>
            <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
              This Shipping Policy applies exclusively to physical retail beauty, skincare, haircare, and tool products purchased through our online boutique. <strong>Salon services and appointment bookings are conducted in-person at our salon premises and are never shipped as physical goods.</strong>
            </p>
          </div>

          {/* Section 1: Delivery Coverage & Serviceable Areas */}
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-[#1F3A26] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#C9A66B]" />
              1. Delivery Coverage &amp; Serviceable Pincodes
            </h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              Serenity Salon ships products to nearly all residential and commercial pincodes across India through premier courier and express logistics partners (including BlueDart, Delhivery, DTDC, and India Post Speed Post). During checkout, enter your 6-digit Indian PIN code to verify serviceability.
            </p>
          </section>

          {/* Section 2: Shipping Charges & Free Shipping Threshold */}
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-[#1F3A26] flex items-center gap-2">
              <Package className="w-5 h-5 text-[#C9A66B]" />
              2. Shipping Rates &amp; Free Delivery
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1">
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-800">Orders ₹999 &amp; Above</span>
                <div className="text-2xl font-bold text-emerald-900 font-heading">FREE SHIPPING</div>
                <p className="text-xs text-emerald-800/90">
                  Enjoy complimentary express door-to-door delivery across all serviceable Indian pincodes.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#1F3A26]/10 bg-[#FBF9F5] space-y-1">
                <span className="text-xs uppercase font-bold tracking-wider text-[#6E6E6E]">Orders Below ₹999</span>
                <div className="text-2xl font-bold text-[#1F3A26] font-heading">₹99 Flat Fee</div>
                <p className="text-xs text-[#4A4A4A]">
                  A nominal flat fee of ₹99 is added at checkout to cover insured express transit and protective packaging.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Processing & Delivery Timelines */}
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-[#1F3A26] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#C9A66B]" />
              3. Processing Time &amp; Estimated Delivery Timelines
            </h2>
            
            <div className="space-y-3 text-sm text-[#4A4A4A]">
              <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#1F3A26]/5 space-y-1">
                <strong className="text-[#1F3A26] block font-semibold">Order Processing Time</strong>
                <p>
                  Orders received Monday through Saturday are packed and handed over to our courier partner within <strong>1 to 2 business days</strong>. Orders placed on Sundays or gazetted public holidays are processed on the following business day.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 bg-white border border-[#1F3A26]/10 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#1F3A26]">
                    <CheckCircle className="w-4 h-4 text-[#C9A66B]" />
                    Metro Cities (Mumbai, Delhi, Bengaluru, etc.)
                  </div>
                  <p className="text-xs text-[#4A4A4A]">
                    Estimated delivery within <strong>3 to 5 business days</strong> from the date of dispatch.
                  </p>
                </div>

                <div className="p-3.5 bg-white border border-[#1F3A26]/10 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#1F3A26]">
                    <CheckCircle className="w-4 h-4 text-[#C9A66B]" />
                    Tier 2, Tier 3 &amp; Regional Towns
                  </div>
                  <p className="text-xs text-[#4A4A4A]">
                    Estimated delivery within <strong>5 to 7 business days</strong> from the date of dispatch.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Tracking Your Order */}
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-[#1F3A26] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#C9A66B]" />
              4. Order Dispatch &amp; Tracking
            </h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              As soon as your shipment is picked up by the logistics carrier, you will receive an SMS and email notification containing your courier partner details, Waybill (AWB) tracking number, and a direct tracking link. You can also monitor your package status anytime under your{' '}
              <button
                onClick={() => onNavigate('home')}
                className="text-[#1F3A26] font-semibold underline hover:text-[#C9A66B] cursor-pointer"
              >
                Serenity Salon Account
              </button>
              .
            </p>
          </section>

          {/* Section 5: Address Accuracy & Failed Deliveries */}
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-[#1F3A26]">
              5. Address Accuracy &amp; Delivery Attempts
            </h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              Please ensure your delivery address, landmark, and contact phone number are entered accurately during checkout. Our courier partner will make up to three (3) delivery attempts before returning the shipment to our warehouse. In the event of non-delivery due to an incorrect address or customer unavailability, our support team will contact you to arrange re-dispatch (re-shipping charges may apply).
            </p>
          </section>

          {/* Section 6: Damaged or Missing Parcels in Transit */}
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-[#1F3A26]">
              6. Damaged, Tampered, or Missing Items
            </h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              All Serenity Salon botanical beauty products are securely packaged with tamper-evident seals. If you notice that your outer package is damaged or the seal has been compromised upon delivery, please <strong>refuse delivery</strong> or take clear photographs/unboxing video and notify us within 48 hours at{' '}
              <a href="mailto:care@serenitysalon.in" className="text-[#1F3A26] font-semibold underline">
                care@serenitysalon.in
              </a>
              . We will immediately dispatch an insured replacement free of charge.
            </p>
          </section>

          {/* Section 7: Support Details */}
          <section className="pt-4 border-t border-[#1F3A26]/10 space-y-3">
            <h2 className="font-heading text-xl font-bold text-[#1F3A26]">
              7. Shipping Inquiries &amp; Support
            </h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              Need assistance tracking an order or have questions about our delivery timelines? Reach out to our logistics concierge:
            </p>
            
            <div className="bg-[#F7F5F1] p-5 rounded-xl border border-[#1F3A26]/10 text-sm space-y-2">
              <div className="font-bold text-[#1F3A26]">Serenity Salon Dispatch &amp; Logistics Hub</div>
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
          </section>

        </div>
      </div>
    </div>
  );
};
