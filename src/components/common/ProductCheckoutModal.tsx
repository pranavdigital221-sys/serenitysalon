import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Loader2,
  CreditCard,
  Truck,
  MapPin,
  User,
  Phone,
  Mail,
  ShoppingBag,
  MessageCircle,
  Check,
  ChevronLeft,
  Tag,
  Package,
} from 'lucide-react';
import { CartItem, ProductOrder, ShippingAddress } from '../../types';
import { formatINR, FREE_SHIPPING_THRESHOLD_INR, STANDARD_SHIPPING_FEE_INR } from '../../utils/currency';
import { calculateServerAuthoritativeOrder } from '../../utils/productPricing';
import { productOrderApi } from '../../services/productOrderApi';
import { SafeImage } from './SafeImage';
import { getAdminWhatsAppUrl, validateAndFormatIndianPhone } from '../../utils/whatsapp';

interface ProductCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedPromoCode?: string;
  onOrderSuccess: (order: ProductOrder) => void;
  onContinueShopping?: () => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi NCR',
  'Chandigarh',
];

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const ProductCheckoutModal: React.FC<ProductCheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  appliedPromoCode = '',
  onOrderSuccess,
  onContinueShopping,
}) => {
  // Step State: 1 = Address & Contact, 2 = Payment & Review, 3 = Success
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Karnataka');
  const [postalCode, setPostalCode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [notes, setNotes] = useState('');

  // Promo Code State
  const [promoCodeInput, setPromoCodeInput] = useState(appliedPromoCode);
  const [activePromoCode, setActivePromoCode] = useState(appliedPromoCode);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Payment State - 100% Online Payment Required (No COD)
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Success State
  const [completedOrder, setCompletedOrder] = useState<ProductOrder | null>(null);

  // Form Validation Errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Razorpay Gateway Config
  const [razorpayKeyId, setRazorpayKeyId] = useState<string>('');
  const [isLiveGateway, setIsLiveGateway] = useState<boolean>(false);
  const [isTestMode, setIsTestMode] = useState<boolean>(false);

  // Explicit Checkout & Session Reset
  const resetCheckoutState = () => {
    setStep(1);
    setCompletedOrder(null);
    setIsProcessing(false);
    setErrorMessage(null);
    setFieldErrors({});
    setNotes('');
  };

  const handleCloseModal = () => {
    resetCheckoutState();
    onClose();
  };

  const handleContinueShopping = () => {
    resetCheckoutState();
    if (onContinueShopping) {
      onContinueShopping();
    } else {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Whenever modal opens, guarantee a fresh checkout session starting at Step 1
      setStep(1);
      setCompletedOrder(null);
      setIsProcessing(false);
      setErrorMessage(null);
      setFieldErrors({});

      loadRazorpayScript();
      productOrderApi.getPaymentConfig().then((cfg) => {
        const live = Boolean(cfg.isConfigured && cfg.keyId);
        setRazorpayKeyId(cfg.keyId || '');
        setIsLiveGateway(live);
        setIsTestMode(Boolean(cfg.isTestMode || (cfg.keyId && cfg.keyId.startsWith('rzp_test_'))));
        if (!live) {
          setErrorMessage('Online payment is temporarily unavailable. Please try again later.');
        } else {
          setErrorMessage(null);
        }
      });

      // Pre-fill from local profile if available
      try {
        const savedProfile = localStorage.getItem('serenity_user_profile');
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          if (parsed.name) setFullName(parsed.name);
          if (parsed.email) setEmail(parsed.email);
          if (parsed.phone) setPhone(parsed.phone);
          if (parsed.address) {
            setStreet(parsed.address.street || '');
            setCity(parsed.address.city || '');
            setState(parsed.address.state || 'Karnataka');
            setPostalCode(parsed.address.postalCode || '');
          }
        }
      } catch (e) {
        // ignore
      }
    } else {
      resetCheckoutState();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // If bag is empty and not on Order Confirmed screen, show empty bag state
  if (step !== 3 && items.length === 0) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-md rounded-2xl p-6 sm:p-8 text-center shadow-2xl border border-[#1F3A26]/10 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#F7F5F1] text-gray-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8 text-[#C9A66B]" />
          </div>
          <h3 className="font-heading text-lg font-bold text-[#1F3A26]">
            Your Shopping Bag is Empty
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Please add luxury beauty and wellness products to your bag before proceeding to checkout.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <button
              type="button"
              onClick={handleContinueShopping}
              className="w-full py-3 rounded-full bg-[#1F3A26] hover:bg-[#4F7358] text-white font-semibold text-xs transition-colors cursor-pointer shadow-md"
            >
              Explore Beauty Shop
            </button>
            <button
              type="button"
              onClick={handleCloseModal}
              className="w-full py-2.5 rounded-full text-gray-600 hover:text-[#1F3A26] text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Convert cart items to format needed by pricing engine
  const pricingInputItems = items.map((i) => ({
    productId: i.product.id,
    quantity: i.quantity,
  }));

  // Authoritative price calculation
  const calculatedPricing = calculateServerAuthoritativeOrder(pricingInputItems, activePromoCode);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    setPromoMessage(null);
    const code = promoCodeInput.trim().toUpperCase();

    if (!code) {
      setActivePromoCode('');
      return;
    }

    if (code === 'GLOW20' || code === 'BEAUTY20' || code === 'SERENITY10' || code === 'FIRST500') {
      setActivePromoCode(code);
      setPromoMessage(
        code === 'FIRST500'
          ? '₹500 flat introductory voucher applied!'
          : code === 'SERENITY10'
          ? '10% salon member discount applied!'
          : '20% festive beauty discount applied!'
      );
    } else {
      setPromoError('Invalid coupon code. Try GLOW20 for 20% off!');
    }
  };

  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};

    if (!items || items.length === 0) {
      errors.cart = 'Your shopping bag is empty. Please add items before checking out.';
    }

    if (!fullName.trim()) errors.fullName = 'Full name is required';
    if (!phone.trim()) {
      errors.phone = 'Mobile number is required';
    } else {
      const phoneValidation = validateAndFormatIndianPhone(phone);
      if (!phoneValidation.isValid) {
        errors.phone = 'Please enter a valid 10-digit Indian mobile number';
      }
    }

    if (!email.trim()) {
      errors.email = 'Email address is required for order confirmation';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!street.trim()) errors.street = 'Flat, house or street address is required';
    if (!city.trim()) errors.city = 'City is required';
    if (!state.trim()) errors.state = 'State is required';
    if (!postalCode.trim() || !/^\d{6}$/.test(postalCode.trim())) {
      errors.postalCode = 'Enter a valid 6-digit PIN code';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToStep2 = () => {
    if (!items || items.length === 0 || pricingInputItems.length === 0) {
      setErrorMessage('Your shopping bag is empty. Please add products before proceeding.');
      return;
    }

    if (validateStep1()) {
      if (!isLiveGateway) {
        setErrorMessage('Online payment is temporarily unavailable. Please try again later.');
      } else {
        setErrorMessage(null);
      }
      setStep(2);
      // Save profile for fast checkout next time
      try {
        localStorage.setItem(
          'serenity_user_profile',
          JSON.stringify({
            name: fullName,
            email,
            phone,
            address: { street, area, city, state, postalCode },
          })
        );
      } catch (e) {
        // ignore
      }
    }
  };

  const handlePlaceOrder = async () => {
    if (!items || items.length === 0 || pricingInputItems.length === 0) {
      setErrorMessage('Your shopping bag is empty. Please add products before checking out.');
      return;
    }

    if (!isLiveGateway) {
      setErrorMessage('Online payment is temporarily unavailable. Please try again later.');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);

    const shippingAddress: ShippingAddress = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      street: street.trim(),
      area: area.trim() || undefined,
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      landmark: landmark.trim() || undefined,
    };

    try {
      // 1. Call Backend Server API to Create Order Authoritatively & Generate Razorpay Order
      const response = await productOrderApi.createOrder({
        items: pricingInputItems,
        customer: {
          name: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          notes: notes.trim() || undefined,
        },
        shippingAddress,
        promoCode: activePromoCode || undefined,
        paymentMethod: 'ONLINE',
      });

      if (!response.success || !response.order || !response.razorpayOrderId) {
        setErrorMessage(
          response.error || 'Razorpay order creation failed. Please check server configuration or try again.'
        );
        setIsProcessing(false);
        return;
      }

      const createdOrder = response.order;
      const razorpayOrderId = response.razorpayOrderId;
      const keyIdToUse = response.razorpayKeyId || razorpayKeyId;

      if (!keyIdToUse) {
        setErrorMessage('Razorpay Key ID is not configured on the server. Please check server settings.');
        setIsProcessing(false);
        return;
      }

      // 2. Ensure Razorpay SDK is loaded
      if (!(window as any).Razorpay) {
        const loaded = await loadRazorpayScript();
        if (!loaded && !(window as any).Razorpay) {
          setErrorMessage('Razorpay payment gateway SDK failed to load. Please check your internet connection.');
          setIsProcessing(false);
          return;
        }
      }

      // 3. Launch Official Razorpay Standard Checkout Modal
      const rawDigits = phone.replace(/\D/g, '');
      const cleanTenDigits = rawDigits.slice(-10);
      const rzpContact = cleanTenDigits ? `+91${cleanTenDigits}` : phone.trim();

      const rzpOptions = {
        key: keyIdToUse,
        amount: Math.round((response.grandTotal || createdOrder.grandTotal || calculatedPricing.grandTotal) * 100), // in paise
        currency: 'INR',
        name: 'Serenity Luxury Salon & Spa',
        description: `Order #${createdOrder.orderId} — Beauty & Wellness Products`,
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=150&auto=format&fit=crop&q=80',
        order_id: razorpayOrderId,
        prefill: {
          name: fullName.trim(),
          email: email.trim(),
          contact: rzpContact,
        },
        theme: {
          color: '#1F3A26',
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setErrorMessage('Payment was cancelled. Your items are safe in your bag.');
          },
        },
        handler: async (paymentResponse: any) => {
          try {
            setIsProcessing(true);
            const verifyRes = await productOrderApi.verifyPayment({
              orderId: createdOrder.id,
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpaySignature: paymentResponse.razorpay_signature,
            });

            if (verifyRes.success && verifyRes.order) {
              setCompletedOrder(verifyRes.order);
              setStep(3);
              onOrderSuccess(verifyRes.order);
            } else {
              setErrorMessage(verifyRes.error || 'Payment signature verification failed.');
            }
          } catch (verErr: any) {
            setErrorMessage(verErr?.message || 'Payment verification failed. Please contact support.');
          } finally {
            setIsProcessing(false);
          }
        },
      };

      const rzpInstance = new (window as any).Razorpay(rzpOptions);
      rzpInstance.on('payment.failed', (resp: any) => {
        setIsProcessing(false);
        setErrorMessage(resp.error?.description || 'Payment transaction failed at gateway.');
      });
      rzpInstance.open();
    } catch (err: any) {
      console.warn('[Checkout notice]:', err?.message || err);
      setErrorMessage(err?.message || 'An error occurred while processing checkout.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-[#1F3A26]/10">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#1F3A26] text-white flex items-center justify-between border-b border-[#C9A66B]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#C9A66B]/20 text-[#C9A66B] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base sm:text-lg text-white">
                {step === 3 ? 'Order Confirmed' : 'Checkout & Express Delivery'}
              </h2>
              <p className="text-[11px] text-[#EADBC8] tracking-wide">
                {step === 1
                  ? 'Step 1 of 2: Shipping & Contact Information'
                  : step === 2
                  ? 'Step 2 of 2: Payment & Order Confirmation'
                  : 'Thank you for choosing Serenity Salon'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCloseModal}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          
          {/* STEP 1: Address & Contact Information */}
          {step === 1 && (
            <div className="space-y-5">
              
              {/* Order quick snapshot badge */}
              <div className="p-3.5 bg-[#F7F5F1] rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#1F3A26]" />
                  <span className="font-medium text-[#1A1A1A]">
                    {items.reduce((sum, i) => sum + i.quantity, 0)} items in your package
                  </span>
                </div>
                <span className="font-bold text-[#1F3A26] font-heading text-sm">
                  {formatINR(calculatedPricing.grandTotal)}
                </span>
              </div>

              {/* Section: Contact Information */}
              <div>
                <h3 className="text-xs font-bold text-[#1F3A26] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#C9A66B]" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Priya Sharma"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (fieldErrors.fullName) setFieldErrors((prev) => ({ ...prev, fullName: '' }));
                      }}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border ${
                        fieldErrors.fullName ? 'border-red-500' : 'border-gray-200'
                      } focus:outline-none focus:border-[#1F3A26] focus:bg-white`}
                    />
                    {fieldErrors.fullName && <p className="text-[11px] text-red-500 mt-1">{fieldErrors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-gray-500 font-medium">+91</span>
                      <input
                        type="tel"
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: '' }));
                        }}
                        className={`w-full pl-11 pr-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border ${
                          fieldErrors.phone ? 'border-red-500' : 'border-gray-200'
                        } focus:outline-none focus:border-[#1F3A26] focus:bg-white`}
                      />
                    </div>
                    {fieldErrors.phone && <p className="text-[11px] text-red-500 mt-1">{fieldErrors.phone}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email Address (for Order Receipt & Tracking) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        placeholder="priya.sharma@example.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                        }}
                        className={`w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border ${
                          fieldErrors.email ? 'border-red-500' : 'border-gray-200'
                        } focus:outline-none focus:border-[#1F3A26] focus:bg-white`}
                      />
                    </div>
                    {fieldErrors.email && <p className="text-[11px] text-red-500 mt-1">{fieldErrors.email}</p>}
                  </div>
                </div>
              </div>

              {/* Section: Delivery Address */}
              <div>
                <h3 className="text-xs font-bold text-[#1F3A26] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C9A66B]" />
                  Shipping Address (India)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Flat / House No., Apartment / Street <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 402, Lotus Residency, 12th Main Rd"
                      value={street}
                      onChange={(e) => {
                        setStreet(e.target.value);
                        if (fieldErrors.street) setFieldErrors((prev) => ({ ...prev, street: '' }));
                      }}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border ${
                        fieldErrors.street ? 'border-red-500' : 'border-gray-200'
                      } focus:outline-none focus:border-[#1F3A26] focus:bg-white`}
                    />
                    {fieldErrors.street && <p className="text-[11px] text-red-500 mt-1">{fieldErrors.street}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Area / Locality
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Indiranagar"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#1F3A26] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bengaluru"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (fieldErrors.city) setFieldErrors((prev) => ({ ...prev, city: '' }));
                      }}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border ${
                        fieldErrors.city ? 'border-red-500' : 'border-gray-200'
                      } focus:outline-none focus:border-[#1F3A26] focus:bg-white`}
                    />
                    {fieldErrors.city && <p className="text-[11px] text-red-500 mt-1">{fieldErrors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#1F3A26] focus:bg-white"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      PIN Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 560038"
                      value={postalCode}
                      onChange={(e) => {
                        setPostalCode(e.target.value.replace(/\D/g, ''));
                        if (fieldErrors.postalCode) setFieldErrors((prev) => ({ ...prev, postalCode: '' }));
                      }}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border ${
                        fieldErrors.postalCode ? 'border-red-500' : 'border-gray-200'
                      } focus:outline-none focus:border-[#1F3A26] focus:bg-white`}
                    />
                    {fieldErrors.postalCode && (
                      <p className="text-[11px] text-red-500 mt-1">{fieldErrors.postalCode}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Landmark / Delivery Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Opposite BDA Complex / Ring doorbell"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#1F3A26] focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-[#1A1A1A] cursor-pointer"
                >
                  Return to Cart
                </button>
                <button
                  type="button"
                  onClick={handleProceedToStep2}
                  className="px-6 py-3 rounded-full bg-[#1F3A26] hover:bg-[#4F7358] text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C9A66B]" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: Review & Payment Selection */}
          {step === 2 && (
            <div className="space-y-5">
              
              {/* Deliver To Snapshot */}
              <div className="p-3.5 bg-[#F7F5F1] rounded-xl border border-gray-200 flex items-start justify-between text-xs">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-[#1F3A26] mb-0.5">
                    <Truck className="w-3.5 h-3.5 text-[#C9A66B]" />
                    <span>Delivering to {fullName} (+91 {phone})</span>
                  </div>
                  <p className="text-gray-600 line-clamp-1">
                    {street}, {city}, {state} - {postalCode}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-[#C9A66B] hover:underline cursor-pointer ml-3 shrink-0"
                >
                  Change
                </button>
              </div>

              {/* Items List Breakdown */}
              <div>
                <h3 className="text-xs font-bold text-[#1F3A26] uppercase tracking-wider mb-2">
                  Order Items ({calculatedPricing.items.length})
                </h3>
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {calculatedPricing.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-xs"
                    >
                      <SafeImage
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover bg-white shrink-0"
                        fallbackType="product"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[#1A1A1A] truncate">{item.name}</h4>
                        <div className="flex items-center gap-2 text-gray-500 mt-0.5">
                          <span>Qty: {item.quantity}</span>
                          <span>•</span>
                          <span>{formatINR(item.unitPrice)} each</span>
                        </div>
                      </div>
                      <div className="text-right font-bold text-[#1F3A26] font-heading">
                        {formatINR(item.totalPrice)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo Code Entry */}
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE6DE]">
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Have a Promo code? (e.g. GLOW20)"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-[#C9A66B] uppercase font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-[#1F3A26] text-white text-xs font-bold rounded-lg hover:bg-[#4F7358] transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
                {promoMessage && (
                  <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-1.5">
                    <Sparkles className="w-3 h-3 text-[#C9A66B]" /> {promoMessage}
                  </p>
                )}
                {promoError && (
                  <p className="text-[11px] text-red-500 font-medium mt-1.5">{promoError}</p>
                )}
              </div>

              {/* Pricing Breakdown Card */}
              <div className="p-4 bg-[#F7F5F1] rounded-xl border border-gray-200 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatINR(calculatedPricing.subtotal)}</span>
                </div>
                {calculatedPricing.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Promo Discount ({activePromoCode})</span>
                    <span>-{formatINR(calculatedPricing.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-gray-900">
                    {calculatedPricing.shippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      formatINR(calculatedPricing.shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#1F3A26] pt-2 border-t border-gray-300">
                  <span>Grand Total</span>
                  <span className="text-base text-[#1F3A26] font-heading">{formatINR(calculatedPricing.grandTotal)}</span>
                </div>
              </div>

              {/* Test Mode Banner */}
              {isTestMode && (
                <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-300 text-amber-950 text-xs mb-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900">
                      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>RAZORPAY TEST MODE</span>
                    </div>
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-200/80 text-amber-900 rounded">
                      Standard Checkout
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Connected to Razorpay Test Mode. Official Razorpay Standard Checkout will open. You can test UPI (e.g. success@razorpay), Cards, or Netbanking. No real money will be charged.
                  </p>
                </div>
              )}

              {/* Payment Method - 100% Online Payment */}
              <div>
                <h3 className="text-xs font-bold text-[#1F3A26] uppercase tracking-wider mb-2.5 flex items-center justify-between">
                  <span>Payment Method</span>
                  <span className="text-[10px] text-gray-500 font-normal lowercase tracking-normal">100% online payment required</span>
                </h3>

                {/* Razorpay Online Payment Option */}
                <div
                  className={`p-4 rounded-xl border-2 flex items-start gap-3 transition-all ${
                    !isLiveGateway
                      ? 'border-amber-200 bg-amber-50/50 text-gray-700'
                      : 'border-[#1F3A26] bg-[#EBF3ED]/40 text-[#1F3A26]'
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-white shadow-xs border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                    <CreditCard className="w-5 h-5 text-[#1F3A26]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-1.5 font-bold text-xs">
                      <span>Razorpay Standard Checkout</span>
                      {isLiveGateway ? (
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded-md">
                          Official Gateway
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[9px] font-semibold bg-amber-100 text-amber-800 rounded-md">
                          Temporarily Unavailable
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                      {isLiveGateway
                        ? 'Official Razorpay Checkout popup will open and display all payment methods enabled for your account (Cards, NetBanking, Wallets, and UPI Intent).'
                        : 'Online payment is temporarily unavailable. Please try again later.'}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] text-gray-500 font-medium">
                      <span className="px-2 py-0.5 bg-white border border-gray-200 rounded">Debit &amp; Credit Cards</span>
                      <span className="px-2 py-0.5 bg-white border border-gray-200 rounded">NetBanking (All Major Banks)</span>
                      <span className="px-2 py-0.5 bg-white border border-gray-200 rounded">Wallets</span>
                      <span className="px-2 py-0.5 bg-white border border-gray-200 rounded">UPI Intent (Supported Apps)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Alert if any */}
              {errorMessage && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <strong>Payment Notice:</strong> {errorMessage}
                    </div>
                  </div>
                  {errorMessage.includes('Authentication failed') && (
                    <div className="text-[11px] bg-white/80 p-2.5 rounded-lg border border-red-200 text-red-800 space-y-1">
                      <div className="font-semibold text-red-900">How to resolve Razorpay Authentication:</div>
                      <div>1. Open your <strong>Razorpay Dashboard</strong> → <em>Account &amp; Settings</em> → <em>API Keys</em>.</div>
                      <div>2. Verify or click <strong>Generate Key</strong> to receive a fresh Test Key ID &amp; Key Secret.</div>
                      <div>3. Update <code>RAZORPAY_KEY_ID</code> and <code>RAZORPAY_KEY_SECRET</code> in your environment or Settings panel.</div>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-[#1A1A1A] flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Back to Shipping
                </button>
                <button
                  type="button"
                  disabled={isProcessing || !isLiveGateway}
                  onClick={handlePlaceOrder}
                  className="px-7 py-3 rounded-full bg-[#1F3A26] hover:bg-[#4F7358] text-white font-semibold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#C9A66B]" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay {formatINR(calculatedPricing.grandTotal)} Online</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C9A66B]" />
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: Order Placed Successfully */}
          {step === 3 && completedOrder && (
            <div className="py-4 text-center space-y-5">
              
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="px-3 py-1 bg-[#EBF3ED] text-[#1F3A26] text-xs font-bold rounded-full uppercase tracking-wider">
                  Order Successfully Placed
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#1F3A26] mt-2">
                  Thank You, {completedOrder.customerName}!
                </h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto mt-1">
                  We've received your order and dispatched confirmation details to{' '}
                  <span className="font-semibold text-gray-900">{completedOrder.email}</span>.
                </p>
              </div>

              {/* Order Reference Box */}
              <div className="p-4 bg-[#F7F5F1] rounded-2xl border border-gray-200 text-left max-w-lg mx-auto space-y-2.5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-500 font-medium">Order Reference:</span>
                  <span className="font-mono font-bold text-[#1F3A26] text-sm">#{completedOrder.orderId || completedOrder.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Payment Status:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {completedOrder.paymentStatus || 'PAID'} ({completedOrder.paymentMethod})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Total Amount:</span>
                  <span className="font-bold text-[#1F3A26] font-heading text-sm">
                    {formatINR(completedOrder.grandTotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-gray-500 font-medium">Delivery Address:</span>
                  <span className="font-medium text-gray-900 text-right line-clamp-1 max-w-[240px]">
                    {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Estimated Arrival:</span>
                  <span className="font-bold text-[#1F3A26]">3 to 5 Business Days</span>
                </div>
              </div>

              {/* WhatsApp Support CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={getAdminWhatsAppUrl(
                    `Hello Serenity Salon Concierge! I have a question regarding my order #${completedOrder.orderId || completedOrder.id} placed for ${completedOrder.customerName}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Concierge Support</span>
                </a>
                
                <button
                  type="button"
                  onClick={handleContinueShopping}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#1F3A26] hover:bg-[#4F7358] text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  Continue Shopping
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
