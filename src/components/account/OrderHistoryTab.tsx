import React, { useState, useMemo } from 'react';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Receipt,
  MapPin,
  Sparkles,
  ExternalLink,
  CreditCard,
  X,
  Compass,
  PackageCheck,
  AlertCircle,
  Filter,
  Search,
  Star,
  MessageSquare,
  ThumbsUp,
  ShieldCheck,
  Send,
  Award,
  SlidersHorizontal,
} from 'lucide-react';
import { UserOrder, Product, CartItem, OrderStatus, UserReview } from '../../types';
import {
  getUserOrders,
  getUserReviews,
  saveUserReview,
  saveUserOrders,
} from '../../utils/accountData';
import { formatINR } from '../../utils/currency';
import { SafeImage } from '../common/SafeImage';

interface OrderHistoryTabProps {
  onReorderItems?: (items: CartItem[]) => void;
  onNavigateToShop?: () => void;
  onShowToast?: (msg: string, type?: 'cart' | 'wishlist' | 'info') => void;
}

export const OrderHistoryTab: React.FC<OrderHistoryTabProps> = ({
  onReorderItems,
  onNavigateToShop,
  onShowToast,
}) => {
  const [orders, setOrders] = useState<UserOrder[]>(getUserOrders);
  const [reviews, setReviews] = useState<UserReview[]>(getUserReviews);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(orders[0]?.id || null);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<UserOrder | null>(null);
  const [trackingModalOrder, setTrackingModalOrder] = useState<UserOrder | null>(null);

  // Review Modal State
  const [reviewModalItem, setReviewModalItem] = useState<{
    orderId: string;
    product: Product;
  } | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [qualityRating, setQualityRating] = useState<number>(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const totalPoints = orders.reduce((sum, o) => sum + (o.pointsEarned || 0), 0);

  // Filter and Search Logic
  const filteredAndSortedOrders = useMemo(() => {
    let result = orders.filter((order) => {
      // Status Filter
      if (statusFilter !== 'All') {
        if (statusFilter === 'Processing' && order.status !== 'Processing') return false;
        if (
          statusFilter === 'Shipped' &&
          !(order.status === 'Shipped' || order.status === 'In Transit' || order.status === 'Out for Delivery')
        ) {
          return false;
        }
        if (
          statusFilter === 'Delivered' &&
          !(order.status === 'Delivered' || order.status === 'Completed')
        ) {
          return false;
        }
        if (statusFilter === 'Cancelled' && order.status !== 'Cancelled') return false;
      }

      // Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = order.id.toLowerCase().includes(q);
        const matchesCarrier = order.trackingCarrier?.toLowerCase().includes(q);
        const matchesTracking = order.trackingNumber?.toLowerCase().includes(q);
        const matchesCity = order.shippingAddress.city.toLowerCase().includes(q);
        const matchesProduct = order.items.some((item) =>
          item.product.name.toLowerCase().includes(q) ||
          item.product.category.toLowerCase().includes(q)
        );

        if (!matchesId && !matchesCarrier && !matchesTracking && !matchesCity && !matchesProduct) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt || a.date).getTime() - new Date(b.createdAt || b.date).getTime();
      }
      if (sortBy === 'highest') {
        return b.total - a.total;
      }
      if (sortBy === 'lowest') {
        return a.total - b.total;
      }
      return 0;
    });

    return result;
  }, [orders, statusFilter, searchQuery, sortBy]);

  const getStatusBadge = (status: UserOrder['status']) => {
    switch (status) {
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-300 shadow-xs ring-1 ring-amber-400/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <Clock className="w-3 h-3 text-amber-700" />
            Processing
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-800 text-[11px] font-bold border border-sky-300 shadow-xs ring-1 ring-sky-400/20">
            <Truck className="w-3 h-3 text-sky-700" />
            Shipped
          </span>
        );
      case 'In Transit':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-[11px] font-bold border border-blue-300 shadow-xs ring-1 ring-blue-400/20">
            <Compass className="w-3 h-3 text-blue-700" />
            In Transit
          </span>
        );
      case 'Out for Delivery':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-[11px] font-bold border border-purple-300 shadow-xs ring-1 ring-purple-400/20">
            <PackageCheck className="w-3 h-3 text-purple-700" />
            Out for Delivery
          </span>
        );
      case 'Delivered':
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-300 shadow-xs ring-1 ring-emerald-400/20">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {status === 'Completed' ? 'Completed' : 'Delivered'}
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-[11px] font-bold border border-rose-300 shadow-xs ring-1 ring-rose-400/20">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-[11px] font-bold">
            {status}
          </span>
        );
    }
  };

  const handleReorder = (order: UserOrder) => {
    if (onReorderItems) {
      onReorderItems(order.items);
    }
    if (onShowToast) {
      onShowToast(`Added all ${order.items.length} items from #${order.id} to your bag!`, 'cart');
    }
  };

  const handleOpenReviewModal = (orderId: string, product: Product) => {
    // Check if review already exists
    const existing = reviews.find((r) => r.orderId === orderId && r.targetId === product.id);
    if (existing) {
      setReviewRating(existing.rating);
      setQualityRating(existing.qualityRating || 5);
      setReviewTitle(existing.title);
      setReviewComment(existing.comment);
      setWouldRecommend(existing.wouldRecommend);
    } else {
      setReviewRating(5);
      setQualityRating(5);
      setReviewTitle('');
      setReviewComment('');
      setWouldRecommend(true);
    }
    setReviewModalItem({ orderId, product });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalItem) return;

    if (!reviewTitle.trim() || !reviewComment.trim()) {
      if (onShowToast) {
        onShowToast('Please provide both a headline and detailed review comments.', 'info');
      }
      return;
    }

    setIsSubmittingReview(true);
    setTimeout(() => {
      const { review, bonusPointsEarned } = saveUserReview({
        orderId: reviewModalItem.orderId,
        targetId: reviewModalItem.product.id,
        targetType: 'product',
        targetName: reviewModalItem.product.name,
        targetImage: reviewModalItem.product.image,
        rating: reviewRating,
        qualityRating,
        serviceRating: 5,
        title: reviewTitle.trim(),
        comment: reviewComment.trim(),
        authorName: 'Aasha Gandal',
        authorEmail: 'aasha.gandal@example.com',
        verifiedPurchase: true,
        wouldRecommend,
      });

      setReviews(getUserReviews());
      setIsSubmittingReview(false);
      setReviewModalItem(null);

      if (onShowToast) {
        onShowToast(
          `✨ Thank you! Your review for "${review.targetName}" is submitted! +${bonusPointsEarned} Aura Points credited!`,
          'info'
        );
      }
    }, 400);
  };

  const getRatingFeedbackWord = (stars: number) => {
    switch (stars) {
      case 5:
        return 'Exceptional Experience';
      case 4:
        return 'Very Good Quality';
      case 3:
        return 'Average / Satisfactory';
      case 2:
        return 'Fair / Needs Improvement';
      default:
        return 'Poor Experience';
    }
  };

  return (
    <div className="space-y-5">
      {/* Orders Summary Cards */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#1F3A26]/10 text-center">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">Orders</span>
          <span className="text-lg sm:text-xl font-bold text-[#1F3A26] font-heading">{orders.length}</span>
        </div>
        <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#1F3A26]/10 text-center">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">Total Spent</span>
          <span className="text-lg sm:text-xl font-bold text-[#1F3A26] font-heading">{formatINR(totalSpent)}</span>
        </div>
        <div className="bg-[#FDF8EC] p-3.5 rounded-xl border border-[#C9A66B]/30 text-center">
          <span className="text-[10px] uppercase font-bold text-[#9E7A3E] tracking-wider block">Points Earned</span>
          <span className="text-lg sm:text-xl font-bold text-[#C9A66B] font-heading">+{totalPoints}</span>
        </div>
      </div>

      {/* ========================================== */}
      {/* SEARCH BAR & FILTER CONTROLS */}
      {/* ========================================== */}
      <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-gray-200 space-y-3">
        {/* Real-Time Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders by ID (e.g. SRN-99410), product name, courier, or city..."
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:border-[#1F3A26] focus:ring-1 focus:ring-[#1F3A26]/20 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns & Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 text-xs">
          {/* Status Filter Dropdown & Quick Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-gray-200 shadow-xs">
              <Filter className="w-3.5 h-3.5 text-[#C9A66B]" />
              <label htmlFor="status-dropdown" className="text-[11px] font-bold text-gray-600">
                Status:
              </label>
              <select
                id="status-dropdown"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-transparent font-bold text-[#1F3A26] focus:outline-none cursor-pointer text-xs"
              >
                <option value="All">All Statuses ({orders.length})</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped / In Transit</option>
                <option value="Delivered">Delivered / Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-gray-200 shadow-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C9A66B]" />
              <label htmlFor="sort-dropdown" className="text-[11px] font-bold text-gray-600">
                Sort:
              </label>
              <select
                id="sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-bold text-[#1F3A26] focus:outline-none cursor-pointer text-xs"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Amount</option>
                <option value="lowest">Lowest Amount</option>
              </select>
            </div>
          </div>

          {/* Result Count and Clear Filters */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-500 font-medium">
              Showing <span className="font-bold text-[#1F3A26]">{filteredAndSortedOrders.length}</span> of{' '}
              {orders.length} orders
            </span>
            {(searchQuery || statusFilter !== 'All' || sortBy !== 'newest') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                  setSortBy('newest');
                }}
                className="text-[11px] font-bold text-red-600 hover:text-red-700 underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredAndSortedOrders.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF8F5] text-gray-400 mx-auto flex items-center justify-center">
            <Package className="w-6 h-6 text-[#C9A66B]" />
          </div>
          <h4 className="font-heading font-bold text-base text-[#1F3A26]">
            {searchQuery
              ? `No Orders Matching "${searchQuery}"`
              : statusFilter === 'All'
              ? 'No Previous Orders Yet'
              : `No ${statusFilter} Orders Found`}
          </h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {searchQuery
              ? 'Try searching with a different order number, brand, product keyword, or carrier name.'
              : statusFilter === 'All'
              ? 'Your purchases and express delivery shipments will appear here with live tracking.'
              : `You currently have no orders in the "${statusFilter}" state.`}
          </p>
          {(searchQuery || statusFilter !== 'All') ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
              }}
              className="mt-2 px-4 py-2 rounded-full bg-[#1F3A26] text-white font-bold text-xs hover:bg-[#2D4D36] transition-colors cursor-pointer"
            >
              Clear Search &amp; Show All
            </button>
          ) : (
            onNavigateToShop && (
              <button
                onClick={onNavigateToShop}
                className="mt-2 px-5 py-2.5 rounded-full bg-[#1F3A26] text-white font-bold text-xs hover:bg-[#2D4D36] transition-colors cursor-pointer"
              >
                Discover Botanical Products
              </button>
            )
          )}
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredAndSortedOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-[#1F3A26]/10 shadow-xs overflow-hidden transition-all hover:border-[#1F3A26]/30"
              >
                {/* Order Top Bar */}
                <div
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                  className="p-4 sm:px-5 flex items-center justify-between gap-3 cursor-pointer hover:bg-[#FAF8F5]/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] text-[#1F3A26] flex items-center justify-center border border-[#1F3A26]/10 shrink-0">
                      <Package className="w-5 h-5 text-[#C9A66B]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-xs text-[#1F3A26]">#{order.id}</span>
                        <span className="text-[11px] text-gray-400">• {order.date}</span>
                      </div>
                      <p className="text-xs font-bold text-[#1F3A26] mt-0.5">
                        {formatINR(order.total)}{' '}
                        <span className="text-[10px] font-normal text-gray-500">
                          ({order.items.reduce((s, i) => s + i.quantity, 0)} items)
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {getStatusBadge(order.status)}
                    <button
                      aria-label={isExpanded ? 'Collapse order details' : 'Expand order details'}
                      className="text-gray-400 hover:text-[#1F3A26] p-1 cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-gray-100 bg-[#FAF8F5]/30 space-y-4 animate-in fade-in duration-200">
                    {/* Items List with 'Leave a Review' action */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">
                          Items Purchased &amp; Reviews
                        </span>
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#C9A66B]" /> Earn +100 pts per review
                        </span>
                      </div>

                      <div className="space-y-2">
                        {order.items.map((item, idx) => {
                          const existingReview = reviews.find(
                            (r) => r.orderId === order.id && r.targetId === item.product.id
                          );

                          return (
                            <div
                              key={idx}
                              className="bg-white p-3 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-[#FAF8F5] overflow-hidden border border-gray-200 shrink-0">
                                  <SafeImage
                                    src={item.product.image}
                                    alt={item.product.name}
                                    fallbackType="product"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <h5 className="text-xs font-bold text-[#1A1A1A] line-clamp-1">
                                    {item.product.name}
                                  </h5>
                                  <p className="text-[11px] text-gray-500">
                                    Qty: {item.quantity} • {formatINR(item.product.price)} each
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end gap-3 pt-1 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                                <span className="text-xs font-bold text-[#1F3A26]">
                                  {formatINR(item.product.price * item.quantity)}
                                </span>

                                {/* LEAVE A REVIEW / VIEW REVIEW BUTTON */}
                                {order.status === 'Delivered' || order.status === 'Completed' ? (
                                  existingReview ? (
                                    <button
                                      onClick={() => handleOpenReviewModal(order.id, item.product)}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                                    >
                                      <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                                      <span>Rated {existingReview.rating}★ (Edit)</span>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleOpenReviewModal(order.id, item.product)}
                                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FDF8EC] text-[#9E7A3E] border border-[#EADBBA] text-[11px] font-bold hover:bg-[#F8EDD3] transition-colors cursor-pointer shadow-xs"
                                    >
                                      <Star className="w-3 h-3 text-[#C9A66B]" />
                                      <span>Leave a Review (+100 pts)</span>
                                    </button>
                                  )
                                ) : (
                                  <span className="text-[10px] text-gray-400 italic">
                                    Review available after delivery
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-3.5 rounded-xl border border-gray-100">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#C9A66B]" /> Shipping Address
                        </span>
                        <p className="font-semibold text-[#1A1A1A]">{order.shippingAddress.fullName}</p>
                        <p className="text-gray-500 text-[11px] leading-tight mt-0.5">
                          {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                          {order.shippingAddress.postalCode}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1 flex items-center gap-1">
                          <CreditCard className="w-3 h-3 text-[#C9A66B]" /> Payment &amp; Rewards
                        </span>
                        <p className="text-[#1A1A1A] font-semibold">{order.paymentMethod}</p>
                        <p className="text-emerald-700 text-[11px] font-semibold mt-0.5 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#C9A66B]" />
                          +{order.pointsEarned} Aura Points Credited
                        </p>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="bg-white p-3.5 rounded-xl border border-gray-100 space-y-1.5 text-xs">
                      <div className="flex justify-between text-gray-500">
                        <span>Subtotal</span>
                        <span className="font-medium text-gray-800">{formatINR(order.subtotal)}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-medium">
                          <span>VIP Discount</span>
                          <span>-{formatINR(order.discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-500">
                        <span>Express Delivery</span>
                        <span className="font-medium text-gray-800">
                          {order.shipping === 0 ? 'FREE' : formatINR(order.shipping)}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-[#1F3A26] pt-1.5 border-t border-gray-100 text-sm">
                        <span>Total Paid</span>
                        <span>{formatINR(order.total)}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setTrackingModalOrder(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-gray-200 text-[#1F3A26] text-xs font-bold transition-colors cursor-pointer border border-gray-200"
                        >
                          <Truck className="w-3.5 h-3.5 text-[#C9A66B]" />
                          <span>Track Package</span>
                        </button>
                        <button
                          onClick={() => setSelectedReceiptOrder(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-gray-200 text-[#1F3A26] text-xs font-bold transition-colors cursor-pointer border border-gray-200"
                        >
                          <Receipt className="w-3.5 h-3.5 text-[#C9A66B]" />
                          <span>Invoice</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleReorder(order)}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#1F3A26] hover:bg-[#2D4D36] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-[#C9A66B]" />
                        <span>Reorder All Items</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================== */}
      {/* LEAVE A REVIEW MODAL */}
      {/* ========================================== */}
      {reviewModalItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-200 space-y-4">
            <button
              onClick={() => setReviewModalItem(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] overflow-hidden border border-gray-200 shrink-0">
                <SafeImage
                  src={reviewModalItem.product.image}
                  alt={reviewModalItem.product.name}
                  fallbackType="product"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#9E7A3E] tracking-wider block flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Purchase Review
                </span>
                <h4 className="font-heading font-bold text-sm text-[#1F3A26] line-clamp-1">
                  {reviewModalItem.product.name}
                </h4>
                <p className="text-[11px] text-gray-400">Order #{reviewModalItem.orderId}</p>
              </div>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              {/* Star Rating Selector */}
              <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-gray-200 space-y-2 text-center">
                <label className="text-xs font-bold text-[#1F3A26] block">
                  How would you rate your overall experience?
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-2xl transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= reviewRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300 fill-transparent'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-[#C9A66B] block">
                  {getRatingFeedbackWord(reviewRating)} ({reviewRating} / 5 Stars)
                </span>
              </div>

              {/* Quality Sub-rating */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-gray-700">
                    Botanical Quality &amp; Texture Rating:
                  </label>
                  <span className="text-[11px] font-bold text-[#1F3A26]">{qualityRating} / 5</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setQualityRating(s)}
                      className={`flex-1 py-1 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                        s <= qualityRating
                          ? 'bg-[#1F3A26] text-white border-[#1F3A26]'
                          : 'bg-white text-gray-500 border-gray-200'
                      }`}
                    >
                      {s} ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Headline */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 block">
                  Headline / Title of Your Review:
                </label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g., Noticeable hydration in 3 days! Wonderful scent."
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:border-[#1F3A26]"
                />
              </div>

              {/* Review Text */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 block">
                  Detailed Feedback &amp; Results:
                </label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details on application, scent, texture, salon finish, and visible results..."
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:border-[#1F3A26]"
                />
              </div>

              {/* Recommend Toggle */}
              <label className="flex items-center gap-2 cursor-pointer bg-[#FAF8F5] p-2.5 rounded-xl border border-gray-200">
                <input
                  type="checkbox"
                  checked={wouldRecommend}
                  onChange={(e) => setWouldRecommend(e.target.checked)}
                  className="rounded text-[#1F3A26] focus:ring-[#1F3A26] cursor-pointer"
                />
                <span className="text-[11px] font-semibold text-[#1F3A26]">
                  I would recommend this product / ritual to other Serenity patrons
                </span>
              </label>

              {/* Submit Buttons */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewModalItem(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-5 py-2 rounded-xl bg-[#1F3A26] hover:bg-[#2D4D36] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-[#E5C78A]" />
                  <span>{isSubmittingReview ? 'Submitting...' : 'Submit Review (+100 pts)'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Package Tracking Modal */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center bg-black/50 backdrop-blur-xs">
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setTrackingModalOrder(null)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#1F3A26] text-[#C9A66B] flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-base text-[#1F3A26]">Live Shipment Tracking</h4>
                <p className="text-[11px] text-gray-500 font-mono">
                  {trackingModalOrder.trackingCarrier} • {trackingModalOrder.trackingNumber}
                </p>
              </div>
            </div>

            {/* Tracking Status Badge */}
            <div className="mb-4">{getStatusBadge(trackingModalOrder.status)}</div>

            {/* Tracking Steps */}
            <div className="space-y-4 py-3 border-y border-gray-100 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <p className="font-bold text-[#1A1A1A]">Order Confirmed &amp; Dispatched</p>
                  <p className="text-gray-400 text-[10px]">Serenity Organic Warehouse, Mumbai</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-full ${
                    trackingModalOrder.status === 'Processing'
                      ? 'bg-amber-100 text-amber-700 border border-amber-400'
                      : 'bg-emerald-600 text-white'
                  } flex items-center justify-center text-[10px] shrink-0 mt-0.5`}
                >
                  {trackingModalOrder.status === 'Processing' ? '•' : '✓'}
                </div>
                <div>
                  <p className="font-bold text-[#1A1A1A]">In Transit - Air Logistics Hub</p>
                  <p className="text-gray-400 text-[10px]">
                    {trackingModalOrder.status === 'Processing'
                      ? 'Scheduled for pickup by carrier'
                      : 'Processed at Central Logistics Sort Facility'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-full ${
                    trackingModalOrder.status === 'Delivered' || trackingModalOrder.status === 'Completed'
                      ? 'bg-emerald-600 text-white'
                      : trackingModalOrder.status === 'Shipped' ||
                        trackingModalOrder.status === 'In Transit' ||
                        trackingModalOrder.status === 'Out for Delivery'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  } flex items-center justify-center text-[10px] shrink-0 mt-0.5`}
                >
                  {trackingModalOrder.status === 'Delivered' || trackingModalOrder.status === 'Completed'
                    ? '✓'
                    : '•'}
                </div>
                <div>
                  <p className="font-bold text-[#1A1A1A]">
                    {trackingModalOrder.status === 'Delivered' || trackingModalOrder.status === 'Completed'
                      ? 'Delivered to Customer'
                      : trackingModalOrder.status === 'Out for Delivery'
                      ? 'Out for Express Delivery'
                      : 'Final Delivery to Destination'}
                  </p>
                  <p className="text-emerald-700 font-medium text-[10px]">{trackingModalOrder.estimatedDelivery}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2 flex justify-end">
              <button
                onClick={() => setTrackingModalOrder(null)}
                className="px-4 py-2 rounded-xl bg-[#1F3A26] text-white font-bold text-xs hover:bg-[#2D4D36] cursor-pointer"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice / Receipt View Modal */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center bg-black/50 backdrop-blur-xs">
          <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-200 font-sans">
            <button
              onClick={() => setSelectedReceiptOrder(null)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-gray-100 pb-4 mb-4 flex justify-between items-start">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-[#1F3A26]">SERENITY LUXURY SALON</h3>
                <p className="text-[11px] text-[#C9A66B] font-semibold">Official Tax Invoice / Receipt</p>
                <p className="text-[10px] text-gray-400 mt-1">GSTIN: 27AABCS1429B1ZX • Mumbai, India</p>
              </div>
              <div className="text-right text-xs">
                <p className="font-mono font-bold text-[#1F3A26]">#{selectedReceiptOrder.id}</p>
                <p className="text-gray-500 text-[11px]">{selectedReceiptOrder.date}</p>
              </div>
            </div>

            <div className="text-xs space-y-2 mb-4">
              <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Billed To:</p>
              <p className="font-bold text-[#1A1A1A]">{selectedReceiptOrder.shippingAddress.fullName}</p>
              <p className="text-gray-500 text-[11px]">
                {selectedReceiptOrder.shippingAddress.street}, {selectedReceiptOrder.shippingAddress.city} -{' '}
                {selectedReceiptOrder.shippingAddress.postalCode}
              </p>
            </div>

            {/* Items Table */}
            <div className="border border-gray-100 rounded-xl overflow-hidden mb-4 text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#FAF8F5] text-gray-500 font-bold border-b border-gray-100">
                  <tr>
                    <th className="p-2.5">Item</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedReceiptOrder.items.map((item, i) => (
                    <tr key={i}>
                      <td className="p-2.5 font-medium text-[#1A1A1A]">{item.product.name}</td>
                      <td className="p-2.5 text-center">{item.quantity}</td>
                      <td className="p-2.5 text-right font-semibold">
                        {formatINR(item.product.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-1 text-xs border-t border-gray-100 pt-3">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatINR(selectedReceiptOrder.subtotal)}</span>
              </div>
              {selectedReceiptOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>VIP Discount</span>
                  <span>-{formatINR(selectedReceiptOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span>
                  {selectedReceiptOrder.shipping === 0 ? 'FREE' : formatINR(selectedReceiptOrder.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#1F3A26] pt-2 border-t border-gray-200">
                <span>Total Amount Paid</span>
                <span>{formatINR(selectedReceiptOrder.total)}</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-gray-200 text-[#1F3A26] text-xs font-bold border border-gray-200 cursor-pointer"
              >
                Print Receipt
              </button>
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="px-4 py-2 rounded-xl bg-[#1F3A26] hover:bg-[#2D4D36] text-white text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
