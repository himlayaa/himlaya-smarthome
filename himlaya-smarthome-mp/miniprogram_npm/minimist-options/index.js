module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1678340948273, function(require, module, exports) {


const isPlainObject = require('is-plain-obj');
const arrify = require('arrify');
const kindOf = require('kind-of');

const push = (obj, prop, value) => {
	if (!obj[prop]) {
		obj[prop] = [];
	}

	obj[prop].push(value);
};

const insert = (obj, prop, key, value) => {
	if (!obj[prop]) {
		obj[prop] = {};
	}

	obj[prop][key] = value;
};

const prettyPrint = output => {
	return Array.isArray(output) ?
		`[${output.map(prettyPrint).join(', ')}]` :
		kindOf(output) === 'string' ? JSON.stringify(output) : output;
};

const resolveType = value => {
	if (Array.isArray(value) && value.length > 0) {
		const [element] = value;
		return `${kindOf(element)}-array`;
	}

	return kindOf(value);
};

const normalizeExpectedType = (type, defaultValue) => {
	const inferredType = type === 'array' ? 'string-array' : type;

	if (arrayTypes.includes(inferredType) && Array.isArray(defaultValue) && defaultValue.length === 0) {
		return 'array';
	}

	return inferredType;
};

const passthroughOptions = ['stopEarly', 'unknown', '--'];
const primitiveTypes = ['string', 'boolean', 'number'];
const arrayTypes = primitiveTypes.map(t => `${t}-array`);
const availableTypes = [...primitiveTypes, 'array', ...arrayTypes];

const buildOptions = options => {
	options = options || {};

	const result = {};

	passthroughOptions.forEach(key => {
		if (options[key]) {
			result[key] = options[key];
		}
	});

	Object.keys(options).forEach(key => {
		let value = options[key];

		if (key === 'arguments') {
			key = '_';
		}

		// If short form is used
		// convert it to long form
		// e.g. { 'name': 'string' }
		if (typeof value === 'string') {
			value = {type: value};
		}

		if (isPlainObject(value)) {
			const props = value;
			const {type} = props;

			if (type) {
				if (!availableTypes.includes(type)) {
					throw new TypeError(`Expected type of "${key}" to be one of ${prettyPrint(availableTypes)}, got ${prettyPrint(type)}`);
				}

				if (arrayTypes.includes(type)) {
					const [elementType] = type.split('-');
					push(result, 'array', {key, [elementType]: true});
				} else {
					push(result, type, key);
				}
			}

			if ({}.hasOwnProperty.call(props, 'default')) {
				const {default: defaultValue} = props;
				const defaultType = resolveType(defaultValue);
				const expectedType = normalizeExpectedType(type, defaultValue);

				if (expectedType && expectedType !== defaultType) {
					throw new TypeError(`Expected "${key}" default value to be of type "${expectedType}", got ${prettyPrint(defaultType)}`);
				}

				insert(result, 'default', key, defaultValue);
			}

			arrify(props.alias).forEach(alias => {
				insert(result, 'alias', alias, key);
			});
		}
	});

	return result;
};

module.exports = buildOptions;
module.exports.default = buildOptions;

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1678340948273);
})()
//miniprogram-npm-outsideDeps=["is-plain-obj","arrify","kind-of"]
//# sourceMappingURL=index.js.map