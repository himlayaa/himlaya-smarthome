module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1678340948049, function(require, module, exports) {


var Combine = require('ordered-read-streams');
var unique = require('unique-stream');
var pumpify = require('pumpify');
var isNegatedGlob = require('is-negated-glob');
var extend = require('extend');

var GlobStream = require('./readable');

function globStream(globs, opt) {
  if (!opt) {
    opt = {};
  }

  var ourOpt = extend({}, opt);
  var ignore = ourOpt.ignore;

  ourOpt.cwd = typeof ourOpt.cwd === 'string' ? ourOpt.cwd : process.cwd();
  ourOpt.dot = typeof ourOpt.dot === 'boolean' ? ourOpt.dot : false;
  ourOpt.silent = typeof ourOpt.silent === 'boolean' ? ourOpt.silent : true;
  ourOpt.cwdbase = typeof ourOpt.cwdbase === 'boolean' ? ourOpt.cwdbase : false;
  ourOpt.uniqueBy =  typeof ourOpt.uniqueBy === 'string' ||
                    typeof ourOpt.uniqueBy === 'function' ? ourOpt.uniqueBy : 'path';

  if (ourOpt.cwdbase) {
    ourOpt.base = ourOpt.cwd;
  }
  // Normalize string `ignore` to array
  if (typeof ignore === 'string') {
    ignore = [ignore];
  }
  // Ensure `ignore` is an array
  if (!Array.isArray(ignore)) {
    ignore = [];
  }

  // Only one glob no need to aggregate
  if (!Array.isArray(globs)) {
    globs = [globs];
  }

  var positives = [];
  var negatives = [];

  globs.forEach(sortGlobs);

  function sortGlobs(globString, index) {
    if (typeof globString !== 'string') {
      throw new Error('Invalid glob at index ' + index);
    }

    var glob = isNegatedGlob(globString);
    var globArray = glob.negated ? negatives : positives;

    globArray.push({
      index: index,
      glob: glob.pattern,
    });
  }

  if (positives.length === 0) {
    throw new Error('Missing positive glob');
  }

  // Create all individual streams
  var streams = positives.map(streamFromPositive);

  // Then just pipe them to a single unique stream and return it
  var aggregate = new Combine(streams);
  var uniqueStream = unique(ourOpt.uniqueBy);

  return pumpify.obj(aggregate, uniqueStream);

  function streamFromPositive(positive) {
    var negativeGlobs = negatives
      .filter(indexGreaterThan(positive.index))
      .map(toGlob)
      .concat(ignore);
    return new GlobStream(positive.glob, negativeGlobs, ourOpt);
  }
}

function indexGreaterThan(index) {
  return function(obj) {
    return obj.index > index;
  };
}

function toGlob(obj) {
  return obj.glob;
}

module.exports = globStream;

}, function(modId) {var map = {"./readable":1678340948050}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340948050, function(require, module, exports) {


var inherits = require('util').inherits;

var glob = require('glob');
var extend = require('extend');
var Readable = require('readable-stream').Readable;
var globParent = require('glob-parent');
var toAbsoluteGlob = require('to-absolute-glob');
var removeTrailingSeparator = require('remove-trailing-separator');

var globErrMessage1 = 'File not found with singular glob: ';
var globErrMessage2 = ' (if this was purposeful, use `allowEmpty` option)';

function getBasePath(ourGlob, opt) {
  return globParent(toAbsoluteGlob(ourGlob, opt));
}

function globIsSingular(glob) {
  var globSet = glob.minimatch.set;
  if (globSet.length !== 1) {
    return false;
  }

  return globSet[0].every(function isString(value) {
    return typeof value === 'string';
  });
}

function GlobStream(ourGlob, negatives, opt) {
  if (!(this instanceof GlobStream)) {
    return new GlobStream(ourGlob, negatives, opt);
  }

  var ourOpt = extend({}, opt);

  Readable.call(this, {
    objectMode: true,
    highWaterMark: ourOpt.highWaterMark || 16,
  });

  // Delete `highWaterMark` after inheriting from Readable
  delete ourOpt.highWaterMark;

  var self = this;

  function resolveNegatives(negative) {
    return toAbsoluteGlob(negative, ourOpt);
  }

  var ourNegatives = negatives.map(resolveNegatives);
  ourOpt.ignore = ourNegatives;

  var cwd = ourOpt.cwd;
  var allowEmpty = ourOpt.allowEmpty || false;

  // Extract base path from glob
  var basePath = ourOpt.base || getBasePath(ourGlob, ourOpt);

  // Remove path relativity to make globs make sense
  ourGlob = toAbsoluteGlob(ourGlob, ourOpt);
  // Delete `root` after all resolving done
  delete ourOpt.root;

  var globber = new glob.Glob(ourGlob, ourOpt);
  this._globber = globber;

  var found = false;

  globber.on('match', function(filepath) {
    found = true;
    var obj = {
      cwd: cwd,
      base: basePath,
      path: removeTrailingSeparator(filepath),
    };
    if (!self.push(obj)) {
      globber.pause();
    }
  });

  globber.once('end', function() {
    if (allowEmpty !== true && !found && globIsSingular(globber)) {
      var err = new Error(globErrMessage1 + ourGlob + globErrMessage2);

      return self.destroy(err);
    }

    self.push(null);
  });

  function onError(err) {
    self.destroy(err);
  }

  globber.once('error', onError);
}
inherits(GlobStream, Readable);

GlobStream.prototype._read = function() {
  this._globber.resume();
};

GlobStream.prototype.destroy = function(err) {
  var self = this;

  this._globber.abort();

  process.nextTick(function() {
    if (err) {
      self.emit('error', err);
    }
    self.emit('close');
  });
};

module.exports = GlobStream;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1678340948049);
})()
//miniprogram-npm-outsideDeps=["ordered-read-streams","unique-stream","pumpify","is-negated-glob","extend","util","glob","readable-stream","glob-parent","to-absolute-glob","remove-trailing-separator"]
//# sourceMappingURL=index.js.map