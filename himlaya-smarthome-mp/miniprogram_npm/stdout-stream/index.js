module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1678340948554, function(require, module, exports) {
var fs = require('fs');
var Writable = require('readable-stream/writable');

var exists = function(path) {
	try {
		return fs.existsSync(path);
	} catch (err) {
		return false;
	}
};

module.exports = function() {
	var s = new Writable({highWaterMark:0});

	var cb;
	var data;
	var tries = 0;
	var offset = 0;

	var write = function() {
		fs.write(1, data, offset, data.length - offset, null, onwrite);
	};

	var onwrite = function(err, written) {
		if (err && err.code === 'EPIPE') return cb()
		if (err && err.code === 'EAGAIN' && tries++ < 30) return setTimeout(write, 10);
		if (err) return cb(err);

		tries = 0;
		if (offset + written >= data.length) return cb();

		offset += written;
		write();
	};

	s._write = function(_data, enc, _cb) {
		offset = 0;
		cb = _cb;
		data = _data;
		write();
	};

	s._isStdio = true;
	s.isTTY = process.stdout.isTTY;

	s.on('finish', function() {
		fs.close(1, function(err) {
			if (err) s.emit('error', err);
		});
	});

	return s;
}();

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1678340948554);
})()
//miniprogram-npm-outsideDeps=["fs","readable-stream/writable"]
//# sourceMappingURL=index.js.map