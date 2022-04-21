import { AddressType, Ether } from 'src/types/contract';
import { CONTRACT_NOT_FOUND_ERROR, NO_PROVIDER_ERROR, TIMEOUT_ERROR } from '@constants/errors';

export const getAddressError = (address: AddressType, allowEmpty = false): string => {
  if (!address && !allowEmpty) return '_errors.addressEmpty';
  return /^0x[a-f0-9]{40}$/i.test(address) ? '' : '_errors.address';
};

export const getAmountError = (amount: Ether, allowZero = false): string => {
  if (!amount && !allowZero) return '_errors.amountZero';
  return amount > 0 ? '' : '_errors.amountNegative';
};

export const getErrorKey = (err) => {
  if (err === TIMEOUT_ERROR) return '_errors.timeout';
  if (err === NO_PROVIDER_ERROR) return '_errors.noProvider';
  if (err === CONTRACT_NOT_FOUND_ERROR) return '_errors.noContract';
  return '_errors.unknown';
};

export const getProcessedError = (err) => {
  if (err.includes('missing provider')) return NO_PROVIDER_ERROR;
  return err;
};
