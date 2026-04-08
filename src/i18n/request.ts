import {getRequestConfig} from 'next-intl/server';

const SUPPORTED_LOCALES = ['en', 'tr', 'de', 'ar'];
 
export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
 
  if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
    locale = 'en';
  }
 
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
