var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var oAuthTypes = ['facebook'];
var validator = require('validator');

/**
  * User schema
  */
var UserSchema = Schema({
    name: {
        first: { type: String, default: '', trim: true },
        last: { type: String, default: '', trim: true }
    },
    email: { type: String, trim: true, required: true },
    provider: String,
    hashed_password: String,
    salt: String,
    authToken: String,
    facebook: {},

    address: [{ type: Schema.Types.ObjectId, ref: 'Address' }]
});

UserSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() { return this._password });

/**
 * Validations
 */

var validatePresenceOf = function (value) {
    return value && value.length
};

// The below validations only apply if you are signing up traditionally

UserSchema.path('email').validate(function (email) {
    if (this.doesNotRequireValidation()) return true;

    return validator.isEmail(email);
}, 'Please enter a valid email address');

UserSchema.path('email').validate(function (email, fn) {
    var User = mongoose.model('User');
    if (this.doesNotRequireValidation()) fn(true);

    // Check only when it is a new user or when email field is modified
    if (this.isNew || this.isModified('email')) {
        User.find({ email: email }).exec(function (err, users) {
            fn(!err && users.length === 0);
        })
    } else fn(true);
}, 'Email already exists');

UserSchema.path('hashed_password').validate(function (hashed_password) {
    if (this.doesNotRequireValidation()) return true;
    return hashed_password.length;
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */

UserSchema.pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.password) && !this.doesNotRequireValidation()) {
        next(new Error('Invalid password'));
    } else {
        next();
    }
})

/**
 * Methods
 */

UserSchema.methods = {
    /**
     * Print out the user's full name
     *
     * @return {String}
     * @api public
     */

    displayName: function() {
        return this.name.first + ' ' + this.name.last;
    },

    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */

    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */

    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */

    encryptPassword: function (password) {
        if (!password) return '';

        var encrypted;
        try {
            encrypted = crypto.createHmac('sha1', this.salt).update(password).digest('hex');
            return encrypted;
        } catch (err) {
            return '';
        }
    },

    /**
     * Validation is not required if using OAuth
     */

    doesNotRequireValidation: function() {
        return ~oAuthTypes.indexOf(this.provider);
    }
}

mongoose.model('User', UserSchema)
