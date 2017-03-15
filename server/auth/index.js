'use strict'
const express = require('express')
const config = require('../config/environment')
const User = require('../api/user/user.model')

// Passport Configuration
require('./local/passport').setup(User, config)
require('./facebook/passport').setup(User, config)
require('./twitter/passport').setup(User, config)

let router = express.Router()

router.use('/local', require('./local'))
router.use('/facebook', require('./facebook'))
router.use('/twitter', require('./twitter'))

module.exports = router
