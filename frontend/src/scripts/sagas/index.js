import { fork } from 'redux-saga/effects';
import userSaga from './user';

export default function* root() {

  yield [
    fork(userSaga),
  ];
}
