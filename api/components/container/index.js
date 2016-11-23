/**
 * Container
 */
class Container {

  constructor() {
    this.paths = {
      services: '../../services/',
      models: '../../models/',
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

export default new Container();
