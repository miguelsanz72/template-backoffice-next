'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

// False during SSR and hydration, true afterwards; avoids the setState-in-effect "mounted" pattern.
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
