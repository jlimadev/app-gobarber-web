import React from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';
import { AvailableLocales, IntlMessages } from './messages';

const DEFAULT_BROWSER_LANGUAGE = navigator.language as AvailableLocales;

export interface IntlProviderProps {
  locale?: AvailableLocales;
}

export const IntlProvider: React.FC<IntlProviderProps> = props => {
  const language = props.locale ?? DEFAULT_BROWSER_LANGUAGE;

  const message = IntlMessages[language] || IntlMessages.en;
  return (
    <ReactIntlProvider messages={message} locale={language} defaultLocale="en">
      {props.children}
    </ReactIntlProvider>
  );
};
