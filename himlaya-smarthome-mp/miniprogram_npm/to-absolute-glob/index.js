module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1678340948601, function(require, module, exports) {


var path = require('path');
var isNegated = require('is-negated-glob');
var isAbsolute = require('is-absolute');

module.exports = function(glob, options) {
  // default options
  var opts = options || {};

  // ensure cwd is absolute
  var cwd = path.resolve(opts.cwd ? opts.cwd : process.cwd());
  cwd = unixify(cwd);

  var rootDir = opts.root;
  // if `options.root` is defined, ensure it's absolute
  if (rootDir) {
    rootDir = unixify(rootDir);
    if (process.platform === 'win32' || !isAbsolute(rootDir)) {
      rootDir = unixify(path.resolve(rootDir));
    }
  }

  // trim starting ./ from glob patterns
  if (glob.slice(0, 2) === './') {
    glob = glob.slice(2);
  }

  // when the glob pattern is only a . use an empty string
  if (glob.length === 1 && glob === '.') {
    glob = '';
  }

  // store last character before glob is modified
  var suffix = glob.slice(-1);

  // check to see if glob is negated (and not a leading negated-extglob)
  var ing = isNegated(glob);
  glob = ing.pattern;

  // make glob absolute
  if (rootDir && glob.charAt(0) === '/') {
    glob = join(rootDir, glob);
  } else if (!isAbsolute(glob) || glob.slice(0, 1) === '\\') {
    glob = join(cwd, glob);
  }

  // if glob had a trailing `/`, re-add it now in case it was removed
  if (suffix === '/' && glob.slice(-1) !== '/') {
    glob += '/';
  }

  // re-add leading `!` if it was removed
  return ing.negated ? '!' + glob : glob;
};

function unixify(filepath) {
  return filepath.replace(/\\/g, '/');
}

function join(dir, glob) {
  if (dir.charAt(dir.length - 1) === '/') {
    dir = dir.slice(0, -1);
  }
  if (glob.charAt(0) === '/') {
    glob = glob.slice(1);
  }
  if (!glob) return dir;
  return dir + '/' + glob;
}

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1678340948601);
})()
//miniprogram-npm-outsideDeps=["path","is-negated-glob","is-absolute"]
//# sourceMappingURL=index.js.map