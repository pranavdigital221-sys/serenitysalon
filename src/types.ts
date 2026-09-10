export interface Product {
  id: string;
  name: string;
  category: 'Skin Care' | 'Make Up' | 'Hair Care' | 'Fragrances' | 'Nail Care' | 'Body Care' | 'Accessories & Tools';
  subCategory?: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  secondaryImage?: string;
  galleryImages?: string[];
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isDealOfTheDay?: boolean;
  tag?: string;
  description: string;
  volume?: string;
  skinType?: string[];
  ingredients?: string[];
  features?: string[];
  specifications?: Record<string, string>;
  warranty?: string;
  sku?: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
  image: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quoteTitle: string;
  comment: string;
  rating: number;
  productUsed: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  readTime: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  date: string;
  image: string;
  excerpt: string;
  content: string[];
  tags: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Orders' | 'Products' | 'Shipping' | 'Returns';
}

export interface SalonService {
  id: string;
  category: 'Hair Services' | 'Skin & Facial' | 'Makeup & Beauty' | 'Nail Care' | 'Spa & Wellness';
  name: string;
  description: string;
  duration?: string;
  priceText: string;
  tag?: string;
  badge?: string;
  includes?: string[];
  image?: string;
}

export interface ServiceCategory {
  id: string;
  name: 'Hair Services' | 'Skin & Facial' | 'Makeup & Beauty' | 'Nail Care' | 'Spa & Wellness';
  tagline: string;
  description: string;
  image: string;
  iconName: string;
  serviceCount: number;
}

export type PageView =
  | 'home'
  | 'services'
  | 'shop'
  | 'skincare'
  | 'makeup'
  | 'haircare'
  | 'about'
  | 'blogs'
  | 'admin'
  | 'privacy-policy'
  | 'terms-and-conditions'
  | 'shipping-policy'
  | 'contact-us'
  | 'cancellation-refund-policy'
  | 'pricing';

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface PaymentDetails {
  amount: number; // Total service estimated price in INR (e.g. 1000)
  advanceAmount: number; // Advance deposit paid via Razorpay (e.g. 200)
  remainingAmount: number; // Balance due at salon counter (e.g. 800)
  status: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paidAt?: string;
  method?: string; // UPI, Card, NetBanking, etc.
}

export interface Appointment {
  id: string; // e.g. "SS-8492" or "apt_1724231001_01"
  serviceName: string;
  serviceCategory?: string;
  servicePrice?: number;
  preferredDate: string; // YYYY-MM-DD
  preferredTime: string; // e.g. "11:00 AM"
  fullName: string;
  phone: string;
  email?: string;
  notes?: string;
  status: AppointmentStatus;
  payment?: PaymentDetails;
  createdAt: string; // ISO String
  updatedAt?: string; // ISO String
  idempotencyKey?: string; // Client-side unique UUID for double-click & retry idempotency
  notificationSent?: boolean;
  notificationDetails?: {
    recipient: string;
    sentAt: string;
    status: 'delivered' | 'simulated' | 'failed' | 'not_configured';
    messagePreview?: string;
  };
  emailStatus?: 'PENDING' | 'SENDING' | 'SENT' | 'FAILED';
  emailError?: string;
  emailSentAt?: string;
  whatsAppStatus?: 'SENT' | 'PENDING' | 'FAILED';
}

export interface AppointmentStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  todayCount: number;
}

export interface AdminAuthSession {
  isAuthenticated: boolean;
  token: string;
  adminEmail: string;
  role: 'admin' | 'manager';
  expiresAt: number;
}

export interface AdminSalonSettings {
  advancePercentage: number; // e.g. 20 for 20%
  defaultAdvanceAmount: number; // fallback flat amount in INR e.g. 200
  adminPhone: string; // e.g. "+91 8108765851"
  adminEmail: string; // e.g. "pranavdigital221@gmail.com"
  enableAdvancePayments: boolean;
}

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PENDING'
  | 'CONFIRMED'
  | 'PAID'
  | 'PROCESSING'
  | 'DISPATCHED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'Pending'
  | 'Confirmed'
  | 'Delivered'
  | 'In Transit'
  | 'Out for Delivery'
  | 'Processing'
  | 'Shipped'
  | 'Completed'
  | 'Cancelled';

export type PaymentStatusEnum =
  | 'PENDING'
  | 'AUTHORIZED'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED'
  | 'Pending'
  | 'Authorized'
  | 'Paid'
  | 'Failed'
  | 'Refunded';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  street: string;
  area?: string;
  city: string;
  state: string;
  postalCode: string;
  landmark?: string;
}

