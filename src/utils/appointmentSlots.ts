import { Appointment } from '../types';

export const DEFAULT_SALON_TIME_SLOTS = [
  '10:00 AM',
  '11:00 AM',
  '12:30 PM',
  '02:00 PM',
  '03:30 PM',
  '05:00 PM',
  '06:30 PM',
  '07:30 PM',
];

export interface SlotAvailabilityInfo {
  time: string;
  isAvailable: boolean;
  isBooked: boolean;
  isPast: boolean;
  bookingReason?: 'booked' | 'past' | 'unavailable';
  appointment?: Appointment;
  bookedCount: number;
  maxCapacity: number;
  slotKey: string;
}

/**
 * Normalizes a time string to canonical format "HH:MM AM/PM"
 * Handles formats like "10:00 AM", "10:00am", "2:00 PM", "14:00"
 */
export function normalizeTimeSlot(timeStr: string): string {
  if (!timeStr) return '';
  const clean = timeStr.trim().toUpperCase();

  // Match standard 12-hour format e.g. "10:00 AM" or "02:00PM"
  const match12 = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match12) {
    const hours = match12[1].padStart(2, '0');
    const mins = match12[2];
    const meridiem = match12[3].toUpperCase();
    return `${hours}:${mins} ${meridiem}`;
  }

  // Match 24-hour format e.g. "14:00"
  const match24 = clean.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    let hoursNum = parseInt(match24[1], 10);
    const mins = match24[2];
    const meridiem = hoursNum >= 12 ? 'PM' : 'AM';
    if (hoursNum > 12) hoursNum -= 12;
    if (hoursNum === 0) hoursNum = 12;
    return `${String(hoursNum).padStart(2, '0')}:${mins} ${meridiem}`;
  }

  return clean;
}

/**
 * Generates a stable, canonical slot key in format "YYYY-MM-DD__HH-MM"
 * e.g. "2026-08-25__11-00", "2026-08-25__14-00", "2026-08-25__15-30"
 */
export function getSlotKey(dateStr: string, timeSlot: string): string {
  if (!dateStr || !timeSlot) return '';
  const cleanDate = dateStr.trim();
  const norm = normalizeTimeSlot(timeSlot);
  const match = norm.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    return `${cleanDate}__${timeSlot.replace(/[^a-zA-Z0-9]/g, '-')}`;
  }

  let hours = parseInt(match[1], 10);
  const mins = match[2];
  const meridiem = match[3].toUpperCase();

  if (meridiem === 'PM' && hours < 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  return `${cleanDate}__${String(hours).padStart(2, '0')}-${mins}`;
}

/**
 * Converts a time slot string into minutes from midnight for accurate comparison
 */
