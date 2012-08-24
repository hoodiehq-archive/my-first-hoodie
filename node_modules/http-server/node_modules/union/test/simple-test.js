/*
 * simple-test.js: Simple tests for basic streaming and non-streaming HTTP requests with union.
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var assert = require('assert'),
    fs = require('fs'),
    path = require('path'),
    spawn = require('child_process').spawn,
    request = require('request'),
    vows = require('vows'),
    macros = require('./helpers/macros');

var examplesDir = path.join(__dirname, '..', 'examples', 'simple'),
    simpleScript = path.join(examplesDir, 'simple.js'),
    pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')),
    fooURI = 'http://localhost:9090/foo',
    server;

vows.describe('union/simple').addBatch({
  "When using union": {
    "a simple http server": {
      topic: function () {
        server = spawn(process.argv[0], [simpleScript]);
        server.stdout.on('data', this.callback.bind(this, null));
      },
      "a GET request to `/foo`": {
        topic: function () {
          request({ uri: fooURI }, this.callback);
        },
        "it should respond with `hello world`": function (err, res, body) {
          macros.assertValidResponse(err, res);
          assert.equal(body, 'hello world\n');
        },
        "it should respond with 'x-powered-by': 'union <version>'": function (err, res, body) {
          assert.isNull(err);
          assert.equal(res.headers['x-powered-by'], 'union ' + pkg.version);
        }
      },
      "a POST request to `/foo`": {
        topic: function () {
          request.post({ uri: fooURI }, this.callback);
        },
        "it should respond with `wrote to a stream!`": function (err, res, body) {
          macros.assertValidResponse(err, res);
          assert.equal(body, 'wrote to a stream!');
        }
      }
    }
  }
}).addBatch({
  "When the tests are over": {
    "the server should close": function () {
      server.kill();
    }
  }
}).export(module);

