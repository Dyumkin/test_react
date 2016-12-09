import Forbidden from '../../../components/errors/forbidden'
import rbac from '../rbac';
/**
 * Access control
 */
class AccessControl {

  /**
   * Return middleware function for permission check
   * @param  {String}  name              Name of role
   * @return {Function}                  Middleware function
   */
  static hasRole(name) {
    return function (req, res, next) {

      if (!req.user) {
        return next(new Forbidden());
      }

      req.user.hasRole(rbac, name, function (err, has) {
        if (err) {
          return next(err);
        }

        if (!has) {
          return next(new Forbidden());
        }

        next();
      });
    };
  };

  /**
   * Return middleware function for permission check
   * @param  {String}  action            Name of action
   * @param  {String}  resource          Name of resource
   * @return {Function}                  Middleware function
   */
  static can(action, resource) {
    return function (req, res, next) {
      if (!req.user) {
        return next(new Forbidden());
      }

      req.user.can(rbac, action, resource, function (err, can) {
        if (err) {
          return next(err);
        }

        if (!can) {
          return next(new Forbidden(401));
        }

        next();
      });
    };
  }
}

export default AccessControl;
