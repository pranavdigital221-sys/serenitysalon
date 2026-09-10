import {
  UserOrder,
  LoyaltyProfile,
  LoyaltyTierLevel,
  ReferralData,
  CartItem,
  PointsHistoryItem,
  UserNotificationPreferences,
  RewardCatalogItem,
  UnlockedReward,
  UserReview,
  UpcomingAppointmentReminder,
} from '../types';
import { PRODUCTS } from '../data/mockData';

const ORDERS_STORAGE_KEY = 'serenity_user_orders_v1';
const LOYALTY_STORAGE_KEY = 'serenity_user_loyalty_v1';
const REFERRAL_STORAGE_KEY = 'serenity_user_referral_v1';
const NOTIFICATIONS_STORAGE_KEY = 'serenity_user_notifications_v1';
const UNLOCKED_REWARDS_STORAGE_KEY = 'serenity_unlocked_rewards_v1';
const REVIEWS_STORAGE_KEY = 'serenity_user_reviews_v1';
const APPOINTMENT_REMINDER_STORAGE_KEY = 'serenity_appointment_reminder_v1';

// Initial Mock Orders
export const INITIAL_MOCK_ORDERS: UserOrder[] = [
  {
    id: 'SRN-99410',
    date: 'Today, Aug 23, 2026',
    createdAt: '2026-08-23T08:30:00Z',
    status: 'Processing',
    items: [
      {
        product: PRODUCTS[2], // Bio Retinol Overnight
        quantity: 1,
      },
      {
        product: PRODUCTS[0], // Damask Rosewater Elixir
        quantity: 1,
      },
    ],
    subtotal: 3398,
    discount: 300,
    shipping: 0,
    total: 3098,
    paymentMethod: 'UPI (Instant Pay / Razorpay)',
    trackingNumber: 'BLUEDART-9901824',
    trackingCarrier: 'BlueDart Express Air',
    estimatedDelivery: 'Preparing for dispatch • Expected Aug 25, 2026',
    shippingAddress: {
      fullName: 'Aasha Gandal',
      street: '402, Lotus Grand Residences, Linking Road',
      city: 'Bandra West, Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
      phone: '+91 98200 12345',
    },
    pointsEarned: 310,
  },
  {
    id: 'SRN-98920',
    date: 'Aug 21, 2026',
    createdAt: '2026-08-21T11:00:00Z',
    status: 'Shipped',
    items: [
      {
        product: PRODUCTS[3], // Hair Silk Treatment
        quantity: 2,
      },
    ],
    subtotal: 3998,
    discount: 400,
    shipping: 0,
    total: 3598,
    paymentMethod: 'Razorpay (HDFC Platinum Card)',
    trackingNumber: 'DELHIVERY-8839201',
    trackingCarrier: 'Delhivery Surface',
    estimatedDelivery: 'In Transit • Expected Tomorrow by 4:00 PM',
    shippingAddress: {
      fullName: 'Aasha Gandal',
      street: '402, Lotus Grand Residences, Linking Road',
      city: 'Bandra West, Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
      phone: '+91 98200 12345',
    },
    pointsEarned: 360,
  },
  {
    id: 'SRN-98421',
    date: 'Aug 18, 2026',
    createdAt: '2026-08-18T14:20:00Z',
    status: 'Delivered',
    items: [
      {
        product: PRODUCTS[0], // Damask Rosewater Elixir
        quantity: 2,
      },
      {
        product: PRODUCTS[4], // Professional Hair Dryer
        quantity: 1,
      },
    ],
    subtotal: 5198,
    discount: 500,
    shipping: 0,
    total: 4698,
    paymentMethod: 'UPI (Google Pay)',
    trackingNumber: 'BLUEDART-8829104',
    trackingCarrier: 'BlueDart Express',
    estimatedDelivery: 'Delivered on Aug 21, 2026',
    shippingAddress: {
      fullName: 'Aasha Gandal',
      street: '402, Lotus Grand Residences, Linking Road',
      city: 'Bandra West, Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
      phone: '+91 98200 12345',
    },
    pointsEarned: 470,
  },
  {
    id: 'SRN-97305',
    date: 'Aug 10, 2026',
    createdAt: '2026-08-10T10:15:00Z',
    status: 'Delivered',
    items: [
      {
        product: PRODUCTS[1], // Cold Pressed Face Oil
        quantity: 1,
      },
      {
        product: PRODUCTS[2], // Bio Retinol Overnight
        quantity: 1,
      },
    ],
    subtotal: 3198,
    discount: 0,
    shipping: 0,
    total: 3198,
    paymentMethod: 'Razorpay (HDFC Credit Card)',
    trackingNumber: 'DELHIVERY-7740192',
    trackingCarrier: 'Delhivery Air',
    estimatedDelivery: 'Delivered on Aug 13, 2026',
    shippingAddress: {
      fullName: 'Aasha Gandal',
      street: '402, Lotus Grand Residences, Linking Road',
      city: 'Bandra West, Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
      phone: '+91 98200 12345',
    },
    pointsEarned: 320,
  },
  {
    id: 'SRN-95112',
    date: 'Jul 28, 2026',
    createdAt: '2026-07-28T16:45:00Z',
    status: 'Delivered',
    items: [
      {
        product: PRODUCTS[3], // Hair Silk Treatment
        quantity: 1,
      },
      {
        product: PRODUCTS[5], // Velvet Jasmine Perfume
        quantity: 1,
      },
    ],
    subtotal: 4498,
    discount: 450,
    shipping: 0,
    total: 4048,
    paymentMethod: 'UPI (PhonePe)',
    trackingNumber: 'EKART-9930114',
    trackingCarrier: 'Ekart Logistics',
    estimatedDelivery: 'Delivered on Jul 31, 2026',
    shippingAddress: {
      fullName: 'Aasha Gandal',
      street: '402, Lotus Grand Residences, Linking Road',
      city: 'Bandra West, Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
      phone: '+91 98200 12345',
    },
    pointsEarned: 405,
  },
];

