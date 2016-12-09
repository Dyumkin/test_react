import container from '../components/container';
import Helper from '../components/helper';
import jwt from 'jwt-simple';
import config from '../config/env';
/**
 * Is authorized middleware
 *
 * @param req
 * @param res
 * @param next
 */
export default (req, res, next) => {
  let token = Helper.getToken(req.headers),
      Roles = container.service('security/roles'),
      User = container.model('user');

  req.user = new User({role: Roles.GUEST});

  if (token) {
    let decoded = jwt.decode(token, config.jwtSecret);

    User.findOne({
      email: decoded.email
    }, (err, user) => {
      if (user) {
        req.user = user;

        return next();
      }
    });
  } else {
    return next();
  }
};
