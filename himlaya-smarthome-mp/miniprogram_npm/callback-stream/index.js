module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1678340947594, function(require, module, exports) {


var Writable = require('readable-stream').Writable
var inherits = require('inherits')

function CallbackStream (options, callback) {
  if (!(this instanceof CallbackStream)) {
    return new CallbackStream(options, callback)
  }

  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  Writable.call(this, options)

  this.results = []
  this.callback = callback

  this.on('finish', deliversCallback)
  this.once('pipe', handlePipe)
}

function deliversCallback () {
  this.callback(null, this.results)
}

function handlePipe (source) {
  source.on('error', this.callback)
}

inherits(CallbackStream, Writable)

CallbackStream.prototype._write = function (data, encoding, done) {
  this.results.push(data)
  done()
}

CallbackStream.obj = function (options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  options.objectMode = true

  return new CallbackStream(options, callback)
}

module.exports = CallbackStream

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1678340947594);
})()
//miniprogram-npm-outsideDeps=["readable-stream","inherits"]
//# sourceMappingURL=index.js.map