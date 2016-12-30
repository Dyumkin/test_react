import * as types from './types';
import config from './../../config';

/**
 *
 * @param status
 * @returns {{type, isLoading: boolean}}
 */
export const setLoading = (status = true) => ({
  type: types.SET_USER_IS_LOADING,
  isLoading: status
});

/**
 *
 * @param status
 * @returns {{type, isAuthenticating: boolean}}
 */
export const setAuthenticating = (status = true) => ({
  type: types.SET_USER_IS_AUTHENTICATING,
  isAuthenticating: status
});

/**
 *
 * @param user
 * @returns {{type, user: *}}
 */
export const setUser = user => ({
  type: types.SET_USER_DATA,
  user
});

/**
 *
 * @param {string} accessToken
 */
export const setAccessToken = (accessToken, rememberMe = false) => {
  if (rememberMe) {
    localStorage.setItem(config.sessionAccessTokenKey, accessToken);
    sessionStorage.removeItem(config.sessionAccessTokenKey);
  } else {
    sessionStorage.setItem(config.sessionAccessTokenKey, accessToken);
    localStorage.removeItem(config.sessionAccessTokenKey);
  }

  return {
    type: types.SET_ACCESS_TOKEN
  };
};

export const setErrors = (errors = {}) => ({
  type: types.SET_USER_ERRORS,
  errors
});

export const resetUser = () => {
  localStorage.hasOwnProperty(config.sessionAccessTokenKey) &&
    localStorage.removeItem(config.sessionAccessTokenKey);

  sessionStorage.hasOwnProperty(config.sessionAccessTokenKey) &&
    sessionStorage.removeItem(config.sessionAccessTokenKey);

  return {
    type: types.RESET_USER_DATA
  };
};

//actions for saga

export const initUser = userProps => ({
  type: types.INIT_USER_REQUESTED,
  userProps
});

/**
 *
 * @returns {{type}}
 */
export const loginUser = (provider, userProps) => ({
  type: types.LOGIN_USER_REQUESTED,
  userProps
});

export const logoutUser = () => ({
  type: types.LOGOUT_USER_REQUESTED
});

export const updateUser = user => ({
  type: types.UPDATE_USER_REQUESTED,
  user
});

export const registerUser = user => ({
  type: types.REGISTER_USER_REQUESTED,
  user
});
