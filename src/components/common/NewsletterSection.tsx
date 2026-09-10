import React, { useState } from 'react';
import { Send, CheckCircle2, Sparkles } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <section id="newsletter-section" className="py-12 sm:py-16 px-4 sm:px-6 bg-[#F7F5F1] relative overflow-hidden">
      {/* Decorative leaf motifs */}
      <div className="max-w-4xl mx-auto bg-white rounded-[24px] p-6 sm:p-12 shadow-sm border border-[#1F3A26]/8 text-center relative overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#C9A66B]/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#1F3A26]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF1E4] text-[#1F3A26] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A66B]" />
            <span>Join Our Botanical Club</span>
          </div>

          {/* Heading with Gold Highlight */}
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1A1A] leading-tight mb-3">
            Subscribe to Our Newsletter to Get <span className="text-[#C9A66B]">Updates on Our Latest Offers</span>
          </h2>

          <p className="text-[#6E6E6E] text-sm sm:text-base max-w-lg mx-auto mb-6">
            Get 20% off your first botanical order, exclusive seasonal beauty rituals, and early access to limited edition apothecary drops.
          </p>

          {/* Form */}
          {subscribed ? (
            <div className="flex items-center justify-center gap-2 p-4 rounded-full bg-[#1F3A26] text-white animate-in fade-in zoom-in-95 duration-300">
              <CheckCircle2 className="w-5 h-5 text-[#C9A66B]" />
              <span className="font-semibold text-sm">Thank you! Check your inbox for your 20% OFF welcome gift.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2.5 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full px-5 py-3.5 rounded-full bg-[#F7F5F1] text-sm text-[#1A1A1A] placeholder:text-gray-400 border border-transparent focus:border-[#C9A66B] focus:bg-white focus:outline-none transition-all shadow-inner"
              />
              <button
                type="submit"
                className="w-full sm:w-auto shrink-0 px-7 py-3.5 rounded-full bg-[#1F3A26] hover:bg-[#4F7358] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>Subscribe</span>
                <Send className="w-4 h-4 text-[#C9A66B]" />
              </button>
            </form>
          )}

          <p className="text-[11px] text-gray-400 mt-4">
            We respect your privacy. No spam ever — unsubscribe at any time with one click.
          </p>
        </div>

      </div>
    </section>
  );
};