// Tier configuration
export const TIER_CONFIG: Record<
  LoyaltyTierLevel,
  {
    name: string;
    minPoints: number;
    maxPoints: number;
    multiplier: number;
    discountPercent: number;
    color: string;
    bgColor: string;
    borderColor: string;
    perks: string[];
  }
> = {
  Bronze: {
    name: 'Bronze Circle',
    minPoints: 0,
    maxPoints: 499,
    multiplier: 1.0,
    discountPercent: 0,
    color: '#8A5D3B',
    bgColor: '#FDF6F0',
    borderColor: '#E8D5C4',
    perks: ['1 Point per ₹10 spent', 'Birthday Beauty Surprise', 'Standard Shipping'],
  },
  Silver: {
    name: 'Silver Radiance',
    minPoints: 500,
    maxPoints: 1499,
    multiplier: 1.25,
    discountPercent: 5,
    color: '#6B7280',
    bgColor: '#F3F4F6',
    borderColor: '#D1D5DB',
    perks: ['1.25x Points on orders', '5% Extra Member Discount', 'Free Standard Shipping across India', 'Early Sale Access (12h early)'],
  },
  Gold: {
    name: 'Gold Botanical VIP',
    minPoints: 1500,
    maxPoints: 3499,
    multiplier: 1.5,
    discountPercent: 10,
    color: '#C9A66B',
    bgColor: '#FDF8EC',
    borderColor: '#EADBBA',
    perks: [
      '1.5x Points on all purchases & salon appointments',
      '10% Sitewide VIP Discount',
      'Free Priority Express Shipping',
      'Complimentary Scalp / Facial Consultation add-on',
      'Exclusive Pre-Launch Beauty Boxes',
    ],
  },
  Platinum: {
    name: 'Emerald Platinum Elite',
    minPoints: 3500,
    maxPoints: 999999,
    multiplier: 2.0,
    discountPercent: 15,
    color: '#1F3A26',
    bgColor: '#EDF4EF',
    borderColor: '#C3D9C9',
    perks: [
      '2.0x Double Points on everything',
      '15% Permanent Elite Member Discount',
      'Complimentary Full Spa Ritual on Birthday month',
      'VIP Salon Priority Lane & Private Suite Booking',
      'Dedicated 24/7 Personal Beauty Concierge',
    ],
  },
};

