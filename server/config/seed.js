/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict'
const Thing = require('../api/thing/thing.model')
const Setlist = require('../api/setlist/setlist.model')
const User = require('../api/user/user.model')
const config = require('./environment/')

exports = module.exports = function() {
  if (false == true) {
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
          name: 'Madame Gandhi @ SXSW',
          concert: 'SXSW',
          artistName: 'Madame Gandhi',
          artist: {
            spotify: {

            }
          },
          songs: [
            {
              name: 'The Future is Female',
              previewUrl: '',
              spotify: {}
            },
            {
              name: 'Her',
              previewUrl: '',
              spotify: {}
            },
            {
              name: 'Yellow Sea',
              previewUrl: '',
              spotify: {}
            }
          ]
        })
      })
  }
}
