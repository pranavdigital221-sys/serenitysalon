import React, { useEffect } from 'react';
import { PageView } from '../../types';
import { Shield, Lock, Eye, FileText, CheckCircle2, Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';
import { updatePageSEO } from '../../utils/seo';

interface PrivacyPolicyPageProps {
  onNavigate: (page: PageView) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    updatePageSEO(
      'Privacy Policy | Serenity Salon — Luxury Beauty & Spa',
      'Learn how Serenity Salon collects, protects, and manages your personal, booking, and payment data in accordance with strict security standards and Razorpay integration protocols.',
      '/privacy-policy'
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
            <span className="text-white/70">Legal</span>
            <span>/</span>
            <span className="text-white font-medium">Privacy Policy</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A66B] text-xs font-semibold uppercase tracking-wider mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Data Protection & Privacy</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold leading-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed">
            Effective Date: January 1, 2026 | Last Updated: September 2026
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
        <div className="bg-white rounded-2xl shadow-sm border border-[#1F3A26]/10 p-6 sm:p-10 space-y-8 text-[#1A1A1A]">
          
          {/* Summary Callout */}
          <div className="bg-[#F7F5F1] border-l-4 border-[#1F3A26] p-5 rounded-r-xl">
            <h2 className="font-heading font-bold text-base text-[#1F3A26] mb-1">
              Our Commitment to Your Privacy
            </h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              At Serenity Salon (&quot;Serenity Luxury Salon &amp; Spa&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), we are dedicated to protecting your personal information and treating it with utmost care and transparency. This Privacy Policy outlines our practices concerning the collection, storage, and processing of your details when you visit our website, schedule salon appointments, or purchase retail products.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-[#1F3A26] flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#C9A66B]" />
              1. Information We Collect
            </h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              We collect only the information necessary to provide our salon treatments, fulfill retail product orders, and offer dedicated customer support:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-sm text-[#4A4A4A]">
              <div className="p-3.5 bg-[#FBF9F5] rounded-xl border border-[#1F3A26]/5">
                <strong className="block text-[#1F3A26] mb-1 font-semibold">Appointment Booking Details</strong>
                Full name, contact phone number, email address, preferred appointment date and time slot, selected salon service, and any styling or wellness notes provided.
              </div>
              <div className="p-3.5 bg-[#FBF9F5] rounded-xl border border-[#1F3A26]/5">
                <strong className="block text-[#1F3A26] mb-1 font-semibold">Product Order &amp; Shipping Details</strong>
                Customer name, delivery address (street, city, state, postal code), phone number, email address, ordered items, and order history.
              </div>
              <div className="p-3.5 bg-[#FBF9F5] rounded-xl border border-[#1F3A26]/5">
                <strong className="block text-[#1F3A26] mb-1 font-semibold">Account &amp; Loyalty Data</strong>
                User registration credentials, order tracking history, Aura loyalty tier status, accumulated reward points, and referral activity.
              </div>
              <div className="p-3.5 bg-[#FBF9F5] rounded-xl border border-[#1F3A26]/5">
                <strong className="block text-[#1F3A26] mb-1 font-semibold">Device &amp; Usage Information</strong>
                IP address, browser type, device identifiers, and site interaction cookies used solely to retain shopping cart items and improve browsing efficiency.
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-[#1F3A26] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#C9A66B]" />
              2. Secure Payment Processing via Razorpay
            </h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              Online payments for salon appointment advance deposits (40% reservation fee) and retail product orders are processed securely via our licensed payment gateway partner, <strong>Razorpay Software Private Limited</strong>.
            </p>
            <div className="p-4 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-sm text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                PCI-DSS Level 1 Compliant Security
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Serenity Salon <strong>never</strong> collects, views, or stores your sensitive payment credentials (such as credit/debit card numbers, CVV codes, net banking passwords, or UPI PINs) on our servers. All transaction authorizations occur directly on Razorpay&apos;s encrypted payment interface with 128-bit/256-bit SSL encryption. We only store unique transaction identifiers (Razorpay Order ID and Payment ID) to verify payment completion and record receipts.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-[#1F3A26] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#C9A66B]" />
              3. How We Use Your Information
            </h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              The information we gather is used strictly for legitimate business and customer service purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#4A4A4A]">
              <li>Confirming and managing your appointment reservations and sending schedule reminders via WhatsApp or SMS.</li>
              <li>Processing, packing, and dispatching physical product orders to your designated shipping address.</li>
              <li>Issuing tax invoices, order receipts, and tracking shipment delivery status.</li>
              <li>Processing cancellations and approved refunds in accordance with our Cancellation &amp; Refund Policy.</li>
              <li>Calculating and awarding Aura loyalty reward points and managing member discounts.</li>
              <li>Responding to your inquiries, appointment modification requests, and customer support queries.</li>
              <li>Complying with statutory accounting, tax (GST), and regulatory requirements under Indian law.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-[#1F3A26] flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#C9A66B]" />
              4. Data Sharing &amp; Third-Party Services
            </h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              We do <strong>not</strong> sell, rent, or trade your personal data to third parties or marketing brokers. We share information only with trusted operational service providers who are contractually bound to maintain strict confidentiality:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#4A4A4A]">
              <li><strong>Payment Partners:</strong> Razorpay for secure checkout and payment settlement.</li>
              <li><strong>Logistics Partners:</strong> Reputable domestic courier partners (e.g., BlueDart, Delhivery, DTDC) to deliver product parcels.</li>
              <li><strong>Communication Gateways:</strong> Email and messaging gateways (such as official Google Workspace / WhatsApp Business) for booking alerts and order updates.</li>
              <li><strong>Cloud Infrastructure:</strong> Secure enterprise database systems with encrypted data-at-rest and in-transit protocols.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-[#1F3A26]">
              5. Cookies &amp; Local Browser Storage
            </h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              Our website uses cookies and standard browser local storage solely for essential operational purposes, such as keeping items in your shopping bag, maintaining your wishlist, remembering your preferred currency selection, and preserving login session state. We do not use intrusive third-party cross-site tracking cookies. You may disable cookies in your browser settings, though doing so may limit your ability to place orders online.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-[#1F3A26]">
              6. Your Privacy Rights
            </h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              As a valued customer, you hold full control over your personal information:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#4A4A4A]">
              <li><strong>Access &amp; Review:</strong> You may request a copy of the personal data we hold about you.</li>
              <li><strong>Rectification:</strong> You may request correction of inaccurate contact or address details.</li>
              <li><strong>Deletion:</strong> You may request removal of your profile and personal data, subject to statutory invoice retention requirements.</li>
              <li><strong>Opt-Out:</strong> You may opt out of non-essential promotional newsletters or SMS announcements at any time.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-[#1F3A26]">
              7. Policy Updates
            </h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              We may revise this Privacy Policy periodically to reflect enhancements in our services, security measures, or applicable regulatory guidelines. Any modifications will become effective immediately upon posting to this URL, with an updated revision date displayed at the top.
            </p>
          </section>

          {/* Section 8: Contact Information */}
          <section className="pt-4 border-t border-[#1F3A26]/10 space-y-3">
            <h2 className="font-heading text-xl font-bold text-[#1F3A26]">
              8. Contact Our Privacy &amp; Data Team
            </h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              If you have any questions, concerns, or requests regarding this Privacy Policy or how your personal information is handled, please reach out to us:
            </p>
            
            <div className="bg-[#F7F5F1] p-5 rounded-xl border border-[#1F3A26]/10 text-sm space-y-2">
              <div className="font-bold text-[#1F3A26]">Serenity Luxury Salon &amp; Spa</div>
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
