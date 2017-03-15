/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict'
const Setlist = require('../api/setlist/setlist.model')
const User = require('../api/user/user.model')
const config = require('./environment/')

exports = module.exports = function() {
  if (config.env === 'development2') {
    User.find({}).remove()
      .then(() => {
        User.create({
          provider: 'local',
          name: 'Test User',
          email: 'test@example.com',
          password: 'test'
        }, {
          provider: 'local',
          role: 'admin',
          name: 'Admin',
          email: 'admin@example.com',
          password: 'admin'
        })
        .then(() => console.log('finished populating users'))
        .catch(err => console.log('error populating users', err))
      })

    Setlist.find({}).remove()
      .then(() => {
        Setlist.create({
          name: 'Daft Punk @ SXSW',
          concert: 'SXSW',
          artistName: 'Daft Punk',
          artist: {
            spotify: {

            }
          },
          songs: [
            {
              name: 'Get Lucky',
              albumName: 'Random Access Memories',
              albumImageUrl: 'https://i.scdn.co/image/405ee050d1976448c600cb9648e491e31ef87aed',
              numVotes: 0,
              spotifyId: '69kOkLUCkxIZYexIgSG8rq',
            },
            {
              name: 'One More Time',
              albumName: 'Discovery',
              albumImageUrl: 'https://i.scdn.co/image/f04bb6fba32e89475d9981007aff21e13745dec2',
              numVotes: 0,
              spotifyId: '0DiWol3AO6WpXZgp0goxAV',
            },
            {
              name: 'Instant Crush',
              albumName: 'Random Access Memories',
              albumImageUrl: 'https://i.scdn.co/image/405ee050d1976448c600cb9648e491e31ef87aed',
              numVotes: 0,
              spotifyId: '2cGxRwrMyEAp8dEbuZaVv6',
            },
            {
              name: 'Lose Yourself To Dance',
              albumName: 'Random Access Memories',
              albumImageUrl: 'https://i.scdn.co/image/405ee050d1976448c600cb9648e491e31ef87aed',
              numVotes: 0,
              spotifyId: '5CMjjywI0eZMixPeqNd75R',
            },
            {
              name: 'Around The World',
              albumName: 'Homework',
              albumImageUrl: 'https://i.scdn.co/image/405ee050d1976448c600cb9648e491e31ef87aed',
              numVotes: 0,
              spotifyId: '1pKYYY0dkg23sQQXi0Q5zN',
            },
            {
              name: 'Doin\' It Right',
              albumName: 'Random Access Memories',
              albumImageUrl: 'https://i.scdn.co/image/405ee050d1976448c600cb9648e491e31ef87aed',
              numVotes: 0,
              spotifyId: '36c4JohayB9qd64eidQMBi',
            },
            {
              name: 'Harder Better Faster Stronger',
              albumName: 'Discovery',
              albumImageUrl: 'https://i.scdn.co/image/f04bb6fba32e89475d9981007aff21e13745dec2',
              numVotes: 0,
              spotifyId: '5W3cjX2J3tjhG8zb6u0qHn',
            },
            {
              name: 'Something About Us',
              albumName: 'Discovery',
              albumImageUrl: 'https://i.scdn.co/image/2dacea257e8de9b0f263b9ffebf714b15a07181f',
              numVotes: 0,
              spotifyId: '1NeLwFETswx8Fzxl2AFl91',
            },
            {
              name: 'Give Life Back to Music',
              albumName: 'Random Access Memories',
              albumImageUrl: 'https://i.scdn.co/image/405ee050d1976448c600cb9648e491e31ef87aed',
              numVotes: 0,
              spotifyId: '0dEIca2nhcxDUV8C5QkPYb',
            },
          ],
        })
      })
  }
}
