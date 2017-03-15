'use strict'

const mongoose = require('mongoose')
// const registerEvents = require('./thing.events').registerEvents

let SongSchema = new mongoose.Schema({
  name: String,
  previewUrl: String,
  artistImageUrl: String,
  // Spotify obj
  // id, preview, more meta information?
  albumName: String,
  albumImageUrl: String,
  spotifyId: String,
  spotify: {}
})

let SetlistSchema = new mongoose.Schema({
  name: String,
  concert: String,
  artistName: String,
  songs: [SongSchema],
  artist: {},
  spotify: {}
}, {
  timestamps: true
})

// registerEvents(SetlistSchema)

exports = module.exports = mongoose.model('Setlist', SetlistSchema)
