import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-[24px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#1F3A26]/10 z-10 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F7F5F1] text-gray-700 flex items-center justify-center hover:bg-[#1F3A26] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-full bg-[#1F3A26] text-[#C9A66B] mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-bold text-xl text-[#1F3A26] mb-1">
              Message Received!
            </h3>
            <p className="text-xs text-[#6E6E6E]">
              Our holistic esthetician support team will reply within 15 minutes.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#FDF1E4] text-[#1F3A26] flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-[#C9A66B]" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-xl text-[#1F3A26]">
                  Contact Skincare Support
                </h2>
                <p className="text-xs text-[#6E6E6E]">
                  Ask questions about ingredients, orders, or custom routines.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sophia Montgomery"
                  className="w-full px-4 py-2.5 rounded-full bg-[#F7F5F1] text-sm text-[#1A1A1A] border border-gray-200 focus:outline-none focus:border-[#C9A66B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sophia@example.com"
                  className="w-full px-4 py-2.5 rounded-full bg-[#F7F5F1] text-sm text-[#1A1A1A] border border-gray-200 focus:outline-none focus:border-[#C9A66B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">How can we help?</label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="I'd love advice on which botanical oil is best for sensitive combination skin..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F7F5F1] text-sm text-[#1A1A1A] border border-gray-200 focus:outline-none focus:border-[#C9A66B] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#1F3A26] hover:bg-[#4F7358] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer mt-2"
              >
                <span>Send Message</span>
                <Send className="w-4 h-4 text-[#C9A66B]" />
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-[#6E6E6E]">
              <a href="tel:+918108765851" className="flex items-center gap-1 hover:text-[#1F3A26] transition-colors">
                <Phone className="w-3 h-3 text-[#C9A66B]" /> +91 8108765851
              </a>
              <a href="mailto:care@serenitysalon.in" className="flex items-center gap-1 hover:text-[#1F3A26] transition-colors">
                <Mail className="w-3 h-3 text-[#C9A66B]" /> care@serenitysalon.in
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};