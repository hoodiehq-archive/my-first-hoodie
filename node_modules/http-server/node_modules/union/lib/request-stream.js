/*
 * http-stream.js: Idomatic buffered stream which pipes additional HTTP information.
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */
 
var url = require('url'),
    util = require('util'),
    qs = require('qs'),
    HttpStream = require('./http-stream');
    
var RequestStream = module.exports = function (options) {
  options = options || {};
  HttpStream.call(this, options);
  
  this.on('pipe', this.pipeRequest);
};

util.inherits(RequestStream, HttpStream);

//
// ### function pipeRequest (source)
// #### @source {ServerRequest|HttpStream} Source stream piping to this instance
// Pipes additional HTTP request metadata from the `source` HTTP stream (either concrete or
// abstract) to this instance. e.g. url, headers, query, etc.
//
// Remark: Is there anything else we wish to pipe?
//
RequestStream.prototype.pipeRequest = function (source) {
  this.url = source.url;
  this.method = source.method;

  if (source.query) {
    this.query = source.query;
  }
  else {
    this.query = ~source.url.indexOf('?')
      ? qs.parse(url.parse(source.url).query)
      : {};
  }
};
