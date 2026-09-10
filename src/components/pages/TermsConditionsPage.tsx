import React, { useEffect } from 'react';
import { PageView } from '../../types';
import { FileCheck2, Scale, CreditCard, CalendarCheck, ShoppingBag, ShieldAlert, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import { updatePageSEO } from '../../utils/seo';

interface TermsConditionsPageProps {
  onNavigate: (page: PageView) => void;
}

export const TermsConditionsPage: React.FC<TermsConditionsPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    updatePageSEO(
      'Terms & Conditions | Serenity Salon — Luxury Beauty & Spa',
      'Review the official terms and conditions for Serenity Salon regarding website usage, salon appointment scheduling, 40% advance deposits, retail orders, and Razorpay payment terms.',
      '/terms-and-conditions'
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
            <span className="text-white font-medium">Terms &amp; Conditions</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A66B] text-xs font-semibold uppercase tracking-wider mb-3">
            <Scale className="w-3.5 h-3.5" />
            <span>Service Agreement</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold leading-tight mb-3">
            Terms &amp; Conditions
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed">
            Effective Date: January 1, 2026 | Last Updated: September 2026
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
        <div className="bg-white rounded-2xl shadow-sm border border-[#1F3A26]/10 p-6 sm:p-10 space-y-8 text-[#1A1A1A]">
          
          {/* Welcome Intro */}
          <div className="bg-[#F7F5F1] border-l-4 border-[#1F3A26] p-5 rounded-r-xl">
            <h2 className="font-heading font-bold text-base text-[#1F3A26] mb-1">
              Welcome to Serenity Salon
            </h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              These Terms &amp; Conditions govern your use of the Serenity Salon website, your booking of in-salon treatments and beauty rituals, and your purchase of retail products. By accessing our platform, booking an appointment, or placing an order, you agree to be bound by these terms. If you do not agree with any part of these terms, please refrain from using our services.
            </p>
          </div>

          {/* Section 1: Website Usage & Eligibility */}
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-[#1F3A26] flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-[#C9A66B]" />
              1. Website Usage &amp; Eligibility
            </h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              By using this website, you warrant that you are at least 18 years of age or accessing under the supervision of a parent or legal guardian. You agree to provide true, accurate, and current information during booking, account creation, or checkout. Unauthorized access, automated scraping, or disruption of website operations is strictly prohibited.
            </p>
          </section>

          {/* Section 2: Products & Services */}
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-[#1F3A26] flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C9A66B]" />
              2. Products &amp; Salon Services
            </h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              Serenity Salon offers two primary categories of offerings:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-sm text-[#4A4A4A]">
              <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#1F3A26]/5 space-y-1.5">
                <strong className="text-[#1F3A26] block font-semibold">In-Salon Beauty &amp; Wellness Services</strong>
                <p>
                  Professional haircuts, coloring, hair spas, facials, skin detox, occasion and bridal makeup, nail art, and therapeutic massages performed physically by trained specialists at our salon premises.
                </p>
              </div>
              <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#1F3A26]/5 space-y-1.5">
                <strong className="text-[#1F3A26] block font-semibold">Retail Botanical Beauty Products</strong>
                <p>
                  100% natural, cruelty-free botanical skincare, haircare, makeup, and professional salon styling tools dispatched physically across India to your specified delivery address.
                </p>
              </div>
            </div>
            <p className="text-xs text-[#6E6E6E] pt-1">
              Product descriptions, images, and prices are displayed accurately to the best of our ability. We reserve the right to correct minor typographical errors or revise stock availability without prior liability.
            </p>
          </section>

          {/* Section 3: Appointment Booking & Advance Payment */}
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-[#1F3A26] flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-[#C9A66B]" />
              3. Salon Appointment Booking &amp; Advance Deposit Policy
            </h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              To ensure dedicated stylist allocation, pristine treatment room preparation, and eliminate slot hoarding, appointments are scheduled under the following binding guidelines:
            </p>
            
            <div className="space-y-3 pt-2">
              <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#1F3A26]/10 text-sm space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#1F3A26]">
                  <CreditCard className="w-4 h-4 text-[#C9A66B]" />
                  40% Online Advance Deposit
                </div>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">
                  When scheduling an appointment online, a <strong>40% advance reservation deposit</strong> (calculated from the standard base price of the chosen service) is collected securely through Razorpay to confirm your appointment slot in our calendar.
                </p>
              </div>

              <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#1F3A26]/10 text-sm space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#1F3A26]">
                  <CreditCard className="w-4 h-4 text-[#C9A66B]" />
                  Remaining 60% Balance Payable at Salon
                </div>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">
                  The remaining <strong>60% balance</strong> is payable directly at our salon reception upon the completion of your service. Payment at the salon counter may be settled via Cash, UPI (Google Pay, PhonePe, Paytm), Credit/Debit Card, or Net Banking.
                </p>
              </div>
            </div>

            <p className="text-xs text-[#6E6E6E] pt-1">
              Custom add-on treatments or tailored services chosen during consultation will be billed at the salon counter upon checkout.
            </p>
          </section>

          {/* Section 4: Product Orders & Payment Terms */}
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-[#1F3A26] flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#C9A66B]" />
              4. Product Orders &amp; Payment Gateway Terms
            </h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              All retail product orders placed via our online store must be paid in full at the time of checkout via our authorized payment partner, <strong>Razorpay</strong>. Accepted payment instruments include:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#4A4A4A]">
              <li>UPI (Instant QR code scan, Google Pay, PhonePe, BHIM, Paytm)</li>
              <li>Credit and Debit Cards (Visa, MasterCard, RuPay, Maestro)</li>
              <li>Net Banking across 50+ major Indian banks</li>
              <li>Authorized Digital Wallets</li>
            </ul>
            <p className="text-sm text-[#4A4A4A] leading-relaxed pt-1">
              All prices are quoted in Indian National Rupees (INR ₹) and are inclusive of applicable Goods and Services Tax (GST). Once your payment is successfully verified by Razorpay, an instant order confirmation with invoice details is generated and sent to your registered email and phone number.
            </p>
          </section>

          {/* Section 5: Customer Responsibilities & Salon Etiquette */}
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-[#1F3A26]">
              5. Customer Responsibilities &amp; Salon Etiquette
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#4A4A4A]">
              <li><strong>Punctuality:</strong> Clients are requested to arrive 10 minutes prior to their scheduled appointment slot. Arriving more than 15 minutes late may necessitate shortening the treatment duration or rescheduling to avoid inconveniencing subsequent clients.</li>
              <li><strong>Health &amp; Allergies:</strong> Please disclose any pre-existing skin conditions, chemical sensitivities, or allergies to our specialists during consultation before beginning any service.</li>
              <li><strong>Personal Belongings:</strong> While our salon maintains secure premises, Serenity Salon is not liable for loss or damage to personal valuables brought onto salon property.</li>
            </ul>
          </section>

          {/* Section 6: Cancellation, Rescheduling & Refunds */}
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-[#1F3A26]">
              6. Cancellation &amp; Refund Terms
            </h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              Our complete cancellation and refund rules are governed by our dedicated{' '}
              <button
                onClick={() => onNavigate('cancellation-refund-policy')}
                className="text-[#1F3A26] font-semibold underline hover:text-[#C9A66B] cursor-pointer"
              >
                Cancellation &amp; Refund Policy
              </button>
              . In summary:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#4A4A4A]">
              <li><strong>Appointments:</strong> Cancellations made at least 12 hours prior to the scheduled slot receive a 100% refund of the 40% advance deposit. Cancellations within 12 hours or no-shows forfeit the 40% advance deposit.</li>
              <li><strong>Product Orders:</strong> Cancellations are permitted prior to shipment dispatch. Damaged or defective physical goods qualify for a 7-day return/refund window upon inspection.</li>
            </ul>
          </section>

          {/* Section 7: Limitation of Liability */}
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-[#1F3A26] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#C9A66B]" />
              7. Limitation of Liability
            </h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              Serenity Salon will not be liable for indirect, incidental, or consequential damages resulting from the use of products purchased on our site or services rendered, except where required by consumer protection legislation under Indian law. Our maximum aggregate liability for any claim shall not exceed the actual amount paid by you for the specific service or product in dispute.
            </p>
          </section>

          {/* Section 8: Intellectual Property & Governing Law */}
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-[#1F3A26]">
              8. Intellectual Property &amp; Governing Law
            </h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              All branding, logos, trademarks, text, graphics, and software code on this website are the intellectual property of Serenity Salon. These Terms shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising hereunder shall be subject to the exclusive jurisdiction of the competent courts in Mumbai, Maharashtra.
            </p>
          </section>

          {/* Section 9: Contact Information */}
          <section className="pt-4 border-t border-[#1F3A26]/10 space-y-3">
            <h2 className="font-heading text-xl font-bold text-[#1F3A26]">
              9. Contact Us Regarding Terms
            </h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              For any clarification regarding these terms, please contact our administrative desk:
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
