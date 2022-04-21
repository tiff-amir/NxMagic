import { createActions, handleActions } from 'redux-actions';

export const INCREASE = 'umill@INCREASE';
export const INCREASE_FINISHED = 'umill@INCREASE_FINISHED';
export const INCREASE_ERROR = 'umill@INCREASE_ERROR';

export const DECREASE = 'umill@DECREASE';
export const DECREASE_FINISHED = 'umill@DECREASE_FINISHED';
export const DECREASE_ERROR = 'umill@DECREASE_ERROR';

export const {
  umillIncrease,
  umillIncreaseFinished,
  umillIncreaseError,
  umillDecrease,
  umillDecreaseFinished,
  umillDecreaseError,
} = createActions(
  INCREASE,
  INCREASE_FINISHED,
  INCREASE_ERROR,
  DECREASE,
  DECREASE_FINISHED,
  DECREASE_ERROR,
);

export type StateType = {
  isIncreasing: boolean
  increaseError: string
  isDecreasing: boolean
  decreaseError: string
};

export const defaultState: StateType = {
  isIncreasing: false,
  increaseError: '',
  isDecreasing: false,
  decreaseError: '',
};

export default handleActions({
  [INCREASE]: (state: StateType): StateType => {
    return {
      ...state,
      isIncreasing: true,
      increaseError: '',
    };
  },
  [INCREASE_FINISHED]: (state: StateType): StateType => {
    return {
      ...state,
      isIncreasing: false,
    };
  },
  [INCREASE_ERROR]: (state: StateType, { payload }: { payload: string }): StateType => {
    return {
      ...state,
      isIncreasing: false,
      increaseError: payload,
    };
  },
  [DECREASE]: (state: StateType): StateType => {
    return {
      ...state,
      isDecreasing: true,
      decreaseError: '',
    };
  },
  [DECREASE_FINISHED]: (state: StateType): StateType => {
    return {
      ...state,
      isDecreasing: false,
    };
  },
  [DECREASE_ERROR]: (state: StateType, { payload }: { payload: string }): StateType => {
    return {
      ...state,
      isDecreasing: false,
      decreaseError: payload,
    };
  },
}, defaultState);
