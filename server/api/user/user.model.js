'use strict'
/*eslint no-invalid-this:0*/
const crypto = require('crypto')
const mongoose = require('mongoose')
mongoose.Promise = Promise
const Schema = mongoose.Schema
const rp = require('request-promise')

const authTypes = ['facebook', 'spotify']

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  fullName: String,
  username: String,
  email: {
    type: String,
    lowercase: true,
    // ideally this just gets pulled from the auth method, but this is stored
    // in a nested object anyway right now
    required() {
      if (authTypes.indexOf(this.provider) === -1) {
        return true
      }
      else {
        return false
      }
    }
  },
  role: {
    type: String,
    default: 'user'
  },
  password: {
    type: String,
    // I'm leaving this in here - password is required but one is randomly
    // generated if it does not exist.
    required() {
      if (authTypes.indexOf(this.provider) === -1) {
        return true
      }
      else {
        return false
      }
    }
  },
  provider: String,
  salt: String,
  facebook: {},
  spotify: {},
  identity: {
    ip: String,
    geo: {}
  },
  loc: {
    type: [Number],
    index: '2dsphere'
  },
  oauth: {},
  tokens: {
    type: Array,
    default: []
  },
  passwordReset: {
    token: String,
    expiration: Date
  }
}, {
  timestamps: true
})

UserSchema.index({ email: 1 })
UserSchema.index({ username: 1 })
UserSchema.index({ provider: 1 })
UserSchema.index({ 'facebook.id': 1 })
UserSchema.index({ 'spotify.id': 1 })

/**
 * Virtuals
 */

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      name: this.name,
      role: this.role
    }
  })

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      _id: this._id,
      role: this.role
    }
  })

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    if (authTypes.indexOf(this.provider) !== -1) {
      return true
    }
    return email.length
  }, 'Email cannot be blank')

// Validate empty password
UserSchema
  .path('password')
  .validate(function(password) {
    if (authTypes.indexOf(this.provider) !== -1) {
      return true
    }
    return password.length
  }, 'Password cannot be blank')

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond) {
    if (authTypes.indexOf(this.provider) !== -1) {
      return respond(true)
    }

    return this.constructor.findOne({ email: value }).exec()
      .then(user => {
        if (user) {
          if (this.id === user.id) {
            return respond(true)
          }
          return respond(false)
        }
        return respond(true)
      })
      .catch(function(err) {
        throw err
      })
  }, 'The specified email address is already in use.')

var validatePresenceOf = function(value) {
  return value && value.length
}

// generate random 8 char user password
UserSchema.pre('validate', function(next) {
  if (!this.password) {
    crypto.randomBytes(4, (err, buffer) => {
      if (err) {
        return next(new Error('failed to create password'))
      }
      this.password = buffer.toString('hex')
      return next()
    })
  }
  else {
    return next()
  }
})

/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
  // Handle new/update passwords
  if (!this.isModified('password')) {
    return next()
  }

  if (!validatePresenceOf(this.password)) {
    if (authTypes.indexOf(this.provider) === -1) {
      return next(new Error('Invalid password'))
    }
    else {
      return next()
    }
  }

  // Make salt with a callback
  this.makeSalt((saltErr, salt) => {
    if (saltErr) {
      return next(saltErr)
    }
    this.salt = salt
    this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
      if (encryptErr) {
        return next(encryptErr)
      }
      this.unhashedPassword = this.password
      this.password = hashedPassword
      return next()
    })
  })
})

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  authenticate(password, callback) {
    if (!callback) {
      return this.password === this.encryptPassword(password)
    }

    this.encryptPassword(password, (err, pwdGen) => {
      if (err) {
        return callback(err)
      }

      if (this.password === pwdGen) {
        return callback(null, true)
      }
      else {
        return callback(null, false)
      }
    })
  },

  /**
   * Make salt
   *
   * @param {Number} [byteSize] - Optional salt byte size, default to 16
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  makeSalt(byteSize, callback) {
    var defaultByteSize = 16

    if (typeof arguments[0] === 'function') {
      callback = arguments[0]
      byteSize = defaultByteSize
    }
    else if (typeof arguments[1] === 'function') {
      callback = arguments[1]
    }
    else {
      throw new Error('Missing Callback')
    }

    if (!byteSize) {
      byteSize = defaultByteSize
    }

    return crypto.randomBytes(byteSize, (err, salt) => {
      if (err) {
        return callback(err)
      }
      else {
        return callback(null, salt.toString('base64'))
      }
    })
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  encryptPassword(password, callback) {
    if (!password || !this.salt) {
      if (!callback) {
        return null
      }
      else {
        return callback('Missing password or salt')
      }
    }

    var defaultIterations = 10000
    var defaultKeyLength = 64
    var salt = new Buffer(this.salt, 'base64')

    if (!callback) {
      return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength)
        .toString('base64')
    }

    return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, (err, key) => {
      if (err) {
        return callback(err)
      }
      else {
        return callback(null, key.toString('base64'))
      }
    })
  },

  /**
   * Lookup geo info based on IP
   *
   * @api public
   */
  getGeo() {
    if (!this.identity.ip) {
      return new Promise((resolve, reject) => reject('Missing param identity.ip'))
    }

    return rp(`http://freegeoip.net/json/${this.identity.ip.split(',')[0]}`)
      .then(response => JSON.parse(response))
      .catch(err => err)
  }
}

exports = module.exports = mongoose.model('User', UserSchema)
