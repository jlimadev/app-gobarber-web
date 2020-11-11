import en from './lang/en.json';
import ptBR from './lang/pt-BR.json';

export type AvailableLocales = 'en' | 'en-US' | 'pt-BR';

export const IntlMessages: Record<AvailableLocales, Record<string, string>> = {
  en,
  'en-US': en,
  'pt-BR': ptBR,
};
