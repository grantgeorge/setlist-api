/**
 * Discography model events
 */

'use strict'

const EventEmitter = require('events')
const Discography = require('./discography.model')
let DiscographyEvents = new EventEmitter()

// Set max event listeners (0 == unlimited)
DiscographyEvents.setMaxListeners(0)

// Model events
let events = {
  save: 'save',
  remove: 'remove'
}

// Register the event emitter to the model events
for (let e in events) {
  let event = events[e]
  Discography.schema.post(e, emitEvent(event))
}

function emitEvent(event) {
  return function(doc) {
    DiscographyEvents.emit(event + ':' + doc._id, doc)
    DiscographyEvents.emit(event, doc)
  }
}

module.exports.default = DiscographyEvents
