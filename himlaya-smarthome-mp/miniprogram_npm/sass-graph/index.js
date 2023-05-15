module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1678340948475, function(require, module, exports) {


var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var glob = require('glob');
var parseImports = require('./parse-imports');

// resolve a sass module to a path
function resolveSassPath(sassPath, loadPaths, extensions) {
  // trim sass file extensions
  var re = new RegExp('(\.('+extensions.join('|')+'))$', 'i');
  var sassPathName = sassPath.replace(re, '');
  // check all load paths
  var i, j, length = loadPaths.length, scssPath, partialPath;
  for (i = 0; i < length; i++) {
    for (j = 0; j < extensions.length; j++) {
      scssPath = path.normalize(loadPaths[i] + '/' + sassPathName + '.' + extensions[j]);
      try {
        if (fs.lstatSync(scssPath).isFile()) {
          return scssPath;
        }
      } catch (e) {}
    }

    // special case for _partials
    for (j = 0; j < extensions.length; j++) {
      scssPath = path.normalize(loadPaths[i] + '/' + sassPathName + '.' + extensions[j]);
      partialPath = path.join(path.dirname(scssPath), '_' + path.basename(scssPath));
      try {
        if (fs.lstatSync(partialPath).isFile()) {
          return partialPath;
        }
      } catch (e) {}
    }
  }

  // File to import not found or unreadable so we assume this is a custom import
  return false;
}

function Graph(options, dir) {
  this.dir = dir;
  this.extensions = options.extensions || [];
  this.index = {};
  this.follow = options.follow || false;
  this.loadPaths = _(options.loadPaths).map(function(p) {
    return path.resolve(p);
  }).value();

  if (dir) {
    var graph = this;
    _.each(glob.sync(dir+'/**/*.@('+this.extensions.join('|')+')', { dot: true, nodir: true, follow: this.follow }), function(file) {
      graph.addFile(path.resolve(file));
    });
  }
}

// add a sass file to the graph
Graph.prototype.addFile = function(filepath, parent) {
  var entry = this.index[filepath] = this.index[filepath] || {
    imports: [],
    importedBy: [],
    modified: fs.statSync(filepath).mtime
  };

  var resolvedParent;
  var isIndentedSyntax = path.extname(filepath) === '.sass';
  var imports = parseImports(fs.readFileSync(filepath, 'utf-8'), isIndentedSyntax);
  var cwd = path.dirname(filepath);

  var i, length = imports.length, loadPaths, resolved;
  for (i = 0; i < length; i++) {
    loadPaths = _([cwd, this.dir]).concat(this.loadPaths).filter().uniq().value();
    resolved = resolveSassPath(imports[i], loadPaths, this.extensions);
    if (!resolved) continue;

    // recurse into dependencies if not already enumerated
    if (!_.includes(entry.imports, resolved)) {
      entry.imports.push(resolved);
      this.addFile(fs.realpathSync(resolved), filepath);
    }
  }

  // add link back to parent
  if (parent) {
    resolvedParent = _(parent).intersection(this.loadPaths).value();

    if (resolvedParent) {
      resolvedParent = parent.substr(parent.indexOf(resolvedParent));
    } else {
      resolvedParent = parent;
    }

    entry.importedBy.push(resolvedParent);
  }
};

// visits all files that are ancestors of the provided file
Graph.prototype.visitAncestors = function(filepath, callback) {
  this.visit(filepath, callback, function(err, node) {
    if (err || !node) return [];
    return node.importedBy;
  });
};

// visits all files that are descendents of the provided file
Graph.prototype.visitDescendents = function(filepath, callback) {
  this.visit(filepath, callback, function(err, node) {
    if (err || !node) return [];
    return node.imports;
  });
};

// a generic visitor that uses an edgeCallback to find the edges to traverse for a node
Graph.prototype.visit = function(filepath, callback, edgeCallback, visited) {
  filepath = fs.realpathSync(filepath);
  var visited = visited || [];
  if (!this.index.hasOwnProperty(filepath)) {
    edgeCallback('Graph doesn\'t contain ' + filepath, null);
  }
  var edges = edgeCallback(null, this.index[filepath]);

  var i, length = edges.length;
  for (i = 0; i < length; i++) {
    if (!_.includes(visited, edges[i])) {
      visited.push(edges[i]);
      callback(edges[i], this.index[edges[i]]);
      this.visit(edges[i], callback, edgeCallback, visited);
    }
  }
};

function processOptions(options) {
  return _.assign({
    loadPaths: [process.cwd()],
    extensions: ['scss', 'css', 'sass'],
  }, options);
}

module.exports.parseFile = function(filepath, options) {
  if (fs.lstatSync(filepath).isFile()) {
    filepath = path.resolve(filepath);
    options = processOptions(options);
    var graph = new Graph(options);
    graph.addFile(filepath);
    return graph;
  }
  // throws
};

module.exports.parseDir = function(dirpath, options) {
  if (fs.lstatSync(dirpath).isDirectory()) {
    dirpath = path.resolve(dirpath);
    options = processOptions(options);
    var graph = new Graph(options, dirpath);
    return graph;
  }
  // throws
};

}, function(modId) {var map = {"./parse-imports":1678340948476}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340948476, function(require, module, exports) {
var tokenizer = require('scss-tokenizer');

function parseImports(content, isIndentedSyntax) {
  var tokens = tokenizer.tokenize(content);
  var results = [];
  var tmp = '';
  var inImport = false;
  var inParen = false;
  var prevToken = tokens[0];

  var i, token;
  for (i = 1; i < tokens.length; i++) {
    token = tokens[i];

    if (inImport && !inParen && token[0] === 'string') {
      results.push(token[1]);
    }
    else if (token[1] === 'import' && prevToken[1] === '@') {
      if (inImport && !isIndentedSyntax) {
        throw new Error('Encountered invalid @import syntax.');
      }

      inImport = true;
    }
    else if (inImport && !inParen && (token[0] === 'ident' || token[0] === '/')) {
      tmp += token[1];
    }
    else if (inImport && !inParen && (token[0] === 'space' || token[0] === 'newline')) {
      if (tmp !== '') {
        results.push(tmp);
        tmp = '';

        if (isIndentedSyntax) {
          inImport = false;
        }
      }
    }
    else if (inImport && token[0] === ';') {
      inImport = false;

      if (tmp !== '') {
        results.push(tmp);
        tmp = '';
      }
    }
    else if (inImport && token[0] === '(') {
      inParen = true;
      tmp = '';
    }
    else if (inParen && token[0] === ')') {
      inParen = false;
    }

    prevToken = token;
  }

  if (tmp !== '') {
    results.push(tmp);
  }

  return results;
}

module.exports = parseImports;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1678340948475);
})()
//miniprogram-npm-outsideDeps=["fs","path","lodash","glob","scss-tokenizer"]
//# sourceMappingURL=index.js.map