/**
 * Main application file
 */

'use strict'

const express = require('express')
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const config = require('./config/environment')
const http = require('http')
const seedDatabaseIfNeeded = require('./config/seed')

// Connect to MongoDB

mongoose.connect(config.mongo.uri, config.mongo.options)
mongoose.connection.on('error', function(err) {
  console.error(`MongoDB connection error: ${err}`)
  process.exit(-1) // eslint-disable-line no-process-exit
})

// Setup server
let app = express()
let server = http.createServer(app)
let socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
})
require('./config/socketio')(socketio)
require('./config/express')(app)
require('./routes')(app)

// Start server
function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, function() {
    console.log('💥 Express server listening on %d, in %s mode', config.port, app.get('env'))
  })
}

seedDatabaseIfNeeded()
setImmediate(startServer)

// Expose app
exports = module.exports = app
