/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/setlists                    ->  index
 * POST    /api/setlists                    ->  create
 * GET     /api/setlists/:id                ->  show
 * PUT     /api/setlists/:id                ->  update
 * DELETE  /api/setlists/:id                ->  destroy
 * GET     /api/setlists/tour/:tour         ->  byTourId
 * GET     /api/setlists/countTour/:tourId  ->  countTour
 * GET     /api/setlists/count/:concertId   ->  count
 */

'use strict'

const api = require('../api')
const Setlist = require('./setlist.model')
const User = require('../user/user.model')
const SpotifyWebApi = require('spotify-web-api-node')
const CLOUDINARY_ENV = 'CLOUDINARY_URL=cloudinary://596681179529928:d2c8woY-iWerQrPiSjaaR59Dmyc@dymwnavh5';
const cloudinary = require('cloudinary')

module.exports.index = (req, res) =>
  Setlist.find()
    .exec()
    .then(api.respondWithResult(req, res))
    .catch(api.handleError(req, res))

// Gets a single Setlist from the DB
module.exports.show = (req, res) =>
  Setlist.findById(req.params.id)
    .exec()
    .then(api.handleEntityNotFound(res))
    .then(api.respondWithResult(req, res))
    .catch(api.handleError(req, res))

// Creates a new Setlist in the DB
module.exports.create = (req, res) =>
  Setlist.create(req.body)
    .then(api.respondWithResult(req, res))
    .catch(api.handleError(req, res))

module.exports.createSpotify = (req, res) =>
  User.findOne().sort({_id:-1}).exec()
    .then(user => {
      return Setlist.findById(req.params.id)
        .exec()
        .then(setlist => {
          const spotifyApi = new SpotifyWebApi({
            clientId: '9e216515916b460d938b99472fd716f9',
            clientSecret: 'd2abdd1cbcff441f919513c5c98c9a0a',
            redirectUri: '/auth/callback/spotify',
            accessToken: user.tokens[0].accessToken,
            refreshToken: user.tokens[0].attributes.refreshToken,
          })

          const tracks = setlist.songs.map(song => `spotify:track:${song.spotifyId}`)

          let playlist
          return spotifyApi.createPlaylist(user.spotify.id, `Setlist API - ${setlist.artistName} Set List`)
            .then(data => {
              const { body } = data
              playlist = body
              // res.json({playlist})
              return playlist
            })
            .then(() => {
              console.log(user.spotify.id)
              console.log(playlist.id)
              console.log(tracks)
              return spotifyApi.addTracksToPlaylist(user.spotify.id, playlist.id, tracks)
            })
            .then(() => res.json({playlist}))
            .catch(err => {
              res.json({err})
            })
        })
        .catch(api.handleError(req, res))
    })

module.exports.createImage = (req, res) =>
  Setlist.findById(req.params.id)
    .exec()
    .then(setlist => {
      cloudinary.config({
        cloud_name: 'dymwnavh5',
        api_key: '596681179529928',
        api_secret: 'd2c8woY-iWerQrPiSjaaR59Dmyc'
      });

      let images = []

      let transformation = setlist.songs.map((song, idx) => {
        return [{
          overlay: `text:helvetica_48:${encodeURI(song.name)}`,
          gravity: 'north',
          y: idx * 80 + 40,
          color: 'white'
        }]
      })

      transformation.push(
        {
          height: 440,
          crop: 'scale'
        }
      )

      let img = cloudinary.image('daftt_punk_lg_oykxl0.jpg', {
        // transformation: [
        //   // {
        //   //   width: 400, crop: "scale"
        //   // },
        //   {
        //     overlay: 'text:helvetica_60:Sea%20Shell',
        //     gravity: 'north', y: 20
        //   }]
        transformation
      })

      images.push({ twitter: img })

      // INSTAGRAM

      transformation = setlist.songs.map((song, idx) => {
        return [{
          overlay: `text:helvetica_48:${encodeURI(song.name)}`,
          gravity: 'north',
          y: idx * 80 + 40,
          color: 'white'
        }]
      })

      transformation.push(
        {
          width: 900,
          height: 900,
          crop: 'fit'
        }
      )

      img = cloudinary.image('daftt_punk_lg_oykxl0.jpg', {
        // transformation: [
        //   // {
        //   //   width: 400, crop: "scale"
        //   // },
        //   {
        //     overlay: 'text:helvetica_60:Sea%20Shell',
        //     gravity: 'north', y: 20
        //   }]
        transformation
      })

      images.push({ instagram: img })

      // FACEBOOK

      transformation = setlist.songs.map((song, idx) => {
        return [{
          overlay: `text:helvetica_42:${encodeURI(song.name)}`,
          gravity: 'north',
          y: idx * 55 + 120,
          color: 'white'
        }]
      })

      transformation.push(
        {
          width: 900,
          height: 472,
          crop: 'fill'
        }
      )

      img = cloudinary.image('daftt_punk_lg_oykxl0.jpg', {
        // transformation: [
        //   // {
        //   //   width: 400, crop: "scale"
        //   // },
        //   {
        //     overlay: 'text:helvetica_60:Sea%20Shell',
        //     gravity: 'north', y: 20
        //   }]
        transformation
      })

      images.push({ facebook: img })

      res.json({images})
    })
    .catch(api.handleError(req, res))

module.exports.postToSocial = (req, res) =>
  Setlist.findById(req.params.id)
    .exec()
    .then(api.handleEntityNotFound(res))
    .then(api.respondWithResult(req, res))
    .catch(api.handleError(req, res))

// Upserts the given Setlist in the DB at the specified ID
module.exports.upsert = (req, res) => {
  if (req.body._id) {
    delete req.body._id
  }
  return Setlist.findOneAndUpdate({ _id: req.params.id }, req.body,
      { new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true
      }).exec()
    .then(api.respondWithResult(res))
    .catch(api.handleError(res))
}

// Deletes a Setlist from the DB
module.exports.destroy = (req, res) =>
  Setlist.findById(req.params.id).exec()
    .then(api.handleEntityNotFound(res))
    .then(api.removeEntity(res))
    .catch(api.handleError(req, res))
