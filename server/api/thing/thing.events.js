/**
 * Thing model events
 */

'use strict'

const EventEmitter = require('events').EventEmitter
let ThingEvents = new EventEmitter()

// Set max event listeners (0 == unlimited)
ThingEvents.setMaxListeners(0)

// Model events
let events = {
  save: 'save',
  remove: 'remove'
}

// Register the event emitter to the model events
module.exports.registerEvents = Thing => {
  for (let e in events) {
    let event = events[e]
    Thing.post(e, emitEvent(event))
  }
}

function emitEvent(event) {
  return function(doc) {
    ThingEvents.emit(`${event}:${doc._id}`, doc)
    ThingEvents.emit(event, doc)
  }
}

module.exports.default = ThingEvents