export function timeSlotToMinutes(timeStr: string): number {
  const norm = normalizeTimeSlot(timeStr);
  const match = norm.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return -1;

  let hours = parseInt(match[1], 10);
  const mins = parseInt(match[2], 10);
  const meridiem = match[3].toUpperCase();

  if (meridiem === 'PM' && hours < 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  return hours * 60 + mins;
}

/**
 * Returns local YYYY-MM-DD formatted string avoiding UTC timezone date shifts
 */
export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Checks if a slot date and time is in the past relative to current local time
 */
export function isSlotInPast(dateStr: string, timeSlot: string): boolean {
  if (!dateStr) return false;
  const now = new Date();
  const todayStr = getLocalDateString(now);

  if (dateStr < todayStr) {
    return true;
  }

  if (dateStr === todayStr) {
    const slotMinutes = timeSlotToMinutes(timeSlot);
    if (slotMinutes < 0) return false;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    // Slots at or before current time are past
    return slotMinutes <= currentMinutes;
  }

  return false;
}

/**
 * Filter active bookings that occupy a slot (excludes Cancelled bookings)
 */
export function getActiveAppointmentsForDate(
  dateStr: string,
  appointments: Appointment[],
  excludeAppointmentId?: string
): Appointment[] {
  if (!dateStr || !Array.isArray(appointments)) return [];

  return appointments.filter((apt) => {
    if (apt.id && excludeAppointmentId && apt.id === excludeAppointmentId) {
      return false;
    }
    // Cancelled appointments do not block calendar slots
    if (apt.status === 'Cancelled') {
      return false;
    }
    return apt.preferredDate === dateStr;
  });
}

/**
 * Checks whether a specific time slot on a date is already booked
 */
export function isSlotBooked(
  dateStr: string,
  timeSlot: string,
  appointments: Appointment[],
  excludeAppointmentId?: string,
  maxCapacity: number = 1
): { isBooked: boolean; matchingAppointment?: Appointment; count: number } {
  const activeOnDate = getActiveAppointmentsForDate(dateStr, appointments, excludeAppointmentId);
  const targetNorm = normalizeTimeSlot(timeSlot);

  const matched = activeOnDate.filter(
    (apt) => normalizeTimeSlot(apt.preferredTime) === targetNorm
  );

  return {
    isBooked: matched.length >= maxCapacity,
    matchingAppointment: matched[0],
    count: matched.length,
  };
}

/**
 * Returns comprehensive availability data for all time slots on a given date
 */
export function getSlotsWithStatus(
  dateStr: string,
  appointments: Appointment[],
  allSlots: string[] = DEFAULT_SALON_TIME_SLOTS,
  excludeAppointmentId?: string,
  maxCapacity: number = 1
): SlotAvailabilityInfo[] {
  const activeOnDate = getActiveAppointmentsForDate(dateStr, appointments, excludeAppointmentId);

  return allSlots.map((slot) => {
    const slotNorm = normalizeTimeSlot(slot);
    const matched = activeOnDate.filter(
      (apt) => normalizeTimeSlot(apt.preferredTime) === slotNorm
    );
    const bookedCount = matched.length;
    const isBooked = bookedCount >= maxCapacity;
    const isPast = isSlotInPast(dateStr, slot);

    let bookingReason: 'booked' | 'past' | 'unavailable' | undefined;
    if (isBooked) bookingReason = 'booked';
    else if (isPast) bookingReason = 'past';

    return {
      time: slot,
      isAvailable: !isBooked && !isPast,
      isBooked,
      isPast,
      bookingReason,
      appointment: matched[0],
      bookedCount,
      maxCapacity,
      slotKey: getSlotKey(dateStr, slot),
    };
  });
}

/**
 * Returns list of only open/available time slot strings for a given date
 */
export function getAvailableSlotsForDate(
  dateStr: string,
  appointments: Appointment[],
  allSlots: string[] = DEFAULT_SALON_TIME_SLOTS,
  excludeAppointmentId?: string,
  maxCapacity: number = 1
): string[] {
  const slotsStatus = getSlotsWithStatus(dateStr, appointments, allSlots, excludeAppointmentId, maxCapacity);
  return slotsStatus.filter((s) => s.isAvailable).map((s) => s.time);
}

/**
 * Finds the first available time slot for a date, or null if fully booked
 */
export function getFirstAvailableSlot(
  dateStr: string,
  appointments: Appointment[],
  allSlots: string[] = DEFAULT_SALON_TIME_SLOTS,
  excludeAppointmentId?: string,
  maxCapacity: number = 1
): string | null {
  const available = getAvailableSlotsForDate(dateStr, appointments, allSlots, excludeAppointmentId, maxCapacity);
  return available.length > 0 ? available[0] : null;
}

/**
 * Checks if a date has zero available time slots
 */
export function isDateFullyBooked(
  dateStr: string,
  appointments: Appointment[],
  allSlots: string[] = DEFAULT_SALON_TIME_SLOTS,
  excludeAppointmentId?: string,
  maxCapacity: number = 1
): boolean {
  const available = getAvailableSlotsForDate(dateStr, appointments, allSlots, excludeAppointmentId, maxCapacity);
  return available.length === 0;
}

/**
 * Validates a selected date and time slot before submission to strictly prevent double-booking
 */
export function validateBookingSlot(
  dateStr: string,
  timeSlot: string,
  appointments: Appointment[],
  excludeAppointmentId?: string,
  maxCapacity: number = 1
): { isValid: boolean; errorMessage?: string } {
  if (!dateStr) {
    return { isValid: false, errorMessage: 'Please select an appointment date.' };
  }
  if (!timeSlot) {
    return { isValid: false, errorMessage: 'Please select a preferred time slot.' };
  }

  if (isSlotInPast(dateStr, timeSlot)) {
    return {
      isValid: false,
      errorMessage: 'The selected time slot is in the past. Please select an upcoming slot.',
    };
  }

  const { isBooked, matchingAppointment } = isSlotBooked(
    dateStr,
    timeSlot,
    appointments,
    excludeAppointmentId,
    maxCapacity
  );

  if (isBooked) {
    const serviceInfo = matchingAppointment?.serviceName
      ? ` for ${matchingAppointment.serviceName}`
      : '';
    return {
      isValid: false,
      errorMessage: `This slot (${timeSlot} on ${dateStr}) is already reserved${serviceInfo}. Please choose another available time slot.`,
    };
  }

  return { isValid: true };
}

/**
 * Computes a map of dates with their booked slots summary for rapid calendar glance
 */
export function getBookedSlotsSummaryByDate(
  appointments: Appointment[],
  allSlots: string[] = DEFAULT_SALON_TIME_SLOTS
): Map<string, { totalSlots: number; bookedCount: number; availableCount: number; isFull: boolean }> {
  const map = new Map<string, { totalSlots: number; bookedCount: number; availableCount: number; isFull: boolean }>();

  // Extract all unique dates from appointments
  const dates = new Set<string>();
  appointments.forEach((a) => {
    if (a.preferredDate && a.status !== 'Cancelled') {
      dates.add(a.preferredDate);
    }
  });

  dates.forEach((dateStr) => {
    const slots = getSlotsWithStatus(dateStr, appointments, allSlots);
    const bookedCount = slots.filter((s) => s.isBooked).length;
    const availableCount = slots.filter((s) => s.isAvailable).length;
    map.set(dateStr, {
      totalSlots: allSlots.length,
      bookedCount,
      availableCount,
      isFull: availableCount === 0,
    });
  });

  return map;
}
