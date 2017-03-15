'use strict'

let express = require('express')
let controller = require('./setlist.controller')

let router = express.Router()

router.get('/', controller.index)
router.get('/:id', controller.show)
router.post('/', controller.create)
router.put('/:id', controller.upsert)
router.delete('/:id', controller.destroy)

module.exports = router
