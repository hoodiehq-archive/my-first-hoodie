var assert = require('assert'),
    vows = require('vows'),
    request = require('request'),
    union = require('../');

vows.describe('union/streaming').addBatch({
  'When using `union`': {
    'a simple union server': {
      topic: function () {
        var self = this;

        union.createServer({
          before: [
            function (req, res, next) {
              var chunks = '';
              req.on('data', function (chunk) {
                chunks += chunk;
              });
              req.on('end', function () {
                self.callback(null,chunks);
              });
            }
          ],
          stream: true
        }).listen(9000, function () {
          request.post('http://localhost:9000').write('hello world');
        });
      },
      'should receive complete POST data': function (chunks) {
        assert.equal(chunks, 'hello world');
      }
    }
  }
}).export(module);

