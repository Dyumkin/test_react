import express from 'express';
import container from '../../components/container';

const router = express.Router();

/**
 * @api {post} /signup sign up user
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
 *          "msg": "Successful created new user."
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *          "success": false,
 *          "msg": "Please pass name and password."
 *     }
 */
router.post('/signup', (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.json({success: false, msg: 'Please pass name and password.'});
  } else {
    let User = container.model('user');
    let newUser = new User({
      email: req.body.email,
      password: req.body.password
    });
    // save the user
    newUser.save((err) => {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});

export default router;
