module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1678340948617, function(require, module, exports) {


var filter = require('through2-filter').obj;
var stringify = require("json-stable-stringify-without-jsonify");

var ES6Set;
if (typeof global.Set === 'function') {
  ES6Set = global.Set;
} else {
  ES6Set = function() {
    this.keys = [];
    this.has = function(val) {
      return this.keys.indexOf(val) !== -1;
    },
    this.add = function(val) {
      this.keys.push(val);
    }
  }
}

function prop(propName) {
  return function (data) {
    return data[propName];
  };
}

module.exports = unique;
function unique(propName, keyStore) {
  keyStore = keyStore || new ES6Set();

  var keyfn = stringify;
  if (typeof propName === 'string') {
    keyfn = prop(propName);
  } else if (typeof propName === 'function') {
    keyfn = propName;
  }

  return filter(function (data) {
    var key = keyfn(data);

    if (keyStore.has(key)) {
      return false;
    }

    keyStore.add(key);
    return true;
  });
}

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1678340948617);
})()
//miniprogram-npm-outsideDeps=["through2-filter","json-stable-stringify-without-jsonify"]
//# sourceMappingURL=index.js.map