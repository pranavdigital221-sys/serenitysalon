import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  Phone,
  Mail,
  User,
  Scissors,
  ShieldCheck,
  Heart,
  Loader2,
  AlertCircle,
  MessageCircle,
  CreditCard,
  Check,
  ExternalLink,
  Send,
  Lock,
  CalendarCheck,
  Ban,
  Copy,
} from 'lucide-react';
import { SALON_SERVICES, SERVICE_CATEGORIES } from '../../data/servicesData';
import { SalonService, Appointment } from '../../types';
import { appointmentApi } from '../../services/appointmentApi';
import { getAdminWhatsAppUrl, getCallTelUrl, SALON_ADMIN_PHONE, validateAndFormatIndianPhone } from '../../utils/whatsapp';
import { getServiceEstimatedPrice, calculateAdvancePayment } from '../../utils/servicePricing';
import { RazorpayPaymentModal } from './RazorpayPaymentModal';
import { GmailConciergeModal } from './GmailConciergeModal';
import { formatINR } from '../../utils/currency';
import { sendAppointmentConfirmationEmail, EmailDispatchResult } from '../../utils/email';
import { createAppointmentInFirestore, listenToAppointments, checkFirestoreSlotAvailability, reserveSlotWithFirestoreTransaction } from '../../lib/firebase';
import {
  DEFAULT_SALON_TIME_SLOTS,
  getSlotsWithStatus,
  getFirstAvailableSlot,
  validateBookingSlot,
  getLocalDateString,
  normalizeTimeSlot,
  SlotAvailabilityInfo,
} from '../../utils/appointmentSlots';

function getGoogleCalendarUrl(appointment: Appointment): string {
  const dateClean = appointment.preferredDate.replace(/-/g, '');
  const norm = normalizeTimeSlot(appointment.preferredTime);
  const match = norm.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  let startH = 10;
  let startM = 0;
  if (match) {
    startH = parseInt(match[1], 10);
    startM = parseInt(match[2], 10);
    const meridiem = match[3].toUpperCase();
    if (meridiem === 'PM' && startH < 12) startH += 12;
    if (meridiem === 'AM' && startH === 12) startH = 0;
  }
  const endH = (startH + 1) % 24;

  const startIso = `${dateClean}T${String(startH).padStart(2, '0')}${String(startM).padStart(2, '0')}00`;
  const endIso = `${dateClean}T${String(endH).padStart(2, '0')}${String(startM).padStart(2, '0')}00`;

  const title = encodeURIComponent(`Serenity Salon: ${appointment.serviceName}`);
  const details = encodeURIComponent(
    `Appointment ID: ${appointment.id}\nService: ${appointment.serviceName}\nClient: ${appointment.fullName}\nPhone: ${appointment.phone}\nSerenity Luxury Salon & Spa Concierge`
  );
  const location = encodeURIComponent('Serenity Luxury Salon & Spa, Indiranagar, Bengaluru');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
}

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: SalonService | null;
  initialCategory?: string;
  onBookingSuccess?: (details: {
    name: string;
    service: string;
    date: string;
    time: string;
    appointment?: Appointment;
  }) => void;
}

