import { createActions, handleActions } from 'redux-actions';

export const UPDATE_FEE = 'config@UPDATE_FEE';
export const UPDATE_FEE_SUCCESS = 'config@UPDATE_FEE_SUCCESS';
export const UPDATE_FEE_ERROR = 'config@UPDATE_FEE_ERROR';

export const {
  configUpdateFee,
  configUpdateFeeSuccess,
  configUpdateFeeError,
} = createActions(
  UPDATE_FEE,
  UPDATE_FEE_SUCCESS,
  UPDATE_FEE_ERROR,
);

export type StateType = {
  fee: {
    value: number
    isFetching: boolean
    error: string
  }
};

export const defaultState: StateType = {
  fee: {
    value: 0,
    isFetching: false,
    error: '',
  },
};

export default handleActions({
  [UPDATE_FEE]: (state: StateType) => ({
    ...state,
    fee: {
      value: 0,
      isFetching: true,
      error: '',
    },
  }),
  [UPDATE_FEE_SUCCESS]: (state: StateType, { payload }: { payload: number }) => ({
    ...state,
    fee: {
      ...state.fee,
      value: payload,
      isFetching: false,
    },
  }),
  [UPDATE_FEE_ERROR]: (state: StateType, { payload }: { payload: string }) => ({
    ...state,
    fee: {
      ...state.fee,
      error: payload,
      isFetching: false,
    },
  }),
}, defaultState);
