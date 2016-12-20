import express from  'express';
import container from '../../components/container';
import ValidationError from '../../components/errors/validation';

const router = express.Router(),
    AccessControl = container.service('security/permission'),
    { Roles } = container.service('security/roles');
/**
 * @api {put} /users update user
 * @apiName Update user
 * @apiGroup User
 * @apiParamExample {json} Request-Example:
 *     {
 *          "name": "SomeName"
 *     }
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "success": true,
 *          "user": {
 *            "email": "user@example.com"
 *            "createdAt": "2016-11-27T11:55:11.425Z"
 *            ...
 *          }
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *          "success": false,
 *          "errors": { ... }
 *     }
 */
router.put('/', AccessControl.except(Roles.GUEST), (req, res) => {
    let attributes = req.query;

    req.user.name = attributes.name || req.user.name;

    // save the user
    req.user.save()
        .then((user) => {
            res.success(user);
        })
        .catch(error => {
            res.error(new ValidationError(error.errors));
        });
});

export default router;
