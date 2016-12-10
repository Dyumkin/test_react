import Promise from 'bluebird';
import mongoose from 'mongoose';
import NotFoundError from '../components/errors/not-found';

const statuses = ['active', 'done', 'overdue', 'cancel']; //todo move anywhere
/**
 * List Schema
 */
const ListSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: 'User'
    },
    isAllDay: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date
    },
    tasks: [{
        id: {
            type: ObjectId,
            auto: true
        },
        time: {
            type: String,
            default: '00:00',
            validate: {
                validator: function(time) {
                    return /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(time);
                },
                message: 'Time is not a valid'
            },
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
        createAt: {
            type: Date
        },
        updateAt: {
            type: Date,
            default: Date.now

        }
    }]
}, {
    timestamps: true
});

/**
 * Methods
 */
ListSchema.method({

});

/**
 * Statics
 */
ListSchema.statics = {
    /**
     * Get list
     * @param {ObjectId} id - The objectId of List.
     * @returns {Promise<List, NotFoundError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((list) => {
                if (list) {
                    return list;
                }

                const err = new NotFoundError('No such list exists!');
                return Promise.reject(err);
            });
    },

    /**
     * List in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of lists to be skipped.
     * @param {number} limit - Limit number of lists to be returned.
     * @returns {Promise<List[]>}
     */
    list({ skip = 0, limit = 50 } = {}) {
        return this.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
    },

    getStatuses() {
        return statuses;
    }
};

/**
 * @typedef List
 */
export default mongoose.model('List', ListSchema);