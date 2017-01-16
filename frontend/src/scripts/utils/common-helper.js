import { Status } from '../constants';

/**
 * @param object
 * @returns {string}
 */
export const serializer = (object) => {
  let query = [];

  for(let key in object) {
    if (object.hasOwnProperty(key)) {
      query.push(`${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`);
    }
  }

  return query.join("&");
};

export const getErrorPostion = () => {
  const error = document.getElementsByClassName('has-error')[0];
  if (error) {
    const _clientRect = error.getBoundingClientRect();

    return window.scrollY + _clientRect.top;
  }

  return null;
};

/**
 * @param duration
 */
export const scrollToTop = duration => {
  const errorPosition = getErrorPostion();
  const step = (errorPosition || window.scrollY) * -1 / (duration / 15);

  const interval = setInterval(() => {
    errorPosition && window.scrollY > errorPosition || errorPosition === null && window.scrollY > 0
      ? window.scrollBy(0, step) : clearInterval(interval);
  }, 15);
};

/**
 * @param prevObj
 * @param nextObj
 * @returns {{}}
 */
export const getDiffs = (prevObj, nextObj) => {
  let diffs = {};

  if (JSON.stringify(prevObj) !== JSON.stringify(nextObj)) {
    for (const key in nextObj) {
      let hasDiffs = false;

      if (typeof prevObj[key] === 'object' && typeof nextObj[key] === 'object') {
        hasDiffs = Object.keys(getDiffs(prevObj[key], nextObj[key])).length > 0;
      } else if (nextObj[key] !== prevObj[key]) {
        hasDiffs = true;
      }

      if (hasDiffs) {
        diffs[key] = nextObj[key];
      }
    }
  }

  return diffs;
};

/**
 * Return color by status value
 * @param status
 * @returns {string}
 */
export const getColorByStatus = (status) => {
  let color = 'secondary';

  switch (status) {
    case Status.Active:
      color = 'primary';
      break;
    case Status.Overdue:
      color = 'warning';
      break;
    case Status.Cancel:
      color = 'danger';
      break;
    case Status.Done:
      color = 'success';
      break;
  }

  return color;
};

/**
 * Return object key by value
 * @param {object} obj
 * @param {string} val
 */
export const getKey = (obj,val) => Object.keys(obj).find(key => obj[key] === val);

/**
 * Return Status Label
 * @param {string} status
 */
export const getStatusByValue = (status) => {
  return getKey(Status, status);
};