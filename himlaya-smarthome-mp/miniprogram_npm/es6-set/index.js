module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1678340947995, function(require, module, exports) {


module.exports = require("./is-implemented")() ? Set : require("./polyfill");

}, function(modId) {var map = {"./is-implemented":1678340947996,"./polyfill":1678340947997}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340947996, function(require, module, exports) {


module.exports = function () {
	var set, iterator, result;
	if (typeof Set !== "function") return false;
	set = new Set(["raz", "dwa", "trzy"]);
	if (String(set) !== "[object Set]") return false;
	if (set.size !== 3) return false;
	if (typeof set.add !== "function") return false;
	if (typeof set.clear !== "function") return false;
	if (typeof set.delete !== "function") return false;
	if (typeof set.entries !== "function") return false;
	if (typeof set.forEach !== "function") return false;
	if (typeof set.has !== "function") return false;
	if (typeof set.keys !== "function") return false;
	if (typeof set.values !== "function") return false;

	iterator = set.values();
	result = iterator.next();
	if (result.done !== false) return false;
	if (result.value !== "raz") return false;

	return true;
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340947997, function(require, module, exports) {


var isValue        = require("type/value/is")
  , clear          = require("es5-ext/array/#/clear")
  , eIndexOf       = require("es5-ext/array/#/e-index-of")
  , setPrototypeOf = require("es5-ext/object/set-prototype-of")
  , callable       = require("es5-ext/object/valid-callable")
  , d              = require("d")
  , ee             = require("event-emitter")
  , Symbol         = require("es6-symbol")
  , iterator       = require("es6-iterator/valid-iterable")
  , forOf          = require("es6-iterator/for-of")
  , Iterator       = require("./lib/iterator")
  , isNative       = require("./is-native-implemented")
  , call           = Function.prototype.call
  , defineProperty = Object.defineProperty
  , getPrototypeOf = Object.getPrototypeOf
  , SetPoly
  , getValues
  , NativeSet;

if (isNative) NativeSet = Set;

module.exports = SetPoly = function Set(/* iterable*/) {
	var iterable = arguments[0], self;
	if (!(this instanceof SetPoly)) throw new TypeError("Constructor requires 'new'");
	if (isNative && setPrototypeOf) self = setPrototypeOf(new NativeSet(), getPrototypeOf(this));
	else self = this;
	if (isValue(iterable)) iterator(iterable);
	defineProperty(self, "__setData__", d("c", []));
	if (!iterable) return self;
	forOf(
		iterable,
		function (value) {
			if (eIndexOf.call(this, value) !== -1) return;
			this.push(value);
		},
		self.__setData__
	);
	return self;
};

if (isNative) {
	if (setPrototypeOf) setPrototypeOf(SetPoly, NativeSet);
	SetPoly.prototype = Object.create(NativeSet.prototype, { constructor: d(SetPoly) });
}

ee(
	Object.defineProperties(SetPoly.prototype, {
		add: d(function (value) {
			if (this.has(value)) return this;
			this.emit("_add", this.__setData__.push(value) - 1, value);
			return this;
		}),
		clear: d(function () {
			if (!this.__setData__.length) return;
			clear.call(this.__setData__);
			this.emit("_clear");
		}),
		delete: d(function (value) {
			var index = eIndexOf.call(this.__setData__, value);
			if (index === -1) return false;
			this.__setData__.splice(index, 1);
			this.emit("_delete", index, value);
			return true;
		}),
		entries: d(function () { return new Iterator(this, "key+value"); }),
		forEach: d(function (cb /*, thisArg*/) {
			var thisArg = arguments[1], iterator, result, value;
			callable(cb);
			iterator = this.values();
			result = iterator._next();
			while (result !== undefined) {
				value = iterator._resolve(result);
				call.call(cb, thisArg, value, value, this);
				result = iterator._next();
			}
		}),
		has: d(function (value) { return eIndexOf.call(this.__setData__, value) !== -1; }),
		keys: d((getValues = function () { return this.values(); })),
		size: d.gs(function () { return this.__setData__.length; }),
		values: d(function () { return new Iterator(this); }),
		toString: d(function () { return "[object Set]"; })
	})
);
defineProperty(SetPoly.prototype, Symbol.iterator, d(getValues));
defineProperty(SetPoly.prototype, Symbol.toStringTag, d("c", "Set"));

}, function(modId) { var map = {"./lib/iterator":1678340947998,"./is-native-implemented":1678340947999}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340947998, function(require, module, exports) {


var setPrototypeOf    = require("es5-ext/object/set-prototype-of")
  , contains          = require("es5-ext/string/#/contains")
  , d                 = require("d")
  , Iterator          = require("es6-iterator")
  , toStringTagSymbol = require("es6-symbol").toStringTag
  , defineProperty    = Object.defineProperty
  , SetIterator;

SetIterator = module.exports = function (set, kind) {
	if (!(this instanceof SetIterator)) return new SetIterator(set, kind);
	Iterator.call(this, set.__setData__, set);
	if (!kind) kind = "value";
	else if (contains.call(kind, "key+value")) kind = "key+value";
	else kind = "value";
	return defineProperty(this, "__kind__", d("", kind));
};
if (setPrototypeOf) setPrototypeOf(SetIterator, Iterator);

SetIterator.prototype = Object.create(Iterator.prototype, {
	constructor: d(SetIterator),
	_resolve: d(function (i) {
		if (this.__kind__ === "value") return this.__list__[i];
		return [this.__list__[i], this.__list__[i]];
	}),
	toString: d(function () { return "[object Set Iterator]"; })
});
defineProperty(SetIterator.prototype, toStringTagSymbol, d("c", "Set Iterator"));

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340947999, function(require, module, exports) {
// Exports true if environment provides native `Set` implementation,
// whatever that is.



module.exports = (function () {
	if (typeof Set === "undefined") return false;
	return Object.prototype.toString.call(Set.prototype) === "[object Set]";
})();

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1678340947995);
})()
//miniprogram-npm-outsideDeps=["type/value/is","es5-ext/array/#/clear","es5-ext/array/#/e-index-of","es5-ext/object/set-prototype-of","es5-ext/object/valid-callable","d","event-emitter","es6-symbol","es6-iterator/valid-iterable","es6-iterator/for-of","es5-ext/string/#/contains","es6-iterator"]
//# sourceMappingURL=index.js.map