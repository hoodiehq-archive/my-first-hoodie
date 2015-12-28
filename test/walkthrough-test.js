/* global describe, it */
require('@gr2m/frontend-test-setup')

describe('my demo page', function () {
  this.timeout(90000)

  it('loads successfully', function () {
    return this.client
      .url('/')
      .getTitle().should.eventually.equal('Something Tracker')
  })
})
