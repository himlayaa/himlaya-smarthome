module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1678340948599, function(require, module, exports) {


module.exports = make
module.exports.ctor = ctor
module.exports.objCtor = objCtor
module.exports.obj = obj

var through2 = require("through2")
var xtend = require("xtend")

function ctor(options, fn) {
  if (typeof options == "function") {
    fn = options
    options = {}
  }

  var Filter = through2.ctor(options, function (chunk, encoding, callback) {
    if (this.options.wantStrings) chunk = chunk.toString()
    try {
      if (fn.call(this, chunk, this._index++)) this.push(chunk)
      return callback()
    } catch (e) {
      return callback(e)
    }
  })
  Filter.prototype._index = 0
  return Filter
}

function objCtor(options, fn) {
  if (typeof options === "function") {
    fn = options
    options = {}
  }
  options = xtend({objectMode: true, highWaterMark: 16}, options)
  return ctor(options, fn)
}

function make(options, fn) {
  return ctor(options, fn)()
}

function obj(options, fn) {
  if (typeof options === "function") {
    fn = options
    options = {}
  }
  options = xtend({objectMode: true, highWaterMark: 16}, options)
  return make(options, fn)
}

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1678340948599);
})()
//miniprogram-npm-outsideDeps=["through2","xtend"]
//# sourceMappingURL=index.js.map