export const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({
  isOpen,
  onClose,
  initialService,
  initialCategory,
  onBookingSuccess,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialService?.category || initialCategory || 'Hair Services'
  );
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialService?.id || ''
  );
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return getLocalDateString(today);
  });
  const [timeSlot, setTimeSlot] = useState('11:00 AM');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStage, setSubmissionStage] = useState<'verifying' | 'saving' | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showGmailModal, setShowGmailModal] = useState(false);
  const [emailStatus, setEmailStatus] = useState<EmailDispatchResult | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Existing bookings from Firestore and server to prevent double-bookings
  const [existingAppointments, setExistingAppointments] = useState<Appointment[]>([]);
  const [serverBookedSlots, setServerBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Sync real-time slot availability from public availability endpoint
  useEffect(() => {
    if (!isOpen || !date) return;

    setIsLoadingSlots(true);
    appointmentApi
      .getAvailability(date)
      .then((res) => {
        if (res.success && Array.isArray(res.bookedSlots)) {
          setServerBookedSlots(res.bookedSlots);
        }
      })
      .catch((err) => {
        console.warn('Slot availability sync notice:', err);
      })
      .finally(() => {
        setIsLoadingSlots(false);
      });
  }, [isOpen, date]);

  // Sync existing bookings from API (if admin token present) & real-time Firestore listener
  useEffect(() => {
    if (!isOpen) return;

    appointmentApi
      .getAll()
      .then((res) => {
        if (Array.isArray(res.data)) {
          setExistingAppointments(res.data);
        }
      })
      .catch((err) => {
        console.debug('Slot booking admin sync notice:', err);
      });

    let unsubscribeFirestore: (() => void) | null = null;
    try {
      unsubscribeFirestore = listenToAppointments((docs) => {
        if (Array.isArray(docs)) {
          setExistingAppointments(docs);
        }
      });
    } catch (fsErr) {
      console.debug('Firestore real-time subscription notice:', fsErr);
    }

    return () => {
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, [isOpen]);

  // Compute status for all salon slots on the chosen date combining Firestore and server availability
  const slotsStatus: SlotAvailabilityInfo[] = useMemo(() => {
    const base = getSlotsWithStatus(date, existingAppointments, DEFAULT_SALON_TIME_SLOTS);
    if (!serverBookedSlots || serverBookedSlots.length === 0) return base;
    return base.map((s) => {
      const isServerBooked = serverBookedSlots.some(
        (b) => normalizeTimeSlot(b) === normalizeTimeSlot(s.time)
      );
      if (isServerBooked) {
        return {
          ...s,
          isAvailable: false,
          isBooked: true,
          bookingReason: 'booked' as const,
        };
      }
      return s;
    });
  }, [date, existingAppointments, serverBookedSlots]);

  const availableSlotsCount = useMemo(() => {
    return slotsStatus.filter((s) => s.isAvailable).length;
  }, [slotsStatus]);

  const isDateFullyBooked = useMemo(() => {
    return slotsStatus.length > 0 && availableSlotsCount === 0;
  }, [slotsStatus, availableSlotsCount]);

  // Auto-switch to next available slot if current slot becomes booked or is in the past
  useEffect(() => {
    if (!slotsStatus || slotsStatus.length === 0) return;
    const currentStatus = slotsStatus.find((s) => s.time === timeSlot);
    if (!currentStatus || !currentStatus.isAvailable) {
      const nextSlot = getFirstAvailableSlot(date, existingAppointments, DEFAULT_SALON_TIME_SLOTS);
      if (nextSlot) {
        setTimeSlot(nextSlot);
      }
    }
  }, [date, slotsStatus, existingAppointments, timeSlot]);

  useEffect(() => {
    if (initialService) {
      setSelectedCategory(initialService.category);
      setSelectedServiceId(initialService.id);
    } else if (initialCategory) {
      setSelectedCategory(initialCategory);
      const firstInCat = SALON_SERVICES.find((s) => s.category === initialCategory);
      if (firstInCat) setSelectedServiceId(firstInCat.id);
    } else if (!selectedServiceId) {
      const firstInCat = SALON_SERVICES.find((s) => s.category === selectedCategory);
      if (firstInCat) setSelectedServiceId(firstInCat.id);
    }
  }, [initialService, initialCategory, isOpen]);

  // When category changes, default to first service in that category
  const handleCategoryChange = (catName: string) => {
    setSelectedCategory(catName);
    const firstInCat = SALON_SERVICES.find((s) => s.category === catName);
    if (firstInCat) {
      setSelectedServiceId(firstInCat.id);
    }
  };

  const filteredServices = SALON_SERVICES.filter((s) => s.category === selectedCategory);
  const currentSelectedService = SALON_SERVICES.find((s) => s.id === selectedServiceId);

  const timeSlots = DEFAULT_SALON_TIME_SLOTS;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();
    const trimmedNotes = notes.trim();

    if (!trimmedName || !trimmedPhone || !date || !timeSlot) {
      setSubmitError('Please complete all required fields (marked with *).');
      return;
    }

    // Name validation
    if (trimmedName.length < 2 || trimmedName.length > 100) {
      setSubmitError('Please enter a valid full name (between 2 and 100 characters).');
      return;
    }

    if (!/[a-zA-Z]/.test(trimmedName)) {
      setSubmitError('Full name must contain letters.');
      return;
    }

    // Strict Indian +91 Phone validation using transformation utility
    const phoneValidation = validateAndFormatIndianPhone(trimmedPhone);
    if (!phoneValidation.isValid) {
      setSubmitError(phoneValidation.errorMessage || 'Please enter a valid 10-digit Indian phone number (+91 98765 43210).');
      return;
    }

    // Date validation
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      setSubmitError('Please select a valid date in YYYY-MM-DD format.');
      return;
    }

    const todayStr = getLocalDateString(new Date());
    if (date < todayStr) {
      setSubmitError('Selected date is in the past. Please choose today or an upcoming date.');
      return;
    }

    const maxBookingDate = new Date();
    maxBookingDate.setDate(maxBookingDate.getDate() + 180);
    const maxDateStr = getLocalDateString(maxBookingDate);
    if (date > maxDateStr) {
      setSubmitError('Appointments can only be scheduled up to 6 months (180 days) in advance.');
      return;
    }

    // Email validation if entered
    if (trimmedEmail) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 150) {
        setSubmitError('Please enter a valid email address (e.g., name@example.com).');
        return;
      }
    }

    // Notes length check
    if (trimmedNotes.length > 1000) {
      setSubmitError('Notes must not exceed 1000 characters.');
      return;
    }

    // Generate unique UUID idempotency key to prevent double-click / retry duplicate bookings
    const idempotencyKey = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? `bk_${crypto.randomUUID()}`
      : `bk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    setSubmitError(null);
    setIsSubmitting(true);
    setSubmissionStage('verifying');

    try {
      // 1. Fast in-memory slot check against current bookings
      const slotValidation = validateBookingSlot(date, timeSlot, existingAppointments);
      if (!slotValidation.isValid) {
        setSubmitError(
          slotValidation.errorMessage ||
            'This time slot is no longer available. Please select another available slot.'
        );
        return;
      }

      setSubmissionStage('saving');
      const serviceName = currentSelectedService?.name || 'Salon Service Consultation';
      const estimatedPrice = getServiceEstimatedPrice(serviceName);

      const bookingPayload = {
        serviceName,
        serviceCategory: selectedCategory,
        servicePrice: estimatedPrice,
        preferredDate: date,
        preferredTime: timeSlot,
        fullName: trimmedName,
        phone: phoneValidation.formatted,
        email: trimmedEmail || undefined,
        notes: trimmedNotes || undefined,
        idempotencyKey,
      };

      // 2. Submit booking to backend API with strict 10-second timeout
      const result = await appointmentApi.create(bookingPayload, 10000);

      if (result.success && result.data) {
        const appointmentData = result.data;

        setExistingAppointments((prev) => [appointmentData, ...prev.filter((p) => p.id !== appointmentData.id)]);
        setCreatedAppointment(appointmentData);

        // If payment is already marked Paid (e.g. mock/admin), confirm immediately. Otherwise open Razorpay Payment Modal.
        if (appointmentData.payment?.status === 'Paid' || appointmentData.status === 'Confirmed') {
          setIsSubmitted(true);
        } else {
          // Open Razorpay 40% Advance Payment Modal
          setShowPaymentModal(true);
        }

        // Background non-blocking tasks (Firestore reservation, events)
        setTimeout(async () => {
          try {
            await reserveSlotWithFirestoreTransaction(appointmentData);
          } catch (firestoreErr) {
            console.debug('Firestore background transaction notice:', firestoreErr);
          }

          try {
            window.dispatchEvent(new CustomEvent('appointment-updated', { detail: appointmentData }));
            window.dispatchEvent(new CustomEvent('serenity:new-appointment', { detail: appointmentData }));
            if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
              const bc = new BroadcastChannel('serenity_appointments_channel');
              bc.postMessage({ type: 'NEW_APPOINTMENT_BOOKED', payload: appointmentData });
              bc.close();
            }
          } catch (eventErr) {
            console.debug('Event dispatch notice:', eventErr);
          }
        }, 10);
      } else {
        setSubmitError(result.error || result.message || 'Failed to submit booking. Please try again.');
      }
    } catch (err: any) {
      console.error('Error submitting appointment:', err);
      setSubmitError(err?.message || 'Unable to connect to the booking system. Please check your connection.');
    } finally {
      setIsSubmitting(false);
      setSubmissionStage(null);
    }
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setCreatedAppointment(null);
    setFullName('');
    setPhone('');
    setEmail('');
    setNotes('');
    setSubmitError(null);
    setShowPaymentModal(false);
    setEmailStatus(null);
  };

  const handleCloseModal = () => {
    handleResetForm();
    onClose();
  };

  const handlePaymentSuccess = (updatedApt: Appointment) => {
    setCreatedAppointment(updatedApt);
    setIsSubmitted(true);
    setShowPaymentModal(false);

    try {
      window.dispatchEvent(new CustomEvent('appointment-updated', { detail: updatedApt }));
      window.dispatchEvent(new CustomEvent('serenity:new-appointment', { detail: updatedApt }));
    } catch {
      // ignore
    }

    if (onBookingSuccess) {
      onBookingSuccess({
        name: updatedApt.fullName,
        service: updatedApt.serviceName,
        date: updatedApt.preferredDate,
        time: updatedApt.preferredTime,
        appointment: updatedApt,
      });
    }
  };

  const appointmentIdFormatted = createdAppointment
    ? createdAppointment.id.startsWith('#')
      ? createdAppointment.id
      : `#${createdAppointment.id}`
    : '#SS-2026';

  const pricing = createdAppointment
    ? calculateAdvancePayment(createdAppointment.serviceName, 40, createdAppointment.servicePrice)
    : calculateAdvancePayment(currentSelectedService?.name || '', 40);

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
        {/* Backdrop */}
        <div
          onClick={handleCloseModal}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        />

        {/* Modal Card */}
        <div className="relative bg-white rounded-[24px] max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#1F3A26]/10 z-10 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col overflow-hidden">
          
          {/* Close Button */}
          <button
            onClick={handleCloseModal}
            aria-label="Close booking modal"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#F7F5F1] text-gray-700 flex items-center justify-center hover:bg-[#1F3A26] hover:text-white transition-colors cursor-pointer z-10 shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>

          {isSubmitted && createdAppointment ? (
            <div className="text-center py-4 my-auto overflow-y-auto pr-1">
              <div className="w-16 h-16 rounded-full bg-[#1F3A26] text-[#C9A66B] mx-auto flex items-center justify-center mb-3 shadow-lg animate-in zoom-in-50 duration-300">
                <CheckCircle2 className="w-9 h-9 text-[#C9A66B]" />
              </div>

              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A66B] block mb-1">
                Booking Request Confirmed
              </span>

              <h3 className="font-heading font-bold text-2xl text-[#1F3A26] mb-3">
                Thank You, {createdAppointment.fullName}!
              </h3>

              {/* Exact Required Success Message */}
              <div className="bg-[#1F3A26]/5 border border-[#1F3A26]/20 p-4 rounded-2xl max-w-md mx-auto mb-4 text-center">
                <p className="text-sm font-semibold text-[#1F3A26] leading-relaxed">
                  Appointment request received successfully!
                  <br />
                  <span className="text-[#C9A66B] font-bold">
                    Your Appointment ID is {appointmentIdFormatted}.
                  </span>
                  <br />
                  <span className="text-xs font-normal text-gray-700">
                    Serenity Salon will contact you shortly to confirm your appointment.
                  </span>
                </p>
              </div>

              {/* Booking Summary Card */}
              <div className="bg-[#F7F5F1] p-4 rounded-2xl border border-[#1F3A26]/10 max-w-md mx-auto text-xs text-[#1F3A26] text-left space-y-2 mb-4">
                <div className="flex justify-between items-center border-b border-gray-200/80 pb-2">
                  <span className="text-gray-500 font-medium">Appointment ID:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-[#1F3A26]">{appointmentIdFormatted}</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (createdAppointment) {
                          navigator.clipboard?.writeText(createdAppointment.id);
                          setCopiedId(true);
                          setTimeout(() => setCopiedId(false), 2000);
                        }
                      }}
                      className="p-1 rounded-md hover:bg-gray-200 text-gray-500 hover:text-[#1F3A26] transition-colors cursor-pointer"
                      title="Copy Appointment ID"
                    >
                      {copiedId ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200/80 pb-2">
                  <span className="text-gray-500 font-medium">Customer Name:</span>
                  <span className="font-bold text-[#1F3A26]">{createdAppointment.fullName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200/80 pb-2">
                  <span className="text-gray-500 font-medium">Service Selected:</span>
                  <span className="font-semibold text-[#1F3A26] text-right">{createdAppointment.serviceName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200/80 pb-2">
                  <span className="text-gray-500 font-medium">Date &amp; Time:</span>
                  <span className="font-bold text-[#C9A66B]">{createdAppointment.preferredDate} at {createdAppointment.preferredTime}</span>
                </div>
                <div className="flex justify-between items-center pt-0.5">
                  <span className="text-gray-500 font-medium">Booking Status:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      createdAppointment.status === 'Confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {createdAppointment.status}
                  </span>
                </div>
                {createdAppointment.payment?.status === 'Paid' && (
                  <div className="flex justify-between items-center pt-1 border-t border-emerald-200/60 text-emerald-800 font-medium">
                    <span>Advance Payment:</span>
                    <span className="font-bold">{formatINR(createdAppointment.payment.advanceAmount)} (Paid via Razorpay)</span>
                  </div>
                )}
              </div>

              {/* Add to Google Calendar Action */}
              <div className="max-w-md mx-auto mb-4">
                <a
                  href={getGoogleCalendarUrl(createdAppointment)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-gray-50 text-[#1F3A26] border border-gray-300 font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4 text-[#C9A66B]" />
                  <span>Add to Google Calendar</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </div>

              {/* Confirmation Email Receipt Notification Banner */}
              {createdAppointment.email && (
                <div className="bg-[#1F3A26]/5 border border-[#1F3A26]/15 rounded-2xl p-3.5 max-w-md mx-auto mb-4 text-left flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#1F3A26] text-[#C9A66B] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4 text-[#C9A66B]" />
                  </div>
                  <div className="text-xs flex-1">
                    <div className="font-bold text-[#1F3A26] flex items-center gap-1.5">
                      <span>Confirmation Email Dispatched</span>
                      <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                    </div>
                    <p className="text-gray-600 text-[11px] leading-relaxed mt-0.5">
                      Receipt sent to <strong className="text-[#1F3A26]">{createdAppointment.email}</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* Advance Payment Banner (if not already paid) */}
              {createdAppointment.payment?.status !== 'Paid' && (
                <div className="bg-gradient-to-r from-[#1F3A26] to-[#2B4E35] text-white p-4 rounded-2xl max-w-md mx-auto mb-4 text-left shadow-md flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#C9A66B] block">
                      Optional Advance Booking
                    </span>
                    <span className="text-xs font-semibold block text-white">
                      Pay {formatINR(pricing.advanceAmount)} advance to instantly lock slot
                    </span>
                    <span className="text-[10px] text-gray-300 block">
                      Balance {formatINR(pricing.remainingAmount)} payable at salon
                    </span>
                  </div>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-[#C9A66B] hover:bg-[#b08e54] text-[#1F3A26] font-bold text-xs shrink-0 shadow-sm transition-all cursor-pointer flex items-center gap-1"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Pay Advance</span>
                  </button>
                </div>
              )}

              {/* Direct Salon Action Buttons & WhatsApp Confirmation */}
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 max-w-md mx-auto mb-4 text-left space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#25D366] text-white flex items-center justify-center shadow-xs">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-950 block">WhatsApp Salon Admin</span>
                      <span className="text-[10px] text-emerald-700 block">Direct Concierge Line: {SALON_ADMIN_PHONE}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                    Instant Connect
                  </span>
                </div>

                <p className="text-[11px] text-emerald-800/90 leading-relaxed">
                  Your appointment details have been prepared for the salon admin. Click below to open WhatsApp and send your confirmation message directly.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  <a
                    href={getAdminWhatsAppUrl(createdAppointment)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-2/3 py-2.5 px-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send to Admin on WhatsApp</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </a>

                  <a
                    href={getCallTelUrl(SALON_ADMIN_PHONE)}
                    className="w-full sm:w-1/3 py-2.5 px-3 rounded-xl bg-white hover:bg-gray-100 text-[#1F3A26] font-bold text-xs border border-gray-300 shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#C9A66B]" />
                    <span>Call Admin</span>
                  </a>
                </div>
              </div>

              {/* Reset / Done */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleResetForm}
                  className="px-4 py-2 rounded-full text-gray-600 hover:text-[#1F3A26] text-xs font-semibold transition-colors cursor-pointer"
                >
                  Book Another Service
                </button>
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 rounded-full bg-[#1F3A26] hover:bg-[#4F7358] text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-y-auto pr-1">
              {/* Header */}
              <div className="flex items-center gap-3 mb-5 pr-8">
                <div className="w-11 h-11 rounded-2xl bg-[#FDF1E4] text-[#1F3A26] flex items-center justify-center border border-[#C9A66B]/30 shrink-0">
                  <Scissors className="w-5 h-5 text-[#C9A66B]" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#C9A66B] block">
                    Serenity Salon Concierge
                  </span>
                  <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#1F3A26] leading-tight">
                    Book an Appointment
                  </h2>
                </div>
              </div>

              {submitError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Category Select Pills */}
                <div>
                  <label className="block text-xs font-bold text-[#1F3A26] uppercase tracking-wider mb-2">
                    1. Select Category *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SERVICE_CATEGORIES.map((cat) => (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.name)}
                        className={`min-h-[44px] px-4 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center justify-center ${
                          selectedCategory === cat.name
                            ? 'bg-[#1F3A26] text-white shadow-xs'
                            : 'bg-[#F7F5F1] text-gray-700 hover:bg-[#FDF1E4] hover:text-[#1F3A26] border border-gray-200'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Service Select Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-[#1F3A26] uppercase tracking-wider mb-1.5">
                    2. Choose Specific Service *
                  </label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full min-h-[44px] px-4 py-3 rounded-xl bg-[#F7F5F1] text-base sm:text-sm text-[#1A1A1A] font-medium border border-gray-200 focus:outline-none focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B]/50"
                  >
                    {filteredServices.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} — {service.duration || 'Consultation'} ({service.priceText})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Service Card Highlight with Pricing & Advance details */}
                {currentSelectedService && (
                  <div className="bg-[#FDF1E4]/70 p-4 rounded-2xl border border-[#C9A66B]/30 flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-[#C9A66B] shrink-0 mt-0.5" />
                    <div className="text-xs w-full">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1F3A26] block text-sm">
                          {currentSelectedService.name}
                        </span>
                        <span className="font-bold text-[#1F3A26] text-sm">{currentSelectedService.priceText}</span>
                      </div>
                      <p className="text-gray-600 text-xs leading-relaxed mt-1">
                        {currentSelectedService.description}
                      </p>
                      <div className="flex flex-wrap items-center justify-between mt-2 pt-2 border-t border-[#C9A66B]/20 text-xs text-[#1F3A26] gap-1">
                        {currentSelectedService.duration && (
                          <span>⏱ Duration: {currentSelectedService.duration}</span>
                        )}
                        <span className="text-emerald-800 font-semibold">
                          Advance deposit: {formatINR(calculateAdvancePayment(currentSelectedService.name).advanceAmount)} (Optional)
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Date & Time Slot with Slot Blocking Utility */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <label className="block text-xs font-bold text-[#1F3A26] uppercase tracking-wider">
                      3. Preferred Date &amp; Time Slot *
                    </label>
                    <div className="flex items-center gap-1.5 text-xs">
                      {isLoadingSlots ? (
                        <span className="text-gray-400 flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin text-[#C9A66B]" /> Checking availability...
                        </span>
                      ) : isDateFullyBooked ? (
                        <span className="text-rose-700 font-bold bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 flex items-center gap-1">
                          <Ban className="w-3 h-3" /> Fully Booked
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {availableSlotsCount} of {slotsStatus.length} slots open
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Date Input */}
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Select Date
                      </label>
                      <input
                        type="date"
                        required
                        min={getLocalDateString(new Date())}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#F7F5F1] text-base sm:text-sm text-[#1A1A1A] font-medium border border-gray-200 focus:outline-none focus:border-[#C9A66B]"
                      />
                    </div>

                    {/* Time Slots Grid */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center justify-between">
                        <span>Select Available Slot</span>
                        {timeSlot && (
                          <span className="text-[#C9A66B] font-bold text-xs">
                            Selected: {timeSlot}
                          </span>
                        )}
                      </label>

                      {isDateFullyBooked ? (
                        <div className="p-3.5 bg-rose-50/80 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                          <span>All slots for this date are fully reserved. Please pick another date above.</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {slotsStatus.map((slot) => {
                            const isSelected = timeSlot === slot.time && slot.isAvailable;
                            const isBooked = slot.isBooked;
                            const isPast = slot.isPast;
                            const isDisabled = !slot.isAvailable;

                            return (
                              <button
                                type="button"
                                key={slot.time}
                                disabled={isDisabled}
                                onClick={() => {
                                  if (slot.isAvailable) {
                                    setTimeSlot(slot.time);
                                    setSubmitError(null);
                                  }
                                }}
                                title={
                                  isBooked
                                    ? `Slot booked (${slot.appointment?.serviceName || 'Reserved'})`
                                    : isPast
                                    ? 'Past time slot'
                                    : `Book ${slot.time}`
                                }
                                className={`relative min-h-[44px] py-2 px-2 rounded-xl text-xs font-semibold transition-all text-center flex flex-col items-center justify-center gap-0.5 border cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#1F3A26] text-white border-[#1F3A26] shadow-xs ring-2 ring-[#C9A66B]/60'
                                    : isBooked
                                    ? 'bg-gray-100 text-gray-400 border-gray-200/80 cursor-not-allowed opacity-75'
                                    : isPast
                                    ? 'bg-gray-50/80 text-gray-300 border-gray-100 cursor-not-allowed opacity-60'
                                    : 'bg-[#F7F5F1] text-gray-800 border-gray-200 hover:bg-[#FDF1E4] hover:text-[#1F3A26] hover:border-[#C9A66B]/50'
                                }`}
                              >
                                <span className={`${isBooked ? 'line-through text-gray-400' : ''}`}>
                                  {slot.time}
                                </span>
                                {isBooked ? (
                                  <span className="text-[9px] font-bold text-rose-600 uppercase tracking-tight flex items-center gap-0.5">
                                    <Lock className="w-2.5 h-2.5" /> Booked
                                  </span>
                                ) : isPast ? (
                                  <span className="text-[9px] font-medium text-gray-400">
                                    Past
                                  </span>
                                ) : (
                                  <span
                                    className={`text-[9px] font-bold ${
                                      isSelected ? 'text-[#C9A66B]' : 'text-emerald-700'
                                    }`}
                                  >
                                    Open
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Client Info: Name, Phone, Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#1F3A26] uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ananya Sharma"
                      className="w-full min-h-[44px] px-4 py-3 rounded-xl bg-[#F7F5F1] text-base sm:text-sm text-[#1A1A1A] border border-gray-200 focus:outline-none focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B]/50"
                    />
                  </div>

                  {/* Phone / WhatsApp with +91 Regex Validation & Helper Text */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-[#1F3A26] uppercase tracking-wider">
                        Phone / WhatsApp *
                      </label>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        +91 Format
                      </span>
                    </div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (submitError) setSubmitError(null);
                      }}
                      placeholder="+91 98765 43210"
                      pattern="^(\+91[\-\s]?)?[6-9]\d{9}$|^(\+91[\-\s]?)?[6-9]\d{4}[\-\s]?\d{5}$"
                      className="w-full min-h-[44px] px-4 py-3 rounded-xl bg-[#F7F5F1] text-base sm:text-sm text-[#1A1A1A] font-medium border border-gray-200 focus:outline-none focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B]/50"
                    />
                    {/* Persistent helper text */}
                    <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#C9A66B] shrink-0" />
                      <span>Format: 10-digit Indian mobile number (e.g. <strong>+91 98765 43210</strong> or <strong>9876543210</strong>).</span>
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F3A26] uppercase tracking-wider mb-1.5">
                    Email Address (For Appointment Receipts)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ananya@example.com"
                    className="w-full min-h-[44px] px-4 py-3 rounded-xl bg-[#F7F5F1] text-base sm:text-sm text-[#1A1A1A] border border-gray-200 focus:outline-none focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B]/50"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    We will dispatch your booking confirmation receipt and calendar details here.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F3A26] uppercase tracking-wider mb-1.5">
                    Special Notes / Styling Preferences
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any hair length details, skin sensitivities, bridal event date..."
                    className="w-full px-4 py-3 rounded-xl bg-[#F7F5F1] text-base sm:text-sm text-[#1A1A1A] border border-gray-200 focus:outline-none focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B]/50 resize-none min-h-[80px]"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[48px] py-3.5 px-6 rounded-full bg-[#1F3A26] hover:bg-[#4F7358] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer mt-4 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 text-[#C9A66B] animate-spin" />
                      <span>
                        {submissionStage === 'verifying'
                          ? 'Checking Slot Availability...'
                          : 'Confirming & Saving Appointment...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4 text-[#C9A66B]" />
                      <span>Confirm Appointment Booking</span>
                    </>
                  )}
                </button>
              </form>

              {/* Quick Contact info */}
              <div className="mt-5 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-[#6E6E6E] gap-2">
                <a
                  href={`tel:${SALON_ADMIN_PHONE}`}
                  className="flex items-center gap-1 hover:text-[#1F3A26] transition-colors font-medium"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C9A66B]" /> Call Concierge: {SALON_ADMIN_PHONE}
                </a>
                <span className="flex items-center gap-1 text-gray-500">
                  <Heart className="w-3.5 h-3.5 text-[#C9A66B]" /> Walk-ins Welcome Everyday
                </span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Razorpay Payment Modal */}
      {createdAppointment && (
        <RazorpayPaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          appointment={createdAppointment}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Gmail Concierge Modal */}
      {createdAppointment && (
        <GmailConciergeModal
          isOpen={showGmailModal}
          onClose={() => setShowGmailModal(false)}
          targetAppointment={createdAppointment}
        />
      )}
    </>
  );
};

