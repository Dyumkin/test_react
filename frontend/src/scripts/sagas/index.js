import { fork } from 'redux-saga/effects';
import userSaga from './user';
import tasksSaga from './tasks';

export default function* root() {

  yield [
    fork(userSaga),
    fork(tasksSaga),
  ];
}
