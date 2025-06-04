import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useNotificationStore } from '../shared/store/notification.store';
import { IResponseErrorApi, IResponseMessage } from '../shared/interfaces/global.interface';
import { useAuthStore } from '@/app/[locale]/auth/(presentation)/store/auth.store';

// Define custom types for better type safety
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
}

class HttpClient {
  private instance: AxiosInstance;
  private baseURL: string;
  // Rutas que no requieren token de autenticación
  private authRoutes: string[] = ['/auth/login', '/auth/signin', '/auth/register', '/auth/forgot-password'];
  // Referencia al store de notificaciones
  private notificationStore = useNotificationStore.getState();

  constructor(config?: HttpClientConfig) {
    this.baseURL = config?.baseURL || process.env.NEXT_PUBLIC_API_BASE_URL || '';

    // Create Axios instance with default configuration
    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: config?.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request Interceptor for logging and token injection
    this.instance.interceptors.request.use(
      (request) => {
        // Log request details
        console.log(`[HTTP Request] ${request.method?.toUpperCase()} ${request.url}`, {
          data: request.data,
          headers: request.headers,
        });

        // Verificar si la ruta actual es una ruta de autenticación
        const currentUrl = request.url || '';
        const isAuthRoute = this.authRoutes.some((route) => currentUrl.includes(route));

        // Inyectar token solo si no es una ruta de autenticación
        if (!isAuthRoute) {
          const token = this.getAuthToken();
          if (token) {
            request.headers['Authorization'] = `Bearer ${token}`;
          }
        }

        return request;
      },
      (error) => {
        console.error('[HTTP Request Error]', error);
        return Promise.reject(error);
      }
    );

    // Response Interceptor for logging and error handling
    this.instance.interceptors.response.use(
      (response: AxiosResponse<IResponseMessage>) => {
        console.log(`[HTTP Response] ${response.status} ${response.config.url}`, response.data);

        // Mostrar mensaje de éxito si existe
        if (response.data && typeof response.data === 'object' && 'message' in response.data) {
          // Actualizar el store para mostrar la notificación
          this.notificationStore = useNotificationStore.getState();

          // Obtener el mensaje
          const message = response.data.message;

          // Verificar si el mensaje necesita ser traducido
          // 1. Si comienza con "common." es una clave de traducción
          // 2. Si contiene "." pero no espacios, probablemente es una clave de traducción
          // 3. Si coincide con alguno de los códigos de éxito conocidos, usar la traducción correspondiente
          let finalMessage = message;
          let isTranslationKey = false;

          // Comprobar si es una clave de traducción directa
          if (message.startsWith('common.') || (message.includes('.') && !message.includes(' '))) {
            isTranslationKey = true;
          }
          // Mapear códigos de éxito conocidos a claves de traducción
          else if (message === 'RECOVERY_CODE_SENT') {
            finalMessage = 'common.AUTH.MESSAGES.RECOVERY_CODE_SENT';
            isTranslationKey = true;
          } else if (message === 'PASSWORD_CHANGED') {
            finalMessage = 'common.AUTH.MESSAGES.PASSWORD_CHANGED';
            isTranslationKey = true;
          } else {
            // Para mensajes genéricos, mantener el mensaje original
            isTranslationKey = false;
          }

          this.notificationStore.showSuccessNotification(finalMessage, 5000, isTranslationKey);
        }

        return response;
      },
      (error) => {
        this.handleResponseError(error);
        return Promise.reject(error);
      }
    );
  }

  // Retrieve authentication token from local storage
  private getAuthToken(): string | null {
    const token = useAuthStore.getState().token;
    return token ? token : null;
  }

  /**
   * Procesa el mensaje de error de la respuesta de la API
   * @param messageData El mensaje de error que puede ser un string o un array de strings
   * @returns Un objeto con el mensaje final y si es una clave de traducción
   */
  private processErrorMessage(messageData: string | string[]): { finalMessage: string; isTranslationKey: boolean } {
    // Si el mensaje es un array, tomamos el primer elemento
    const message = Array.isArray(messageData) ? messageData[0] : messageData;

    // Verificar si el mensaje necesita ser traducido
    // 1. Si comienza con "common." es una clave de traducción
    // 2. Si contiene "." pero no espacios, probablemente es una clave de traducción
    // 3. Si coincide con alguno de los códigos de error conocidos, usar la traducción correspondiente
    let finalMessage = message;
    let isTranslationKey = false;

    // Comprobar si es una clave de traducción directa
    if (message.startsWith('common.') || (message.includes('.') && !message.includes(' '))) {
      // Si la clave ya incluye el prefijo "common.", la usamos tal cual
      // Si no, añadimos el prefijo "common."
      finalMessage = message.startsWith('common.') ? message : `common.${message}`;
      isTranslationKey = true;
    }
    // Mapear códigos de error conocidos a claves de traducción
    else if (message === 'USER_NOT_FOUND') {
      finalMessage = 'common.AUTH.ERRORS.USER.NOT_FOUND';
      isTranslationKey = true;
    } else if (message === 'INVALID_CREDENTIALS') {
      finalMessage = 'common.AUTH.MESSAGES.INVALID_CREDENTIALS';
      isTranslationKey = true;
    } else if (message === 'INVALID_CODE') {
      finalMessage = 'common.AUTH.MESSAGES.INVALID_CODE';
      isTranslationKey = true;
    } else if (message === 'CODE_EXPIRED') {
      finalMessage = 'common.AUTH.MESSAGES.CODE_EXPIRED';
      isTranslationKey = true;
    } else if (message === 'USER_ALREADY_EXISTS') {
      finalMessage = 'common.AUTH.MESSAGES.USER_ALREADY_EXISTS';
      isTranslationKey = true;
    } else if (message === 'PASSWORD_NOT_STRONG') {
      finalMessage = 'common.AUTH.ERRORS.PASSWORD_NOT_STRONG';
      isTranslationKey = true;
    } else if (message.includes('NETWORK_ERROR') || message.includes('ECONNREFUSED')) {
      finalMessage = 'common.ERRORS.NETWORK_ERROR';
      isTranslationKey = true;
    } else {
      // Para errores genéricos no identificados
      finalMessage = 'common.ERRORS.UNEXPECTED_ERROR';
      isTranslationKey = true;
    }

    return { finalMessage, isTranslationKey };
  }

