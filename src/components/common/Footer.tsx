import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin, Globe, Sparkles, Code } from 'lucide-react';
import { PageView } from '../../types';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  onOpenElementorGuide: () => void;
  onOpenAdmin?: () => void;
  onOpenAccountModal?: (tab?: 'orders' | 'loyalty' | 'referral' | 'profile') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenElementorGuide, onOpenAdmin, onOpenAccountModal }) => {
  const [currency, setCurrency] = useState('INR (₹)');
  const [language, setLanguage] = useState('English (India)');

  return (
    <footer id="main-footer" className="bg-white border-t border-[#1F3A26]/10 pt-14 pb-8 text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 pb-12 border-b border-[#1F3A26]/8">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-1 flex flex-col justify-between">
            <div>
              {/* Logo */}
              <button 
                onClick={() => onNavigate('home')}
                className="text-left mb-4 cursor-pointer group focus:outline-none block"
                aria-label="Serenity Salon Home"
              >
                <BrandLogo size="md" />
              </button>

              <p className="text-sm text-[#6E6E6E] leading-relaxed mb-6">
                Pure botanical skincare crafted for radiant, effortless elegance. 100% natural, cruelty-free, and dermatologically approved.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2">
              {[
                { Icon: Facebook, href: '#', label: 'Facebook' },
                { Icon: Twitter, href: '#', label: 'Twitter' },
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Youtube, href: '#', label: 'YouTube' },
              ].map(({ Icon, href, label }, idx) => (
                <a
                  key={idx}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-[#F7F5F1] text-[#1F3A26] flex items-center justify-center hover:bg-[#1F3A26] hover:text-white transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Company */}
          <div>
            <h4 className="font-heading font-bold text-base text-[#1F3A26] mb-4 uppercase tracking-wider text-xs">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-[#6E6E6E]">
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-[#1F3A26] transition-colors cursor-pointer font-medium text-[#1F3A26]">
                  Salon Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#1F3A26] transition-colors cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blogs')} className="hover:text-[#1F3A26] transition-colors cursor-pointer">
                  News & Blogs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-[#1F3A26] transition-colors cursor-pointer">
                  Explore Products
                </button>
              </li>
              <li>
                <a href="#about-story" onClick={() => onNavigate('about')} className="hover:text-[#1F3A26] transition-colors">
                  Our Ethical Sourcing
                </a>
              </li>
              <li>
                <a href="#careers" className="hover:text-[#1F3A26] transition-colors">
                  Careers & Press
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Services */}
          <div>
            <h4 className="font-heading font-bold text-base text-[#1F3A26] mb-4 uppercase tracking-wider text-xs">
              Customer Services
            </h4>
            <ul className="space-y-2.5 text-sm text-[#6E6E6E]">
              <li>
                <button
                  onClick={() => onOpenAccountModal ? onOpenAccountModal('profile') : null}
                  className="hover:text-[#1F3A26] transition-colors cursor-pointer text-left"
                >
                  My Account Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAccountModal ? onOpenAccountModal('orders') : null}
                  className="hover:text-[#1F3A26] transition-colors cursor-pointer text-left"
                >
                  Order History &amp; Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAccountModal ? onOpenAccountModal('loyalty') : null}
                  className="hover:text-[#1F3A26] transition-colors cursor-pointer text-left text-[#C9A66B] font-semibold"
                >
                  Aura Loyalty Points &amp; Tiers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAccountModal ? onOpenAccountModal('referral') : null}
                  className="hover:text-[#1F3A26] transition-colors cursor-pointer text-left"
                >
                  Refer a Friend (Get 500 Pts)
                </button>
              </li>
              <li>
                <a href="#faqs" className="hover:text-[#1F3A26] transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Our Information & Policies */}
          <div>
            <h4 className="font-heading font-bold text-base text-[#1F3A26] mb-4 uppercase tracking-wider text-xs">
              Our Policies &amp; Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-[#6E6E6E]">
              <li>
                <a
                  href="/privacy-policy"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('privacy-policy');
                  }}
                  className="hover:text-[#1F3A26] transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms-and-conditions"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('terms-and-conditions');
                  }}
                  className="hover:text-[#1F3A26] transition-colors"
                >
                  Terms &amp; Conditions
                </a>
              </li>
              <li>
                <a
                  href="/shipping-policy"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('shipping-policy');
                  }}
                  className="hover:text-[#1F3A26] transition-colors"
                >
                  Shipping Policy
                </a>
              </li>
              <li>
                <a
                  href="/cancellation-refund-policy"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('cancellation-refund-policy');
                  }}
                  className="hover:text-[#1F3A26] transition-colors font-medium text-[#1F3A26]"
                >
                  Cancellation &amp; Refund
                </a>
              </li>
              <li>
                <a
                  href="/pricing"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('pricing');
                  }}
                  className="hover:text-[#1F3A26] transition-colors"
                >
                  Pricing &amp; Rates
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenElementorGuide}
                  className="text-[#C9A66B] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5" />
                  Elementor Blueprint
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact Info */}
          <div>
            <h4 className="font-heading font-bold text-base text-[#1F3A26] mb-4 uppercase tracking-wider text-xs">
              <a
                href="/contact-us"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('contact-us');
                }}
                className="hover:text-[#C9A66B] transition-colors"
              >
                Contact Us
              </a>
            </h4>
            <ul className="space-y-3 text-sm text-[#6E6E6E]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C9A66B] shrink-0 mt-0.5" />
                <span>802 Botanical Horizon Towers, BKC, Mumbai, Maharashtra 400051</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C9A66B] shrink-0" />
                <a href="tel:+918108765851" className="hover:text-[#1F3A26] font-medium">+91 8108765851</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C9A66B] shrink-0" />
                <a href="mailto:pranavdigital221@gmail.com" className="hover:text-[#1F3A26]">pranavdigital221@gmail.com</a>
              </li>
              <li>
                <a
                  href="/contact-us"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('contact-us');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F3A26] bg-[#F7F5F1] hover:bg-[#1F3A26] hover:text-white px-3 py-1.5 rounded-full border border-[#1F3A26]/10 transition-colors"
                >
                  <span>Customer Support Desk &rarr;</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Razorpay Compliance Policy Links Row */}
        <div className="py-4 border-b border-[#1F3A26]/8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#6E6E6E]">
          <a
            href="/privacy-policy"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('privacy-policy');
            }}
            className="hover:text-[#1F3A26] transition-colors"
          >
            Privacy Policy
          </a>
          <span className="text-gray-300">•</span>
          <a
            href="/terms-and-conditions"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('terms-and-conditions');
            }}
            className="hover:text-[#1F3A26] transition-colors"
          >
            Terms &amp; Conditions
          </a>
          <span className="text-gray-300">•</span>
          <a
            href="/shipping-policy"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('shipping-policy');
            }}
            className="hover:text-[#1F3A26] transition-colors"
          >
            Shipping Policy
          </a>
          <span className="text-gray-300">•</span>
          <a
            href="/cancellation-refund-policy"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('cancellation-refund-policy');
            }}
            className="hover:text-[#1F3A26] transition-colors font-medium text-[#1F3A26]"
          >
            Cancellation &amp; Refund Policy
          </a>
          <span className="text-gray-300">•</span>
          <a
            href="/contact-us"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('contact-us');
            }}
            className="hover:text-[#1F3A26] transition-colors"
          >
            Contact Us
          </a>
          <span className="text-gray-300">•</span>
          <a
            href="/pricing"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('pricing');
            }}
            className="hover:text-[#1F3A26] transition-colors"
          >
            Pricing &amp; Product Details
          </a>
        </div>

        {/* Bottom Bar: Copyright & Currency / Language */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6E6E6E]">
          
          <div className="flex items-center gap-2 text-center sm:text-left flex-wrap">
            <span>© {new Date().getFullYear()} Serenity Salon. All rights reserved.</span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">Crafted with Organic Clean Beauty Standards.</span>
            {onOpenAdmin && (
              <>
                <span className="text-gray-300">|</span>
                <button
                  onClick={onOpenAdmin}
                  title="Admin Dashboard (Secret Trigger / Ctrl+Shift+A)"
                  className="text-gray-400 hover:text-[#1F3A26] transition-colors cursor-pointer text-[11px] underline decoration-dotted inline-flex items-center gap-1"
                >
                  <span>Admin Analytics</span>
                </button>
              </>
            )}
          </div>

          {/* Language & Currency Dropdowns */}
          <div className="flex items-center gap-3">
            
            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-[#F7F5F1] text-xs font-medium py-1.5 px-3 rounded-full border border-gray-200 text-[#1A1A1A] focus:outline-none focus:border-[#C9A66B] cursor-pointer"
            >
              <option value="INR (₹)">INR (₹)</option>
              <option value="USD ($)">USD ($)</option>
              <option value="EUR (€)">EUR (€)</option>
              <option value="GBP (£)">GBP (£)</option>
              <option value="AED (د.إ)">AED (د.إ)</option>
            </select>

            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#F7F5F1] text-xs font-medium py-1.5 px-3 rounded-full border border-gray-200 text-[#1A1A1A] focus:outline-none focus:border-[#C9A66B] cursor-pointer"
            >
              <option value="English (India)">English (India)</option>
              <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
              <option value="English (US)">English (US)</option>
              <option value="Français">Français</option>
            </select>

          </div>

        </div>

      </div>
    </footer>
  );
};
