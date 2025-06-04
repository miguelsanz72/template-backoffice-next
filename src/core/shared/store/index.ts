import { useAuthStore } from '@/app/[locale]/auth/(presentation)/store/auth.store';
import { useNotificationStore } from './notification.store';

export type StoreState = {
  auth: ReturnType<typeof useAuthStore>;
  notification: ReturnType<typeof useNotificationStore>;
};

export const store: StoreState = {
  auth: useAuthStore,
  notification: useNotificationStore,
};
