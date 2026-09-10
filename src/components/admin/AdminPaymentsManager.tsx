import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CreditCard,
  Search,
  RefreshCw,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  Calendar,
  ShoppingBag,
  Scissors,
  ArrowUpRight,
  ExternalLink,
  Filter,
  X,
  Eye,
  Hash,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { formatINR } from '../../utils/currency';

export interface PaymentTransaction {
  id: string;
  transactionId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  type: 'APPOINTMENT' | 'PRODUCT_ORDER';
  referenceId: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  serviceOrProducts: string;
  totalAmount: number;
  paidAmount: number;
  advancePercentage?: number;
  remainingAmount: number;
  currency: 'INR';
  status: 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';
  paymentMethod: string;
  date: string;
  signatureVerified?: boolean;
}

export const AdminPaymentsManager: React.FC = () => {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'APPOINTMENT' | 'PRODUCT_ORDER'>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/payments/transactions');
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.data || []);
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (typeFilter !== 'All' && tx.type !== typeFilter) {
        return false;
      }
      if (statusFilter !== 'All' && tx.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = (tx.transactionId || tx.id || '').toLowerCase().includes(q);
        const matchRef = (tx.referenceId || '').toLowerCase().includes(q);
        const matchRzpPay = (tx.razorpayPaymentId || '').toLowerCase().includes(q);
        const matchRzpOrd = (tx.razorpayOrderId || '').toLowerCase().includes(q);
        const matchCust = (tx.customerName || '').toLowerCase().includes(q);
        const matchPhone = (tx.customerPhone || '').includes(q);
        const matchEmail = (tx.customerEmail || '').toLowerCase().includes(q);
        const matchService = (tx.serviceOrProducts || '').toLowerCase().includes(q);
        return matchId || matchRef || matchRzpPay || matchRzpOrd || matchCust || matchPhone || matchEmail || matchService;
      }
      return true;
    });
  }, [transactions, typeFilter, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const totalTransactions = transactions.length;
    const paidTransactions = transactions.filter((t) => t.status === 'PAID');
    const totalCollected = paidTransactions.reduce((acc, t) => acc + (t.paidAmount || 0), 0);
    const appointmentRevenue = paidTransactions
      .filter((t) => t.type === 'APPOINTMENT')
      .reduce((acc, t) => acc + (t.paidAmount || 0), 0);
    const productRevenue = paidTransactions
      .filter((t) => t.type === 'PRODUCT_ORDER')
      .reduce((acc, t) => acc + (t.paidAmount || 0), 0);
    const pendingCount = transactions.filter((t) => t.status === 'PENDING').length;

    return {
      totalTransactions,
      paidCount: paidTransactions.length,
      totalCollected,
      appointmentRevenue,
      productRevenue,
      pendingCount,
    };
  }, [transactions]);

  const handleExportCSV = () => {
    if (transactions.length === 0) return;
    const headers = [
      'Transaction ID',
      'Type',
      'Reference ID',
      'Razorpay Order ID',
      'Razorpay Payment ID',
      'Customer Name',
      'Phone',
      'Email',
      'Item / Service',
      'Total Amount (INR)',
      'Paid Amount (INR)',
      'Remaining at Salon (INR)',
      'Currency',
      'Status',
      'Payment Method',
      'Date',
    ];

    const rows = transactions.map((t) => [
      `"${t.transactionId}"`,
      `"${t.type}"`,
      `"${t.referenceId}"`,
      `"${t.razorpayOrderId || ''}"`,
      `"${t.razorpayPaymentId || ''}"`,
      `"${t.customerName}"`,
      `"${t.customerPhone || ''}"`,
      `"${t.customerEmail || ''}"`,
      `"${t.serviceOrProducts.replace(/"/g, '""')}"`,
      t.totalAmount,
      t.paidAmount,
      t.remainingAmount,
      t.currency,
      `"${t.status}"`,
      `"${t.paymentMethod}"`,
      `"${t.date}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `serenity_payments_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="admin-payments-manager" className="space-y-6">
      {/* Top Banner & Action Controls */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#1F3A26] flex items-center justify-center text-[#C9A66B] shadow-xs shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#1F3A26]">Unified Payments & Settlement Ledger</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F7F5F1] text-[#1F3A26] border border-gray-200">
                Razorpay Verified
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Live audit of 100% product checkouts and 40% salon appointment advance payments.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchTransactions}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-[#F7F5F1] hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Refresh payment records"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-[#1F3A26] hover:bg-[#4F7358] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Export full financial ledger to CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#C9A66B]" />
            <span>Export Payments CSV</span>
          </button>
        </div>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Total Collected Online</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#1F3A26]">
            {formatINR(stats.totalCollected)}
          </div>
          <div className="mt-1 text-[11px] text-gray-500 font-medium">
            From {stats.paidCount} verified online payments
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Appointment Advances (40%)</span>
            <Scissors className="w-4 h-4 text-[#C9A66B]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#1F3A26]">
            {formatINR(stats.appointmentRevenue)}
          </div>
          <div className="mt-1 text-[11px] text-gray-500 font-medium">
            Remaining 60% due upon service completion
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Product Sales (100%)</span>
            <ShoppingBag className="w-4 h-4 text-[#1F3A26]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#1F3A26]">
            {formatINR(stats.productRevenue)}
          </div>
          <div className="mt-1 text-[11px] text-gray-500 font-medium">
            Full upfront payment before order dispatch
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Total Transactions Logged</span>
            <Hash className="w-4 h-4 text-gray-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#1F3A26]">
            {stats.totalTransactions}
          </div>
          <div className="mt-1 text-[11px] text-amber-700 font-medium">
            {stats.pendingCount} pending verification
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Payment ID, Order ID, customer name, phone, service..."
            className="w-full pl-9.5 pr-4 py-2 rounded-xl bg-[#F7F5F1] text-xs text-[#1A1A1A] border border-transparent focus:border-[#C9A66B] focus:bg-white outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Type & Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <div className="flex items-center bg-[#F7F5F1] p-1 rounded-xl border border-gray-200 shrink-0">
            {(['All', 'APPOINTMENT', 'PRODUCT_ORDER'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  typeFilter === t
                    ? 'bg-[#1F3A26] text-white shadow-2xs'
                    : 'text-gray-600 hover:text-[#1F3A26]'
                }`}
              >
                {t === 'All' ? 'All Types' : t === 'APPOINTMENT' ? 'Appointments (40%)' : 'Orders (100%)'}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#F7F5F1] text-gray-700 border border-gray-200 outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="PAID">Paid / Captured</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F7F5F1] border-b border-gray-200 text-gray-600 font-bold">
                <th className="py-3 px-4">Transaction ID & Ref</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Service / Product</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Paid Online</th>
                <th className="py-3 px-4">Remaining (Salon)</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4">Gateway IDs</th>
                <th className="py-3 px-4 text-right">Date & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-gray-500">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#C9A66B] mx-auto mb-2" />
                    <span>Loading payment transactions...</span>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-gray-500">
                    <CreditCard className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="font-semibold text-gray-700">No payment transactions found</p>
                    <p className="text-xs text-gray-400 mt-0.5">Transactions appear automatically when customers book or purchase.</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isPaid = tx.status === 'PAID';
                  const isAppointment = tx.type === 'APPOINTMENT';

                  return (
                    <tr key={tx.id} className="hover:bg-gray-50/80 transition-colors">
                      {/* Transaction ID */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-[#1F3A26] block">
                          {tx.transactionId}
                        </span>
                        <span className="text-[11px] text-gray-500 font-mono">
                          Ref: {tx.referenceId}
                        </span>
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-4">
                        {isAppointment ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#C9A66B]/15 text-[#1F3A26] border border-[#C9A66B]/30">
                            <Scissors className="w-3 h-3 text-[#C9A66B]" />
                            <span>Salon (40%)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                            <ShoppingBag className="w-3 h-3 text-blue-600" />
                            <span>Product (100%)</span>
                          </span>
                        )}
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#1F3A26]">{tx.customerName}</div>
                        <div className="text-[11px] text-gray-500 font-mono">
                          {tx.customerPhone || tx.customerEmail || '—'}
                        </div>
                      </td>

                      {/* Service / Products */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <span className="line-clamp-1 font-medium text-gray-800" title={tx.serviceOrProducts}>
                          {tx.serviceOrProducts}
                        </span>
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5 px-4 font-bold text-[#1F3A26]">
                        {formatINR(tx.totalAmount)}
                      </td>

                      {/* Paid Online */}
                      <td className="py-3.5 px-4">
                        <span className={`font-bold ${isPaid ? 'text-emerald-700' : 'text-gray-500'}`}>
                          {formatINR(tx.paidAmount)}
                        </span>
                        {isAppointment && (
                          <span className="block text-[10px] text-emerald-600 font-semibold">40% Advance</span>
                        )}
                        {!isAppointment && isPaid && (
                          <span className="block text-[10px] text-blue-600 font-semibold">100% Full</span>
                        )}
                      </td>

                      {/* Remaining (Salon) */}
                      <td className="py-3.5 px-4">
                        {tx.remainingAmount > 0 ? (
                          <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-[11px]">
                            {formatINR(tx.remainingAmount)} (60%)
                          </span>
                        ) : (
                          <span className="text-gray-400 text-[11px] font-medium">₹0 (Settled)</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {tx.status === 'PAID' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>PAID</span>
                          </span>
                        ) : tx.status === 'PENDING' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-500" />
                            <span>PENDING</span>
                          </span>
                        ) : tx.status === 'FAILED' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertCircle className="w-3 h-3 text-rose-500" />
                            <span>FAILED</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            <span>REFUNDED</span>
                          </span>
                        )}
                      </td>

                      {/* Gateway IDs */}
                      <td className="py-3.5 px-4 text-[11px] font-mono text-gray-500">
                        {tx.razorpayPaymentId ? (
                          <div>
                            <span className="text-[#1F3A26] font-semibold block truncate max-w-[120px]" title={tx.razorpayPaymentId}>
                              {tx.razorpayPaymentId}
                            </span>
                            <span className="text-gray-400 block truncate max-w-[120px]" title={tx.razorpayOrderId}>
                              {tx.razorpayOrderId}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">COD / Cash</span>
                        )}
                      </td>

                      {/* Date & Action */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-[11px] text-gray-500 block mb-1">
                          {tx.date ? new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        </span>
                        <button
                          onClick={() => setSelectedTx(tx)}
                          className="px-2.5 py-1 rounded-lg bg-[#F7F5F1] hover:bg-gray-200 text-[#1F3A26] text-[11px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-[#C9A66B]" />
                          <span>Audit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Audit Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1F3A26] flex items-center justify-center text-[#C9A66B]">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1F3A26]">Transaction Audit Details</h3>
                  <span className="text-xs font-mono text-gray-500">{selectedTx.transactionId}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              {/* Payment Flow Status Banner */}
              <div className={`p-4 rounded-2xl border ${
                selectedTx.status === 'PAID'
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-sm">
                      {selectedTx.status === 'PAID' ? 'Cryptographically Verified Payment' : 'Payment Status: ' + selectedTx.status}
                    </span>
                  </div>
                  <span className="font-bold font-mono text-xs">INR ({selectedTx.currency})</span>
                </div>
                <p className="mt-1 text-[11px] text-gray-600">
                  {selectedTx.type === 'APPOINTMENT'
                    ? '40% advance reservation fee paid online via Razorpay. Balance 60% is collectible at the salon checkout counter.'
                    : '100% upfront product payment verified prior to warehouse picking and courier dispatch.'}
                </p>
              </div>

              {/* Financial Breakdown Table */}
              <div className="bg-[#F7F5F1] p-4 rounded-2xl space-y-2 border border-gray-200/80">
                <div className="flex justify-between text-gray-600">
                  <span>Gross Transaction Value:</span>
                  <span className="font-bold text-[#1F3A26]">{formatINR(selectedTx.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>
                    Amount Paid Online ({selectedTx.type === 'APPOINTMENT' ? '40% Advance' : '100% Full'}):
                  </span>
                  <span>{formatINR(selectedTx.paidAmount)}</span>
                </div>
                {selectedTx.remainingAmount > 0 && (
                  <div className="flex justify-between text-amber-800 font-bold pt-2 border-t border-gray-200">
                    <span>Payable at Salon Counter (60%):</span>
                    <span>{formatINR(selectedTx.remainingAmount)}</span>
                  </div>
                )}
              </div>

              {/* Customer & Gateway References */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] text-gray-500 font-semibold uppercase block">Customer</span>
                  <span className="font-bold text-gray-900 block mt-0.5">{selectedTx.customerName}</span>
                  <span className="text-[11px] text-gray-500 block font-mono">{selectedTx.customerPhone || '—'}</span>
                  <span className="text-[11px] text-gray-500 block truncate">{selectedTx.customerEmail || '—'}</span>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] text-gray-500 font-semibold uppercase block">Gateway Metadata</span>
                  <span className="text-[11px] font-mono text-gray-800 block mt-0.5 truncate" title={selectedTx.razorpayPaymentId}>
                    PayID: {selectedTx.razorpayPaymentId || 'N/A'}
                  </span>
                  <span className="text-[11px] font-mono text-gray-800 block truncate" title={selectedTx.razorpayOrderId}>
                    OrdID: {selectedTx.razorpayOrderId || 'N/A'}
                  </span>
                  <span className="text-[11px] text-gray-600 block mt-1">Method: {selectedTx.paymentMethod}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedTx(null)}
                className="px-5 py-2 rounded-xl bg-[#1F3A26] hover:bg-[#4F7358] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
