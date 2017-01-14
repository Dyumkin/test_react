import config from './../config';
import { serializer } from './common-helper';

class ApiFetch {

  constructor() {
    this.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  }

  /**
   * Set Api AccessToken to headers
   * @return this
   */
  auth() {
    const token = localStorage.getItem(config.sessionAccessTokenKey) ||
      sessionStorage.getItem(config.sessionAccessTokenKey);

    if (token) {
      this.headers = {
        ...this.headers,
        [config.apiAccessTokenKey]: token
      }
    } else {
      console.warn('You are trying to set an access token to headers, but it doesn\'t exist.');
    }

    return this;
  }

  /**
   *
   * @param  {string} endpoint
   * @param  {{}} body = {}
   * @param  {{}} headers = {}
   * @return Promise
   */
  post(endpoint, body = {}, headers = {}) {
    const url = config.apiUrl + '/' + endpoint;

    if (body.constructor && body.constructor.name === FormData.name) {
      delete this.headers['Content-Type'];
    }

    return this._getResponse(fetch(url, {
      method: 'POST',
      headers: {
        ...this.headers,
        ...headers
      },
      body: (body.constructor && body.constructor.name === FormData.name) ? body : JSON.stringify(body)
    }));
  }

  /**
   *
   * @param  {string} endpoint
   * @param  {{}} body = {}
   * @param  {{}} headers = {}
   * @return Promise
   */
  put(endpoint, body = {}, headers = {}) {
    const url = config.apiUrl + '/' + endpoint;

    return this._getResponse(fetch(url, {
      method: 'PUT',
      headers: {
        ...this.headers,
        ...headers
      },
      body: JSON.stringify(body)
    }));
  }

  /**
   *
   * @param  {string} endpoint
   * @param  {{}} query = {}
   * @param  {{}} headers = {}
   * @return Promise
   */
  delete(endpoint, query = {}, headers = {}) {
    let url = config.apiUrl + '/' + endpoint;

    if (Object.keys(query).length > 0) {
      url = url + '?' + serializer(query);
    }

    return this._getResponse(fetch(url, {
      method: 'DELETE',
      headers: {
        ...this.headers,
        ...headers
      }
    }));
  }

  /**
   *
   * @param  {string} endpoint
   * @param  {{}} query = {}
   * @param  {{}} headers = {}
   * @return Promise
   */
  get(endpoint, query = {}, headers = {}) {
    let url = config.apiUrl + '/' + endpoint;

    if (Object.keys(query).length > 0) {
      url = url + '?' + serializer(query);
    }

    return this._getResponse(fetch(url, {
      method: 'GET',
      headers: {
        ...this.headers,
        ...headers
      }
    }));
  }

  _getResponse(fetch) {
    return fetch
      .then(response => {
        return response.json().then(json => {
          json.status = response.status;
          return response.ok ? json : Promise.reject(json);
        });
      });
  }
}

export default ApiFetch;
