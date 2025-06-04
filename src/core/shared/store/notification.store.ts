import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';
import { INotification } from '../interfaces/notification.interface';

/**
 * Interface for the notification store state and actions
 */
export interface NotificationStore {
  // State
  notifications: INotification[];

  // Actions
  showNotification: (notification: INotification) => void;
  showSuccessNotification: (message: string, duration?: number, isTranslationKey?: boolean) => void;
  showErrorNotification: (message: string, duration?: number, isTranslationKey?: boolean) => void;
  showInfoNotification: (message: string, duration?: number, isTranslationKey?: boolean) => void;
  showWarningNotification: (message: string, duration?: number, isTranslationKey?: boolean) => void;
  clearNotifications: () => void;
}

/**
 * Store implementation for notifications
 */
const storeApi: StateCreator<NotificationStore, [['zustand/devtools', never]], []> = (set) => ({
  // Initial state
  notifications: [],

  // Actions
  showNotification: (notification: INotification) => {
    set(
      (state) => ({
        notifications: [...state.notifications, notification],
      }),
      false,
      'showNotification'
    );
  },

  showSuccessNotification: (message: string, duration = 5000, isTranslationKey = true) => {
    set(
      (state) => ({
        notifications: [...state.notifications, { message, type: 'success', duration, isTranslationKey }],
      }),
      false,
      'showSuccessNotification'
    );
  },

  showErrorNotification: (message: string, duration = 8000, isTranslationKey = true) => {
    set(
      (state) => ({
        notifications: [...state.notifications, { message, type: 'error', duration, isTranslationKey }],
      }),
      false,
      'showErrorNotification'
    );
  },

  showInfoNotification: (message: string, duration = 5000, isTranslationKey = true) => {
    set(
      (state) => ({
        notifications: [...state.notifications, { message, type: 'info', duration, isTranslationKey }],
      }),
      false,
      'showInfoNotification'
    );
  },

  showWarningNotification: (message: string, duration = 5000, isTranslationKey = true) => {
    set(
      (state) => ({
        notifications: [...state.notifications, { message, type: 'warning', duration, isTranslationKey }],
      }),
      false,
      'showWarningNotification'
    );
  },

  clearNotifications: () => {
    set({ notifications: [] }, false, 'clearNotifications');
  },
});

// Create the store with devtools middleware
export const useNotificationStore = create<NotificationStore>()(devtools(storeApi));
