/**
 * Broadcast updates to client when the model changes
 */

'use strict'

const DiscographyEvents = require('./discography.events').default

// Model events to emit
let events = ['save', 'remove']

module.exports.register = (socket) => {
  // Bind model events to socket events
  for(let i = 0, eventsLength = events.length; i < eventsLength; i++) {
    let event = events[i]
    let listener = createListener(`discography:${event}`, socket)

    DiscographyEvents.on(event, listener)
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
    DiscographyEvents.removeListener(event, listener)
  }
}
