import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Phone,
  MessageSquare,
  Eye,
  Trash2,
  Plus,
  Check,
  Sparkles,
  CalendarDays,
  ShieldCheck,
  AlertCircle,
  Download
} from 'lucide-react';
import { Appointment, AppointmentStatus } from '../../types';

interface AppointmentWeeklyCalendarProps {
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
  onStatusChange: (id: string, status: AppointmentStatus) => Promise<void>;
  onDeleteAppointment: (id: string) => Promise<void>;
  onOpenNewBooking: (prefillDate?: string) => void;
  onExportCSV?: () => void;
  isUpdatingStatus: string | null;
  isLoading?: boolean;
}

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  Pending: {
    label: 'Pending',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  Confirmed: {
    label: 'Confirmed',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  Completed: {
    label: 'Completed',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  Cancelled: {
    label: 'Cancelled',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
  },
};

// Helper: Get Monday of a given date
function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

// Helper: Format Date to YYYY-MM-DD local string
function formatISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export const AppointmentWeeklyCalendar: React.FC<AppointmentWeeklyCalendarProps> = ({
  appointments,
  onSelectAppointment,
  onStatusChange,
  onDeleteAppointment,
  onOpenNewBooking,
  onExportCSV,
  isUpdatingStatus,
  isLoading = false,
}) => {
  // State for currently viewed week's Monday
  const [currentMonday, setCurrentMonday] = useState<Date>(() => getMonday(new Date()));

  // Today string for comparison
  const todayISO = useMemo(() => formatISO(new Date()), []);

  // Compute 7 days of the currently selected week (Mon -> Sun)
  const weekDays = useMemo(() => {
    const days: { date: Date; iso: string; dayName: string; dayShort: string; dayNum: number; monthName: string; isToday: boolean }[] = [];
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(currentMonday);
      dayDate.setDate(currentMonday.getDate() + i);
      const iso = formatISO(dayDate);
      days.push({
        date: dayDate,
        iso,
        dayName: dayDate.toLocaleDateString('en-US', { weekday: 'long' }),
        dayShort: dayDate.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: dayDate.getDate(),
        monthName: dayDate.toLocaleDateString('en-US', { month: 'short' }),
        isToday: iso === todayISO,
      });
    }
    return days;
  }, [currentMonday, todayISO]);

  // Group appointments by date
  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    appointments.forEach((apt) => {
      const dateKey = apt.preferredDate;
      const list = map.get(dateKey) || [];
      list.push(apt);
      map.set(dateKey, list);
    });

    // Sort each day's appointments by time string
    map.forEach((list) => {
      list.sort((a, b) => {
        return (a.preferredTime || '').localeCompare(b.preferredTime || '');
      });
    });

    return map;
  }, [appointments]);

  // Calculate weekly metrics
  const weekIsoSet = useMemo(() => new Set(weekDays.map((d) => d.iso)), [weekDays]);
  
  const weekAppointments = useMemo(() => {
    return appointments.filter((apt) => weekIsoSet.has(apt.preferredDate));
  }, [appointments, weekIsoSet]);

  const weekMetrics = useMemo(() => {
    let pending = 0;
    let confirmed = 0;
    let completed = 0;
    let cancelled = 0;

    weekAppointments.forEach((apt) => {
      if (apt.status === 'Pending') pending++;
      else if (apt.status === 'Confirmed') confirmed++;
      else if (apt.status === 'Completed') completed++;
      else if (apt.status === 'Cancelled') cancelled++;
    });

    return {
      total: weekAppointments.length,
      pending,
      confirmed,
      completed,
      cancelled,
    };
  }, [weekAppointments]);

  // Navigation handlers
  const handlePrevWeek = () => {
    setCurrentMonday((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() - 7);
      return next;
    });
  };

  const handleNextWeek = () => {
    setCurrentMonday((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + 7);
      return next;
    });
  };

  const handleTodayWeek = () => {
    setCurrentMonday(getMonday(new Date()));
  };

  // Week range label formatted (e.g. "Aug 17 – Aug 23, 2026")
  const weekRangeLabel = useMemo(() => {
    const start = weekDays[0];
    const end = weekDays[6];
    if (!start || !end) return '';
    return `${start.monthName} ${start.dayNum} – ${end.monthName} ${end.dayNum}, ${start.date.getFullYear()}`;
  }, [weekDays]);

  return (
    <div className="space-y-4">
      {/* Calendar Header & Week Navigation Controls */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Left: Week Range Display and Today button */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1F3A26] text-[#C9A66B] flex items-center justify-center shrink-0 shadow-xs">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-lg text-[#1F3A26]">
                {weekRangeLabel}
              </h3>
              {weekDays.some((d) => d.isToday) && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                  Current Week
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Interactive 7-day schedule grid with real-time status management & direct booking
            </p>
          </div>
        </div>

        {/* Center/Right: Navigation buttons & Quick Metrics */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Metrics Chips */}
          <div className="hidden sm:flex items-center gap-1.5 mr-2 bg-[#F7F5F1] px-3 py-1.5 rounded-xl text-xs">
            <span className="text-gray-500 font-medium">This Week:</span>
            <span className="font-bold text-[#1F3A26]">{weekMetrics.total} total</span>
            {weekMetrics.pending > 0 && (
              <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px]">
                {weekMetrics.pending} pending
              </span>
            )}
            {weekMetrics.confirmed > 0 && (
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                {weekMetrics.confirmed} confirmed
              </span>
            )}
          </div>

          {onExportCSV && (
            <button
              onClick={onExportCSV}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#1F3A26] hover:text-white text-[#1F3A26] text-xs font-bold transition-all cursor-pointer border border-gray-200 shadow-2xs flex items-center gap-1.5"
              title="Download CSV of appointments"
            >
              <Download className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span>Download CSV</span>
            </button>
          )}

          <button
            onClick={handleTodayWeek}
            className="px-3.5 py-1.5 rounded-xl bg-[#F7F5F1] hover:bg-gray-200 text-[#1F3A26] text-xs font-bold transition-colors cursor-pointer border border-gray-200"
          >
            Today
          </button>

          <div className="flex items-center bg-[#F7F5F1] rounded-xl border border-gray-200 p-0.5">
            <button
              onClick={handlePrevWeek}
              className="p-1.5 rounded-lg text-gray-700 hover:text-[#1F3A26] hover:bg-white transition-colors cursor-pointer"
              title="Previous Week"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextWeek}
              className="p-1.5 rounded-lg text-gray-700 hover:text-[#1F3A26] hover:bg-white transition-colors cursor-pointer"
              title="Next Week"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 7-Day Weekly Grid / Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
          {[0, 1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-gray-200 bg-white flex flex-col min-h-[360px] overflow-hidden shadow-xs animate-pulse"
            >
              {/* Day Header Skeleton */}
              <div className="p-3 bg-[#F7F5F1] border-b border-gray-200/80">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-8 bg-gray-200 rounded-md"></div>
                  {idx === 2 && <div className="h-3 w-10 bg-[#C9A66B]/30 rounded-md"></div>}
                </div>
                <div className="flex items-baseline justify-between mt-2">
                  <div className="h-5 w-6 bg-gray-300 rounded-md"></div>
                  <div className="h-3 w-12 bg-gray-200 rounded-md"></div>
                </div>
              </div>

              {/* Day Body Skeleton Cards */}
              <div className="p-2 space-y-2.5 flex-1">
                {idx % 2 === 0 ? (
                  <>
                    <div className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="h-3 w-12 bg-amber-100 rounded-md"></div>
                        <div className="h-2.5 w-8 bg-gray-200 rounded-md"></div>
                      </div>
                      <div className="h-3.5 w-24 bg-gray-300 rounded-md"></div>
                      <div className="h-2.5 w-20 bg-gray-200 rounded-md"></div>
                    </div>
                    <div className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="h-3 w-14 bg-emerald-100 rounded-md"></div>
                        <div className="h-2.5 w-8 bg-gray-200 rounded-md"></div>
                      </div>
                      <div className="h-3.5 w-20 bg-gray-300 rounded-md"></div>
                      <div className="h-2.5 w-16 bg-gray-200 rounded-md"></div>
                    </div>
                  </>
                ) : idx % 3 === 0 ? (
                  <div className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-12 bg-blue-100 rounded-md"></div>
                      <div className="h-2.5 w-8 bg-gray-200 rounded-md"></div>
                    </div>
                    <div className="h-3.5 w-28 bg-gray-300 rounded-md"></div>
                    <div className="h-2.5 w-18 bg-gray-200 rounded-md"></div>
                  </div>
                ) : (
                  <div className="h-24 flex items-center justify-center border border-dashed border-gray-200 rounded-xl my-2">
                    <div className="h-2 w-16 bg-gray-200 rounded"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
          {weekDays.map((day) => {
          const dayAppointments = appointmentsByDate.get(day.iso) || [];
          const count = dayAppointments.length;

          return (
            <div
              key={day.iso}
              className={`rounded-2xl border transition-all flex flex-col min-h-[360px] ${
                day.isToday
                  ? 'bg-white border-[#1F3A26] ring-2 ring-[#1F3A26]/10 shadow-sm'
                  : 'bg-white/90 border-gray-200/90 shadow-xs hover:border-gray-300'
              }`}
            >
              {/* Day Header */}
              <div
                className={`p-3 rounded-t-2xl border-b transition-colors ${
                  day.isToday
                    ? 'bg-[#1F3A26] text-white border-[#1F3A26]'
                    : 'bg-[#F7F5F1] text-[#1F3A26] border-gray-200/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold uppercase tracking-wider ${day.isToday ? 'text-[#C9A66B]' : 'text-gray-600'}`}>
                    {day.dayShort}
                  </span>
                  {day.isToday && (
                    <span className="px-1.5 py-0.2 rounded-md bg-[#C9A66B] text-[#1F3A26] text-[9px] font-extrabold uppercase">
                      Today
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between mt-1">
                  <div className="flex items-baseline gap-1">
                    <span className="font-heading font-extrabold text-xl leading-none">
                      {day.dayNum}
                    </span>
                    <span className={`text-[11px] font-medium ${day.isToday ? 'text-gray-300' : 'text-gray-500'}`}>
                      {day.monthName}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      count > 0
                        ? day.isToday
                          ? 'bg-white/20 text-white'
                          : 'bg-[#1F3A26] text-[#C9A66B]'
                        : day.isToday
                        ? 'bg-white/10 text-gray-300'
                        : 'bg-gray-200/70 text-gray-500'
                    }`}
                  >
                    {count} {count === 1 ? 'booking' : 'bookings'}
                  </span>
                </div>
              </div>

              {/* Day Body / Appointment Cards List */}
              <div className="p-2.5 flex-1 flex flex-col gap-2 overflow-y-auto max-h-[520px]">
                {count === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-4 text-center text-gray-400 border border-dashed border-gray-200 rounded-xl bg-[#FAF9F7]/50 my-1">
                    <Clock className="w-5 h-5 text-gray-300 mb-1" />
                    <span className="text-[11px] font-medium text-gray-400">No bookings</span>
                    <button
                      onClick={() => onOpenNewBooking(day.iso)}
                      className="mt-2 px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-[#1F3A26] hover:bg-[#1F3A26] hover:text-white text-[10px] font-bold flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Book</span>
                    </button>
                  </div>
                ) : (
                  <>
                    {dayAppointments.map((apt) => {
                      const statusConf = STATUS_CONFIG[apt.status] || STATUS_CONFIG.Pending;
                      const cleanPhone = apt.phone.replace(/[^0-9+]/g, '');
                      const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(
                        `Hello ${apt.fullName}, this is Serenity Salon regarding your booking for "${apt.serviceName}" on ${apt.preferredDate} at ${apt.preferredTime}.`
                      )}`;

                      return (
                        <div
                          key={apt.id}
                          className="p-2.5 rounded-xl bg-[#F7F5F1]/80 hover:bg-[#F7F5F1] border border-gray-200/80 hover:border-[#C9A66B]/50 transition-all shadow-2xs group flex flex-col gap-1.5"
                        >
                          {/* Top Row: Time & Status Badge */}
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[11px] font-bold text-[#1F3A26] flex items-center gap-1 bg-white px-1.5 py-0.5 rounded-md border border-gray-200 font-mono">
                              <Clock className="w-3 h-3 text-[#C9A66B]" />
                              {apt.preferredTime}
                            </span>

                            <select
                              value={apt.status}
                              disabled={isUpdatingStatus === apt.id}
                              onChange={(e) => onStatusChange(apt.id, e.target.value as AppointmentStatus)}
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${statusConf.bg} ${statusConf.text} ${statusConf.border} cursor-pointer focus:outline-none`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>

                          {/* Middle: Customer Name & Service */}
                          <div>
                            <div className="font-bold text-xs text-[#1F3A26] truncate" title={apt.fullName}>
                              {apt.fullName}
                            </div>
                            <div className="text-[11px] font-medium text-gray-600 line-clamp-1" title={apt.serviceName}>
                              {apt.serviceName}
                            </div>
                          </div>

                          {/* Bottom Row: Quick Contacts & Actions */}
                          <div className="flex items-center justify-between pt-1 border-t border-gray-200/60 mt-0.5">
                            <div className="flex items-center gap-1">
                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                                title="WhatsApp chat"
                              >
                                <MessageSquare className="w-3 h-3" />
                              </a>
                              <a
                                href={`tel:${cleanPhone}`}
                                className="p-1 rounded-md bg-white text-gray-700 hover:bg-gray-200 transition-colors border border-gray-200"
                                title="Call"
                              >
                                <Phone className="w-3 h-3" />
                              </a>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => onSelectAppointment(apt)}
                                className="p-1 rounded-md bg-white text-gray-700 hover:bg-[#1F3A26] hover:text-white transition-colors border border-gray-200 cursor-pointer"
                                title="View full details"
                              >
                                <Eye className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => onDeleteAppointment(apt.id)}
                                className="p-1 rounded-md bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                                title="Delete booking"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Quick Add Button at bottom of day */}
                    <button
                      onClick={() => onOpenNewBooking(day.iso)}
                      className="w-full py-1.5 rounded-lg border border-dashed border-gray-300 hover:border-[#1F3A26] text-gray-500 hover:text-[#1F3A26] text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer bg-[#FAF9F7]/40 hover:bg-white mt-1"
                    >
                      <Plus className="w-3 h-3" /> Add Slot
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* Footer Info / Legend */}
      <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-wrap items-center justify-between text-xs text-gray-500 gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold text-[#1F3A26]">Status Legend:</span>
          <span className="flex items-center gap-1.5 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Pending Review
          </span>
          <span className="flex items-center gap-1.5 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Confirmed / Scheduled
          </span>
          <span className="flex items-center gap-1.5 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Completed
          </span>
          <span className="flex items-center gap-1.5 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Cancelled
          </span>
        </div>

        <div className="text-[11px] text-gray-400">
          Showing real-time appointments for week of {weekRangeLabel}
        </div>
      </div>
    </div>
  );
};
