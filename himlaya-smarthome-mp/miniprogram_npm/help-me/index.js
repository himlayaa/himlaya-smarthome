module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1678340948134, function(require, module, exports) {


var fs = require('fs')
var path = require('path')
var through = require('through2')
var globStream = require('glob-stream')
var concat = require('callback-stream')
var xtend = require('xtend')

var defaults = {
  dir: path.join(path.dirname(require.main.filename), 'doc'),
  ext: '.txt',
  help: 'help'
}

function helpMe (opts) {
  opts = xtend(defaults, opts)

  if (!opts.dir) {
    throw new Error('missing directory')
  }

  return {
    createStream: createStream,
    toStdout: toStdout
  }

  function createStream (args) {
    if (typeof args === 'string') {
      args = args.split(' ')
    } else if (!args || args.length === 0) {
      args = [opts.help]
    }

    var out = through()
    var gs = globStream([opts.dir + '/**/*' + opts.ext])
    var re = new RegExp(args.map(function (arg) {
      return arg + '[a-zA-Z0-9]*'
    }).join('[ /]+'))

    gs.pipe(concat({ objectMode: true }, function (err, files) {
      if (err) return out.emit('error', err)

      files = files.map(function (file) {
        file.relative = file.path.replace(file.base, '').replace(/^\//, '')
        return file
      }).filter(function (file) {
        return file.relative.match(re)
      })

      if (files.length === 0) {
        return out.emit('error', new Error('no such help file'))
      } else if (files.length > 1) {
        out.write('There are ' + files.length + ' help pages ')
        out.write('that matches the given request, please disambiguate:\n')
        files.forEach(function (file) {
          out.write('  * ')
          out.write(file.relative.replace(opts.ext, ''))
          out.write('\n')
        })
        out.end()
        return
      }

      fs.createReadStream(files[0].path)
        .on('error', function (err) {
          out.emit('error', err)
        })
        .pipe(out)
    }))

    return out
  }

  function toStdout (args) {
    createStream(args)
      .on('error', function () {
        console.log('no such help file\n')
        toStdout()
      })
      .pipe(process.stdout)
  }
}

module.exports = helpMe

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1678340948134);
})()
//miniprogram-npm-outsideDeps=["fs","path","through2","glob-stream","callback-stream","xtend"]
//# sourceMappingURL=index.js.map