/**
 * Is authorized middleware
 *
 * @param req
 * @param res
 * @param next
 */
export default (req, res, next) => {
  // let userRepository = container.repository('user'),
  //   accessToken = req.header('X-Access-Token');
  //
  // req.user = {roles: [{role: roles.GUEST}]};
  //
  // if (accessToken) {
  //   //todo: get from redis
  //   userRepository.findUserByCredentialsToken(accessToken).then(user => {
  //     if (user) {
  //       req.user = user;
  //     }
  //
  //     return next();
  //   });
  // } else {
  //   return next();
  // }

  return next();
};
