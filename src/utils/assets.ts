/**
 * Serenity Salon Centralized Asset Registry
 * Stable, permanent local paths for production, preview, and dev environments.
 */

import {
  VISUAL_SERUM_BOTTLE,
  VISUAL_HAIR_DRYER,
  VISUAL_FACE_OIL,
  VISUAL_HAIR_SILK,
  VISUAL_BIO_RETINOL_JAR,
  VISUAL_PERFUME,
  VISUAL_HAIR_SERVICES,
  VISUAL_SKIN_SERVICES,
  VISUAL_MAKEUP_SERVICES,
  VISUAL_NAIL_SERVICES,
  VISUAL_SPA_SERVICES,
} from './productVisuals';

// Branding Assets
export const BRAND_ASSETS = {
  logo: '/serenity-salon-logo.png',
  logoJpg: '/serenity-salon-logo.jpg',
  logoRoot: '/serenity-salon-logo.png',
};

// Placeholders & Fallbacks
export const PLACEHOLDER_ASSETS = {
  product: VISUAL_SERUM_BOTTLE,
  service: VISUAL_SKIN_SERVICES,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
};

// Services Assets
export const SERVICE_ASSETS = {
  hero: '/assets/services/hero.jpg',
  hair: '/assets/services/hair.jpg',
  skin: '/assets/services/skin.jpg',
  makeup: '/assets/services/makeup.jpg',
  nail: '/assets/services/nail.jpg',
  spa: '/assets/services/spa.jpg',
};

// Product & Category Assets
export const PRODUCT_ASSETS = {
  // Ikonic Blaze Hair Dryer
  ikonicMain: '/assets/products/ikonic_main.jpg',
  ikonicFeatures: '/assets/products/ikonic_features.jpg',
  ikonicNozzles: '/assets/products/ikonic_nozzles.jpg',
  ikonicLifestyle: '/assets/products/ikonic_lifestyle.jpg',

  // Deals of the Day
  dealMask: '/assets/products/deal_mask.jpg',
  dealHair: '/assets/products/deal_hair.jpg',

  // Catalog Products (Ultra-high quality botanical cosmetic photography)
  prodRosewater: 'https://images.unsplash.com/photo-1608248597358-1e4344d5c192?auto=format&fit=crop&w=700&q=80',
  prodRosewaterSec: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80',
  prodFaceOil: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=700&q=80',
  prodBlushTint: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80',
  prodScalpElixir: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=700&q=80',
  prodPerfume: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80',
  prodCleanser: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80',
  prodNailPolish: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=700&q=80',
  prodBodyCreme: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=80',
  prodVitC: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80',
  prodMatchaTea: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=700&q=80',
  prodHairMist: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80',
  prodSpfFluid: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=700&q=80',
  prodLipNectar: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80',
};

// Category Thumbnails
export const CATEGORY_ASSETS = {
  skincare: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
  makeup: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
  haircare: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80',
  fragrances: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
  nailcare: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80',
  bodycare: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80',
  accessories: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
};

// Banners & Stories
export const BANNER_ASSETS = {
  hero: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80',
  summer: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1000&q=80',
  weekly: 'https://images.unsplash.com/photo-1608248597358-1e4344d5c192?auto=format&fit=crop&w=1000&q=80',
  story1: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
  story2: 'https://images.unsplash.com/photo-1608248597358-1e4344d5c192?auto=format&fit=crop&w=800&q=80',
  story3: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
  story4: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
};

// Blog Post Images
export const BLOG_ASSETS = {
  blog1: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=700&q=80',
  blog2: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=700&q=80',
  blog3: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80',
  blog4: 'https://images.unsplash.com/photo-1608248597358-1e4344d5c192?auto=format&fit=crop&w=700&q=80',
  blog5: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=700&q=80',
  blog6: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=700&q=80',
};

// Testimonial Avatars
export const AVATAR_ASSETS = {
  avatar1: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  avatar2: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
  avatar3: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  avatar4: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  avatar5: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
  avatar6: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=80',
};
