/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/discographys              ->  index
 * POST    /api/discographys              ->  create
 * GET     /api/discographys/:id          ->  show
 * PUT     /api/discographys/:id          ->  upsert
 * PATCH   /api/discographys/:id          ->  patch
 * DELETE  /api/discographys/:id          ->  destroy
 */

'use strict'

const jsonpatch = require('fast-json-patch')
const Discography = require('./discography.model')

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200
  return function(entity) {
    if (entity) {
      return res.status(statusCode).json(entity)
    }
    return null
  }
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true)
    } catch(err) {
      return Promise.reject(err)
    }

    return entity.save()
  }
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end()
        })
    }
  }
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end()
      return null
    }
    return entity
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500
  return function(err) {
    res.status(statusCode).send(err)
  }
}

// Gets a list of Discographys
module.exports.index = (req, res) => {
  return Discography.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res))
}

// Gets a single Discography from the DB
module.exports.show = (req, res) => {
  return Discography.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res))
}

// Creates a new Discography in the DB
module.exports.create = (req, res) => {
  return Discography.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res))
}

// Upserts the given Discography in the DB at the specified ID
module.exports.upsert = (req, res) => {
  if(req.body._id) {
    delete req.body._id
  }
  return Discography.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res))
}

// Updates an existing Discography in the DB
module.exports.patch = (req, res) => {
  if(req.body._id) {
    delete req.body._id
  }
  return Discography.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res))
}

// Deletes a Discography from the DB
module.exports.destroy = (req, res) => {
  return Discography.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res))
}