  // Handle response errors
  private handleResponseError(error: AxiosError<IResponseErrorApi>) {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('[HTTP Response Error]', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });

      // Mostrar mensaje de error si existe
      if (error.response.data && typeof error.response.data === 'object') {
        // Actualizar el store para mostrar la notificación
        this.notificationStore = useNotificationStore.getState();

        // Verificar el formato del mensaje de error
        if ('message' in error.response.data) {
          const messageData = error.response.data.message;
          const { finalMessage, isTranslationKey } = this.processErrorMessage(messageData as string | string[]);

          this.notificationStore.showErrorNotification(finalMessage, 8000, isTranslationKey);
        }
      }
      console.log(error.response);

      // Handle specific error scenarios
      switch (error.response.status) {
        case 401:
          // Unauthorized - Clear token and redirect to login
          this.handleUnauthorized();
          break;
        case 403:
          // Forbidden - Handle access denied
          console.warn('Access forbidden');
          break;
        case 404:
          // Not Found
          console.warn('Resource not found');
          break;
        case 500:
          // Server Error
          console.error('Internal server error');
          break;
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('[HTTP No Response]', error.request);

      // Mostrar mensaje de error genérico
      this.notificationStore = useNotificationStore.getState();
      this.notificationStore.showErrorNotification('common.ERRORS.NETWORK_ERROR', 5000, true);
    } else {
      // Something happened in setting up the request
      console.error('[HTTP Request Setup Error]', error.message);

      // Mostrar mensaje de error genérico
      this.notificationStore = useNotificationStore.getState();
      this.notificationStore.showErrorNotification('common.ERRORS.UNEXPECTED_ERROR', 5000, true);
    }
  }

  // Handle unauthorized access
  private handleUnauthorized() {
    console.log('Unauthorized access detected');
    // useAuthStore.getState().logout();
  }

  /**
   * Ensures the URL is properly formatted with the base URL if it's a relative path
   * @param url The URL or path to format
   * @returns Properly formatted URL
   */
  private formatUrl(url: string): string {
    // If URL already starts with http:// or https://, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // Ensure path starts with a slash
    const path = url.startsWith('/') ? url : `/${url}`;

    return path;
  }

  // Generic GET request
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const formattedUrl = this.formatUrl(url);
      const response: AxiosResponse<T> = await this.instance.get(formattedUrl, config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Generic POST request
  async post<T, R>(url: string, data: T, config?: AxiosRequestConfig): Promise<ApiResponse<R>> {
    try {
      const formattedUrl = this.formatUrl(url);
      const response: AxiosResponse<R> = await this.instance.post(formattedUrl, data, config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Generic PUT request
  async put<T, R>(url: string, data: T, config?: AxiosRequestConfig): Promise<ApiResponse<R>> {
    try {
      const formattedUrl = this.formatUrl(url);
      const response: AxiosResponse<R> = await this.instance.put(formattedUrl, data, config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Generic PATCH request
  async patch<T, R>(url: string, data: T, config?: AxiosRequestConfig): Promise<ApiResponse<R>> {
    try {
      const formattedUrl = this.formatUrl(url);
      const response: AxiosResponse<R> = await this.instance.patch(formattedUrl, data, config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Generic DELETE request
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const formattedUrl = this.formatUrl(url);
      const response: AxiosResponse<T> = await this.instance.delete(formattedUrl, config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Error handling for all requests
  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      throw {
        data: error.response?.data,
        status: error.response?.status || 0,
        message: error.response?.data?.message || 'An error occurred',
      };
    } else if (error instanceof Error) {
      throw {
        data: null,
        status: 0,
        message: error.message || 'Request setup error',
      };
    } else {
      throw {
        data: null,
        status: 0,
        message: 'An unexpected error occurred',
      };
    }
  }

  /**
   * Get the current base URL
   * @returns The base URL being used for requests
   */
  getBaseURL(): string {
    return this.baseURL;
  }

  /**
   * Set a new base URL for all future requests
   * @param newBaseURL The new base URL to use
   */
  setBaseURL(newBaseURL: string): void {
    this.baseURL = newBaseURL;
    this.instance.defaults.baseURL = newBaseURL;
  }
}

// Create a singleton instance
export const httpClient = new HttpClient();
export default httpClient;
