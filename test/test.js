/*global before:true*/
/*global after:true*/
/*global beforeEach:true*/
/*global describe:true*/
/*global it:true*/

var app = require('../server/server.js')
var chai = require('chai')
var expect = chai.expect
var request = require('supertest-as-promised')

chai.use(require('chai-datetime'));
chai.should()

var apiUrl = '/api'

// Helper function to make api requests.
function json(verb, reqUrl) {
  return request(app)[verb](reqUrl)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
}

describe('Create new item (internal)', function() {
  before(function() {
    return app.models.Program.create({})
      .then(program => {
        return program.people.create({})
      })
      .then(person => {
        this.person = person
      })
  })
  it('should have a default date', function() {
    expect(this.person).to.have.property('created')
    expect(this.person.created).to.be.a('date')
  })
})


describe('Update an existing item (internal)', function() {
  before(function() {
    return app.models.Program.create({})
      .then(program => {
        return program.people.create({})
      })
      .then(person => {
        this.createdBefore = person.created
        return person.save()
      })
      .then(person => {
        this.createdAfter = person.created
      })
  })
  it('should not update the date', function() {
    expect(this.createdBefore).to.equalTime(this.createdAfter)
  })
})


describe('Update an existing item directly (api)', function() {
  before(function() {
    return app.models.Program.create({})
      .then(program => {
        this.program = program
        return program.people.create({})
      })
      .then(person => {
        this.createdBefore = person.created
        return json('put', `${apiUrl}/People/${person.id}`)
          .send({
            id: person.id
          })
      })
      .then(res => {
        this.createdAfter = new Date(res.body.created)
      })
  })
  it('should not update the date', function() {
    expect(this.createdBefore).to.equalTime(this.createdAfter)
  })
})

describe('Update an existing item via a relationship (api)', function() {
  before(function() {
    return app.models.Program.create({})
      .then(program => {
        this.program = program
        return program.people.create({})
      })
      .then(person => {
        this.createdBefore = person.created
        return json('put', `${apiUrl}/Programs/${this.program.id}/People/${person.id}`)
          .send({
            id: person.id
          })
      })
      .then(res => {
        this.createdAfter = new Date(res.body.created)
      })
  })
  it('should not update the date', function() {
    expect(this.createdBefore).to.equalTime(this.createdAfter)
  })
})
