'use strict'

let express = require('express')
let controller = require('./setlist.controller')
const auth = require('../../auth/auth.service')

let router = express.Router()

router.get('/', controller.index)
router.get('/:id/spotify', controller.createSpotify)
router.get('/:id/image', controller.createImage)
router.get('/:id/social', controller.postToSocial)
router.get('/:id', controller.show)
router.post('/', controller.create)
router.put('/:id', controller.upsert)
router.delete('/:id', controller.destroy)

module.exports = router
