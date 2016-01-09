/* global describe, it */
require('@gr2m/frontend-test-setup')

function toValue(result) {
  if (isError(result.value)) {
    var error = new Error(result.value.message)
    Object.keys(result.value).forEach(function (key) {
      error[key] = result.value[key]
    })
    throw error
  }

  return result.value
}

function isError (value) {
  return value && value.name && /error/i.test(value.name)
}

function logError (error) {
  console.log(error)

  throw error
}

describe('my demo page', function () {
  this.timeout(90000)

  it('loads successfully', function () {
    return this.client
      .url('/')
      .getTitle().should.eventually.equal('Something Tracker')
  })

  it('walkthrough', function () {
    username = 'user' + Math.random().toString(16).substr(2)

    return this.client.url('/')

      .executeAsync(function storeAdd(username, done) {
        return hoodie.store.add({
          foo: 'bar'
        })

        .then(done, done)
      }, username).then(toValue)
      .should.eventually.have.property('foo', 'bar')

      .executeAsync(function signUp(username, done) {
        return hoodie.account.signUp({
          username: username,
          password: 'secret'
        })

        .then(done, done)
      }, username).then(toValue)
      .should.eventually.have.property('username', username)

      .executeAsync(function signOut(username, done) {
        return hoodie.account.signIn({
          username: username,
          password: 'secret'
        })

        .then(done, done)
      }, username).then(toValue)
      .should.eventually.have.property('username', username)

      .waitUntil(function () {
        return this.execute(function storeHasNoLocalChanges() {
          return hoodie.store.hasLocalChanges() === false
        })
      }, 10000)

      .executeAsync(function signOut(done) {
        return hoodie.account.signOut()

        .then(done, done)
      }).then(toValue)
      // .should.eventually.have.property('username', username)

      // .executeAsync(function storeFindAll(done) {
      //   return hoodie.store.findAll()
      //
      //   .then(done, done)
      // }).then(toValue)
      // .should.eventually.be.empty


      .catch(logError)
  })
})
