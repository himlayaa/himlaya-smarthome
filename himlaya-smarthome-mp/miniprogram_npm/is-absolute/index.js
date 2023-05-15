module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1678340948145, function(require, module, exports) {


var isRelative = require('is-relative');
var isWindows = require('is-windows');

/**
 * Expose `isAbsolute`
 */

module.exports = isAbsolute;

/**
 * Returns true if a file path is absolute.
 *
 * @param  {String} `fp`
 * @return {Boolean}
 */

function isAbsolute(fp) {
  if (typeof fp !== 'string') {
    throw new TypeError('isAbsolute expects a string.');
  }
  return isWindows() ? isAbsolute.win32(fp) : isAbsolute.posix(fp);
}

/**
 * Test posix paths.
 */

isAbsolute.posix = function posixPath(fp) {
  return fp.charAt(0) === '/';
};

/**
 * Test windows paths.
 */

isAbsolute.win32 = function win32(fp) {
  if (/[a-z]/i.test(fp.charAt(0)) && fp.charAt(1) === ':' && fp.charAt(2) === '\\') {
    return true;
  }
  // Microsoft Azure absolute filepath
  if (fp.slice(0, 2) === '\\\\') {
    return true;
  }
  return !isRelative(fp);
};

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1678340948145);
})()
//miniprogram-npm-outsideDeps=["is-relative","is-windows"]
//# sourceMappingURL=index.js.map