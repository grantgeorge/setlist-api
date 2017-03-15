'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var discographyCtrlStub = {
  index: 'discographyCtrl.index',
  show: 'discographyCtrl.show',
  create: 'discographyCtrl.create',
  upsert: 'discographyCtrl.upsert',
  patch: 'discographyCtrl.patch',
  destroy: 'discographyCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var discographyIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './discography.controller': discographyCtrlStub
});

describe('Discography API Router:', function() {
  it('should return an express router instance', function() {
    discographyIndex.should.equal(routerStub);
  });

  describe('GET /api/discographys', function() {
    it('should route to discography.controller.index', function() {
      routerStub.get
        .withArgs('/', 'discographyCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/discographys/:id', function() {
    it('should route to discography.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'discographyCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/discographys', function() {
    it('should route to discography.controller.create', function() {
      routerStub.post
        .withArgs('/', 'discographyCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/discographys/:id', function() {
    it('should route to discography.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'discographyCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/discographys/:id', function() {
    it('should route to discography.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'discographyCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/discographys/:id', function() {
    it('should route to discography.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'discographyCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
