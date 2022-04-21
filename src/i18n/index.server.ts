import i18n from 'i18n-js';

import info from 'src/locales/info.json';
import locale from 'src/locales/en/index.json';

i18n.locale = info.default;
i18n.default = info.default;
i18n.translations = { [info.default]: locale };

export const checkInited = () => true;

export const init = () => Promise.resolve(i18n);

export const t = (path) => i18n.t(path);