export const INITIAL_LOYALTY_PROFILE: LoyaltyProfile = {
  pointsBalance: 2450,
  lifetimePoints: 4200,
  tier: 'Gold',
  nextTierPoints: 3500,
  pointsToNextTier: 1050,
  tierProgress: 47.5, // ((2450 - 1500) / (3500 - 1500)) * 100
  memberSince: 'March 2025',
  history: [
    {
      id: 'pt-1',
      date: 'Aug 18, 2026',
      title: 'Order #SRN-98421 Purchase',
      points: 470,
      type: 'earned',
      orderId: 'SRN-98421',
    },
    {
      id: 'pt-2',
      date: 'Aug 15, 2026',
      title: 'Friend Referral Bonus (Pooja K.)',
      points: 500,
      type: 'bonus',
    },
    {
      id: 'pt-3',
      date: 'Aug 10, 2026',
      title: 'Order #SRN-97305 Purchase',
      points: 320,
      type: 'earned',
      orderId: 'SRN-97305',
    },
    {
      id: 'pt-4',
      date: 'Aug 02, 2026',
      title: 'Redeemed for ₹200 Salon Voucher',
      points: -1000,
      type: 'redeemed',
    },
    {
      id: 'pt-5',
      date: 'Jul 28, 2026',
      title: 'Order #SRN-95112 Purchase',
      points: 405,
      type: 'earned',
      orderId: 'SRN-95112',
    },
  ],
  availableCoupons: [
    {
      code: 'SERENITY-GOLD-100',
      discountINR: 100,
      requiredPoints: 500,
      description: '₹100 OFF on any order over ₹999',
    },
    {
      code: 'SERENITY-GOLD-250',
      discountINR: 250,
      requiredPoints: 1000,
      description: '₹250 OFF on any order over ₹1,999',
    },
    {
      code: 'SERENITY-VIP-500',
      discountINR: 500,
      requiredPoints: 2000,
      description: '₹500 OFF on luxury salon packages & cosmetics',
    },
  ],
};

export const INITIAL_REFERRAL_DATA: ReferralData = {
  referralCode: 'SERENITY-AURA-8921',
  referralLink: 'https://serenitysalon.in/invite?ref=SERENITY-AURA-8921',
  friendsInvited: 5,
  successfulOrders: 3,
  totalPointsEarned: 1500,
  history: [
    {
      id: 'ref-1',
      name: 'Pooja Kulkarni',
      status: 'Reward Credited',
      date: 'Aug 15, 2026',
      rewardEarned: 500,
    },
    {
      id: 'ref-2',
      name: 'Sneha Patel',
      status: 'Reward Credited',
      date: 'Aug 04, 2026',
      rewardEarned: 500,
    },
    {
      id: 'ref-3',
      name: 'Rhea Sharma',
      status: 'Reward Credited',
      date: 'Jul 19, 2026',
      rewardEarned: 500,
    },
    {
      id: 'ref-4',
      name: 'Tanvi Deshmukh',
      status: 'Joined',
      date: 'Aug 21, 2026',
      rewardEarned: 0,
    },
    {
      id: 'ref-5',
      name: 'Ananya Gupta',
      status: 'Joined',
      date: 'Aug 22, 2026',
      rewardEarned: 0,
    },
  ],
};

// Storage Helpers
export function getUserOrders(): UserOrder[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_ORDERS));
      return INITIAL_MOCK_ORDERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOCK_ORDERS;
  }
}

export function saveUserOrders(orders: UserOrder[]): void {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders to localStorage', e);
  }
}

