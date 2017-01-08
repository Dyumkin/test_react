import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import ApiFetch from './../utils/api-fetch';
import * as types from './../actions/tasks/types';
import * as actions from './../actions/tasks';
import EventEmitter, { NOTIFICATOR_ITEM_ADD } from './../utils/event-emitter';
import { browserHistory } from 'react-router';

function* addTask(action) {
  const { task } = action;

  yield put(actions.setLoading());
  try {
    yield new ApiFetch().auth().post('tasks', task);
    browserHistory.push('/dashboard/all'); //todo fix
    EventEmitter.emit(NOTIFICATOR_ITEM_ADD, {
      item: { type: 'success', title: 'Task was successfully added.' }
    });
  } catch (exception) {
    console.warn(exception);
    yield put(actions.setLoading(false));
  }
}

function* updateTask(action) {
  const { task } = action;

  yield put(actions.setLoading());
  try {
    yield new ApiFetch().auth().put('tasks/' + task.id, task);
    EventEmitter.emit(NOTIFICATOR_ITEM_ADD, {
      item: { type: 'success', title: 'Task was successfully updated.' }
    });
  } catch (exception) {
    console.warn(exception);
  }
}

function* removeTask(action) {
  const { taskId } = action;

  yield put(actions.setLoading());
  try {
    yield new ApiFetch().auth().delete('tasks/' + taskId);

    yield put(actions.getTasks('all')); //todo fix

    EventEmitter.emit(NOTIFICATOR_ITEM_ADD, {
      item: { type: 'warning', title: 'Project was successfully deleted.' }
    });
  } catch (exception) {
    console.warn(exception);
  }
}

function* getTask(action) {
  const { taskId } = action;

  yield put(actions.setLoading());
  try {
    const { data } = yield new ApiFetch().auth().get('tasks/' + taskId);
    yield put(actions.setTask(data));
  } catch (exception) {
    console.warn(exception);
    yield put(actions.setLoading(false));
  }
}

function* getTasks(action) {
  const { status, offset, limit } = action;

  yield put(actions.setLoading());
  try {
    const { data } = yield new ApiFetch().auth().get(`tasks/${status}/${limit}/${offset}`);
    if (offset === 0) {
      yield put(actions.setTasks(data.items, data.total));
    } else {
      yield put(actions.pushTasks(data.items, data.total));
    }
  } catch (exception) {
    console.warn(exception);
    yield put(actions.setLoading(false));
  }
}

export default function* tasksSaga() {
  yield [
    takeEvery(types.ADD_TASK_REQUESTED, addTask),
    takeEvery(types.UPDATE_TASK_REQUESTED, updateTask),
    takeEvery(types.REMOVE_TASK_REQUESTED, removeTask),
    takeEvery(types.GET_TASK_REQUESTED, getTask),
    takeEvery(types.GET_TASK_LIST_REQUESTED, getTasks)
  ];
}
