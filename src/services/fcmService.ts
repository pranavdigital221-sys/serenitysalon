import { getMessaging, getToken, onMessage, isSupported, Messaging } from 'firebase/messaging';
import { app } from '../lib/firebase';

export interface PushNotificationPayload {
  title: string;
  body: string;
  appointmentId?: string;
  customerName?: string;
  serviceName?: string;
  preferredDate?: string;
  preferredTime?: string;
  timestamp?: string;
}

export type NotificationPermissionState = 'default' | 'granted' | 'denied' | 'unsupported';

let messagingInstance: Messaging | null = null;
let isMessagingSupported: boolean | null = null;

/**
 * Check if Firebase Cloud Messaging & Service Worker is supported in current browser/iframe
 */
export async function checkFCMSupport(): Promise<boolean> {
  if (isMessagingSupported !== null) {
    return isMessagingSupported;
  }

  try {
    if (typeof window === 'undefined' || !('Notification' in window) || !('serviceWorker' in navigator)) {
      isMessagingSupported = false;
      return false;
    }
    const supported = await isSupported();
    isMessagingSupported = supported;
    return supported;
  } catch (err) {
    console.warn('FCM support check note:', err);
    isMessagingSupported = false;
    return false;
  }
}

/**
 * Initialize FCM Messaging instance safely
 */
export async function getFCMInstance(): Promise<Messaging | null> {
  if (messagingInstance) return messagingInstance;
  if (!app) return null;

  const supported = await checkFCMSupport();
  if (!supported) return null;

  try {
    messagingInstance = getMessaging(app);
    return messagingInstance;
  } catch (err) {
    console.warn('FCM getMessaging initialization warning:', err);
    return null;
  }
}

/**
 * Plays a pleasant, refined 2-tone chime using the Web Audio API
 */
export function playNotificationChime(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // First tone (Gold tone - 587.33 Hz / D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Second harmonic tone (Emerald tone - 880 Hz / A5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0.18, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.6);
  } catch (err) {
    console.debug('Audio chime playback omitted:', err);
  }
}

/**
 * Request Notification Permission and register FCM Token
 */
export async function requestFCMNotificationPermission(): Promise<{
  status: NotificationPermissionState;
  token: string | null;
  message: string;
}> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return {
      status: 'unsupported',
      token: null,
      message: 'Browser notifications are not supported in this environment.',
    };
  }

  try {
    // 1. Request native browser notification permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return {
        status: permission,
        token: null,
        message: 'Notification permission was dismissed or blocked by the browser.',
      };
    }

    // 2. Register Service Worker if possible
    let swRegistration: ServiceWorkerRegistration | undefined;
    if ('serviceWorker' in navigator) {
      try {
        swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('Firebase messaging service worker active:', swRegistration.scope);
      } catch (swErr) {
        console.warn('Service worker registration note (normal in restricted preview):', swErr);
      }
    }

    // 3. Attempt FCM Device Token retrieval if Firebase App is initialized
    let fcmToken: string | null = null;
    const messaging = await getFCMInstance();
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY || undefined;

    if (messaging) {
      try {
        fcmToken = await getToken(messaging, {
          vapidKey: vapidKey || undefined,
          serviceWorkerRegistration: swRegistration,
        });

        if (fcmToken) {
          console.log('FCM Device Registration Token received:', fcmToken.substring(0, 16) + '...');
          localStorage.setItem('serenity_fcm_token', fcmToken);
        }
      } catch (tokenErr: any) {
        console.warn('FCM getToken note (using local browser push listener):', tokenErr.message);
      }
    }

    // Store push notification active status
    localStorage.setItem('serenity_push_enabled', 'true');

    return {
      status: 'granted',
      token: fcmToken,
      message: fcmToken
        ? 'Firebase Cloud Messaging & browser push notifications are active!'
        : 'Browser notifications active! You will receive instant alerts on new bookings.',
    };
  } catch (err: any) {
    console.error('Error requesting push permission:', err);
    return {
      status: 'denied',
      token: null,
      message: err.message || 'Could not enable push notifications.',
    };
  }
}

/**
 * Setup foreground FCM message listener
 */
export async function setupFCMForegroundListener(
  onNotificationReceived: (payload: PushNotificationPayload) => void
): Promise<(() => void) | null> {
  const messaging = await getFCMInstance();
  if (!messaging) return null;

  try {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Foreground FCM push message received:', payload);
      
      const notificationData: PushNotificationPayload = {
        title: payload.notification?.title || payload.data?.title || '✨ New Appointment Booked',
        body: payload.notification?.body || payload.data?.body || 'A customer has booked an appointment.',
        appointmentId: payload.data?.appointmentId,
        customerName: payload.data?.customerName,
        serviceName: payload.data?.serviceName,
        preferredDate: payload.data?.preferredDate,
        preferredTime: payload.data?.preferredTime,
        timestamp: new Date().toISOString(),
      };

      // Play audio chime
      playNotificationChime();

      // Show native notification if page is not focused or supported
      triggerNativeNotification(notificationData.title, {
        body: notificationData.body,
        data: notificationData,
      });

      // Call in-app callback
      onNotificationReceived(notificationData);
    });

    return unsubscribe;
  } catch (err) {
    console.warn('FCM onMessage listener note:', err);
    return null;
  }
}

/**
 * Display a native browser notification & audio chime
 */
export function triggerNativeNotification(
  title: string,
  options?: NotificationOptions & { playSound?: boolean }
): Notification | null {
  if (options?.playSound !== false) {
    playNotificationChime();
  }

  if (typeof window === 'undefined' || !('Notification' in window)) {
    return null;
  }

  if (Notification.permission !== 'granted') {
    return null;
  }

  try {
    const notification = new Notification(title, {
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      ...options,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return notification;
  } catch (err) {
    console.warn('Native notification display warning:', err);
    return null;
  }
}

/**
 * Broadcast new appointment event across browser tabs (via BroadcastChannel / CustomEvent / storage)
 */
export function broadcastNewAppointmentEvent(appointment: any): void {
  try {
    // 1. Web BroadcastChannel for multi-tab instant sync
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('serenity_appointments_channel');
      channel.postMessage({
        type: 'NEW_APPOINTMENT_BOOKED',
        payload: appointment,
        timestamp: Date.now(),
      });
      channel.close();
    }
  } catch (err) {
    console.debug('BroadcastChannel omitted:', err);
  }

  try {
    // 2. CustomEvent for same-window components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('serenity:new-appointment', {
          detail: appointment,
        })
      );
    }
  } catch (err) {
    console.debug('CustomEvent dispatch omitted:', err);
  }
}
