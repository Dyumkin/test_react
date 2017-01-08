import Immutable from 'immutable';
import * as types from './../actions/tasks/types';

const initialState = Immutable.fromJS({
  task: null,
  list: [],
  total: 0,
  isLoading: false
});

const reducers = {

  [types.SET_IS_LOADING]: (state, action) =>
    state.set('isLoading', action.isLoading),

  [types.SET_TASKS_LIST]: (state, action) =>
    state
      .set('list', action.tasks)
      .set('total', Number(action.total))
      .set('isLoading', false),

  [types.PUSH_TASKS_LIST]: (state, action) =>
    state
      .set('list', state.get('list').concat(action.tasks))
      .set('total', Number(action.total))
      .set('isLoading', false),

  [types.RESET_TASKS_LIST]: (state) =>
    state.set('list', []),

  [types.SET_CURRENT_TASK]: (state, action) =>
      state.set('task', action.task).set('isLoading', false),
};

export default (state = initialState, action) => {
  const reducer = reducers[action.type];

  return reducer ? reducer(state, action) : state;
};
