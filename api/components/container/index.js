'use strict';

/**
 * Container
 */
class Container {

  constructor() {
    this.paths = {
      services: '../../services/',
      repositories: '../../database/repositories/',
      models: '../../database/models/',
      components: '../../components/'
    };
  }

  /**
   * Get the object from the container
   *
   * @param type
   * @param name
   * @returns {*}
   */
  get(type, name) {
    let path = this.paths[type] ? this.paths[type] + name : false;

    if (!path) {
      throw new Error(`object with type "${type}:${name}" could not be loaded from the container`);
    }

    return require(path);
  }

  /**
   * Return service
   *
   * @param serviceName
   * @returns {*}
   */
  service(serviceName) {
    return this.get('services', serviceName);
  }

  /**
   * Return repository
   *
   * @param repositoryName
   * @returns {*}
   */
  repository(repositoryName) {
    return this.get('repositories', repositoryName);
  }

  /**
   * Return component
   *
   * @param componentName
   * @returns {*}
   */
  component(componentName) {
    return this.get('components', componentName);
  }

  /**
   * Return model
   *
   * @param modelName
   * @returns {*}
   */
  model(modelName) {
    return this.get('models', modelName);
  }

}

module.exports = new Container();
