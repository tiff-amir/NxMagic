import { AddressType } from 'src/types/contract';

export const same = (first: AddressType, second: AddressType): boolean => {
  return first.toLowerCase() === second.toLowerCase();
};
