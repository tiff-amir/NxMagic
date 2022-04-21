import StateType from '@ducks/StateType';

export const checkFeeFetching = (state: StateType): boolean => {
  return state.config.fee.isFetching;
};

export const getFee = (state: StateType): number => {
  return state.config.fee.value;
};

export const getFeeError = (state: StateType): string => {
  return state.config.fee.error;
};
