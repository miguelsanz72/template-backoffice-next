import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export default getRequestConfig(async () => {
  const headersList = await headers();
  const locale = headersList.get('X-NEXT-INTL-LOCALE') ?? 'es';
  const messages = (await import(`./locale/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});

export const dynamic = 'force-dynamic';
