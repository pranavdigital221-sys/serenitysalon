import React, { useState, useEffect } from 'react';
import { PageView } from '../../types';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle2, ArrowLeft, Sparkles, MessageCircle } from 'lucide-react';
import { updatePageSEO } from '../../utils/seo';

interface ContactUsPageProps {
  onNavigate: (page: PageView) => void;
}

export const ContactUsPage: React.FC<ContactUsPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    updatePageSEO(
      'Contact Us | Serenity Salon — Luxury Beauty & Spa',
      'Get in touch with Serenity Luxury Salon & Spa in Mumbai. Reach our reception and concierge via phone at +91 8108765851, email care@serenitysalon.in, or visit us in BKC, Mumbai.',
      '/contact-us'
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate immediate, reliable feedback
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: '',
      });
    }, 800);
  };

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
            <span className="text-white font-medium">Contact Us</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A66B] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Concierge &amp; Customer Care</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold leading-tight mb-3">
            Contact Serenity Salon
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed">
            We are here to assist with appointment scheduling, bridal consultations, product inquiries, or customer support.
          </p>
        </div>
      </section>

      {/* Main Grid: Contact Cards & Form */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (5 cols): Official Business Details */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#1F3A26]/10 space-y-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#C9A66B] block mb-1">
                  Salon Flagship Location
                </span>
                <h2 className="font-heading text-xl font-bold text-[#1F3A26]">
                  Serenity Luxury Salon &amp; Spa
                </h2>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3.5 text-sm text-[#4A4A4A]">
                <div className="w-9 h-9 rounded-full bg-[#F7F5F1] text-[#1F3A26] flex items-center justify-center shrink-0 mt-0.5 border border-[#1F3A26]/10">
                  <MapPin className="w-4 h-4 text-[#C9A66B]" />
                </div>
                <div>
                  <strong className="block text-[#1F3A26] font-semibold mb-0.5">Physical Salon Address</strong>
                  <p className="leading-relaxed">
                    802 Botanical Horizon Towers, BKC,<br />
                    Mumbai, Maharashtra 400051, India
                  </p>
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="flex items-start gap-3.5 text-sm text-[#4A4A4A]">
                <div className="w-9 h-9 rounded-full bg-[#F7F5F1] text-[#1F3A26] flex items-center justify-center shrink-0 mt-0.5 border border-[#1F3A26]/10">
                  <Phone className="w-4 h-4 text-[#C9A66B]" />
                </div>
                <div>
                  <strong className="block text-[#1F3A26] font-semibold mb-0.5">Phone &amp; WhatsApp</strong>
                  <a
                    href="tel:+918108765851"
                    className="hover:text-[#1F3A26] font-medium text-base text-[#1F3A26] block"
                  >
                    +91 8108765851
                  </a>
                  <p className="text-xs text-[#6E6E6E] mt-0.5">
                    Direct call or WhatsApp concierge messaging
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5 text-sm text-[#4A4A4A]">
                <div className="w-9 h-9 rounded-full bg-[#F7F5F1] text-[#1F3A26] flex items-center justify-center shrink-0 mt-0.5 border border-[#1F3A26]/10">
                  <Mail className="w-4 h-4 text-[#C9A66B]" />
                </div>
                <div>
                  <strong className="block text-[#1F3A26] font-semibold mb-0.5">Email Support</strong>
                  <a
                    href="mailto:care@serenitysalon.in"
                    className="hover:text-[#1F3A26] font-medium text-[#1F3A26] block"
                  >
                    care@serenitysalon.in
                  </a>
                  <p className="text-xs text-[#6E6E6E] mt-0.5">
                    Response within 24 business hours
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3.5 text-sm text-[#4A4A4A]">
                <div className="w-9 h-9 rounded-full bg-[#F7F5F1] text-[#1F3A26] flex items-center justify-center shrink-0 mt-0.5 border border-[#1F3A26]/10">
                  <Clock className="w-4 h-4 text-[#C9A66B]" />
                </div>
                <div>
                  <strong className="block text-[#1F3A26] font-semibold mb-0.5">Salon Operating Hours</strong>
                  <p className="text-xs leading-relaxed text-[#4A4A4A]">
                    <strong>Monday – Saturday:</strong> 9:00 AM – 8:00 PM IST<br />
                    <strong>Sunday:</strong> 10:00 AM – 6:00 PM IST
                  </p>
                </div>
              </div>

              {/* Quick WhatsApp Action Button */}
              <div className="pt-2">
                <a
                  href="https://wa.me/918108765851?text=Hello%20Serenity%20Salon,%20I%20would%20like%20to%20inquire%20about%20your%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#1EBE5D] transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp (+91 8108765851)</span>
                </a>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="bg-[#1F3A26] text-white rounded-2xl p-6 space-y-3">
              <h3 className="font-heading font-bold text-base text-[#C9A66B]">
                Looking to Book an Appointment?
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Explore our comprehensive treatment menu, pick your preferred specialist, and lock in your slot with a secure 40% advance deposit.
              </p>
              <button
                onClick={() => onNavigate('services')}
                className="w-full py-2.5 px-4 bg-[#C9A66B] hover:bg-[#B39358] text-[#1F3A26] font-bold text-xs rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
              >
                Browse Salon Services
              </button>
            </div>
          </div>

          {/* Right Column (7 cols): Send a Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#1F3A26]/10">
              <div className="mb-6">
                <h2 className="font-heading text-2xl font-bold text-[#1F3A26] mb-1">
                  Send Us a Message
                </h2>
                <p className="text-sm text-[#6E6E6E]">
                  Fill out the form below and our guest relations concierge will get back to you promptly.
                </p>
              </div>

              {isSubmitted ? (
                <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-emerald-950">
                    Thank You! Your Message Has Been Sent.
                  </h3>
                  <p className="text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                    Our team has received your message and will review it immediately. A representative will contact you via phone or email within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#1F3A26] text-white text-xs font-semibold hover:bg-[#2C4D35] transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1F3A26] mb-1.5">
                        Your Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Priya Sharma"
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#C9A66B] bg-[#FBF9F5]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1F3A26] mb-1.5">
                        Contact Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#C9A66B] bg-[#FBF9F5]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1F3A26] mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="priya@example.com"
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#C9A66B] bg-[#FBF9F5]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1F3A26] mb-1.5">
                        Inquiry Topic
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#C9A66B] bg-[#FBF9F5] cursor-pointer"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Appointment Question">Appointment Question</option>
                        <option value="Product Order Tracking">Product Order Tracking</option>
                        <option value="Bridal / Event Package">Bridal / Event Package</option>
                        <option value="Feedback / Suggestion">Feedback / Suggestion</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F3A26] mb-1.5">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we assist you today? Please share any details..."
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#C9A66B] bg-[#FBF9F5]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#1F3A26] text-white font-semibold text-sm hover:bg-[#2C4D35] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
