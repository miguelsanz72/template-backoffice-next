import { useAuthStore } from '@/app/[locale]/auth/(presentation)/store/auth.store';

export const useAuthState = () => {
  return useAuthStore();
};
