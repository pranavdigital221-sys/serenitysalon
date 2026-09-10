import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  RefreshCw,
  Download,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  AlertCircle,
  Eye,
  ExternalLink,
  MessageCircle,
  Mail,
  User,
  Phone,
  MapPin,
  CreditCard,
  Send,
  Loader2,
  X,
  Sparkles,
  Tag,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { ProductOrder } from '../../types';
import { productOrderApi } from '../../services/productOrderApi';
import { formatINR } from '../../utils/currency';
import { SafeImage } from '../common/SafeImage';
import { getAdminWhatsAppUrl } from '../../utils/whatsapp';

export const AdminOrdersManager: React.FC = () => {
  const [orders, setOrders] = useState<ProductOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('All');
  const [fulfillmentFilter, setFulfillmentFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<ProductOrder | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
  const [isRetryingEmail, setIsRetryingEmail] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Delete order state
  const [orderToDelete, setOrderToDelete] = useState<ProductOrder | null>(null);
  const [isDeletingOrder, setIsDeletingOrder] = useState(false);

  // Tracking info form inside order detail modal
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('Blue Dart / Delhivery');

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await productOrderApi.getAllOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Payment status filter
      if (paymentStatusFilter !== 'All' && order.paymentStatus !== paymentStatusFilter) {
        return false;
      }
      // Fulfillment status filter
      if (fulfillmentFilter !== 'All' && order.status !== fulfillmentFilter) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = (order.orderId || order.id || '').toLowerCase().includes(q);
        const matchesName = (order.customerName || '').toLowerCase().includes(q);
        const matchesPhone = (order.phone || '').toLowerCase().includes(q);
        const matchesEmail = (order.email || '').toLowerCase().includes(q);
        const matchesCity = (order.shippingAddress?.city || '').toLowerCase().includes(q);
        const matchesItem = (order.items || []).some((item) => item.name.toLowerCase().includes(q));
        return matchesId || matchesName || matchesPhone || matchesEmail || matchesCity || matchesItem;
      }
      return true;
    });
  }, [orders, paymentStatusFilter, fulfillmentFilter, searchQuery]);

  // Analytics Stats
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const paidOrders = orders.filter((o) => o.paymentStatus === 'PAID');
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
    const pendingOrders = orders.filter((o) => o.status === 'PENDING');
    const processingOrders = orders.filter((o) => o.status === 'PROCESSING');
    const dispatchedOrders = orders.filter((o) => o.status === 'DISPATCHED' || o.status === 'DELIVERED');
    const avgOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

    return {
      totalOrders,
      paidOrdersCount: paidOrders.length,
      totalRevenue,
      pendingOrdersCount: pendingOrders.length,
      processingOrdersCount: processingOrders.length,
      dispatchedOrdersCount: dispatchedOrders.length,
      avgOrderValue,
    };
  }, [orders]);

  // Handle status update
  const handleStatusChange = async (orderId: string, newStatus: ProductOrder['status']) => {
    setIsUpdatingStatus(orderId);
    try {
      const res = await productOrderApi.updateOrderStatus(orderId, {
        status: newStatus,
        trackingNumber: trackingNumber || undefined,
        carrier: carrier || undefined,
      });

      if (res.success && res.order) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? res.order! : o)));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(res.order);
        }
        showFeedback(`Order #${res.order.orderId || orderId} status updated to ${newStatus}`);
      } else {
        showFeedback(res.error || 'Failed to update order status');
      }
    } catch (err: any) {
      showFeedback(err.message || 'Error updating order status');
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  // Handle email retry
  const handleRetryEmail = async (orderId: string) => {
    setIsRetryingEmail(orderId);
    try {
      const res = await productOrderApi.retryOrderEmail(orderId);
      if (res.success && res.order) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? res.order! : o)));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(res.order);
        }
        showFeedback(`Confirmation email dispatched to ${res.order.email}!`);
      } else {
        showFeedback(res.error || 'Email retry failed.');
      }
    } catch (err: any) {
      showFeedback(err.message || 'Error dispatching email');
    } finally {
      setIsRetryingEmail(null);
    }
  };

  // Permanently delete order
  const handleConfirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    const targetId = orderToDelete.id;
    const displayId = orderToDelete.orderId || orderToDelete.id;

    setIsDeletingOrder(true);
    try {
      // Optimistic update
      setOrders((prev) => prev.filter((o) => o.id !== targetId && o.orderId !== targetId));
      if (selectedOrder?.id === targetId || selectedOrder?.orderId === targetId) {
        setSelectedOrder(null);
      }

      const res = await productOrderApi.deleteOrder(targetId);
      if (res.success) {
        showFeedback(`Order #${displayId} deleted permanently.`);
      } else {
        fetchOrders();
        showFeedback(res.error || 'Failed to delete order from server.');
      }
    } catch (err: any) {
      fetchOrders();
      showFeedback(err?.message || 'Error deleting order.');
    } finally {
      setIsDeletingOrder(false);
      setOrderToDelete(null);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      alert('No orders found to export.');
      return;
    }

    const headers = [
      'Order ID',
      'Date Placed',
      'Customer Name',
      'Phone',
      'Email',
      'Delivery Address',
      'City',
      'State',
      'PIN',
      'Items Count',
      'Grand Total (INR)',
      'Payment Method',
      'Payment Status',
      'Fulfillment Status',
      'Promo Code',
      'Email Status',
    ];

    const rows = filteredOrders.map((o) => [
      `"${o.orderId || o.id}"`,
      `"${o.createdAt}"`,
      `"${(o.customerName || '').replace(/"/g, '""')}"`,
      `"${(o.phone || '').replace(/"/g, '""')}"`,
      `"${(o.email || '').replace(/"/g, '""')}"`,
      `"${(o.shippingAddress?.street || '').replace(/"/g, '""')}"`,
      `"${(o.shippingAddress?.city || '').replace(/"/g, '""')}"`,
      `"${(o.shippingAddress?.state || '').replace(/"/g, '""')}"`,
      `"${(o.shippingAddress?.postalCode || '').replace(/"/g, '""')}"`,
      `"${o.items?.length || 0}"`,
      `"${o.grandTotal}"`,
      `"${o.paymentMethod}"`,
      `"${o.paymentStatus}"`,
      `"${o.status}"`,
      `"${o.promoCode || 'NONE'}"`,
      `"${o.emailStatus || 'SENT'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `serenity_orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback */}
      {actionFeedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
          <button onClick={() => setActionFeedback(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Total Orders */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Product Orders</span>
            <div className="w-7 h-7 rounded-lg bg-[#F7F5F1] text-[#1F3A26] flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-heading font-bold text-2xl text-[#1F3A26]">{stats.totalOrders}</div>
          <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#C9A66B]" /> Persistent Server Database
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Gross Product Sales</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-heading font-bold text-2xl text-emerald-700">{formatINR(stats.totalRevenue)}</div>
          <div className="text-[11px] text-gray-500 mt-1">
            Avg: <strong className="text-gray-900">{formatINR(stats.avgOrderValue)}</strong> / paid order
          </div>
        </div>

        {/* Processing & Dispatched */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">In Fulfillment</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Truck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-heading font-bold text-2xl text-blue-700">
            {stats.processingOrdersCount + stats.pendingOrdersCount}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            {stats.pendingOrdersCount} pending • {stats.processingOrdersCount} packing
          </div>
        </div>

        {/* Completed & Delivered */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Delivered & Dispatched</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Package className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-heading font-bold text-2xl text-[#1F3A26]">{stats.dispatchedOrdersCount}</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            {stats.paidOrdersCount} Paid Transactions
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer, Phone, City, or Product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#1F3A26] focus:bg-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          
          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#1F3A26] font-medium"
          >
            <option value="All">All Payment (Any)</option>
            <option value="PAID">Paid Online / Verified</option>
            <option value="PENDING">Pending (COD/Gateway)</option>
            <option value="FAILED">Failed Payment</option>
          </select>

          <select
            value={fulfillmentFilter}
            onChange={(e) => setFulfillmentFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#1F3A26] font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing / Packed</option>
            <option value="DISPATCHED">Dispatched</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-white border border-gray-200 hover:border-[#1F3A26] text-[#1F3A26] text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="Download CSV report"
          >
            <Download className="w-3.5 h-3.5 text-[#C9A66B]" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={fetchOrders}
            disabled={isLoading}
            className="p-2 rounded-xl bg-white border border-gray-200 hover:border-[#1F3A26] text-gray-700 transition-colors shadow-xs cursor-pointer"
            title="Refresh orders"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#C9A66B]' : ''}`} />
          </button>
        </div>

      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        
        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 text-[#C9A66B] animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-500 font-medium">Loading orders from server...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#F7F5F1] text-gray-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6 text-[#C9A66B]" />
            </div>
            <h3 className="font-heading font-bold text-sm text-[#1A1A1A]">No product orders found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {searchQuery || paymentStatusFilter !== 'All' || fulfillmentFilter !== 'All'
                ? 'Try adjusting your search criteria or filters.'
                : 'Customer orders placed via the shopping cart and checkout will appear here in real-time.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F7F5F1] text-gray-600 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
                  <th className="py-3.5 px-4">Order ID & Date</th>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Items Summary</th>
                  <th className="py-3.5 px-4">Amount & Payment</th>
                  <th className="py-3.5 px-4">Fulfillment Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => {
                  const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <tr key={order.id} className="hover:bg-[#FAF8F5] transition-colors">
                      
                      {/* ID & Date */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-mono font-bold text-[#1F3A26] text-xs">
                          #{order.orderId || order.id}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">{dateStr}</div>
                        {order.promoCode && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#FDF1E4] text-[#1F3A26] px-1.5 py-0.2 rounded mt-1">
                            <Tag className="w-2.5 h-2.5 text-[#C9A66B]" /> {order.promoCode}
                          </span>
                        )}
                      </td>

                      {/* Customer Details */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-semibold text-gray-900">{order.customerName}</div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-gray-400" /> +91 {order.phone}
                        </div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-1 truncate max-w-[180px]">
                          <Mail className="w-3 h-3 text-gray-400" /> {order.email}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          {order.shippingAddress.city}, {order.shippingAddress.state}
                        </div>
                      </td>

                      {/* Items Summary */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="flex items-center gap-1.5 mb-1">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <SafeImage
                              key={idx}
                              src={item.image}
                              alt={item.name}
                              className="w-7 h-7 rounded-md object-cover bg-white border border-gray-200 shrink-0"
                              fallbackType="product"
                            />
                          ))}
                          {order.items.length > 3 && (
                            <span className="w-7 h-7 rounded-md bg-gray-100 text-gray-600 text-[10px] font-bold flex items-center justify-center">
                              +{order.items.length - 3}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-700 line-clamp-1 font-medium">
                          {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                        </div>
                      </td>

                      {/* Amount & Payment */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-bold text-[#1F3A26] font-heading text-sm">
                          {formatINR(order.grandTotal)}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              order.paymentStatus === 'PAID'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.paymentStatus === 'FAILED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                          <span className="text-[10px] text-gray-500 font-medium">
                            {order.paymentMethod === 'COD' ? 'COD' : 'Online'}
                          </span>
                        </div>
                      </td>

                      {/* Fulfillment Status */}
                      <td className="py-3.5 px-4 align-top">
                        <select
                          value={order.status}
                          disabled={isUpdatingStatus === order.id}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as ProductOrder['status'])}
                          className={`px-2.5 py-1 text-xs rounded-lg font-bold border transition-colors cursor-pointer ${
                            order.status === 'DELIVERED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : order.status === 'DISPATCHED'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : order.status === 'PROCESSING'
                              ? 'bg-purple-50 text-purple-800 border-purple-300'
                              : order.status === 'CANCELLED'
                              ? 'bg-rose-50 text-rose-800 border-rose-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="DISPATCHED">Dispatched</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                        {order.trackingNumber && (
                          <div className="text-[10px] text-gray-500 font-mono mt-1">
                            Track: {order.trackingNumber}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 align-top text-right space-x-1.5 whitespace-nowrap">
                        
                        {/* WhatsApp Contact */}
                        <a
                          href={getAdminWhatsAppUrl(
                            `Hello ${order.customerName}! This is Serenity Salon regarding your order #${order.orderId || order.id} (${order.status}).`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 inline-flex items-center justify-center transition-colors"
                          title="Message on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>

                        {/* Retry Email */}
                        <button
                          onClick={() => handleRetryEmail(order.id)}
                          disabled={isRetryingEmail === order.id}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 inline-flex items-center justify-center transition-colors cursor-pointer"
                          title="Resend confirmation email receipt"
                        >
                          {isRetryingEmail === order.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C9A66B]" />
                          ) : (
                            <Mail className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* View Details Modal */}
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setTrackingNumber(order.trackingNumber || '');
                            setCarrier(order.carrier || 'Blue Dart / Delhivery');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-[#1F3A26] hover:bg-[#4F7358] text-white text-xs font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-[#C9A66B]" />
                          <span>Details</span>
                        </button>

                        {/* Delete Order Permanently */}
                        <button
                          onClick={() => setOrderToDelete(order)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 inline-flex items-center justify-center transition-colors cursor-pointer"
                          title="Delete order permanently"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-[#1F3A26]/10">
            
            {/* Header */}
            <div className="px-6 py-4 bg-[#1F3A26] text-white flex items-center justify-between border-b border-[#C9A66B]/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#C9A66B]/20 text-[#C9A66B] flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">
                    Order #{selectedOrder.orderId || selectedOrder.id}
                  </h3>
                  <p className="text-[11px] text-[#EADBC8]">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
              
              {/* Customer & Shipping Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Customer Box */}
                <div className="p-3.5 bg-[#F7F5F1] rounded-xl border border-gray-200 space-y-2">
                  <h4 className="font-bold text-[#1F3A26] uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#C9A66B]" />
                    Customer Details
                  </h4>
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-900 text-sm">{selectedOrder.customerName}</div>
                    <div className="text-gray-600 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-gray-400" /> +91 {selectedOrder.phone}
                    </div>
                    <div className="text-gray-600 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-gray-400" /> {selectedOrder.email}
                    </div>
                    {selectedOrder.notes && (
                      <div className="text-gray-500 italic text-[11px] pt-1">
                        Note: "{selectedOrder.notes}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery Box */}
                <div className="p-3.5 bg-[#F7F5F1] rounded-xl border border-gray-200 space-y-2">
                  <h4 className="font-bold text-[#1F3A26] uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C9A66B]" />
                    Shipping Destination
                  </h4>
                  <div className="space-y-1 text-gray-700 leading-relaxed">
                    <div>{selectedOrder.shippingAddress.street}</div>
                    {selectedOrder.shippingAddress.area && <div>{selectedOrder.shippingAddress.area}</div>}
                    <div className="font-semibold text-gray-900">
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.postalCode}
                    </div>
                    {selectedOrder.shippingAddress.landmark && (
                      <div className="text-gray-500 text-[11px]">
                        Landmark: {selectedOrder.shippingAddress.landmark}
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Items List */}
              <div>
                <h4 className="font-bold text-[#1F3A26] uppercase text-[10px] tracking-wider mb-2.5">
                  Ordered Items ({selectedOrder.items.length})
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <SafeImage
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover bg-white shrink-0"
                        fallbackType="product"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 truncate">{item.name}</div>
                        <div className="text-gray-500 text-[11px] mt-0.5">
                          {formatINR(item.unitPrice)} × {item.quantity} qty
                        </div>
                      </div>
                      <div className="font-bold text-[#1F3A26] font-heading">
                        {formatINR(item.totalPrice)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="p-3.5 bg-[#F7F5F1] rounded-xl border border-gray-200 space-y-1.5">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatINR(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({selectedOrder.promoCode || 'PROMO'})</span>
                    <span>-{formatINR(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span className="font-semibold text-gray-900">
                    {selectedOrder.shippingFee === 0 ? 'FREE' : formatINR(selectedOrder.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#1F3A26] pt-1.5 border-t border-gray-300">
                  <span>Grand Total</span>
                  <span className="text-base font-heading">{formatINR(selectedOrder.grandTotal)}</span>
                </div>
              </div>

              {/* Payment & Tracking Form */}
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <h4 className="font-bold text-[#1F3A26] uppercase text-[10px] tracking-wider">
                  Update Tracking & Delivery Status
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-gray-700 mb-1">Carrier Partner</label>
                    <input
                      type="text"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      placeholder="e.g. Blue Dart / Delhivery"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-[#1F3A26]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-700 mb-1">AWB / Tracking Number</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="e.g. BLD123456789IN"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-[#1F3A26] font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Status:</span>
                    <select
                      value={selectedOrder.status}
                      disabled={isUpdatingStatus === selectedOrder.id}
                      onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as ProductOrder['status'])}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-gray-300 focus:outline-none focus:border-[#1F3A26] cursor-pointer"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing / Packing</option>
                      <option value="DISPATCHED">Dispatched / In Transit</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleStatusChange(selectedOrder.id, selectedOrder.status)}
                    disabled={isUpdatingStatus === selectedOrder.id}
                    className="px-4 py-1.5 rounded-lg bg-[#1F3A26] hover:bg-[#4F7358] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    Save Tracking Info
                  </button>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-[#F7F5F1] border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
              <a
                href={getAdminWhatsAppUrl(
                  `Hello ${selectedOrder.customerName}! Regarding your Serenity Salon order #${selectedOrder.orderId || selectedOrder.id}: Status is now ${selectedOrder.status}.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Message Client on WhatsApp</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const toDel = selectedOrder;
                    setSelectedOrder(null);
                    setOrderToDelete(toDel);
                  }}
                  className="px-4 py-2 rounded-full border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Delete Order</span>
                </button>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Delete Order Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-60 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-rose-200 flex flex-col animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-rose-50 p-5 border-b border-rose-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-rose-950">Delete Product Order?</h4>
                <p className="text-[11px] text-rose-800">This action cannot be undone.</p>
              </div>
            </div>

            {/* Details */}
            <div className="p-5 space-y-3 text-xs text-gray-700">
              <p className="text-gray-600">
                Are you sure you want to permanently delete order <strong className="text-gray-900 font-mono">#{orderToDelete.orderId || orderToDelete.id}</strong>?
              </p>

              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Customer:</span>
                  <span className="font-semibold text-gray-900">{orderToDelete.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Total Amount:</span>
                  <span className="font-semibold text-[#1F3A26]">{formatINR(orderToDelete.grandTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Payment Status:</span>
                  <span className="font-semibold uppercase">{orderToDelete.paymentStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Items:</span>
                  <span className="text-gray-700 font-medium truncate max-w-[220px]">
                    {orderToDelete.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-gray-500 leading-relaxed">
                This will remove the order record from the salon database and orders list permanently.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOrderToDelete(null)}
                  disabled={isDeletingOrder}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold text-xs cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteOrder}
                  disabled={isDeletingOrder}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors disabled:opacity-50"
                >
                  {isDeletingOrder ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Permanently</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
