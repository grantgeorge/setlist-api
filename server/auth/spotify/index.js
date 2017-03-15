'use strict'

const passport = require('passport')
const router = require('express').Router()
const setTokenCookie = require('../auth.service').setTokenCookie

// Available Scopes
// https://developer.spotify.com/web-api/using-scopes/

router
  .get('/',
    passport.authenticate('spotify', {
      scope: ['user-read-private', 'user-read-email', 'playlist-modify-public',
        'playlist-read-collaborative', 'streaming', 'user-follow-read',
        'user-follow-modify', 'user-library-read', 'user-library-modify',
        'user-top-read', 'user-read-birthdate'],
      failureRedirect: '/signup',
      session: false
    }))
  .get('/callback', passport.authenticate('spotify', {
    failureRedirect: '/signup',
    session: false
  }), setTokenCookie)

module.exports = router
