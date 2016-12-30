import { takeEvery } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import ApiFetch from './../utils/api-fetch';
import { browserHistory } from 'react-router';
import * as types from './../actions/user/types';
import * as actions from './../actions/user';
import EventEmitter, { NOTIFICATOR_ITEM_ADD } from './../utils/event-emitter';

function* initUser(action) {
  const { userProps } = action;

  if (!userProps.id && userProps.token) {
    try {
      const { data } = yield new ApiFetch().auth().get('security/user');

      yield put(actions.setUser(data));
    } catch (exception) {
      yield put(actions.setErrors(exception.error));
    }
  }

  yield put(actions.setLoading(false));
}

function* loginUser(action) {
  const { provider, userProps } = action;
  yield put(actions.setAuthenticating(true));

  try {
    const { data } = yield new ApiFetch().post('security/signin', userProps);
    const { token } = data.token;

    yield put(actions.setLoading(true));
    yield put(actions.setAccessToken(token, userProps.rememberMe));
    yield put(actions.setUser(data));
    yield put(actions.setLoading(false));
  } catch (exception) {
    yield put(actions.setErrors(exception.error));
    browserHistory.push('/sign-in');
  }

  yield put(actions.setAuthenticating(false));
}

function* logoutUser() {
  yield put(actions.setLoading(true));
  yield put(actions.resetUser());
  yield put(actions.setLoading(false));
}

function* createUser(action) {
  const { user } = action;

  yield put(actions.setAuthenticating(true));

  try {
    const { data } = yield new ApiFetch().post('security/signup', user);

    yield put(actions.setLoading(true));
    yield put(actions.setAccessToken(data.token));
    yield put(actions.setUser(data));
    yield put(actions.setLoading(false));
  } catch (exception) {
    yield put(actions.setErrors(exception.error));
    browserHistory.push('/sign-up');
  }

  yield put(actions.setAuthenticating(false));
}

function* updateUser(action) {
  const { user } = action;

  try {
    const { data } = yield new ApiFetch().auth().put('users', user);

    data.is_new = false;
    yield put(actions.setLoading(true));
    yield put(actions.setUser(data));
    yield put(actions.setLoading(false));
    EventEmitter.emit(NOTIFICATOR_ITEM_ADD, {
      item: {type: 'success', title: 'Account was successfully updated.'}, scrollToTop: true
    });
  } catch (exception) {
    if (exception.status !== 400) {
      EventEmitter.emit(NOTIFICATOR_ITEM_ADD, {
        item: {type: 'danger', title: 'Account was not updated.'}, scrollToTop: true
      });
    } else {
      yield put(actions.setErrors(exception.error));
    }
  }
}

export default function* userSaga() {
  yield [
    takeEvery(types.INIT_USER_REQUESTED, initUser),
    takeEvery(types.LOGIN_USER_REQUESTED, loginUser),
    takeEvery(types.LOGOUT_USER_REQUESTED, logoutUser),
    takeEvery(types.UPDATE_USER_REQUESTED, updateUser),
    takeEvery(types.REGISTER_USER_REQUESTED, createUser)
  ];
}
