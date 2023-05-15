module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1678340948126, function(require, module, exports) {
var Ajv = require('ajv')
var HARError = require('./error')
var schemas = require('har-schema')

var ajv

function createAjvInstance () {
  var ajv = new Ajv({
    allErrors: true
  })
  ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'))
  ajv.addSchema(schemas)

  return ajv
}

function validate (name, data) {
  data = data || {}

  // validator config
  ajv = ajv || createAjvInstance()

  var validate = ajv.getSchema(name + '.json')

  return new Promise(function (resolve, reject) {
    var valid = validate(data)

    !valid ? reject(new HARError(validate.errors)) : resolve(data)
  })
}

exports.afterRequest = function (data) {
  return validate('afterRequest', data)
}

exports.beforeRequest = function (data) {
  return validate('beforeRequest', data)
}

exports.browser = function (data) {
  return validate('browser', data)
}

exports.cache = function (data) {
  return validate('cache', data)
}

exports.content = function (data) {
  return validate('content', data)
}

exports.cookie = function (data) {
  return validate('cookie', data)
}

exports.creator = function (data) {
  return validate('creator', data)
}

exports.entry = function (data) {
  return validate('entry', data)
}

exports.har = function (data) {
  return validate('har', data)
}

exports.header = function (data) {
  return validate('header', data)
}

exports.log = function (data) {
  return validate('log', data)
}

exports.page = function (data) {
  return validate('page', data)
}

exports.pageTimings = function (data) {
  return validate('pageTimings', data)
}

exports.postData = function (data) {
  return validate('postData', data)
}

exports.query = function (data) {
  return validate('query', data)
}

exports.request = function (data) {
  return validate('request', data)
}

exports.response = function (data) {
  return validate('response', data)
}

exports.timings = function (data) {
  return validate('timings', data)
}

}, function(modId) {var map = {"./error":1678340948127}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340948127, function(require, module, exports) {
function HARError (errors) {
  var message = 'validation failed'

  this.name = 'HARError'
  this.message = message
  this.errors = errors

  if (typeof Error.captureStackTrace === 'function') {
    Error.captureStackTrace(this, this.constructor)
  } else {
    this.stack = (new Error(message)).stack
  }
}

HARError.prototype = Error.prototype

module.exports = HARError

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1678340948126);
})()
//miniprogram-npm-outsideDeps=["ajv","har-schema","ajv/lib/refs/json-schema-draft-06.json"]
//# sourceMappingURL=index.js.map