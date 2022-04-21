import { NextRouter } from 'next/router';
import { MISMATCH_ERROR } from '@constants/errors';
import identity from 'lodash.identity';

export const checkMatch = (router: NextRouter, path: string | string[]): boolean => {
  const pathList = typeof path === 'string' ? [path] : path;
  return pathList.some((checkPath) => {
    return router.pathname.toLowerCase() === checkPath.toLowerCase();
  });
};

export const getParams = (pathname: string, path: string): { [key: string]: string } => {
  const pathnameParts = pathname.split('/');
  const pathParts = path.replace(/\?.*/, '').split('/');
  if (pathnameParts.length !== pathParts.length) throw new Error(MISMATCH_ERROR);
  return pathnameParts.reduce((acc, item, index) => {
    if (/\[[a-z_]+[a-z0-9_]*]/.test(item)) {
      acc[item.replace('[', '').replace(']', '')] = pathParts[index];
    }
    return acc;
  }, {} as { [key: string]: string });
};

export const buildPath = (
  pathname: string, params: { [key: string]: string | string[] }, search = '',
): string => {
  const pathnameParts = pathname.replace(/\?.*/, '').split('/').filter(identity);
  const path = pathnameParts.reduce((acc, name) => {
    const val = params[name.replace('[', '').replace(']', '')];
    if (!val) return `${acc}${name}/`;
    return typeof val === 'string' ? `${acc}${val}/` : `${acc}${val.join(',')}/`;
  }, '/');
  return `${path}${search}`;
};
