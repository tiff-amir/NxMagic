import i18n from 'i18n-js';
import appConfig from 'appConfig.json';

import info from 'src/locales/info.json';
import defaultLocale from 'src/locales/en/index.json';
import { TYPE_ERROR } from '@constants/errors';

if (info.default === 'en') {
  i18n.locale = info.default;
  i18n.default = info.default;
  i18n.translations = { [info.default]: defaultLocale };
}

const loadLocale = async (name: string) => {
  const data = await fetch(appConfig.webApp.localePathPattern.replace('{{name}}', name));
  if (!data.ok) throw new Error(TYPE_ERROR);
  return data.json();
};

export const init = (() => {
  let prom;
  return () => {
    if (prom) return prom;
    prom = new Promise((resolve, reject) => {
      return loadLocale(info.default).then((locale) => {
        i18n.locale = info.default;
        i18n.default = info.default;
        i18n.translations = { [info.default]: locale };
        resolve(i18n);
      }).catch(reject).finally(() => {
        prom = undefined;
      });
    });
    return prom;
  };
})();

export const checkInited = () => i18n.locale && i18n.translations[i18n.locale];

export const t = (path, options?: { [key: string]: any }) => i18n.t(path, options);
