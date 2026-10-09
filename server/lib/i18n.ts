import countries from 'i18n-iso-countries';
import countriesEN from 'i18n-iso-countries/langs/en.json' with { type: 'json' };

countries.registerLocale(countriesEN);

export const getCountryName = (code: string): string => {
  if (!code) {
    return '';
  }
  return countries.getName(code, 'en');
};
