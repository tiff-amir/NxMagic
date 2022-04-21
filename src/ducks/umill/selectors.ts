import StateType from '@ducks/StateType';

export const checkIncreasing = (state: StateType): boolean => state.umill.isIncreasing;
export const getIncreaseError = (state: StateType): string => state.umill.increaseError;

export const checkDecreasing = (state: StateType): boolean => state.umill.isDecreasing;
export const getDecreaseError = (state: StateType): string => state.umill.decreaseError;
