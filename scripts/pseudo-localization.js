/* eslint-disable
global-require, import/no-dynamic-require, no-use-before-define, @typescript-eslint/no-var-requires
*/
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const { localize: pseudoLocalize } = require('pseudo-localization');
const { readFile, writeFile, folderFiles } = require('./utils/fs');

const PATH_LIST = [
  {
    name: 'en',
    pseudoName: 'pse',
    template: path.join(__dirname, '../src/locales/{{name}}'),
  },
];

const localize = (val, info, parentPath) => {
  if (typeof val !== 'string' || (info.skip || []).includes(parentPath)) return val;

  const splitter = /(\{\{.*?\}\}|<.*?>|%-?[a-zA-Z])/;
  return `[${val.split(splitter).map((s) => (splitter.test(s) ? s : pseudoLocalize(s))).join('')}]`;
};

const isObject = (val) => !['string', 'number', 'boolean'].includes(typeof val)
  && !Array.isArray(val) && val !== null;

const localizeData = (data, info, parentPath = '') => {
  if (isObject(data)) {
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = localizeData(data[key], info, parentPath ? `${parentPath}.${key}` : key);
      return acc;
    }, {});
  }
  return Array.isArray(data)
    ? data.map((item) => localizeData(item, info, `${parentPath}[]`))
    : localize(data, info, parentPath);
};

const localizedData = (info) => {
  const readPath = info.template.replace('{{name}}', info.name);
  const writePath = info.template.replace('{{name}}', info.pseudoName);
  return folderFiles(readPath).then((files) => {
    return Promise.all(files.map((file) => readFile(path.join(readPath, file))))
      .then((dataList) => {
        return Promise.resolve(files.map((file, index) => ({ file, data: dataList[index] })));
      });
  }).then((list) => {
    return Promise.resolve(list.map((item) => ({
      ...item, data: localizeData(JSON.parse(item.data), info),
    })));
  }).then((list) => {
    return Promise.all(list.map(({ file, data }) => {
      return writeFile(path.join(writePath, file), JSON.stringify(data, null, 2));
    }));
  });
};

Promise.all(PATH_LIST.map(localizedData));
