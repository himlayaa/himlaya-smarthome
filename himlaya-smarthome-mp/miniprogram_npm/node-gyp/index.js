module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1678340948361, function(require, module, exports) {


const path = require('path')
const nopt = require('nopt')
const log = require('npmlog')
const childProcess = require('child_process')
const EE = require('events').EventEmitter
const inherits = require('util').inherits
const commands = [
  // Module build commands
  'build',
  'clean',
  'configure',
  'rebuild',
  // Development Header File management commands
  'install',
  'list',
  'remove'
]
const aliases = {
  ls: 'list',
  rm: 'remove'
}

// differentiate node-gyp's logs from npm's
log.heading = 'gyp'

function gyp () {
  return new Gyp()
}

function Gyp () {
  var self = this

  this.devDir = ''
  this.commands = {}

  commands.forEach(function (command) {
    self.commands[command] = function (argv, callback) {
      log.verbose('command', command, argv)
      return require('./' + command)(self, argv, callback)
    }
  })
}
inherits(Gyp, EE)
exports.Gyp = Gyp
var proto = Gyp.prototype

/**
 * Export the contents of the package.json.
 */

proto.package = require('../package.json')

/**
 * nopt configuration definitions
 */

proto.configDefs = {
  help: Boolean, // everywhere
  arch: String, // 'configure'
  cafile: String, // 'install'
  debug: Boolean, // 'build'
  directory: String, // bin
  make: String, // 'build'
  msvs_version: String, // 'configure'
  ensure: Boolean, // 'install'
  solution: String, // 'build' (windows only)
  proxy: String, // 'install'
  noproxy: String, // 'install'
  devdir: String, // everywhere
  nodedir: String, // 'configure'
  loglevel: String, // everywhere
  python: String, // 'configure'
  'dist-url': String, // 'install'
  tarball: String, // 'install'
  jobs: String, // 'build'
  thin: String // 'configure'
}

/**
 * nopt shorthands
 */

proto.shorthands = {
  release: '--no-debug',
  C: '--directory',
  debug: '--debug',
  j: '--jobs',
  silly: '--loglevel=silly',
  verbose: '--loglevel=verbose',
  silent: '--loglevel=silent'
}

/**
 * expose the command aliases for the bin file to use.
 */

proto.aliases = aliases

/**
 * Parses the given argv array and sets the 'opts',
 * 'argv' and 'command' properties.
 */

proto.parseArgv = function parseOpts (argv) {
  this.opts = nopt(this.configDefs, this.shorthands, argv)
  this.argv = this.opts.argv.remain.slice()

  var commands = this.todo = []

  // create a copy of the argv array with aliases mapped
  argv = this.argv.map(function (arg) {
    // is this an alias?
    if (arg in this.aliases) {
      arg = this.aliases[arg]
    }
    return arg
  }, this)

  // process the mapped args into "command" objects ("name" and "args" props)
  argv.slice().forEach(function (arg) {
    if (arg in this.commands) {
      var args = argv.splice(0, argv.indexOf(arg))
      argv.shift()
      if (commands.length > 0) {
        commands[commands.length - 1].args = args
      }
      commands.push({ name: arg, args: [] })
    }
  }, this)
  if (commands.length > 0) {
    commands[commands.length - 1].args = argv.splice(0)
  }

  // support for inheriting config env variables from npm
  var npmConfigPrefix = 'npm_config_'
  Object.keys(process.env).forEach(function (name) {
    if (name.indexOf(npmConfigPrefix) !== 0) {
      return
    }
    var val = process.env[name]
    if (name === npmConfigPrefix + 'loglevel') {
      log.level = val
    } else {
      // add the user-defined options to the config
      name = name.substring(npmConfigPrefix.length)
      // gyp@741b7f1 enters an infinite loop when it encounters
      // zero-length options so ensure those don't get through.
      if (name) {
        this.opts[name] = val
      }
    }
  }, this)

  if (this.opts.loglevel) {
    log.level = this.opts.loglevel
  }
  log.resume()
}

/**
 * Spawns a child process and emits a 'spawn' event.
 */

proto.spawn = function spawn (command, args, opts) {
  if (!opts) {
    opts = {}
  }
  if (!opts.silent && !opts.stdio) {
    opts.stdio = [0, 1, 2]
  }
  var cp = childProcess.spawn(command, args, opts)
  log.info('spawn', command)
  log.info('spawn args', args)
  return cp
}

/**
 * Returns the usage instructions for node-gyp.
 */

proto.usage = function usage () {
  var str = [
    '',
    '  Usage: node-gyp <command> [options]',
    '',
    '  where <command> is one of:',
    commands.map(function (c) {
      return '    - ' + c + ' - ' + require('./' + c).usage
    }).join('\n'),
    '',
    'node-gyp@' + this.version + '  ' + path.resolve(__dirname, '..'),
    'node@' + process.versions.node
  ].join('\n')
  return str
}

/**
 * Version number getter.
 */

Object.defineProperty(proto, 'version', {
  get: function () {
    return this.package.version
  },
  enumerable: true
})

module.exports = exports = gyp

}, function(modId) {var map = {"util":1678340948362,"../package.json":1678340948363}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340948362, function(require, module, exports) {


const log = require('npmlog')
const execFile = require('child_process').execFile
const path = require('path')

function logWithPrefix (log, prefix) {
  function setPrefix (logFunction) {
    return (...args) => logFunction.apply(null, [ prefix, ...args ]) // eslint-disable-line
  }
  return {
    silly: setPrefix(log.silly),
    verbose: setPrefix(log.verbose),
    info: setPrefix(log.info),
    warn: setPrefix(log.warn),
    error: setPrefix(log.error)
  }
}

function regGetValue (key, value, addOpts, cb) {
  const outReValue = value.replace(/\W/g, '.')
  const outRe = new RegExp(`^\\s+${outReValue}\\s+REG_\\w+\\s+(\\S.*)$`, 'im')
  const reg = path.join(process.env.SystemRoot, 'System32', 'reg.exe')
  const regArgs = ['query', key, '/v', value].concat(addOpts)

  log.silly('reg', 'running', reg, regArgs)
  const child = execFile(reg, regArgs, { encoding: 'utf8' },
    function (err, stdout, stderr) {
      log.silly('reg', 'reg.exe stdout = %j', stdout)
      if (err || stderr.trim() !== '') {
        log.silly('reg', 'reg.exe err = %j', err && (err.stack || err))
        log.silly('reg', 'reg.exe stderr = %j', stderr)
        return cb(err, stderr)
      }

      const result = outRe.exec(stdout)
      if (!result) {
        log.silly('reg', 'error parsing stdout')
        return cb(new Error('Could not parse output of reg.exe'))
      }
      log.silly('reg', 'found: %j', result[1])
      cb(null, result[1])
    })
  child.stdin.end()
}

function regSearchKeys (keys, value, addOpts, cb) {
  var i = 0
  const search = () => {
    log.silly('reg-search', 'looking for %j in %j', value, keys[i])
    regGetValue(keys[i], value, addOpts, (err, res) => {
      ++i
      if (err && i < keys.length) { return search() }
      cb(err, res)
    })
  }
  search()
}

module.exports = {
  logWithPrefix: logWithPrefix,
  regGetValue: regGetValue,
  regSearchKeys: regSearchKeys
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340948363, function(require, module, exports) {
module.exports = {
  "name": "node-gyp",
  "description": "Node.js native addon build tool",
  "license": "MIT",
  "keywords": [
    "native",
    "addon",
    "module",
    "c",
    "c++",
    "bindings",
    "gyp"
  ],
  "version": "7.1.2",
  "installVersion": 9,
  "author": "Nathan Rajlich <nathan@tootallnate.net> (http://tootallnate.net)",
  "repository": {
    "type": "git",
    "url": "git://github.com/nodejs/node-gyp.git"
  },
  "preferGlobal": true,
  "bin": "./bin/node-gyp.js",
  "main": "./lib/node-gyp.js",
  "dependencies": {
    "env-paths": "^2.2.0",
    "glob": "^7.1.4",
    "graceful-fs": "^4.2.3",
    "nopt": "^5.0.0",
    "npmlog": "^4.1.2",
    "request": "^2.88.2",
    "rimraf": "^3.0.2",
    "semver": "^7.3.2",
    "tar": "^6.0.2",
    "which": "^2.0.2"
  },
  "engines": {
    "node": ">= 10.12.0"
  },
  "devDependencies": {
    "bindings": "^1.5.0",
    "nan": "^2.14.2",
    "require-inject": "^1.4.4",
    "standard": "^14.3.4",
    "tap": "^12.7.0"
  },
  "scripts": {
    "lint": "standard */*.js test/**/*.js",
    "test": "npm run lint && tap --timeout=120 test/test-*"
  }
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1678340948361);
})()
//miniprogram-npm-outsideDeps=["path","nopt","npmlog","child_process","events"]
//# sourceMappingURL=index.js.map