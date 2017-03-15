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
