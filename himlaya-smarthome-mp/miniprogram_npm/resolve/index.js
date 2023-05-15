module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1678340948433, function(require, module, exports) {
var async = require('./lib/async');
async.core = require('./lib/core');
async.isCore = require('./lib/is-core');
async.sync = require('./lib/sync');

module.exports = async;

}, function(modId) {var map = {"./lib/async":1678340948434,"./lib/core":1678340948439,"./lib/is-core":1678340948441,"./lib/sync":1678340948442}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340948434, function(require, module, exports) {
var fs = require('fs');
var getHomedir = require('./homedir');
var path = require('path');
var caller = require('./caller');
var nodeModulesPaths = require('./node-modules-paths');
var normalizeOptions = require('./normalize-options');
var isCore = require('is-core-module');

var realpathFS = process.platform !== 'win32' && fs.realpath && typeof fs.realpath.native === 'function' ? fs.realpath.native : fs.realpath;

var homedir = getHomedir();
var defaultPaths = function () {
    return [
        path.join(homedir, '.node_modules'),
        path.join(homedir, '.node_libraries')
    ];
};

var defaultIsFile = function isFile(file, cb) {
    fs.stat(file, function (err, stat) {
        if (!err) {
            return cb(null, stat.isFile() || stat.isFIFO());
        }
        if (err.code === 'ENOENT' || err.code === 'ENOTDIR') return cb(null, false);
        return cb(err);
    });
};

var defaultIsDir = function isDirectory(dir, cb) {
    fs.stat(dir, function (err, stat) {
        if (!err) {
            return cb(null, stat.isDirectory());
        }
        if (err.code === 'ENOENT' || err.code === 'ENOTDIR') return cb(null, false);
        return cb(err);
    });
};

var defaultRealpath = function realpath(x, cb) {
    realpathFS(x, function (realpathErr, realPath) {
        if (realpathErr && realpathErr.code !== 'ENOENT') cb(realpathErr);
        else cb(null, realpathErr ? x : realPath);
    });
};

var maybeRealpath = function maybeRealpath(realpath, x, opts, cb) {
    if (opts && opts.preserveSymlinks === false) {
        realpath(x, cb);
    } else {
        cb(null, x);
    }
};

var defaultReadPackage = function defaultReadPackage(readFile, pkgfile, cb) {
    readFile(pkgfile, function (readFileErr, body) {
        if (readFileErr) cb(readFileErr);
        else {
            try {
                var pkg = JSON.parse(body);
                cb(null, pkg);
            } catch (jsonErr) {
                cb(null);
            }
        }
    });
};

var getPackageCandidates = function getPackageCandidates(x, start, opts) {
    var dirs = nodeModulesPaths(start, opts, x);
    for (var i = 0; i < dirs.length; i++) {
        dirs[i] = path.join(dirs[i], x);
    }
    return dirs;
};

module.exports = function resolve(x, options, callback) {
    var cb = callback;
    var opts = options;
    if (typeof options === 'function') {
        cb = opts;
        opts = {};
    }
    if (typeof x !== 'string') {
        var err = new TypeError('Path must be a string.');
        return process.nextTick(function () {
            cb(err);
        });
    }

    opts = normalizeOptions(x, opts);

    var isFile = opts.isFile || defaultIsFile;
    var isDirectory = opts.isDirectory || defaultIsDir;
    var readFile = opts.readFile || fs.readFile;
    var realpath = opts.realpath || defaultRealpath;
    var readPackage = opts.readPackage || defaultReadPackage;
    if (opts.readFile && opts.readPackage) {
        var conflictErr = new TypeError('`readFile` and `readPackage` are mutually exclusive.');
        return process.nextTick(function () {
            cb(conflictErr);
        });
    }
    var packageIterator = opts.packageIterator;

    var extensions = opts.extensions || ['.js'];
    var includeCoreModules = opts.includeCoreModules !== false;
    var basedir = opts.basedir || path.dirname(caller());
    var parent = opts.filename || basedir;

    opts.paths = opts.paths || defaultPaths();

    // ensure that `basedir` is an absolute path at this point, resolving against the process' current working directory
    var absoluteStart = path.resolve(basedir);

    maybeRealpath(
        realpath,
        absoluteStart,
        opts,
        function (err, realStart) {
            if (err) cb(err);
            else init(realStart);
        }
    );

    var res;
    function init(basedir) {
        if ((/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/).test(x)) {
            res = path.resolve(basedir, x);
            if (x === '.' || x === '..' || x.slice(-1) === '/') res += '/';
            if ((/\/$/).test(x) && res === basedir) {
                loadAsDirectory(res, opts.package, onfile);
            } else loadAsFile(res, opts.package, onfile);
        } else if (includeCoreModules && isCore(x)) {
            return cb(null, x);
        } else loadNodeModules(x, basedir, function (err, n, pkg) {
            if (err) cb(err);
            else if (n) {
                return maybeRealpath(realpath, n, opts, function (err, realN) {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, realN, pkg);
                    }
                });
            } else {
                var moduleError = new Error("Cannot find module '" + x + "' from '" + parent + "'");
                moduleError.code = 'MODULE_NOT_FOUND';
                cb(moduleError);
            }
        });
    }

    function onfile(err, m, pkg) {
        if (err) cb(err);
        else if (m) cb(null, m, pkg);
        else loadAsDirectory(res, function (err, d, pkg) {
            if (err) cb(err);
            else if (d) {
                maybeRealpath(realpath, d, opts, function (err, realD) {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, realD, pkg);
                    }
                });
            } else {
                var moduleError = new Error("Cannot find module '" + x + "' from '" + parent + "'");
                moduleError.code = 'MODULE_NOT_FOUND';
                cb(moduleError);
            }
        });
    }

    function loadAsFile(x, thePackage, callback) {
        var loadAsFilePackage = thePackage;
        var cb = callback;
        if (typeof loadAsFilePackage === 'function') {
            cb = loadAsFilePackage;
            loadAsFilePackage = undefined;
        }

        var exts = [''].concat(extensions);
        load(exts, x, loadAsFilePackage);

        function load(exts, x, loadPackage) {
            if (exts.length === 0) return cb(null, undefined, loadPackage);
            var file = x + exts[0];

            var pkg = loadPackage;
            if (pkg) onpkg(null, pkg);
            else loadpkg(path.dirname(file), onpkg);

            function onpkg(err, pkg_, dir) {
                pkg = pkg_;
                if (err) return cb(err);
                if (dir && pkg && opts.pathFilter) {
                    var rfile = path.relative(dir, file);
                    var rel = rfile.slice(0, rfile.length - exts[0].length);
                    var r = opts.pathFilter(pkg, x, rel);
                    if (r) return load(
                        [''].concat(extensions.slice()),
                        path.resolve(dir, r),
                        pkg
                    );
                }
                isFile(file, onex);
            }
            function onex(err, ex) {
                if (err) return cb(err);
                if (ex) return cb(null, file, pkg);
                load(exts.slice(1), x, pkg);
            }
        }
    }

    function loadpkg(dir, cb) {
        if (dir === '' || dir === '/') return cb(null);
        if (process.platform === 'win32' && (/^\w:[/\\]*$/).test(dir)) {
            return cb(null);
        }
        if ((/[/\\]node_modules[/\\]*$/).test(dir)) return cb(null);

        maybeRealpath(realpath, dir, opts, function (unwrapErr, pkgdir) {
            if (unwrapErr) return loadpkg(path.dirname(dir), cb);
            var pkgfile = path.join(pkgdir, 'package.json');
            isFile(pkgfile, function (err, ex) {
                // on err, ex is false
                if (!ex) return loadpkg(path.dirname(dir), cb);

                readPackage(readFile, pkgfile, function (err, pkgParam) {
                    if (err) cb(err);

                    var pkg = pkgParam;

                    if (pkg && opts.packageFilter) {
                        pkg = opts.packageFilter(pkg, pkgfile);
                    }
                    cb(null, pkg, dir);
                });
            });
        });
    }

    function loadAsDirectory(x, loadAsDirectoryPackage, callback) {
        var cb = callback;
        var fpkg = loadAsDirectoryPackage;
        if (typeof fpkg === 'function') {
            cb = fpkg;
            fpkg = opts.package;
        }

        maybeRealpath(realpath, x, opts, function (unwrapErr, pkgdir) {
            if (unwrapErr) return cb(unwrapErr);
            var pkgfile = path.join(pkgdir, 'package.json');
            isFile(pkgfile, function (err, ex) {
                if (err) return cb(err);
                if (!ex) return loadAsFile(path.join(x, 'index'), fpkg, cb);

                readPackage(readFile, pkgfile, function (err, pkgParam) {
                    if (err) return cb(err);

                    var pkg = pkgParam;

                    if (pkg && opts.packageFilter) {
                        pkg = opts.packageFilter(pkg, pkgfile);
                    }

                    if (pkg && pkg.main) {
                        if (typeof pkg.main !== 'string') {
                            var mainError = new TypeError('package “' + pkg.name + '” `main` must be a string');
                            mainError.code = 'INVALID_PACKAGE_MAIN';
                            return cb(mainError);
                        }
                        if (pkg.main === '.' || pkg.main === './') {
                            pkg.main = 'index';
                        }
                        loadAsFile(path.resolve(x, pkg.main), pkg, function (err, m, pkg) {
                            if (err) return cb(err);
                            if (m) return cb(null, m, pkg);
                            if (!pkg) return loadAsFile(path.join(x, 'index'), pkg, cb);

                            var dir = path.resolve(x, pkg.main);
                            loadAsDirectory(dir, pkg, function (err, n, pkg) {
                                if (err) return cb(err);
                                if (n) return cb(null, n, pkg);
                                loadAsFile(path.join(x, 'index'), pkg, cb);
                            });
                        });
                        return;
                    }

                    loadAsFile(path.join(x, '/index'), pkg, cb);
                });
            });
        });
    }

    function processDirs(cb, dirs) {
        if (dirs.length === 0) return cb(null, undefined);
        var dir = dirs[0];

        isDirectory(path.dirname(dir), isdir);

        function isdir(err, isdir) {
            if (err) return cb(err);
            if (!isdir) return processDirs(cb, dirs.slice(1));
            loadAsFile(dir, opts.package, onfile);
        }

        function onfile(err, m, pkg) {
            if (err) return cb(err);
            if (m) return cb(null, m, pkg);
            loadAsDirectory(dir, opts.package, ondir);
        }

        function ondir(err, n, pkg) {
            if (err) return cb(err);
            if (n) return cb(null, n, pkg);
            processDirs(cb, dirs.slice(1));
        }
    }
    function loadNodeModules(x, start, cb) {
        var thunk = function () { return getPackageCandidates(x, start, opts); };
        processDirs(
            cb,
            packageIterator ? packageIterator(x, start, thunk, opts) : thunk()
        );
    }
};

}, function(modId) { var map = {"./homedir":1678340948435,"./caller":1678340948436,"./node-modules-paths":1678340948437,"./normalize-options":1678340948438}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340948435, function(require, module, exports) {


var os = require('os');

// adapted from https://github.com/sindresorhus/os-homedir/blob/11e089f4754db38bb535e5a8416320c4446e8cfd/index.js

module.exports = os.homedir || function homedir() {
    var home = process.env.HOME;
    var user = process.env.LOGNAME || process.env.USER || process.env.LNAME || process.env.USERNAME;

    if (process.platform === 'win32') {
        return process.env.USERPROFILE || process.env.HOMEDRIVE + process.env.HOMEPATH || home || null;
    }

    if (process.platform === 'darwin') {
        return home || (user ? '/Users/' + user : null);
    }

    if (process.platform === 'linux') {
        return home || (process.getuid() === 0 ? '/root' : (user ? '/home/' + user : null)); // eslint-disable-line no-extra-parens
    }

    return home || null;
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340948436, function(require, module, exports) {
module.exports = function () {
    // see https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
    var origPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) { return stack; };
    var stack = (new Error()).stack;
    Error.prepareStackTrace = origPrepareStackTrace;
    return stack[2].getFileName();
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340948437, function(require, module, exports) {
var path = require('path');
var parse = path.parse || require('path-parse'); // eslint-disable-line global-require

var getNodeModulesDirs = function getNodeModulesDirs(absoluteStart, modules) {
    var prefix = '/';
    if ((/^([A-Za-z]:)/).test(absoluteStart)) {
        prefix = '';
    } else if ((/^\\\\/).test(absoluteStart)) {
        prefix = '\\\\';
    }

    var paths = [absoluteStart];
    var parsed = parse(absoluteStart);
    while (parsed.dir !== paths[paths.length - 1]) {
        paths.push(parsed.dir);
        parsed = parse(parsed.dir);
    }

    return paths.reduce(function (dirs, aPath) {
        return dirs.concat(modules.map(function (moduleDir) {
            return path.resolve(prefix, aPath, moduleDir);
        }));
    }, []);
};

module.exports = function nodeModulesPaths(start, opts, request) {
    var modules = opts && opts.moduleDirectory
        ? [].concat(opts.moduleDirectory)
        : ['node_modules'];

    if (opts && typeof opts.paths === 'function') {
        return opts.paths(
            request,
            start,
            function () { return getNodeModulesDirs(start, modules); },
            opts
        );
    }

    var dirs = getNodeModulesDirs(start, modules);
    return opts && opts.paths ? dirs.concat(opts.paths) : dirs;
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340948438, function(require, module, exports) {
module.exports = function (x, opts) {
    /**
     * This file is purposefully a passthrough. It's expected that third-party
     * environments will override it at runtime in order to inject special logic
     * into `resolve` (by manipulating the options). One such example is the PnP
     * code path in Yarn.
     */

    return opts || {};
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340948439, function(require, module, exports) {
var current = (process.versions && process.versions.node && process.versions.node.split('.')) || [];

function specifierIncluded(specifier) {
    var parts = specifier.split(' ');
    var op = parts.length > 1 ? parts[0] : '=';
    var versionParts = (parts.length > 1 ? parts[1] : parts[0]).split('.');

    for (var i = 0; i < 3; ++i) {
        var cur = parseInt(current[i] || 0, 10);
        var ver = parseInt(versionParts[i] || 0, 10);
        if (cur === ver) {
            continue; // eslint-disable-line no-restricted-syntax, no-continue
        }
        if (op === '<') {
            return cur < ver;
        } else if (op === '>=') {
            return cur >= ver;
        }
        return false;
    }
    return op === '>=';
}

function matchesRange(range) {
    var specifiers = range.split(/ ?&& ?/);
    if (specifiers.length === 0) { return false; }
    for (var i = 0; i < specifiers.length; ++i) {
        if (!specifierIncluded(specifiers[i])) { return false; }
    }
    return true;
}

function versionIncluded(specifierValue) {
    if (typeof specifierValue === 'boolean') { return specifierValue; }
    if (specifierValue && typeof specifierValue === 'object') {
        for (var i = 0; i < specifierValue.length; ++i) {
            if (matchesRange(specifierValue[i])) { return true; }
        }
        return false;
    }
    return matchesRange(specifierValue);
}

var data = require('./core.json');

var core = {};
for (var mod in data) { // eslint-disable-line no-restricted-syntax
    if (Object.prototype.hasOwnProperty.call(data, mod)) {
        core[mod] = versionIncluded(data[mod]);
    }
}
module.exports = core;

}, function(modId) { var map = {"./core.json":1678340948440}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340948440, function(require, module, exports) {
module.exports = {
	"assert": true,
	"node:assert": [">= 14.18 && < 15", ">= 16"],
	"assert/strict": ">= 15",
	"node:assert/strict": ">= 16",
	"async_hooks": ">= 8",
	"node:async_hooks": [">= 14.18 && < 15", ">= 16"],
	"buffer_ieee754": ">= 0.5 && < 0.9.7",
	"buffer": true,
	"node:buffer": [">= 14.18 && < 15", ">= 16"],
	"child_process": true,
	"node:child_process": [">= 14.18 && < 15", ">= 16"],
	"cluster": ">= 0.5",
	"node:cluster": [">= 14.18 && < 15", ">= 16"],
	"console": true,
	"node:console": [">= 14.18 && < 15", ">= 16"],
	"constants": true,
	"node:constants": [">= 14.18 && < 15", ">= 16"],
	"crypto": true,
	"node:crypto": [">= 14.18 && < 15", ">= 16"],
	"_debug_agent": ">= 1 && < 8",
	"_debugger": "< 8",
	"dgram": true,
	"node:dgram": [">= 14.18 && < 15", ">= 16"],
	"diagnostics_channel": [">= 14.17 && < 15", ">= 15.1"],
	"node:diagnostics_channel": [">= 14.18 && < 15", ">= 16"],
	"dns": true,
	"node:dns": [">= 14.18 && < 15", ">= 16"],
	"dns/promises": ">= 15",
	"node:dns/promises": ">= 16",
	"domain": ">= 0.7.12",
	"node:domain": [">= 14.18 && < 15", ">= 16"],
	"events": true,
	"node:events": [">= 14.18 && < 15", ">= 16"],
	"freelist": "< 6",
	"fs": true,
	"node:fs": [">= 14.18 && < 15", ">= 16"],
	"fs/promises": [">= 10 && < 10.1", ">= 14"],
	"node:fs/promises": [">= 14.18 && < 15", ">= 16"],
	"_http_agent": ">= 0.11.1",
	"node:_http_agent": [">= 14.18 && < 15", ">= 16"],
	"_http_client": ">= 0.11.1",
	"node:_http_client": [">= 14.18 && < 15", ">= 16"],
	"_http_common": ">= 0.11.1",
	"node:_http_common": [">= 14.18 && < 15", ">= 16"],
	"_http_incoming": ">= 0.11.1",
	"node:_http_incoming": [">= 14.18 && < 15", ">= 16"],
	"_http_outgoing": ">= 0.11.1",
	"node:_http_outgoing": [">= 14.18 && < 15", ">= 16"],
	"_http_server": ">= 0.11.1",
	"node:_http_server": [">= 14.18 && < 15", ">= 16"],
	"http": true,
	"node:http": [">= 14.18 && < 15", ">= 16"],
	"http2": ">= 8.8",
	"node:http2": [">= 14.18 && < 15", ">= 16"],
	"https": true,
	"node:https": [">= 14.18 && < 15", ">= 16"],
	"inspector": ">= 8",
	"node:inspector": [">= 14.18 && < 15", ">= 16"],
	"_linklist": "< 8",
	"module": true,
	"node:module": [">= 14.18 && < 15", ">= 16"],
	"net": true,
	"node:net": [">= 14.18 && < 15", ">= 16"],
	"node-inspect/lib/_inspect": ">= 7.6 && < 12",
	"node-inspect/lib/internal/inspect_client": ">= 7.6 && < 12",
	"node-inspect/lib/internal/inspect_repl": ">= 7.6 && < 12",
	"os": true,
	"node:os": [">= 14.18 && < 15", ">= 16"],
	"path": true,
	"node:path": [">= 14.18 && < 15", ">= 16"],
	"path/posix": ">= 15.3",
	"node:path/posix": ">= 16",
	"path/win32": ">= 15.3",
	"node:path/win32": ">= 16",
	"perf_hooks": ">= 8.5",
	"node:perf_hooks": [">= 14.18 && < 15", ">= 16"],
	"process": ">= 1",
	"node:process": [">= 14.18 && < 15", ">= 16"],
	"punycode": ">= 0.5",
	"node:punycode": [">= 14.18 && < 15", ">= 16"],
	"querystring": true,
	"node:querystring": [">= 14.18 && < 15", ">= 16"],
	"readline": true,
	"node:readline": [">= 14.18 && < 15", ">= 16"],
	"readline/promises": ">= 17",
	"node:readline/promises": ">= 17",
	"repl": true,
	"node:repl": [">= 14.18 && < 15", ">= 16"],
	"smalloc": ">= 0.11.5 && < 3",
	"_stream_duplex": ">= 0.9.4",
	"node:_stream_duplex": [">= 14.18 && < 15", ">= 16"],
	"_stream_transform": ">= 0.9.4",
	"node:_stream_transform": [">= 14.18 && < 15", ">= 16"],
	"_stream_wrap": ">= 1.4.1",
	"node:_stream_wrap": [">= 14.18 && < 15", ">= 16"],
	"_stream_passthrough": ">= 0.9.4",
	"node:_stream_passthrough": [">= 14.18 && < 15", ">= 16"],
	"_stream_readable": ">= 0.9.4",
	"node:_stream_readable": [">= 14.18 && < 15", ">= 16"],
	"_stream_writable": ">= 0.9.4",
	"node:_stream_writable": [">= 14.18 && < 15", ">= 16"],
	"stream": true,
	"node:stream": [">= 14.18 && < 15", ">= 16"],
	"stream/consumers": ">= 16.7",
	"node:stream/consumers": ">= 16.7",
	"stream/promises": ">= 15",
	"node:stream/promises": ">= 16",
	"stream/web": ">= 16.5",
	"node:stream/web": ">= 16.5",
	"string_decoder": true,
	"node:string_decoder": [">= 14.18 && < 15", ">= 16"],
	"sys": [">= 0.4 && < 0.7", ">= 0.8"],
	"node:sys": [">= 14.18 && < 15", ">= 16"],
	"node:test": ">= 18",
	"timers": true,
	"node:timers": [">= 14.18 && < 15", ">= 16"],
	"timers/promises": ">= 15",
	"node:timers/promises": ">= 16",
	"_tls_common": ">= 0.11.13",
	"node:_tls_common": [">= 14.18 && < 15", ">= 16"],
	"_tls_legacy": ">= 0.11.3 && < 10",
	"_tls_wrap": ">= 0.11.3",
	"node:_tls_wrap": [">= 14.18 && < 15", ">= 16"],
	"tls": true,
	"node:tls": [">= 14.18 && < 15", ">= 16"],
	"trace_events": ">= 10",
	"node:trace_events": [">= 14.18 && < 15", ">= 16"],
	"tty": true,
	"node:tty": [">= 14.18 && < 15", ">= 16"],
	"url": true,
	"node:url": [">= 14.18 && < 15", ">= 16"],
	"util": true,
	"node:util": [">= 14.18 && < 15", ">= 16"],
	"util/types": ">= 15.3",
	"node:util/types": ">= 16",
	"v8/tools/arguments": ">= 10 && < 12",
	"v8/tools/codemap": [">= 4.4 && < 5", ">= 5.2 && < 12"],
	"v8/tools/consarray": [">= 4.4 && < 5", ">= 5.2 && < 12"],
	"v8/tools/csvparser": [">= 4.4 && < 5", ">= 5.2 && < 12"],
	"v8/tools/logreader": [">= 4.4 && < 5", ">= 5.2 && < 12"],
	"v8/tools/profile_view": [">= 4.4 && < 5", ">= 5.2 && < 12"],
	"v8/tools/splaytree": [">= 4.4 && < 5", ">= 5.2 && < 12"],
	"v8": ">= 1",
	"node:v8": [">= 14.18 && < 15", ">= 16"],
	"vm": true,
	"node:vm": [">= 14.18 && < 15", ">= 16"],
	"wasi": ">= 13.4 && < 13.5",
	"worker_threads": ">= 11.7",
	"node:worker_threads": [">= 14.18 && < 15", ">= 16"],
	"zlib": ">= 0.5",
	"node:zlib": [">= 14.18 && < 15", ">= 16"]
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340948441, function(require, module, exports) {
var isCoreModule = require('is-core-module');

module.exports = function isCore(x) {
    return isCoreModule(x);
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340948442, function(require, module, exports) {
var isCore = require('is-core-module');
var fs = require('fs');
var path = require('path');
var getHomedir = require('./homedir');
var caller = require('./caller');
var nodeModulesPaths = require('./node-modules-paths');
var normalizeOptions = require('./normalize-options');

var realpathFS = process.platform !== 'win32' && fs.realpathSync && typeof fs.realpathSync.native === 'function' ? fs.realpathSync.native : fs.realpathSync;

var homedir = getHomedir();
var defaultPaths = function () {
    return [
        path.join(homedir, '.node_modules'),
        path.join(homedir, '.node_libraries')
    ];
};

var defaultIsFile = function isFile(file) {
    try {
        var stat = fs.statSync(file, { throwIfNoEntry: false });
    } catch (e) {
        if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) return false;
        throw e;
    }
    return !!stat && (stat.isFile() || stat.isFIFO());
};

var defaultIsDir = function isDirectory(dir) {
    try {
        var stat = fs.statSync(dir, { throwIfNoEntry: false });
    } catch (e) {
        if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) return false;
        throw e;
    }
    return !!stat && stat.isDirectory();
};

var defaultRealpathSync = function realpathSync(x) {
    try {
        return realpathFS(x);
    } catch (realpathErr) {
        if (realpathErr.code !== 'ENOENT') {
            throw realpathErr;
        }
    }
    return x;
};

var maybeRealpathSync = function maybeRealpathSync(realpathSync, x, opts) {
    if (opts && opts.preserveSymlinks === false) {
        return realpathSync(x);
    }
    return x;
};

var defaultReadPackageSync = function defaultReadPackageSync(readFileSync, pkgfile) {
    var body = readFileSync(pkgfile);
    try {
        var pkg = JSON.parse(body);
        return pkg;
    } catch (jsonErr) {}
};

var getPackageCandidates = function getPackageCandidates(x, start, opts) {
    var dirs = nodeModulesPaths(start, opts, x);
    for (var i = 0; i < dirs.length; i++) {
        dirs[i] = path.join(dirs[i], x);
    }
    return dirs;
};

module.exports = function resolveSync(x, options) {
    if (typeof x !== 'string') {
        throw new TypeError('Path must be a string.');
    }
    var opts = normalizeOptions(x, options);

    var isFile = opts.isFile || defaultIsFile;
    var readFileSync = opts.readFileSync || fs.readFileSync;
    var isDirectory = opts.isDirectory || defaultIsDir;
    var realpathSync = opts.realpathSync || defaultRealpathSync;
    var readPackageSync = opts.readPackageSync || defaultReadPackageSync;
    if (opts.readFileSync && opts.readPackageSync) {
        throw new TypeError('`readFileSync` and `readPackageSync` are mutually exclusive.');
    }
    var packageIterator = opts.packageIterator;

    var extensions = opts.extensions || ['.js'];
    var includeCoreModules = opts.includeCoreModules !== false;
    var basedir = opts.basedir || path.dirname(caller());
    var parent = opts.filename || basedir;

    opts.paths = opts.paths || defaultPaths();

    // ensure that `basedir` is an absolute path at this point, resolving against the process' current working directory
    var absoluteStart = maybeRealpathSync(realpathSync, path.resolve(basedir), opts);

    if ((/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/).test(x)) {
        var res = path.resolve(absoluteStart, x);
        if (x === '.' || x === '..' || x.slice(-1) === '/') res += '/';
        var m = loadAsFileSync(res) || loadAsDirectorySync(res);
        if (m) return maybeRealpathSync(realpathSync, m, opts);
    } else if (includeCoreModules && isCore(x)) {
        return x;
    } else {
        var n = loadNodeModulesSync(x, absoluteStart);
        if (n) return maybeRealpathSync(realpathSync, n, opts);
    }

    var err = new Error("Cannot find module '" + x + "' from '" + parent + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;

    function loadAsFileSync(x) {
        var pkg = loadpkg(path.dirname(x));

        if (pkg && pkg.dir && pkg.pkg && opts.pathFilter) {
            var rfile = path.relative(pkg.dir, x);
            var r = opts.pathFilter(pkg.pkg, x, rfile);
            if (r) {
                x = path.resolve(pkg.dir, r); // eslint-disable-line no-param-reassign
            }
        }

        if (isFile(x)) {
            return x;
        }

        for (var i = 0; i < extensions.length; i++) {
            var file = x + extensions[i];
            if (isFile(file)) {
                return file;
            }
        }
    }

    function loadpkg(dir) {
        if (dir === '' || dir === '/') return;
        if (process.platform === 'win32' && (/^\w:[/\\]*$/).test(dir)) {
            return;
        }
        if ((/[/\\]node_modules[/\\]*$/).test(dir)) return;

        var pkgfile = path.join(maybeRealpathSync(realpathSync, dir, opts), 'package.json');

        if (!isFile(pkgfile)) {
            return loadpkg(path.dirname(dir));
        }

        var pkg = readPackageSync(readFileSync, pkgfile);

        if (pkg && opts.packageFilter) {
            // v2 will pass pkgfile
            pkg = opts.packageFilter(pkg, /*pkgfile,*/ dir); // eslint-disable-line spaced-comment
        }

        return { pkg: pkg, dir: dir };
    }

    function loadAsDirectorySync(x) {
        var pkgfile = path.join(maybeRealpathSync(realpathSync, x, opts), '/package.json');
        if (isFile(pkgfile)) {
            try {
                var pkg = readPackageSync(readFileSync, pkgfile);
            } catch (e) {}

            if (pkg && opts.packageFilter) {
                // v2 will pass pkgfile
                pkg = opts.packageFilter(pkg, /*pkgfile,*/ x); // eslint-disable-line spaced-comment
            }

            if (pkg && pkg.main) {
                if (typeof pkg.main !== 'string') {
                    var mainError = new TypeError('package “' + pkg.name + '” `main` must be a string');
                    mainError.code = 'INVALID_PACKAGE_MAIN';
                    throw mainError;
                }
                if (pkg.main === '.' || pkg.main === './') {
                    pkg.main = 'index';
                }
                try {
                    var m = loadAsFileSync(path.resolve(x, pkg.main));
                    if (m) return m;
                    var n = loadAsDirectorySync(path.resolve(x, pkg.main));
                    if (n) return n;
                } catch (e) {}
            }
        }

        return loadAsFileSync(path.join(x, '/index'));
    }

    function loadNodeModulesSync(x, start) {
        var thunk = function () { return getPackageCandidates(x, start, opts); };
        var dirs = packageIterator ? packageIterator(x, start, thunk, opts) : thunk();

        for (var i = 0; i < dirs.length; i++) {
            var dir = dirs[i];
            if (isDirectory(path.dirname(dir))) {
                var m = loadAsFileSync(dir);
                if (m) return m;
                var n = loadAsDirectorySync(dir);
                if (n) return n;
            }
        }
    }
};

}, function(modId) { var map = {"./homedir":1678340948435,"./caller":1678340948436,"./node-modules-paths":1678340948437,"./normalize-options":1678340948438}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1678340948433);
})()
//miniprogram-npm-outsideDeps=["fs","path","is-core-module","os","path-parse"]
//# sourceMappingURL=index.js.map