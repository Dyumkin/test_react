import express from  'express';
import container from '../../components/container';
import ValidationError from '../../components/errors/validation';

const router = express.Router(),
    AccessControl = container.service('security/permission'),
    { Roles } = container.service('security/roles');

/**
 * @api {get} /tasks/:limit(\\d+)/:offset(\\d+)? return list of tasks
 * @apiName Get tasks
 * @apiGroup Tasks
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *         "success": true,
 *         "data": {
 *           "total": "1",
 *           "items": [
 *             {
 *               "id": 3,
 *               "created_at": "2016-05-20T14:21:11.008Z",
 *               "updated_at": "2016-05-23T08:31:27.043Z",
 *               "title": "task title ",
 *               "subtitle": "task subtitle",
 *               "description": "task description long text ...",
 *               "deadline": "2016-10-12T21:00:00.000Z",
 *               "status": "done",
 *               "notes": [
 *                 {
 *                   "id": 4,
 *                   "text": "Some note text",
 *                   "created_at": "2016-05-20T14:21:11.008Z",
 *                   "updated_at": "2016-05-23T08:31:27.043Z",
 *                 },
 *                 ...
 *               ],
 *             }
 *           ]
 *         }
 *       }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *          "success": false,
 *          "errors": { ... }
 *     }
 */
router.get('/:status(all|active|done|overdue|cancel)/:limit(\\d+)/:offset(\\d+)?', AccessControl.hasRole(Roles.USER), (req, res) => {
    let Task = container.model('task'),
        limit = req.params.limit,
        offset = req.params.offset || 0,
        status = req.params.status;

    Promise.all([
        Task.count(status, req.user),
        Task.list(req.user, {status: status, skip: parseInt(offset), limit: parseInt(limit)})
    ])
        .then(result => ({total: result[0], items: result[1]}))
        .then(res.success)
        .catch(res.error);
});

/**
 * @api {post} /tasks create task
 * @apiName Create task
 * @apiGroup Tasks
 * @apiParamExample {json} Request-Example:
 *    {
 *       "title": "task title ",
 *       "subtitle": "task subtitle",
 *       "description": "task description long text ...",
 *       "deadline": "2016-10-12T21:00:00.000Z"
 *       "status": "active"
 *    }
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "success": true,
 *          "data": {
 *             "id": 3,
 *             "created_at": "2016-05-20T14:21:11.008Z",
 *             "updated_at": "2016-05-23T08:31:27.043Z",
 *             "title": "task title ",
 *             "subtitle": "task subtitle",
 *             "description": "task description long text ...",
 *             "deadline": "2016-10-12T21:00:00.000Z",
 *             "status": "active"
 *           }
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *          "success": false,
 *          "errors": { ... }
 *     }
 */
router.post('/', AccessControl.hasRole(Roles.USER), (req, res) => {
    let Task = container.model('task'),
        statuses = Task.getStatuses(),
        //notes = JSON.parse(req.body.notes),
        newTask = new Task({
            title: req.body.title,
            subtitle: req.body.subtitle,
            description: req.body.description,
            deadline: (req.body.deadline) ? req.body.deadline : null,
            user: req.user._id,
            status: (req.body.status) ? req.body.status : statuses[0],
            //notes: (notes) && Array.isArray(notes) ? notes : []
            notes: (req.body.notes) && Array.isArray(req.body.notes) ? req.body.notes : []
        });

    newTask.save()
        .then((task) => {
            res.success(task);
        })
        .catch(error => {
            res.error(new ValidationError(error.errors));
        });
});

export default router;
