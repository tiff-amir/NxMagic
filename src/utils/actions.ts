import { TIMEOUT_ERROR } from '@constants/errors';

export const timeout = (delay = 0) => new Promise((_, reject) => {
  setTimeout(() => reject(new Error(TIMEOUT_ERROR)), delay);
});
