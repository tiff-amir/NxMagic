/*
* Copyright (c) 2020 Western Digital Corporation or its affiliates.
*
* This code is CONFIDENTIAL and a TRADE SECRET of Western Digital
* Corporation or its affiliates ("WD").  This code is protected
* under copyright laws as an unpublished work of WD.  Notice is
* for informational purposes only and does not imply publication.
*
* The receipt or possession of this code does not convey any rights to
* reproduce or disclose its contents, or to manufacture, use, or sell
* anything that it may describe, in whole or in part, without the
* specific written consent of WD.  Any reproduction or distribution
* of this code without the express written consent of WD is strictly
* prohibited, is a violation of the copyright laws, and may subject you
* to criminal prosecution.
*/
module.exports = {
  ORIGINAL_FOLDER: 'colored',
  DEFS_PATTERN: /<defs((?!\/defs>).)*\/defs>/g,
  SVG_PATTERN: /^((?!\.mask).)*\.svg$/,
  MASK_PATTERN: /\.mask\.svg$/,
  ICON_PATH_LIST: [
    { entry: 'src/assets/icons', output: 'src/assets/icons/index.svg' },
    { entry: 'src/assets/icons/colored', output: 'src/assets/icons/index.svg' },
  ],
  SYMBOL_TEMPLATE: '<symbol xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n{{content}}\n</symbol>',
  GENERAL_TEMPLATE: '{{content}}\n',
};