export function calculateTier(points: number): {
  tier: LoyaltyTierLevel;
  nextTierPoints: number;
  pointsToNextTier: number;
  tierProgress: number;
} {
  if (points >= 3500) {
    return {
      tier: 'Platinum',
      nextTierPoints: 5000,
      pointsToNextTier: 0,
      tierProgress: 100,
    };
  } else if (points >= 1500) {
    const progress = Math.min(100, Math.max(0, ((points - 1500) / (3500 - 1500)) * 100));
    return {
      tier: 'Gold',
      nextTierPoints: 3500,
      pointsToNextTier: 3500 - points,
      tierProgress: progress,
    };
  } else if (points >= 500) {
    const progress = Math.min(100, Math.max(0, ((points - 500) / (1500 - 500)) * 100));
    return {
      tier: 'Silver',
      nextTierPoints: 1500,
      pointsToNextTier: 1500 - points,
      tierProgress: progress,
    };
  } else {
    const progress = Math.min(100, Math.max(0, (points / 500) * 100));
    return {
      tier: 'Bronze',
      nextTierPoints: 500,
      pointsToNextTier: 500 - points,
      tierProgress: progress,
    };
  }
}

export function getUserLoyalty(): LoyaltyProfile {
  try {
    const raw = localStorage.getItem(LOYALTY_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOYALTY_STORAGE_KEY, JSON.stringify(INITIAL_LOYALTY_PROFILE));
      return INITIAL_LOYALTY_PROFILE;
    }
    const profile: LoyaltyProfile = JSON.parse(raw);
    const tierMeta = calculateTier(profile.pointsBalance);
    return {
      ...profile,
      ...tierMeta,
    };
  } catch {
    return INITIAL_LOYALTY_PROFILE;
  }
}

export function saveUserLoyalty(profile: LoyaltyProfile): void {
  try {
    localStorage.setItem(LOYALTY_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save loyalty to localStorage', e);
  }
}

export function getUserReferral(): ReferralData {
  try {
    const raw = localStorage.getItem(REFERRAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(INITIAL_REFERRAL_DATA));
      return INITIAL_REFERRAL_DATA;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_REFERRAL_DATA;
  }
}

export function saveUserReferral(data: ReferralData): void {
  try {
    localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save referral data to localStorage', e);
  }
}

export function createNewOrder(
  items: CartItem[],
  subtotal: number,
  discount: number,
  shipping: number,
  total: number,
  paymentMethod = 'UPI (Instant Pay)'
): { order: UserOrder; pointsEarned: number } {
  const currentOrders = getUserOrders();
  const loyalty = getUserLoyalty();
  
  // Calculate points: 10 points per ₹100, multiplied by Tier multiplier
  const multiplier = TIER_CONFIG[loyalty.tier]?.multiplier || 1.0;
  const basePoints = Math.round((total / 100) * 10);
  const pointsEarned = Math.round(basePoints * multiplier);

  const orderId = `SRN-${Math.floor(10000 + Math.random() * 90000)}`;
  const todayStr = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const newOrder: UserOrder = {
    id: orderId,
    date: todayStr,
    createdAt: new Date().toISOString(),
    status: 'Processing',
    items,
    subtotal,
    discount,
    shipping,
    total,
    paymentMethod,
    trackingNumber: `EXP-${Math.floor(1000000 + Math.random() * 9000000)}`,
    trackingCarrier: 'Serenity Express Courier',
    estimatedDelivery: 'Expected in 2-3 business days',
    shippingAddress: {
      fullName: 'Aasha Gandal',
      street: '402, Lotus Grand Residences, Linking Road',
      city: 'Bandra West, Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
      phone: '+91 98200 12345',
    },
    pointsEarned,
  };

  // Prepend to orders
  const updatedOrders = [newOrder, ...currentOrders];
  saveUserOrders(updatedOrders);

  // Update Loyalty Profile
  const updatedPoints = loyalty.pointsBalance + pointsEarned;
  const updatedLifetime = loyalty.lifetimePoints + pointsEarned;
  const tierMeta = calculateTier(updatedPoints);

  const updatedHistory: PointsHistoryItem[] = [
    {
      id: `pt-${Date.now()}`,
      date: todayStr,
      title: `Order #${orderId} Purchase`,
      points: pointsEarned,
      type: 'earned',
      orderId,
    },
    ...loyalty.history,
  ];

  saveUserLoyalty({
    ...loyalty,
    pointsBalance: updatedPoints,
    lifetimePoints: updatedLifetime,
    ...tierMeta,
    history: updatedHistory,
  });

  return { order: newOrder, pointsEarned };
}

// User Notification Preferences
export const DEFAULT_NOTIFICATION_PREFERENCES: UserNotificationPreferences = {
  emailOrderConfirmation: true,
  emailAppointmentReminder: true,
  whatsappDispatchAlerts: true,
  smsDeliveryUpdates: false,
  promotionsAndMultipliers: true,
  preferredChannel: 'email',
};

export const getUserNotifications = (): UserNotificationPreferences => {
  try {
    const data = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!data) return DEFAULT_NOTIFICATION_PREFERENCES;
    return { ...DEFAULT_NOTIFICATION_PREFERENCES, ...JSON.parse(data) };
  } catch {
    return DEFAULT_NOTIFICATION_PREFERENCES;
  }
};

