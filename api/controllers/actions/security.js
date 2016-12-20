import express from 'express';
import container from '../../components/container';
import ValidationError from '../../components/errors/validation';
import jwt from 'jwt-simple';
import config from '../../config/env';

const router = express.Router(),
      AccessControl = container.service('security/permission'),
      { Roles } = container.service('security/roles');

/**
 * @api {post} /security/signup sign up user
 * @apiName Sign Up
 * @apiGroup Security
 * @apiParamExample {json} Request-Example:
 *     {
 *          "email": "exmaple@email.com",
 *          "password": 123456
 *     }
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "success": true,
 *          "user": {
 *              "email": "exmaple@email.com",
 *              "createdAt": "2016-11-27T11:55:11.425Z"
 *              ...
 *          }
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *          "success": false,
 *          "errors": {
 *              "email": [
 *                  "User with address "exmaple@email.com" already exists"
 *              ]
 *          }
 *     }
 */
router.post('/signup', AccessControl.hasRole(Roles.GUEST), (req, res) => {
  let User = container.model('user');
  let newUser = new User({
    email: req.body.email,
    password: req.body.password,
    name: (req.body.name) ? req.body.name : ''
  });

  // save the user
  newUser.save()
      .then((user) => {
        res.success(user);
      })
      .catch(error => {
          res.error(new ValidationError(error.errors));
      });
});

/**
 * @api {post} /security/signin verify user
 * @apiGroup Security
 * @apiParamExample {json} Request-Example:
 *  local porvider:
 *     {
 *          "email": "exmaple@email.com",
 *          "password": 123456,
 *     }
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "success": true,
 *          "token": "56b3249c72a31bc776d776bf"
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *          "success": false,
 *          "errors": ""
 *     }
 */
router.post('/signin', AccessControl.hasRole(Roles.GUEST), (req, res) => {
    let User = container.model('user');

    User.findOne({
        email: req.body.email
    }, (err, user) => {

        if (!user) {
            res.error({message: 'Authentication failed. User not found.'});
        } else {
            // check if password matches
            user.comparePassword(req.body.password, (err, isMatch) => {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    let token = jwt.encode(user, config.jwtSecret);
                    // return the information including token as JSON
                    res.success({token: 'JWT ' + token});
                } else {
                    res.error({message: 'Authentication failed. Wrong password.'});

                }
            });
        }
    });
});

/**
 * @api {get} /security/user return authorized user by token
 * @apiParamExample Request-Example:
 *      Header:
 *          Authorization: JWT r447bxsmwrPLpdVAbKTtgaGWEsGPrzNexzQ7xHsuKZRsfAnHPMsJagEbmQ/poAdUMZKBVWUhjTCD3bgisDQB+g==
 * @apiGroup Security
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "success": true
 *        "user": {
 *          "email": "user@example.com"
 *          "createdAt": "2016-11-27T11:55:11.425Z"
 *          ...
 *        }
 *     }
 */
router.get('/user', AccessControl.hasRole(Roles.USER), (req, res) => {
    res.success(req.user ? req.user : {});
});

export default router;
