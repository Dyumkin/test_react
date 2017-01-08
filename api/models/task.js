import Promise from 'bluebird';
import mongoose from 'mongoose';
import NotFoundError from '../components/errors/not-found';
import User from './user';

const statuses = ['active', 'done', 'overdue', 'cancel'], //todo move anywhere
      ObjectId = mongoose.Schema.Types.ObjectId;
/**
 * Task Schema
 */
const TaskSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: 'User'
    },
    deadline: {
        type: Date,
        default: null
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        maxlength: [200, "^The title cannot be longer %{MAXLENGTH} characters"]
    },
    subtitle: {
        type: String,
        maxlength: [200, "^The subtitle cannot be longer %{MAXLENGTH} characters"]
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [2000, "^The description cannot be longer %{MAXLENGTH} characters"]
    },
    status: {
        type: String,
        enum: {
            values: statuses,
            message: 'Status is invalid'
        }
    },
    notes: [{
        text: {
            type: String,
            required: [true, 'Text is required'],
            maxlength: [2000, "^The text cannot be longer %{MAXLENGTH} characters"]
        },
        createAt: {
            type: Date,
            default: Date.now
        },
        updateAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

TaskSchema.plugin(require('mongoose-hidden')());

/**
 * Methods
 */
TaskSchema.method({

});

TaskSchema.virtual('id').get(function(){
    return this._id;
});

/**
 * Statics
 */
TaskSchema.statics = {
    /**
     * Get task
     * @param {ObjectId} id - The objectId of task.
     * @returns {Promise<Task, NotFoundError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((task) => {
                if (task) {
                    return task;
                }

                const err = new NotFoundError('No such task exists!');
                return Promise.reject(err);
            });
    },

    /**
     * Task in descending order of 'createdAt' timestamp.
     * @param {User} user
     * @param {String} status
     * @param {number} skip - Number of tasks to be skipped.
     * @param {number} limit - Limit number of tasks to be returned.
     * @returns {Promise<Task[]>}
     */
    list(user, {status = 'all', skip = 0, limit = 50} = {}) {
        let params = {'user': user.id};

        if (status != 'all') {
            params.status = status;
        }

        return this.find(params)
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
            .exec();
    },

    /**
     * Get tasks count
     * @param {String} status
     * @param {User} user
     */
    count(status, user) {
        let params = {'user': user.id};

        if (status != 'all') {
            params.status = status;
        }

        return this.find(params).count();
    },

    getStatuses() {
        return statuses;
    }
};

/**
 * @typedef Task
 */
export default mongoose.model('Task', TaskSchema);