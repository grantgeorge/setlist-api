/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/things              ->  index
 * POST    /api/things              ->  create
 * GET     /api/things/:id          ->  show
 * PUT     /api/things/:id          ->  upsert
 * DELETE  /api/things/:id          ->  destroy
 */

'use strict'

const Thing = require('./thing.model')

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200
  return function(entity) {
    if(entity) {
      console.log(entity)
      return res.status(statusCode).json(entity)
    }
    return null
  }
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end()
        })
    }
  }
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
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

// Gets a list of Things
module.exports.index = (req, res) => {
  return Thing.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res))
}

// Gets a single Thing from the DB
module.exports.show = (req, res) => {
  return Thing.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res))
}

// Creates a new Thing in the DB
module.exports.create = (req, res) => {
  return Thing.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res))
}

// Upserts the given Thing in the DB at the specified ID
module.exports.upsert = (req, res) => {
  if(req.body._id) {
    delete req.body._id
  }
  return Thing.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res))
}

// Updates an existing Thing in the DB
module.exports.patch = (req, res) => {
  if(req.body._id) {
    delete req.body._id
  }
  return Thing.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res))
}

// Deletes a Thing from the DB
module.exports.destroy = (req, res) => {
  return Thing.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res))
}