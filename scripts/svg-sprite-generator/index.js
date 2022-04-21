const pathTool = require('path');
const svgo = require('svgo');
const md5 = require('salted-md5');
const { DOMParser } = require('xmldom');

const svgoConfig = {
  pretty: true,
};

const getStringCode = (str) => str
  .replace(/^0-1a-z/ig, '')
  .split('')
  .reduce((acc, character) => acc + character.charCodeAt(0), 0);

const sortStrings = (first, second) => getStringCode(first) - getStringCode(second);

const {
  SVG_PATTERN,
  MASK_PATTERN,
  ICON_PATH_LIST,
  GENERAL_TEMPLATE,
  ORIGINAL_FOLDER,
  DEFS_PATTERN,
  SYMBOL_TEMPLATE,
} = require('./constants');
const { folderFiles, writeFile, getStats, readFile, checkFolder } = require('../utils/fs');

const baseContentPostProcessor = (content) => content
  .replace(/^\n*/, '')
  .replace(/\n*$/, '');

const maskContentPostProcessor = async (
  content,
) => Promise.resolve(baseContentPostProcessor(content));

const processSvgNodeList = (item) => {
  if (item.getAttribute && item.getAttribute('opacity')) {
    item.removeAttribute('opacity');
  }

  if (item.getAttribute && item.getAttribute('fill') && !item.getAttribute('stroke')) {
    item.setAttribute('stroke', 'none');
    item.removeAttribute('fill');
  } else if (item.getAttribute && item.getAttribute('stroke') && !item.getAttribute('fill')) {
    item.setAttribute('fill', 'none');
    item.removeAttribute('stroke');
  } else if (item.getAttribute && item.getAttribute('stroke') && item.getAttribute('fill')) {
    item.removeAttribute('stroke');
    item.removeAttribute('fill');
  }

  Array.prototype.forEach.apply(item.childNodes, [processSvgNodeList]);
};

const replaceLocalIdList = (str) => {
  const hash = md5(str);
  const idList = (str.match(/id="([^"]+)"/g) || [])
    .map((idData) => idData.replace(/^id="/, '').replace(/"$/, ''));
  return idList.reduce((acc, id) => {
    const newId = `${id}_${hash}`;
    const patternUse = new RegExp(`id="${id}"`, 'g');
    const patternDefine = new RegExp(`clip-path="url\\(#${id}\\)"`, 'g');
    return acc
      .replace(patternUse, `id="${newId}"`)
      .replace(patternDefine, `clip-path="url(#${newId})"`);
  }, str);
};

const svgContentPostProcessor = async (
  content, path,
) => {
  const name = path.replace('/index.svg', '').replace(/[^\\/]*(\\|\/)/g, '').replace('.svg', '');
  const isOriginal = path.includes(`/${ORIGINAL_FOLDER}/`);
  return new Promise((res) => {
    const { data } = svgo.optimize(baseContentPostProcessor(content), svgoConfig);
    return Promise.resolve(data
      .replace(/^<svg/, '<symbol')
      .replace(/\/svg>$/, '/symbol>')
      .replace(/\s*class="glyphFill"\s*/g, ' '))
      .then((result) => Promise.resolve(replaceLocalIdList(result))).then((result) => {
        const defsList = result.match(DEFS_PATTERN);
        const doc = new DOMParser().parseFromString(result.replace(DEFS_PATTERN, ''));
        const rootElement = doc.getElementsByTagName('symbol')[0];
        rootElement.removeAttribute('id');
        rootElement.setAttribute('id', name);
        if (isOriginal) {
          if (!rootElement.getAttribute('fill')) rootElement.setAttribute('fill', 'none');
          if (!rootElement.getAttribute('stroke')) rootElement.setAttribute('stroke', 'none');
        } else {
          processSvgNodeList(doc);
          rootElement.removeAttribute('fill');
          rootElement.removeAttribute('stroke');
        }
        const processedResult = [
          defsList ? SYMBOL_TEMPLATE.replace('{{content}}', defsList.join('')) : '',
          doc.toString(),
        ].join('\n');
        return Promise.resolve(processedResult);
      })
      .then((res))
      .catch((err) => {
        console.error('Error on parse svg file', path, err);
        res('');
      });
  });
};

const getFileContent = async (path) => {
  const isSvg = SVG_PATTERN.test(path);
  if (!isSvg && !MASK_PATTERN.test(path)) return Promise.resolve({});
  const content = await readFile(path);
  if (!content) console.warn('Empty file', path);
  const processedContent = await (isSvg ? svgContentPostProcessor(content, path)
    : maskContentPostProcessor(content, path));
  return { [path]: processedContent };
};

const getFolderFilesContent = async (path) => {
  const files = await folderFiles(path);
  return Promise.all(files.sort(sortStrings)
    .sort((first, second) => Number(second.includes('.mask.svg')) - Number(first.includes('.mask.svg')))
    .map((file) => (!SVG_PATTERN.test(file)
      ? getFolderFilesContent(pathTool.join(path, file))
      : getFileContent(pathTool.join(path, file)))))
    .then((data) => data.reduce((acc, itemData) => ({ ...acc, ...itemData }), {}));
};

const getFileData = async (path) => {
  const stats = await getStats(path);
  if (!stats) {
    console.error('Error on get info of the', path);
    return Promise.resolve('');
  }
  const content = await (stats.isDirectory() ? getFolderFilesContent(path) : getFileContent(path));
  const rootPath = path.replace(/(\\|\/)[^\\/]*$/g, '');
  return Object.keys(content).reduce((acc, itemPath) => {
    const relativePath = itemPath.replace(rootPath, '').replace(/^(\\|\/)/, '');
    acc.push(content[itemPath] ? `<!--${relativePath}-->\n${content[itemPath]}` : `<!--${relativePath} {EMPTY}-->`);
    return acc;
  }, []).join('\n');
};

const getFiles = async ({ entry, output }) => {
  const isFolder = await checkFolder(entry);
  if (!isFolder) return '';
  const files = await folderFiles(entry);
  const content = await Promise.all(files.sort(sortStrings)
    .filter((file) => pathTool.join(entry, file) !== output)
    .map((name) => getFileData(pathTool.join(entry, name))));
  return `${GENERAL_TEMPLATE.replace('{{content}}', content.join('\n'))}\n`.replace(/\n+/g, '\n');
};

Promise.all(ICON_PATH_LIST.map(({ output }) => output).reduce((acc, output) => {
  return acc.includes(output) ? acc : [...acc, output];
}, []).map((output) => {
  return writeFile(output, '');
})).then(() => Promise.all(ICON_PATH_LIST.map((params) => {
  return getFiles(params);
}))).then((result) => {
  const data = result.reduce((acc, itemData, index) => {
    const { output } = ICON_PATH_LIST[index];
    if (!acc[output]) acc[output] = '';
    acc[output] = `${acc[output]}${itemData}`;
    return acc;
  }, {});
  return Object.keys(data).map((output) => {
    return writeFile(output, data[output]);
  });
});
