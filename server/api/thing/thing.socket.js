/**
 * Broadcast updates to client when the model changes
 */

'use strict'

const ThingEvents = require('./thing.events').default

// Model events to emit
let events = ['save', 'remove']

module.exports.register = socket => {
  // Bind model events to socket events
  for (var i = 0, eventsLength = events.length; i < eventsLength; i++) {
    var event = events[i]
    var listener = createListener(`thing:${event}`, socket)

    ThingEvents.on(event, listener)
    socket.on('disconnect', removeListener(event, listener))
  }
}


function createListener(event, socket) {
  return function(doc) {
    socket.emit(event, doc)
  }
}

function removeListener(event, listener) {
  return function() {
    ThingEvents.removeListener(event, listener)
  }
}
