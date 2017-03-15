'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newDiscography;

describe('Discography API:', function() {
  describe('GET /api/discographys', function() {
    var discographys;

    beforeEach(function(done) {
      request(app)
        .get('/api/discographys')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          discographys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      discographys.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/discographys', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/discographys')
        .send({
          name: 'New Discography',
          info: 'This is the brand new discography!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newDiscography = res.body;
          done();
        });
    });

    it('should respond with the newly created discography', function() {
      newDiscography.name.should.equal('New Discography');
      newDiscography.info.should.equal('This is the brand new discography!!!');
    });
  });

  describe('GET /api/discographys/:id', function() {
    var discography;

    beforeEach(function(done) {
      request(app)
        .get(`/api/discographys/${newDiscography._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          discography = res.body;
          done();
        });
    });

    afterEach(function() {
      discography = {};
    });

    it('should respond with the requested discography', function() {
      discography.name.should.equal('New Discography');
      discography.info.should.equal('This is the brand new discography!!!');
    });
  });

  describe('PUT /api/discographys/:id', function() {
    var updatedDiscography;

    beforeEach(function(done) {
      request(app)
        .put(`/api/discographys/${newDiscography._id}`)
        .send({
          name: 'Updated Discography',
          info: 'This is the updated discography!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedDiscography = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedDiscography = {};
    });

    it('should respond with the updated discography', function() {
      updatedDiscography.name.should.equal('Updated Discography');
      updatedDiscography.info.should.equal('This is the updated discography!!!');
    });

    it('should respond with the updated discography on a subsequent GET', function(done) {
      request(app)
        .get(`/api/discographys/${newDiscography._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let discography = res.body;

          discography.name.should.equal('Updated Discography');
          discography.info.should.equal('This is the updated discography!!!');

          done();
        });
    });
  });

  describe('PATCH /api/discographys/:id', function() {
    var patchedDiscography;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/discographys/${newDiscography._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Discography' },
          { op: 'replace', path: '/info', value: 'This is the patched discography!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedDiscography = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedDiscography = {};
    });

    it('should respond with the patched discography', function() {
      patchedDiscography.name.should.equal('Patched Discography');
      patchedDiscography.info.should.equal('This is the patched discography!!!');
    });
  });

  describe('DELETE /api/discographys/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/discographys/${newDiscography._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when discography does not exist', function(done) {
      request(app)
        .delete(`/api/discographys/${newDiscography._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
