import express from 'express';
import container from '../../components/container';

const router = express.Router();

/**
 * @api {get} /start return string
 * @apiGroup Start
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *           "success": true,
 *           "data": [
 *              ...
 *           ]
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *          "success": false,
 *          "errors": ""
 *     }
 */
router.get('/', (req, res) => {
  res.success({data: 'Hello world!'});
});

export default router;
