// WordPress Customizer Additional CSS
export const WORDPRESS_CUSTOMIZER_CSS = `/* ==========================================================================
   SERENITY SALON - WORDPRESS CUSTOMIZER ADDITIONAL CSS
   Paste into: WordPress Admin > Appearance > Customize > Additional CSS
   ========================================================================== */

/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Jost:ital,wght@0,300..900;1,300..900&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap');

:root {
  --color-primary-green: #1F3A26;
  --color-earth-green: #4F7358;
  --color-accent-gold: #C9A66B;
  --color-bg-cream: #F7F5F1;
  --color-soft-beige: #FDF1E4;
  --color-dark-charcoal: #1A1A1A;
  --color-muted-grey: #6E6E6E;
  
  --font-heading: 'Jost', sans-serif;
  --font-body: 'Plus Jakarta Sans', sans-serif;
  --font-script: 'Caveat', cursive;
}

/* Global Typography Overrides */
.elementor-widget-heading .elementor-heading-title {
  font-family: var(--font-heading) !important;
  color: var(--color-dark-charcoal);
  letter-spacing: -0.01em;
}

.beauty-script-text {
  font-family: var(--font-script) !important;
  font-size: 2.2rem !important;
  color: var(--color-primary-green) !important;
}

.beauty-gold-highlight {
  color: var(--color-accent-gold) !important;
}

/* Section Containers & Backgrounds */
.beauty-cream-bg {
  background-color: var(--color-bg-cream) !important;
}

.beauty-dark-green-bg {
  background-color: var(--color-primary-green) !important;
}

.beauty-soft-beige-bg {
  background-color: var(--color-soft-beige) !important;
}

/* Pill Buttons */
.beauty-btn-primary .elementor-button {
  background-color: var(--color-primary-green) !important;
  color: #FFFFFF !important;
  border-radius: 9999px !important;
  padding: 14px 28px !important;
  font-family: var(--font-body) !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 14px rgba(31, 58, 38, 0.15) !important;
}

.beauty-btn-primary .elementor-button:hover {
  background-color: var(--color-earth-green) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(31, 58, 38, 0.25) !important;
}

.beauty-btn-secondary .elementor-button {
  background-color: #FFFFFF !important;
  color: var(--color-primary-green) !important;
  border-radius: 9999px !important;
  padding: 14px 28px !important;
  font-family: var(--font-body) !important;
  font-weight: 700 !important;
  font-size: 14px !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08) !important;
}

.beauty-btn-secondary .elementor-button:hover {
  background-color: var(--color-accent-gold) !important;
  color: #FFFFFF !important;
  transform: translateY(-2px);
}

.beauty-btn-outline .elementor-button {
  background-color: transparent !important;
  color: var(--color-primary-green) !important;
  border: 1.5px solid var(--color-primary-green) !important;
  border-radius: 9999px !important;
  padding: 13px 26px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
}

.beauty-btn-outline .elementor-button:hover {
  background-color: var(--color-primary-green) !important;
  color: #FFFFFF !important;
}

/* Category Circular Cards */
.beauty-category-card {
  text-align: center;
  transition: all 0.3s ease;
}

.beauty-category-card img {
  border-radius: 50% !important;
  border: 2px dashed rgba(31, 58, 38, 0.2) !important;
  padding: 6px !important;
  background: #FFFFFF !important;
  transition: all 0.3s ease !important;
}

.beauty-category-card:hover img {
  border-color: var(--color-accent-gold) !important;
  transform: scale(0.96);
}

/* Promo Cards & Banners */
.beauty-rounded-card {
  border-radius: 24px !important;
  overflow: hidden !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease !important;
}

.beauty-rounded-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(31, 58, 38, 0.08) !important;
}

/* Product Cards */
.beauty-product-card {
  background: #FFFFFF !important;
  border-radius: 20px !important;
  padding: 16px !important;
  border: 1px solid rgba(31, 58, 38, 0.08) !important;
  transition: all 0.3s ease !important;
}

.beauty-product-card:hover {
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.07) !important;
  border-color: rgba(201, 166, 107, 0.4) !important;
}

.beauty-product-card img {
  border-radius: 14px !important;
}

/* Accordion FAQs */
.beauty-accordion .elementor-accordion .elementor-accordion-item {
  border: 1px solid rgba(31, 58, 38, 0.08) !important;
  border-radius: 16px !important;
  margin-bottom: 12px !important;
  overflow: hidden !important;
  background: #FFFFFF !important;
}

.beauty-accordion .elementor-accordion .elementor-tab-title {
  padding: 18px 24px !important;
  font-family: var(--font-heading) !important;
  font-weight: 700 !important;
  color: var(--color-dark-charcoal) !important;
}

.beauty-accordion .elementor-accordion .elementor-tab-title.elementor-active {
  background-color: var(--color-primary-green) !important;
  color: #FFFFFF !important;
}

.beauty-accordion .elementor-accordion .elementor-tab-content {
  padding: 18px 24px !important;
  color: #4A4A4A !important;
  font-size: 14px !important;
  line-height: 1.6 !important;
}

/* Trust Badges */
.beauty-trust-box {
  background: #FFFFFF !important;
  border-radius: 20px !important;
  padding: 24px !important;
  border: 1px solid rgba(31, 58, 38, 0.06) !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02) !important;
}

/* Continuous Marquee Ticker */
@keyframes beautyMarquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}

.beauty-marquee-track {
  display: flex !important;
  width: 200% !important;
  animation: beautyMarquee 25s linear infinite !important;
}

.beauty-marquee-track:hover {
  animation-play-state: paused !important;
}
`;
