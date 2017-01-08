import * as types from './types';

export const setLoading = (isLoading = true) => ({
  type: types.SET_IS_LOADING,
  isLoading
});

export const addTask = task => ({
  type: types.ADD_TASK_REQUESTED,
  task
});

export const setTask = task => ({
  type: types.SET_CURRENT_TASK,
  task
});

export const removeTask = (taskId) => ({
  type: types.REMOVE_TASK_REQUESTED,
  taskId
});

export const updateTask = (task) => ({
  type: types.UPDATE_TASK_REQUESTED,
  task
});

export const getTask = taskId => ({
  type: types.GET_TASK_REQUESTED,
  taskId
});

export const getTasks = (status, offset = 0, limit = 50) => ({
  type: types.GET_TASK_LIST_REQUESTED,
  status,
  offset,
  limit
});

export const setTasks = (tasks, total) => ({
  type: types.SET_TASKS_LIST,
  tasks,
  total
});

export const pushTasks = (tasks, total) => ({
  type: types.PUSH_TASKS_LIST,
  tasks,
  total
});

export const resetTaskList = () => ({
  type: types.RESET_TASKS_LIST
});