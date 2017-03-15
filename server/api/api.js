'use strict'

const jsonpatch = require('fast-json-patch')
const _ = require('lodash')
const merge = require('lodash').merge
const config = require('../config/environment')

module.exports.respondWithResult = (req, res, statusCode = 200) => entity => {
  if (entity) {
    return res.status(statusCode).json(entity)
  }
  return null
}

module.exports.patchUpdates = patches =>
   entity => {
     try {
       jsonpatch.apply(entity, patches, /*validate*/ true) // eslint-disable-line prefer-reflect
     }
     catch (err) {
       return Promise.reject(err)
     }

     return entity.save()
   }

module.exports.saveUpdates = updates =>
  entity => {
    entity = merge(entity, updates)
    return entity.save()
      .then(updatedResult => updatedResult)
  }

module.exports.removeEntity = res => entity => {
  if (entity) {
    return entity.remove()
      .then(() => res.status(200).end())
  }
}

module.exports.handleEntityNotFound = res => entity => {
  if (!entity) {
    res.status(404).end()
    return null
  }
  return entity
}

module.exports.handleError = (req, res, code = 500) => err => {
  if (err) {
    _logError(req, err)
    _errorResponse(res, code, err)
  }
}

module.exports.validationError = (req, res, statusCode = 422) => err => {
  res.status(statusCode).json(err)
}

// PRIVATE

function _errorResponse(res, code, err) {
  let response = {
    status: {
      success: false,
      code
    },
    data: {
      response: 'An error occurred processing the request.'
    }
  }
  if (config.env === 'development' || config.env === 'test') {
    response.data = _.merge({
      name: err.name,
      message: err.message,
      stack: err.stack
    }, response.data)
  }
  res.status(code).json(response)
}

function _logError(req, err) {
  if (config.env === 'staging' || config.env === 'production') {
    console.error(`${req.headers['X-Request-ID']}: ${err}`)
  }
  else {
    console.error(err)
  }
  return err
}

// TODO: this isn't used, but idea should be flushed out
// Originall from Artist Controller
// function buildPopulation(req) {
//   let include
//   let population = ''
//   let populations = []
//
//   if (req.query.include) {
//     return req.query.include.split(',').join(' ')
//   }
//
//   return ''
// }
