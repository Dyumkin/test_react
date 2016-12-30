import * as types from './../actions/user/types';
import config from './../config';
import Immutable, { List, Map } from 'immutable';

const initialState = Immutable.fromJS({
  id: null,
  is_new: false,
  token: localStorage.getItem(config.sessionAccessTokenKey) || sessionStorage.getItem(config.sessionAccessTokenKey),
  errors: {},
  isLoading: true,
  isAuthenticating: false,
});

const reducers = {

  [types.SET_USER_IS_LOADING]: (state, action) =>
    state.set('isLoading', action.isLoading),

  [types.SET_USER_IS_AUTHENTICATING]: (state, action) =>
    state.set('isAuthenticating', action.isAuthenticating),

  [types.SET_USER_DATA]: (state, action) =>
    Immutable.fromJS({ ...initialState.toJS(), ...action.user }),

  [types.SET_USER_ERRORS]: (state, action) =>
    state.set('errors', action.errors),

  [types.RESET_USER_DATA]: () =>
    initialState.set('isLoading', false)
};

/**
 *
 * @param state
 * @param action
 * @returns object
 */
export default (state = initialState, action) => {
  let reducer = reducers[action.type];

  return reducer ? reducer(state, action) : state;
}
