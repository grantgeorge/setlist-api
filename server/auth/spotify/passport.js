'use strict'

const passport = require('passport')
const SpotifyStrategy = require('passport-spotify').Strategy

module.exports.setup = (User, config) => {
  passport.use(new SpotifyStrategy({
    clientID: '9e216515916b460d938b99472fd716f9',
    clientSecret: 'd2abdd1cbcff441f919513c5c98c9a0a',
    callbackURL: 'https://settheset.ngrok.io/auth/spotify/callback',
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    if (!req.user) {
      // Not logged-in. Authenticate based on Spotify account.
      User.findOne({ 'spotify.id': profile.id})
        .exec()
        .then(user => {
          if (user) {
            // Check if User already exists in DB. If so, return & login
            return done(null, user)
          }

          user = new User({
            name: profile.displayName,
            role: 'user',
            provider: 'spotify',
            spotify: profile._json,
            identity: { ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress }
          })

          const t = { kind: 'spotify', accessToken, attributes: { refreshToken } }
          user.tokens.push(t)

          if (profile.emails && profile.emails[0]) {
            user.email = profile.emails[0].value
          }

          return user.save()
        })
        .then(newUser => done(null, newUser))
        .catch(err => done(err))
    }
  }))
}