export const saveUserNotifications = (prefs: UserNotificationPreferences): void => {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
};

// ==========================================
// REWARDS CATALOG DATA & LOGIC
// ==========================================
export const REWARDS_CATALOG: RewardCatalogItem[] = [
  // Store Discounts
  {
    id: 'rew-disc-150',
    title: '₹150 Store Discount Voucher',
    category: 'discounts',
    type: 'store_discount',
    requiredPoints: 350,
    valueINR: 150,
    description: 'Instant discount voucher applicable on any botanical skincare or hair care order above ₹999.',
    codePrefix: 'AURA-DISC-150',
    badge: 'Popular',
    terms: 'Valid for 90 days. Applicable on all full-priced cosmetic items.',
  },
  {
    id: 'rew-disc-300',
    title: '₹300 Sitewide Discount Voucher',
    category: 'discounts',
    type: 'store_discount',
    requiredPoints: 700,
    valueINR: 300,
    description: 'Generous ₹300 cart deduction on purchases above ₹1,499 across all brand categories.',
    codePrefix: 'AURA-DISC-300',
    badge: 'Best Value',
    terms: 'Valid for 90 days. Can be combined with standard free delivery.',
  },
  {
    id: 'rew-disc-600',
    title: '₹600 VIP Shopping Credit',
    category: 'discounts',
    type: 'store_discount',
    requiredPoints: 1400,
    valueINR: 600,
    description: 'Premium ₹600 luxury shopping credit for orders above ₹2,499. Perfect for full regime sets.',
    codePrefix: 'AURA-VIP-600',
    badge: 'Gold VIP',
    terms: 'Valid for 120 days on all product bundles and luxury tools.',
  },
  {
    id: 'rew-disc-1200',
    title: '₹1,200 Luxury Beauty Grant',
    category: 'discounts',
    type: 'store_discount',
    requiredPoints: 2500,
    valueINR: 1200,
    description: 'Substantial ₹1,200 discount for orders above ₹3,999 on high-potency serums and professional kits.',
    codePrefix: 'AURA-ELITE-1200',
    badge: 'Platinum',
    terms: 'Valid for 180 days across all product and hair device collections.',
  },

  // Salon Service Upgrades
  {
    id: 'rew-srv-scalp',
    title: 'Complimentary Scalp Detox & Kera-Infusion Upgrade',
    category: 'services',
    type: 'service_upgrade',
    requiredPoints: 450,
    valueINR: 800,
    description: 'Add-on therapeutic scalp clarifying treatment and botanical keratin steam infusion during any hair service.',
    codePrefix: 'UPGRADE-SCALPDETOX',
    serviceCategory: 'Hair Services',
    badge: 'Top Rated Upgrade',
    terms: 'Present code at Serenity Salon reception during your appointment. Valid for 60 days.',
  },
  {
    id: 'rew-srv-goldfacial',
    title: 'Organic 24K Gold Facial Radiance Booster Upgrade',
    category: 'services',
    type: 'service_upgrade',
    requiredPoints: 850,
    valueINR: 1200,
    description: 'Upgrades any standard facial with 24K micro-gold leaf hydration sheet and anti-pollution serum lock.',
    codePrefix: 'UPGRADE-24KGOLD',
    serviceCategory: 'Skin & Facial',
    badge: 'Luxury Ritual',
    terms: 'Applicable on HydraGlow, Brightening, or Ayurvedic Facial bookings.',
  },
  {
    id: 'rew-srv-hairmask',
    title: 'Botanical Deep Conditioning Hair Mask & Scalp Massage',
    category: 'services',
    type: 'service_upgrade',
    requiredPoints: 600,
    valueINR: 950,
    description: '15-minute nourishing argan & rosemary hair mask therapy with hot towel wrap and acupressure massage.',
    codePrefix: 'UPGRADE-HAIRMASK',
    serviceCategory: 'Hair Services',
    badge: 'Relaxation',
    terms: 'Can be combined with haircuts, hair coloring, or hair styling sessions.',
  },
  {
    id: 'rew-srv-gelpolish',
    title: 'Aromatherapy Hand Massage & Organic Gel Polish',
    category: 'services',
    type: 'service_upgrade',
    requiredPoints: 500,
    valueINR: 750,
    description: 'Complimentary non-toxic longwear gel polish finish and relaxing lavender hand acupressure treatment.',
    codePrefix: 'UPGRADE-GELPOLISH',
    serviceCategory: 'Nail Care',
    badge: 'Nail Upgrade',
    terms: 'Valid with any Spa Manicure or Pedicure booking at Bandra West salon.',
  },
  {
    id: 'rew-srv-bridal',
    title: 'Bridal Glow & 24K Skin Polish Add-On Upgrade',
    category: 'services',
    type: 'service_upgrade',
    requiredPoints: 1500,
    valueINR: 2500,
    description: 'Exclusive bridal pre-event skin polish, collagen lip plumping mask, and neck decollete glow massage.',
    codePrefix: 'UPGRADE-BRIDALGLOW',
    serviceCategory: 'Makeup & Beauty',
    badge: 'Bridal Special',
    terms: 'Applicable for any Bridal / Festive package consultation or session.',
  },

  // Complimentary Botanical Products
  {
    id: 'rew-prod-rosemist',
    title: 'Damask Rosewater Elixir Travel Mist (30ml)',
    category: 'products',
    type: 'free_product',
    requiredPoints: 400,
    valueINR: 499,
    description: 'Receive a free luxury travel-sized Damask Rose refreshing facial mist shipped with your next purchase.',
    codePrefix: 'GIFT-ROSEMIST',
    badge: 'Free Gift',
    terms: 'Claim with voucher code at checkout. Free shipping when added to cart.',
  },
  {
    id: 'rew-prod-minibooster',
    title: 'Mini Bio-Retinol Overnight Booster (15ml)',
    category: 'products',
    type: 'free_product',
    requiredPoints: 750,
    valueINR: 899,
    description: 'Botanical bakuchiol & retinol night concentrate in a chic travel dropper bottle to restore skin firmness.',
    codePrefix: 'GIFT-RETINOLMINI',
    badge: 'Member Favorite',
    terms: 'Auto-added to your cart via promo code redemption.',
  },
  {
    id: 'rew-prod-comb',
    title: 'Handcrafted Neem Scalp Comb & Silk Pouch',
    category: 'products',
    type: 'free_product',
    requiredPoints: 350,
    valueINR: 450,
    description: 'Pure anti-static medicinal neem wood wide-tooth detangler comb for scalp stimulation and hair health.',
    codePrefix: 'GIFT-NEEMCOMB',
    badge: 'Eco-Friendly',
    terms: 'Complimentary eco-friendly accessory code redeemed at checkout.',
  },
];

