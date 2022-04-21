const LIMIT = 10000;
const LOGS = [];

export const log = (...args) => {
  LOGS.push([Date.now(), ...args]);
  while (LOGS.length >= LIMIT) LOGS.shift();
};
