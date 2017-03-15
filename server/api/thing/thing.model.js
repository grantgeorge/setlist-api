'use strict'

const mongoose = require('mongoose')
const registerEvents = require('./thing.events').registerEvents

let ThingSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
})

registerEvents(ThingSchema)

exports = module.exports = mongoose.model('Thing', ThingSchema)
