'use client';

import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useNotificationStore } from '@/core/shared/store/notification.store';

/**
 * NotificationProvider component
 *
 * This component listens to the notification store and displays notifications
 * using the Sonner toast component. It also handles translation of messages
 * if they are translation keys.
 */
export const NotificationProvider = () => {
  // Get notifications from the store
  const { notifications, clearNotifications } = useNotificationStore();

  // Get translation functions
  const commonT = useTranslations('common');

  /**
   * Traduce un mensaje utilizando la función de traducción apropiada
   * @param key Clave de traducción
   * @returns Mensaje traducido
   */
  const translateMessage = useCallback(
    (key: string): string => {
      try {
        // Si no es una clave de traducción, devolver el mensaje tal cual
        if (!key.includes('.')) {
          return key;
        }

        // Dividir la clave por puntos para determinar la ruta
        const parts = key.split('.');

        // Si la clave comienza con "common.", eliminar ese prefijo
        if (parts[0] === 'common') {
          // Usar el resto de la clave sin el prefijo "common."
          const keyWithoutCommon = parts.slice(1).join('.');
          return commonT(keyWithoutCommon);
        }

        // Manejar diferentes patrones de claves de traducción
        if (parts.length >= 2) {
          // Por ejemplo: AUTH.ERRORS.USER.NOT_FOUND
          if (parts[0] === 'AUTH' && parts[1] === 'ERRORS') {
            return commonT(`AUTH.ERRORS.${parts.slice(2).join('.')}`);
          }

          // Por ejemplo: AUTH.MESSAGES.INVALID_CREDENTIALS
          if (parts[0] === 'AUTH' && parts[1] === 'MESSAGES') {
            return commonT(`AUTH.MESSAGES.${parts.slice(2).join('.')}`);
          }

          // Por ejemplo: ERRORS.NETWORK_ERROR
          if (parts[0] === 'ERRORS') {
            return commonT(`ERRORS.${parts.slice(1).join('.')}`);
          }
        }

        // Intentar traducir la clave completa como último recurso
        return commonT(key);
      } catch (error) {
        console.error('Error traduciendo mensaje:', error);
        // Devolver la clave como fallback, pero eliminar el prefijo "common." si existe
        return key.startsWith('common.') ? key.substring(7) : key;
      }
    },
    [commonT]
  );

  useEffect(() => {
    // Procesar notificaciones cuando cambian
    if (notifications.length > 0) {
      // Obtener la última notificación
      const notification = notifications[notifications.length - 1];

      // Traducir mensaje si es una clave de traducción
      const message = notification.isTranslationKey ? translateMessage(notification.message) : notification.message;
      console.log(notification.type);

      // Mostrar toast según el tipo de notificación
      switch (notification.type) {
        case 'success':
          toast.success(message, { duration: notification.duration, position: 'top-right' });
          break;
        case 'error':
          toast.error(message, { duration: notification.duration, position: 'bottom-right' });

          break;
        case 'info':
          toast.info(message, { duration: notification.duration, position: 'top-left' });
          break;
        case 'warning':
          toast.warning(message, { duration: notification.duration, position: 'top-center' });
          break;
        default:
        //  toast(message, { duration: notification.duration });
      }

      // Limpiar notificaciones después de procesarlas
      clearNotifications();
    }
  }, [notifications, clearNotifications, translateMessage]);

  // Este componente no renderiza nada visible
  return null;
};

export default NotificationProvider;