export const INITIAL_UNLOCKED_REWARDS: UnlockedReward[] = [
  {
    id: 'unl-101',
    rewardId: 'rew-disc-150',
    title: '₹150 Store Discount Voucher',
    code: 'AURA-DISC-150-WELCOME',
    type: 'store_discount',
    valueINR: 150,
    pointsSpent: 350,
    unlockedAt: 'Aug 18, 2026',
    expiresAt: 'Nov 18, 2026',
    isUsed: false,
    terms: 'Valid on orders over ₹999.',
  },
  {
    id: 'unl-102',
    rewardId: 'rew-srv-scalp',
    title: 'Complimentary Scalp Detox Upgrade',
    code: 'UPGRADE-SCALPDETOX-VIP',
    type: 'service_upgrade',
    valueINR: 800,
    pointsSpent: 450,
    unlockedAt: 'Aug 02, 2026',
    expiresAt: 'Oct 02, 2026',
    isUsed: false,
    terms: 'Present code at salon during booking.',
  },
];

export function getUnlockedRewards(): UnlockedReward[] {
  try {
    const raw = localStorage.getItem(UNLOCKED_REWARDS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(UNLOCKED_REWARDS_STORAGE_KEY, JSON.stringify(INITIAL_UNLOCKED_REWARDS));
      return INITIAL_UNLOCKED_REWARDS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_UNLOCKED_REWARDS;
  }
}

export function saveUnlockedRewards(rewards: UnlockedReward[]): void {
  try {
    localStorage.setItem(UNLOCKED_REWARDS_STORAGE_KEY, JSON.stringify(rewards));
  } catch (err) {
    console.error('Failed to save unlocked rewards', err);
  }
}

export function redeemRewardCatalogItem(reward: RewardCatalogItem): {
  success: boolean;
  unlockedReward?: UnlockedReward;
  error?: string;
} {
  const loyalty = getUserLoyalty();

  if (loyalty.pointsBalance < reward.requiredPoints) {
    return {
      success: false,
      error: `You need ${reward.requiredPoints - loyalty.pointsBalance} more points to redeem this reward.`,
    };
  }

  const updatedPoints = loyalty.pointsBalance - reward.requiredPoints;
  const tierMeta = calculateTier(updatedPoints);
  const todayStr = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const uniqueCode = `${reward.codePrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newUnlockedReward: UnlockedReward = {
    id: `unl-${Date.now()}`,
    rewardId: reward.id,
    title: reward.title,
    code: uniqueCode,
    type: reward.type,
    valueINR: reward.valueINR,
    pointsSpent: reward.requiredPoints,
    unlockedAt: todayStr,
    expiresAt: new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(Date.now() + 90 * 86400000)),
    isUsed: false,
    terms: reward.terms,
  };

  // Save unlocked rewards
  const existingUnlocked = getUnlockedRewards();
  const updatedUnlocked = [newUnlockedReward, ...existingUnlocked];
  saveUnlockedRewards(updatedUnlocked);

  // Update loyalty history and balance
  const updatedHistory: PointsHistoryItem[] = [
    {
      id: `pt-${Date.now()}`,
      date: todayStr,
      title: `Redeemed ${reward.requiredPoints} pts for ${reward.title} (${uniqueCode})`,
      points: -reward.requiredPoints,
      type: 'redeemed',
    },
    ...loyalty.history,
  ];

  saveUserLoyalty({
    ...loyalty,
    pointsBalance: updatedPoints,
    ...tierMeta,
    history: updatedHistory,
  });

  return { success: true, unlockedReward: newUnlockedReward };
}

// ==========================================
// USER REVIEWS DATA & STORAGE
// ==========================================
export const INITIAL_USER_REVIEWS: UserReview[] = [
  {
    id: 'rev-01',
    orderId: 'SRN-98421',
    targetId: 'prod_001',
    targetType: 'product',
    targetName: 'Damask Rosewater Elixir',
    rating: 5,
    qualityRating: 5,
    serviceRating: 5,
    title: 'Transformative hydration and beautiful natural scent!',
    comment: 'The mist is ultra-fine and leaves my skin deeply moisturized without any stickiness. I use it both morning and night.',
    authorName: 'Aasha Gandal',
    authorEmail: 'aasha.gandal@example.com',
    createdAt: 'Aug 22, 2026',
    verifiedPurchase: true,
    wouldRecommend: true,
    likesCount: 14,
    responseFromSalon: 'Thank you so much Aasha! We are delighted that the Damask Rose Elixir is working beautifully for your daily regime.',
  },
  {
    id: 'rev-02',
    orderId: 'SRN-98421',
    targetId: 'prod_005',
    targetType: 'product',
    targetName: 'Ikonic Pro 2800+ Hair Dryer',
    rating: 5,
    qualityRating: 5,
    serviceRating: 5,
    title: 'Salon-grade blow dry at home in 10 minutes!',
    comment: 'Fast drying without burning my hair ends. The cool shot button and nozzle attachments make styling effortless.',
    authorName: 'Aasha Gandal',
    authorEmail: 'aasha.gandal@example.com',
    createdAt: 'Aug 21, 2026',
    verifiedPurchase: true,
    wouldRecommend: true,
    likesCount: 9,
  },
  {
    id: 'rev-03',
    orderId: 'SRN-97305',
    targetId: 'prod_002',
    targetType: 'product',
    targetName: 'Cold Pressed Botanical Face Oil',
    rating: 4,
    qualityRating: 5,
    serviceRating: 4,
    title: 'Nourishing and lightweight absorption',
    comment: 'Subtle botanical scent, absorbs in about 2 minutes. Great base under clean makeup.',
    authorName: 'Aasha Gandal',
    authorEmail: 'aasha.gandal@example.com',
    createdAt: 'Aug 14, 2026',
    verifiedPurchase: true,
    wouldRecommend: true,
    likesCount: 6,
  },
];

export function getUserReviews(): UserReview[] {
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(INITIAL_USER_REVIEWS));
      return INITIAL_USER_REVIEWS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USER_REVIEWS;
  }
}

export function saveUserReview(review: Omit<UserReview, 'id' | 'createdAt' | 'likesCount'>): {
  review: UserReview;
  bonusPointsEarned: number;
} {
  const existing = getUserReviews();
  const todayStr = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const fullReview: UserReview = {
    ...review,
    id: `rev-${Date.now()}`,
    createdAt: todayStr,
    likesCount: 0,
  };

  const updated = [fullReview, ...existing];
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save review to storage', err);
  }

  // Award +100 bonus Aura points for leaving verified review
  const loyalty = getUserLoyalty();
  const bonusPoints = 100;
  const updatedPoints = loyalty.pointsBalance + bonusPoints;
  const updatedLifetime = loyalty.lifetimePoints + bonusPoints;
  const tierMeta = calculateTier(updatedPoints);

  const updatedHistory: PointsHistoryItem[] = [
    {
      id: `pt-${Date.now()}`,
      date: todayStr,
      title: `Verified Review Bonus for "${review.targetName}"`,
      points: bonusPoints,
      type: 'bonus',
      orderId: review.orderId,
    },
    ...loyalty.history,
  ];

  saveUserLoyalty({
    ...loyalty,
    pointsBalance: updatedPoints,
    lifetimePoints: updatedLifetime,
    ...tierMeta,
    history: updatedHistory,
  });

  return { review: fullReview, bonusPointsEarned: bonusPoints };
}

// ==========================================
// 24-HOUR APPOINTMENT REMINDER HELPER
// ==========================================
export function getUpcomingAppointmentReminder(): UpcomingAppointmentReminder | null {
  try {
    // Generate tomorrow's date format for realistic 24-hour reminder
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(tomorrow);

    const defaultReminder: UpcomingAppointmentReminder = {
      id: 'apt-active-user-24h',
      serviceName: 'Botanical Keratin Infusion & Spa Ritual',
      serviceCategory: 'Hair Services',
      preferredDate: tomorrowFormatted,
      preferredTime: '11:00 AM',
      stylistName: 'Priya Sharma (Senior Master Stylist)',
      salonBranch: 'Serenity Flagship Suite, Bandra West, Mumbai',
      status: 'Confirmed',
      hoursRemaining: 22,
      advancePaidINR: 350,
      reminderSent: true,
    };

    const raw = localStorage.getItem(APPOINTMENT_REMINDER_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(APPOINTMENT_REMINDER_STORAGE_KEY, JSON.stringify(defaultReminder));
      return defaultReminder;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function dismissAppointmentReminder(): void {
  try {
    const existing = getUpcomingAppointmentReminder();
    if (existing) {
      localStorage.setItem(
        APPOINTMENT_REMINDER_STORAGE_KEY,
        JSON.stringify({ ...existing, reminderSent: false, dismissed: true })
      );
    }
  } catch {
    // ignore
  }
}

