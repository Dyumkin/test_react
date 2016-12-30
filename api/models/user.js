import Promise from 'bluebird';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import NotFoundError from '../components/errors/not-found';
import config from '../config/env';
import uniqueValidator from 'mongoose-unique-validator';
import mongooseRbac from 'mongoose-hrbac';
import container from '../components/container';
import jwt from 'jwt-simple';

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        maxlength: [50, "^The email cannot be longer %{MAXLENGTH} characters"]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, "Password must be at least {MINLENGTH} characters"],
        hide: true
    },
    name: {
        type: String,
        maxlength: [30, "^Name cannot be longer %{MAXLENGTH} characters"],
        minlength: [3, "Name must be at least {MINLENGTH} characters"]
    }
}, {
    timestamps: true,
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

UserSchema.plugin(uniqueValidator, {
    message: 'User with address "{VALUE}" already exists'
});

UserSchema.plugin(require('mongoose-hidden')());
UserSchema.plugin(mongooseRbac);

/**
 * Pre-save
 */
UserSchema.pre('save', function(next) {
    let user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) {
        return next();
    }

    // generate a salt
    bcrypt.genSalt(config.SALT_WORK_FACTOR, (err, salt) => {
        if (err) {
            return next(err);
        }

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

/**
 * After save
 */
UserSchema.post('save', function(user) {
    let { Roles } = container.service('security/roles'),
        rbac = container.service('security/rbac');

    if (user.role == null || user.role == Roles.GUEST) {
        user.setRole(rbac, Roles.USER, (err) => {
            if (err) {
                throw err;
            }
        });
    }
});

UserSchema.virtual('id').get(function(){
    return this._id;
});

/**
 * Methods
 */
UserSchema.method({
    comparePassword: function (passw, cb) {
        bcrypt.compare(passw, this.password, (err, isMatch) => {
            if (err) {
                return cb(err);
            }
            cb(null, isMatch);
        });
    },

    getUserWithToken: function () {
        let user = this.toObject();
        user.token = 'JWT ' + jwt.encode(this, config.jwtSecret);

        return user;
    }
});

/**
 * Statics
 */
UserSchema.statics = {
    /**
     * Get user
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, NotFoundError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((user) => {
                if (user) {
                    return user;
                }

                const err = new NotFoundError('No such user exists!');
                return Promise.reject(err);
            });
    },

    /**
     * List users in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of users to be skipped.
     * @param {number} limit - Limit number of users to be returned.
     * @returns {Promise<User[]>}
     */
    list({ skip = 0, limit = 50 } = {}) {
        return this.find()
            .select('email password id')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
    }
};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);