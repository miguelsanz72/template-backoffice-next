export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface INotification {
  message: string;
  type: NotificationType;
  duration?: number;
  isTranslationKey?: boolean;
}