export interface ProductOrderItem {
  productId: string;
  name: string;
  category?: string;
  image: string;
  unitPrice: number;
  originalPrice?: number;
  quantity: number;
  totalPrice: number;
}

export interface ProductOrder {
  id: string; // e.g. "SRN-84920"
  orderId: string;
  customerId?: string;
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: ShippingAddress;
  items: ProductOrderItem[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  shipping: number;
  shippingFee?: number;
  grandTotal: number;
  total: number;
  currency: 'INR';
  paymentStatus: PaymentStatusEnum;
  orderStatus: OrderStatus;
  status: OrderStatus;
  paymentMethod?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paidAt?: string;
  notes?: string;
  emailStatus?: 'PENDING' | 'SENT' | 'FAILED';
  emailError?: string;
  trackingNumber?: string;
  trackingCarrier?: string;
  carrier?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt?: string;
  pointsEarned?: number;
  inventoryDeducted?: boolean;
}

export interface UserNotificationPreferences {
  emailOrderConfirmation: boolean;
  emailAppointmentReminder: boolean;
  whatsappDispatchAlerts: boolean;
  smsDeliveryUpdates: boolean;
  promotionsAndMultipliers: boolean;
  preferredChannel: 'email' | 'whatsapp' | 'sms' | 'all';
}

export interface UserOrder {
  id: string; // e.g. "SRN-84920"
  orderId?: string;
  date: string; // e.g. "Aug 20, 2026"
  createdAt: string; // ISO
  status: OrderStatus;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatusEnum;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  grandTotal?: number;
  paymentMethod: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  trackingNumber?: string;
  trackingCarrier?: string;
  estimatedDelivery?: string;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
    area?: string;
    landmark?: string;
  };
  pointsEarned: number;
}

export type LoyaltyTierLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface PointsHistoryItem {
  id: string;
  date: string;
  title: string;
  points: number;
  type: 'earned' | 'redeemed' | 'bonus';
  orderId?: string;
}

export interface LoyaltyProfile {
  pointsBalance: number;
  lifetimePoints: number;
  tier: LoyaltyTierLevel;
  nextTierPoints: number;
  pointsToNextTier: number;
  tierProgress: number; // 0 to 100 percentage
  memberSince: string;
  history: PointsHistoryItem[];
  availableCoupons: {
    code: string;
    discountINR: number;
    requiredPoints: number;
    description: string;
  }[];
}

export interface ReferralFriend {
  id: string;
  name: string;
  avatar?: string;
  status: 'Joined' | 'First Purchase Made' | 'Reward Credited';
  date: string;
  rewardEarned: number; // points
}

export interface ReferralData {
  referralCode: string;
  referralLink: string;
  friendsInvited: number;
  successfulOrders: number;
  totalPointsEarned: number;
  history: ReferralFriend[];
}

export type RewardCategory = 'all' | 'discounts' | 'services' | 'products';

export interface RewardCatalogItem {
  id: string;
  title: string;
  category: 'discounts' | 'services' | 'products';
  requiredPoints: number;
  valueINR: number;
  description: string;
  codePrefix: string;
  badge?: string;
  image?: string;
  terms?: string;
  serviceCategory?: string;
  type: 'store_discount' | 'service_upgrade' | 'free_product';
}

export interface UnlockedReward {
  id: string;
  rewardId: string;
  title: string;
  code: string;
  type: 'store_discount' | 'service_upgrade' | 'free_product';
  valueINR: number;
  pointsSpent: number;
  unlockedAt: string;
  expiresAt: string;
  isUsed: boolean;
  terms?: string;
}

export interface UserReview {
  id: string;
  orderId?: string;
  targetId: string;
  targetType: 'product' | 'service';
  targetName: string;
  targetImage?: string;
  rating: number; // 1 to 5
  qualityRating?: number; // 1 to 5
  serviceRating?: number; // 1 to 5
  title: string;
  comment: string;
  authorName: string;
  authorEmail?: string;
  createdAt: string;
  verifiedPurchase: boolean;
  wouldRecommend: boolean;
  likesCount: number;
  responseFromSalon?: string;
}

export interface UpcomingAppointmentReminder {
  id: string;
  serviceName: string;
  serviceCategory: string;
  preferredDate: string;
  preferredTime: string;
  stylistName: string;
  salonBranch: string;
  status: 'Confirmed' | 'Pending';
  hoursRemaining: number;
  advancePaidINR: number;
  reminderSent: boolean;
  dismissed?: boolean;
}

