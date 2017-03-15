'use strict'

const mongoose = require('mongoose')

const DiscographySchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
})

module.exports = mongoose.model('Discography', DiscographySchema)
