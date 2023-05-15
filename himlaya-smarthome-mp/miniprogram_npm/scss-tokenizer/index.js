module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1678340948497, function(require, module, exports) {
module.exports = require('./lib/entry').default;

}, function(modId) {var map = {"./lib/entry":1678340948498}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340948498, function(require, module, exports) {


exports.__esModule = true;

var _input = require('./input');

var _input2 = _interopRequireDefault(_input);

var _tokenize = require('./tokenize');

var _tokenize2 = _interopRequireDefault(_tokenize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scss = {};
scss.tokenize = function (css) {
    var input = new _input2.default(css);
    return (0, _tokenize2.default)(input);
};

exports.default = scss;
}, function(modId) { var map = {"./input":1678340948499,"./tokenize":1678340948501}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340948499, function(require, module, exports) {


exports.__esModule = true;

var _previousMap = require('./previous-map');

var _previousMap2 = _interopRequireDefault(_previousMap);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var sequence = 0;

var Input = function () {
    function Input(css) {
        var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Input);

        this.css = css.toString();

        if (this.css[0] === '\uFEFF' || this.css[0] === '\uFFFE') {
            this.css = this.css.slice(1);
        }

        if (opts.from) this.file = _path2.default.resolve(opts.from);

        var map = new _previousMap2.default(this.css, opts, this.id);
        if (map.text) {
            this.map = map;
            var file = map.consumer().file;
            if (!this.file && file) this.file = this.mapResolve(file);
        }

        if (this.file) {
            this.from = this.file;
        } else {
            sequence += 1;
            this.id = '<input css ' + sequence + '>';
            this.from = this.id;
        }
        if (this.map) this.map.file = this.from;
    }

    Input.prototype.mapResolve = function mapResolve(file) {
        return _path2.default.resolve(this.map.consumer().sourceRoot || '.', file);
    };

    return Input;
}();

exports.default = Input;
}, function(modId) { var map = {"./previous-map":1678340948500}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340948500, function(require, module, exports) {


exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _jsBase = require('js-base64');

var _sourceMap = require('source-map');

var _sourceMap2 = _interopRequireDefault(_sourceMap);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PreviousMap = function () {
    function PreviousMap(css, opts) {
        _classCallCheck(this, PreviousMap);

        this.loadAnnotation(css);
        this.inline = this.startWith(this.annotation, 'data:');

        var prev = opts.map ? opts.map.prev : undefined;
        var text = this.loadMap(opts.from, prev);
        if (text) this.text = text;
    }

    PreviousMap.prototype.consumer = function consumer() {
        if (!this.consumerCache) {
            this.consumerCache = new _sourceMap2.default.SourceMapConsumer(this.text);
        }
        return this.consumerCache;
    };

    PreviousMap.prototype.withContent = function withContent() {
        return !!(this.consumer().sourcesContent && this.consumer().sourcesContent.length > 0);
    };

    PreviousMap.prototype.startWith = function startWith(string, start) {
        if (!string) return false;
        return string.substr(0, start.length) === start;
    };

    PreviousMap.prototype.loadAnnotation = function loadAnnotation(css) {
        var match = css.match(/\/\*\s*# sourceMappingURL=(.*)\s*\*\//);
        if (match) this.annotation = match[1].trim();
    };

    PreviousMap.prototype.decodeInline = function decodeInline(text) {
        var uri = 'data:application/json,';
        var base64 = 'data:application/json;base64,';

        if (this.startWith(text, uri)) {
            return decodeURIComponent(text.substr(uri.length));
        } else if (this.startWith(text, base64)) {
            return _jsBase.Base64.decode(text.substr(base64.length));
        } else {
            var encoding = text.match(/data:application\/json;([^,]+),/)[1];
            throw new Error('Unsupported source map encoding ' + encoding);
        }
    };

    PreviousMap.prototype.loadMap = function loadMap(file, prev) {
        if (prev === false) return false;

        if (prev) {
            if (typeof prev === 'string') {
                return prev;
            } else if (prev instanceof _sourceMap2.default.SourceMapConsumer) {
                return _sourceMap2.default.SourceMapGenerator.fromSourceMap(prev).toString();
            } else if (prev instanceof _sourceMap2.default.SourceMapGenerator) {
                return prev.toString();
            } else if ((typeof prev === 'undefined' ? 'undefined' : _typeof(prev)) === 'object' && prev.mappings) {
                return JSON.stringify(prev);
            } else {
                throw new Error('Unsupported previous source map format: ' + prev.toString());
            }
        } else if (this.inline) {
            return this.decodeInline(this.annotation);
        } else if (this.annotation) {
            var map = this.annotation;
            if (file) map = _path2.default.join(_path2.default.dirname(file), map);

            this.root = _path2.default.dirname(map);
            if (_fs2.default.existsSync && _fs2.default.existsSync(map)) {
                return _fs2.default.readFileSync(map, 'utf-8').toString().trim();
            } else {
                return false;
            }
        }
    };

    return PreviousMap;
}();

exports.default = PreviousMap;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340948501, function(require, module, exports) {


exports.__esModule = true;
exports.default = tokenize;

var _input = require('./input');

var _input2 = _interopRequireDefault(_input);

var _tokenizeString2 = require('./tokenize-string');

var _tokenizeString3 = _interopRequireDefault(_tokenizeString2);

var _tokenizeComment2 = require('./tokenize-comment');

var _tokenizeComment3 = _interopRequireDefault(_tokenizeComment2);

var _tokenizeInterpolant2 = require('./tokenize-interpolant');

var _tokenizeInterpolant3 = _interopRequireDefault(_tokenizeInterpolant2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var singleQuote = "'".charCodeAt(0),
    doubleQuote = '"'.charCodeAt(0),
    dollar = '$'.charCodeAt(0),
    hash = '#'.charCodeAt(0),
    backslash = '\\'.charCodeAt(0),
    slash = '/'.charCodeAt(0),
    newline = '\n'.charCodeAt(0),
    space = ' '.charCodeAt(0),
    feed = '\f'.charCodeAt(0),
    tab = '\t'.charCodeAt(0),
    cr = '\r'.charCodeAt(0),
    openBracket = '('.charCodeAt(0),
    closeBracket = ')'.charCodeAt(0),
    openCurly = '{'.charCodeAt(0),
    closeCurly = '}'.charCodeAt(0),
    semicolon = ';'.charCodeAt(0),
    asterisk = '*'.charCodeAt(0),
    colon = ':'.charCodeAt(0),
    at = '@'.charCodeAt(0),
    comma = ','.charCodeAt(0),
    plus = '+'.charCodeAt(0),
    minus = '-'.charCodeAt(0),
    decComb = '>'.charCodeAt(0),
    adjComb = '~'.charCodeAt(0),
    number = /[+-]?(\d+(\.\d+)?|\.\d+)|(e[+-]\d+)/gi,
    sQuoteEnd = /(.*?)[^\\](?=((#{)|'))/gm,
    dQuoteEnd = /(.*?)[^\\](?=((#{)|"))/gm,
    wordEnd = /[ \n\t\r\(\)\{\},:;@!'"\\]|\/(?=\*)|#(?={)/g,
    ident = /-?([a-z_]|\\[^\\])([a-z-_0-9]|\\[^\\])*/gi;

function tokenize(input, l, p) {
    var tokens = [];
    var css = input.css.valueOf();

    var code = void 0,
        next = void 0,
        quote = void 0,
        lines = void 0,
        last = void 0,
        content = void 0,
        escape = void 0,
        nextLine = void 0,
        nextOffset = void 0,
        escaped = void 0,
        escapePos = void 0,
        inInterpolant = void 0,
        inComment = void 0,
        inString = void 0;

    var length = css.length;
    var offset = -1;
    var line = l || 1;
    var pos = p || 0;

    while (pos < length) {
        code = css.charCodeAt(pos);

        if (code === newline) {
            offset = pos;
            line += 1;
        }

        switch (code) {
            case space:
            case tab:
            case cr:
            case feed:
                next = pos;
                do {
                    next += 1;
                    code = css.charCodeAt(next);
                    if (code === newline) {
                        offset = next;
                        line += 1;
                    }
                } while (code === space || code === tab || code === cr || code === feed);

                tokens.push(['space', css.slice(pos, next)]);
                pos = next - 1;
                break;

            case newline:
                tokens.push(['newline', '\n', line, pos - offset]);
                break;

            case plus:
                tokens.push(['+', '+', line, pos - offset]);
                break;

            case minus:
                tokens.push(['-', '-', line, pos - offset]);
                break;

            case decComb:
                tokens.push(['>', '>', line, pos - offset]);
                break;

            case adjComb:
                tokens.push(['~', '~', line, pos - offset]);
                break;

            case openCurly:
                tokens.push(['{', '{', line, pos - offset]);
                break;

            case closeCurly:
                if (inInterpolant) {
                    inInterpolant = false;
                    tokens.push(['endInterpolant', '}', line, pos - offset]);
                } else {
                    tokens.push(['}', '}', line, pos - offset]);
                }
                break;

            case comma:
                tokens.push([',', ',', line, pos - offset]);
                break;

            case dollar:
                tokens.push(['$', '$', line, pos - offset]);
                break;

            case colon:
                tokens.push([':', ':', line, pos - offset]);
                break;

            case semicolon:
                tokens.push([';', ';', line, pos - offset]);
                break;

            case openBracket:
                tokens.push(['(', '(', line, pos - offset]);
                break;

            case closeBracket:
                tokens.push([')', ')', line, pos - offset]);
                break;

            case singleQuote:
            case doubleQuote:
                quote = code === singleQuote ? "'" : '"';
                tokens.push([quote, quote, line, pos - offset]);
                next = pos + 1;

                var _tokenizeString = (0, _tokenizeString3.default)(input, line, next, quote),
                    t = _tokenizeString.tokens,
                    _p = _tokenizeString.pos;

                tokens = tokens.concat(t);
                next = _p;

                pos = next;
                break;

            case at:
                tokens.push(['@', '@', line, pos - offset]);
                break;

            case backslash:
                next = pos;
                escape = true;
                while (css.charCodeAt(next + 1) === backslash) {
                    next += 1;
                    escape = !escape;
                }
                code = css.charCodeAt(next + 1);
                if (escape && code !== space && code !== newline && code !== tab && code !== cr && code !== feed) {
                    next += 1;
                }
                tokens.push(['word', css.slice(pos, next + 1), line, pos - offset, line, next - offset]);
                pos = next;
                break;

            default:
                ident.lastIndex = pos;
                number.lastIndex = pos;
                wordEnd.lastIndex = pos;

                if (code === slash && css.charCodeAt(pos + 1) === asterisk) {
                    inComment = true;
                    tokens.push(['startComment', '/*', line, pos + 1 - offset]);
                    next = pos + 1;

                    var _tokenizeComment = (0, _tokenizeComment3.default)(input, line, next + 1),
                        _t = _tokenizeComment.tokens,
                        _l = _tokenizeComment.line,
                        _p2 = _tokenizeComment.pos,
                        o = _tokenizeComment.offset;

                    tokens = tokens.concat(_t);
                    next = _p2;
                    line = _l;
                    offset = o;

                    pos = next;
                    break;
                }

                if (code === asterisk && css.charCodeAt(pos + 1) !== slash) {
                    tokens.push(['*', '*', line, pos - offset]);
                    break;
                }

                if (inComment && code === asterisk && css.charCodeAt(pos + 1) === slash) {
                    inComment = false;
                    tokens.push(['endComment', '*/', line, pos + 1 - offset]);
                    pos += 2;
                    break;
                }

                if (code === slash && css.charCodeAt(pos + 1) !== slash) {
                    tokens.push(['/', '/', line, pos - offset]);
                    break;
                }

                if (code === hash && css.charCodeAt(pos + 1) === openCurly) {
                    inInterpolant = true;
                    tokens.push(['startInterpolant', '#{', line, pos + 1 - offset]);
                    next = pos + 1;

                    var _tokenizeInterpolant = (0, _tokenizeInterpolant3.default)(input, line, next + 1),
                        _t2 = _tokenizeInterpolant.tokens,
                        _p3 = _tokenizeInterpolant.pos;

                    tokens = tokens.concat(_t2);
                    next = _p3;

                    pos = next;
                    break;
                }

                if (code === slash && css.charCodeAt(pos + 1) === slash) {
                    next = css.indexOf('\n', pos + 2);
                    next = (next > 0 ? next : css.length) - 1;

                    tokens.push(['scssComment', css.slice(pos, next + 1), line, pos - offset, line, next - offset]);

                    pos = next;
                    break;
                }

                if (ident.test(css) && (ident.lastIndex = pos || 1) && ident.exec(css).index === pos) {
                    next = ident.lastIndex - 1;

                    tokens.push(['ident', css.slice(pos, next + 1), line, pos - offset, line, next - offset]);

                    pos = next;
                    break;
                }

                if (number.test(css) && (number.lastIndex = pos || 1) && number.exec(css).index === pos) {
                    next = number.lastIndex - 1;

                    tokens.push(['number', css.slice(pos, next + 1), line, pos - offset, line, next - offset]);

                    pos = next;
                    break;
                }

                wordEnd.lastIndex = pos + 1;
                wordEnd.test(css);
                if (wordEnd.lastIndex === 0) {
                    next = css.length - 1;
                } else {
                    next = wordEnd.lastIndex - 2;
                }

                tokens.push(['word', css.slice(pos, next + 1), line, pos - offset, line, next - offset]);

                pos = next;

                break;
        }

        pos++;
    }

    return tokens;
}
}, function(modId) { var map = {"./input":1678340948499,"./tokenize-string":1678340948502,"./tokenize-comment":1678340948504,"./tokenize-interpolant":1678340948503}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340948502, function(require, module, exports) {


exports.__esModule = true;
exports.default = tokenize;

var _input = require('./input');

var _input2 = _interopRequireDefault(_input);

var _tokenizeString = require('./tokenize-string');

var _tokenizeString2 = _interopRequireDefault(_tokenizeString);

var _tokenizeInterpolant2 = require('./tokenize-interpolant');

var _tokenizeInterpolant3 = _interopRequireDefault(_tokenizeInterpolant2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var singleQuote = "'".charCodeAt(0),
    doubleQuote = '"'.charCodeAt(0),
    newline = '\n'.charCodeAt(0),
    space = ' '.charCodeAt(0),
    feed = '\f'.charCodeAt(0),
    tab = '\t'.charCodeAt(0),
    cr = '\r'.charCodeAt(0),
    hash = '#'.charCodeAt(0),
    backslash = '\\'.charCodeAt(0),
    slash = '/'.charCodeAt(0),
    openCurly = '{'.charCodeAt(0),
    closeCurly = '}'.charCodeAt(0),
    interpolantEnd = /([.\s]*?)[^\\](?=(}))/gm,
    sQuoteEnd = /([.\s]*?)[^\\](?=((#{)|'))/gm,
    dQuoteEnd = /([.\s]*?)[^\\](?=((#{)|"))/gm;

function tokenize(input, l, p, quote) {
    var tokens = [];
    var css = input.css.valueOf();

    var code = void 0,
        next = void 0,
        lines = void 0,
        last = void 0,
        content = void 0,
        escape = void 0,
        nextLine = void 0,
        nextOffset = void 0,
        escaped = void 0,
        escapePos = void 0,
        inInterpolant = void 0,
        inComment = void 0,
        inString = void 0;

    var length = css.length;
    var offset = -1;
    var line = l || 1;
    var pos = p || 0;

    var quoteEnd = quote === "'" ? sQuoteEnd : dQuoteEnd;
    var quoteChar = quote.charCodeAt(0);

    loop: while (pos < length) {
        code = css.charCodeAt(pos);

        if (code === newline) {
            offset = pos;
            line += 1;
        }

        switch (code) {

            case closeCurly:
                tokens.push(['endInterpolant', '}', line, pos - offset]);
                break;

            case quoteChar:
                tokens.push([quote, quote, line, pos - offset]);
                break loop;

            case backslash:
                next = pos;
                escape = true;
                while (css.charCodeAt(next + 1) === backslash) {
                    next += 1;
                    escape = !escape;
                }
                code = css.charCodeAt(next + 1);
                if (escape && code !== slash && code !== space && code !== newline && code !== tab && code !== cr && code !== feed) {
                    next += 1;
                }
                tokens.push(['string', css.slice(pos, next + 1), line, pos - offset, line, next - offset]);
                pos = next;
                break;

            default:
                if (code === hash && css.charCodeAt(pos + 1) === openCurly) {
                    tokens.push(['startInterpolant', '#{', line, pos + 1 - offset]);
                    next = pos + 1;

                    var _tokenizeInterpolant = (0, _tokenizeInterpolant3.default)(input, line, next + 1),
                        t = _tokenizeInterpolant.tokens,
                        _p = _tokenizeInterpolant.pos;

                    tokens = tokens.concat(t);
                    next = _p;

                    pos = next;
                } else {
                    quoteEnd.lastIndex = pos;
                    quoteEnd.test(css);

                    if (quoteEnd.lastIndex === 0) {
                        next = css.length - 1;
                    } else {
                        next = quoteEnd.lastIndex - 1;
                    }

                    tokens.push(['string', css.slice(pos, next + 1), line, pos - offset, line, next - offset]);

                    pos = next;
                }

                break;
        }

        pos++;
    }

    return { tokens: tokens, pos: pos };
}
}, function(modId) { var map = {"./input":1678340948499,"./tokenize-string":1678340948502,"./tokenize-interpolant":1678340948503}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340948503, function(require, module, exports) {


exports.__esModule = true;
exports.default = tokenize;

var _input = require('./input');

var _input2 = _interopRequireDefault(_input);

var _tokenizeString2 = require('./tokenize-string');

var _tokenizeString3 = _interopRequireDefault(_tokenizeString2);

var _tokenizeComment2 = require('./tokenize-comment');

var _tokenizeComment3 = _interopRequireDefault(_tokenizeComment2);

var _tokenizeInterpolant2 = require('./tokenize-interpolant');

var _tokenizeInterpolant3 = _interopRequireDefault(_tokenizeInterpolant2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var singleQuote = "'".charCodeAt(0),
    doubleQuote = '"'.charCodeAt(0),
    dollar = '$'.charCodeAt(0),
    hash = '#'.charCodeAt(0),
    backslash = '\\'.charCodeAt(0),
    slash = '/'.charCodeAt(0),
    newline = '\n'.charCodeAt(0),
    space = ' '.charCodeAt(0),
    feed = '\f'.charCodeAt(0),
    tab = '\t'.charCodeAt(0),
    cr = '\r'.charCodeAt(0),
    openBracket = '('.charCodeAt(0),
    closeBracket = ')'.charCodeAt(0),
    openCurly = '{'.charCodeAt(0),
    closeCurly = '}'.charCodeAt(0),
    semicolon = ';'.charCodeAt(0),
    asterisk = '*'.charCodeAt(0),
    colon = ':'.charCodeAt(0),
    at = '@'.charCodeAt(0),
    comma = ','.charCodeAt(0),
    plus = '+'.charCodeAt(0),
    minus = '-'.charCodeAt(0),
    decComb = '>'.charCodeAt(0),
    adjComb = '~'.charCodeAt(0),
    number = /[+-]?(\d+(\.\d+)?|\.\d+)|(e[+-]\d+)/gi,
    sQuoteEnd = /(.*?)[^\\](?=((#{)|'))/gm,
    dQuoteEnd = /(.*?)[^\\](?=((#{)|"))/gm,
    wordEnd = /[ \n\t\r\(\)\{\},:;@!'"\\]|\/(?=\*)|#(?={)/g,
    ident = /-?([a-z_]|\\[^\\])([a-z-_0-9]|\\[^\\])*/gi;

function tokenize(input, l, p) {
    var tokens = [];
    var css = input.css.valueOf();

    var code = void 0,
        next = void 0,
        quote = void 0,
        lines = void 0,
        last = void 0,
        content = void 0,
        escape = void 0,
        nextLine = void 0,
        nextOffset = void 0,
        escaped = void 0,
        escapePos = void 0,
        inInterpolant = void 0,
        inComment = void 0,
        inString = void 0;

    var length = css.length;
    var offset = -1;
    var line = l || 1;
    var pos = p || 0;

    loop: while (pos < length) {
        code = css.charCodeAt(pos);

        if (code === newline) {
            offset = pos;
            line += 1;
        }

        switch (code) {
            case space:
            case tab:
            case cr:
            case feed:
                next = pos;
                do {
                    next += 1;
                    code = css.charCodeAt(next);
                    if (code === newline) {
                        offset = next;
                        line += 1;
                    }
                } while (code === space || code === tab || code === cr || code === feed);

                tokens.push(['space', css.slice(pos, next)]);
                pos = next - 1;
                break;

            case newline:
                tokens.push(['newline', '\n', line, pos - offset]);
                break;

            case plus:
                tokens.push(['+', '+', line, pos - offset]);
                break;

            case minus:
                tokens.push(['-', '-', line, pos - offset]);
                break;

            case decComb:
                tokens.push(['>', '>', line, pos - offset]);
                break;

            case adjComb:
                tokens.push(['~', '~', line, pos - offset]);
                break;

            case openCurly:
                tokens.push(['{', '{', line, pos - offset]);
                break;

            case closeCurly:
                if (inInterpolant) {
                    inInterpolant = false;
                    tokens.push(['endInterpolant', '}', line, pos - offset]);
                } else {
                    break loop;
                }
                break;

            case comma:
                tokens.push([',', ',', line, pos - offset]);
                break;

            case dollar:
                tokens.push(['$', '$', line, pos - offset]);
                break;

            case colon:
                tokens.push([':', ':', line, pos - offset]);
                break;

            case semicolon:
                tokens.push([';', ';', line, pos - offset]);
                break;

            case openBracket:
                tokens.push(['(', '(', line, pos - offset]);
                break;

            case closeBracket:
                tokens.push([')', ')', line, pos - offset]);
                break;

            case singleQuote:
            case doubleQuote:
                quote = code === singleQuote ? "'" : '"';
                tokens.push([quote, quote, line, pos - offset]);
                next = pos + 1;

                var _tokenizeString = (0, _tokenizeString3.default)(input, line, next, quote),
                    t = _tokenizeString.tokens,
                    _p = _tokenizeString.pos;

                tokens = tokens.concat(t);
                next = _p;

                pos = next;
                break;

            case at:
                tokens.push(['@', '@', line, pos - offset]);
                break;

            case backslash:
                next = pos;
                escape = true;
                while (css.charCodeAt(next + 1) === backslash) {
                    next += 1;
                    escape = !escape;
                }
                code = css.charCodeAt(next + 1);
                if (escape && code !== space && code !== newline && code !== tab && code !== cr && code !== feed) {
                    next += 1;
                }
                tokens.push(['word', css.slice(pos, next + 1), line, pos - offset, line, next - offset]);
                pos = next;
                break;

            default:
                ident.lastIndex = pos;
                number.lastIndex = pos;
                wordEnd.lastIndex = pos;

                if (code === slash && css.charCodeAt(pos + 1) === asterisk) {
                    inComment = true;
                    tokens.push(['startComment', '/*', line, pos + 1 - offset]);
                    next = pos + 1;

                    var _tokenizeComment = (0, _tokenizeComment3.default)(input, line, next + 1),
                        _t = _tokenizeComment.tokens,
                        _l = _tokenizeComment.line,
                        _p2 = _tokenizeComment.pos,
                        o = _tokenizeComment.offset;

                    tokens = tokens.concat(_t);
                    next = _p2;
                    line = _l;
                    offset = o;

                    pos = next;
                    break;
                }

                if (code === asterisk && css.charCodeAt(pos + 1) !== slash) {
                    tokens.push(['*', '*', line, pos - offset]);
                    break;
                }

                if (inComment && code === asterisk && css.charCodeAt(pos + 1) === slash) {
                    inComment = false;
                    tokens.push(['endComment', '*/', line, pos + 1 - offset]);
                    pos += 2;
                    break;
                }

                if (code === slash && css.charCodeAt(pos + 1) !== slash) {
                    tokens.push(['/', '/', line, pos - offset]);
                    pos += 2;
                    break;
                }

                if (code === hash && css.charCodeAt(pos + 1) === openCurly) {
                    inInterpolant = true;
                    tokens.push(['startInterpolant', '#{', line, pos + 1 - offset]);
                    next = pos + 1;

                    var _tokenizeInterpolant = (0, _tokenizeInterpolant3.default)(input, line, next + 1),
                        _t2 = _tokenizeInterpolant.tokens,
                        _p3 = _tokenizeInterpolant.pos;

                    tokens = tokens.concat(_t2);
                    next = _p3;

                    pos = next;
                    break;
                }

                if (code === slash && css.charCodeAt(pos + 1) === slash) {
                    next = css.indexOf('\n\n', pos + 2);
                    next = next > 0 ? next : css.length;

                    tokens.push(['scssComment', css.slice(pos, next), line, pos - offset, line, next - offset]);

                    pos = next;
                    break;
                }

                if (ident.test(css) && (ident.lastIndex = pos || 1) && ident.exec(css).index === pos) {
                    next = ident.lastIndex - 1;

                    tokens.push(['ident', css.slice(pos, next + 1), line, pos - offset, line, next - offset]);

                    pos = next;
                    break;
                }

                if (number.test(css) && (number.lastIndex = pos || 1) && number.exec(css).index === pos) {
                    next = number.lastIndex - 1;

                    tokens.push(['number', css.slice(pos, next + 1), line, pos - offset, line, next - offset]);

                    pos = next;
                    break;
                }

                wordEnd.lastIndex = pos + 1;
                wordEnd.test(css);
                if (wordEnd.lastIndex === 0) {
                    next = css.length - 1;
                } else {
                    next = wordEnd.lastIndex - 2;
                }

                tokens.push(['word', css.slice(pos, next + 1), line, pos - offset, line, next - offset]);

                pos = next;

                break;
        }

        pos++;
    }

    return { tokens: tokens, pos: pos };
}
}, function(modId) { var map = {"./input":1678340948499,"./tokenize-string":1678340948502,"./tokenize-comment":1678340948504,"./tokenize-interpolant":1678340948503}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340948504, function(require, module, exports) {


exports.__esModule = true;
exports.default = tokenize;

var _input = require('./input');

var _input2 = _interopRequireDefault(_input);

var _tokenizeString = require('./tokenize-string');

var _tokenizeString2 = _interopRequireDefault(_tokenizeString);

var _tokenizeInterpolant2 = require('./tokenize-interpolant');

var _tokenizeInterpolant3 = _interopRequireDefault(_tokenizeInterpolant2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var newline = '\n'.charCodeAt(0),
    space = ' '.charCodeAt(0),
    feed = '\f'.charCodeAt(0),
    tab = '\t'.charCodeAt(0),
    cr = '\r'.charCodeAt(0),
    hash = '#'.charCodeAt(0),
    backslash = '\\'.charCodeAt(0),
    slash = '/'.charCodeAt(0),
    openCurly = '{'.charCodeAt(0),
    closeCurly = '}'.charCodeAt(0),
    asterisk = '*'.charCodeAt(0),
    wordEnd = /[ \n\t\r\(\)\{\},:;@!'"\\]|\*(?=\/)|#(?={)/g;

function tokenize(input, l, p) {
    var tokens = [];
    var css = input.css.valueOf();

    var code = void 0,
        next = void 0,
        lines = void 0,
        last = void 0,
        content = void 0,
        escape = void 0,
        nextLine = void 0,
        nextOffset = void 0,
        escaped = void 0,
        escapePos = void 0,
        inInterpolant = void 0,
        inComment = void 0,
        inString = void 0;

    var length = css.length;
    var offset = -1;
    var line = l || 1;
    var pos = p || 0;

    loop: while (pos < length) {
        code = css.charCodeAt(pos);

        if (code === newline) {
            offset = pos;
            line += 1;
        }

        switch (code) {
            case space:
            case tab:
            case cr:
            case feed:
                next = pos;
                do {
                    next += 1;
                    code = css.charCodeAt(next);
                    if (code === newline) {
                        offset = next;
                        line += 1;
                    }
                } while (code === space || code === tab || code === cr || code === feed);

                tokens.push(['space', css.slice(pos, next)]);
                pos = next - 1;
                break;

            case newline:
                tokens.push(['newline', '\n', line, pos - offset]);
                break;

            case closeCurly:
                tokens.push(['endInterpolant', '}', line, pos - offset]);
                break;

            case backslash:
                next = pos;
                escape = true;
                while (css.charCodeAt(next + 1) === backslash) {
                    next += 1;
                    escape = !escape;
                }
                code = css.charCodeAt(next + 1);
                if (escape && code !== slash && code !== space && code !== newline && code !== tab && code !== cr && code !== feed) {
                    next += 1;
                }
                tokens.push(['word', css.slice(pos, next + 1), line, pos - offset, line, next - offset]);
                pos = next;
                break;

            default:

                if (code === asterisk && css.charCodeAt(pos + 1) === slash) {
                    next = pos;
                    pos = next - 1;
                    break loop;
                }

                if (code === hash && css.charCodeAt(pos + 1) === openCurly) {
                    tokens.push(['startInterpolant', '#{', line, pos + 1 - offset]);
                    next = pos + 1;

                    var _tokenizeInterpolant = (0, _tokenizeInterpolant3.default)(input, line, next + 1),
                        t = _tokenizeInterpolant.tokens,
                        _p = _tokenizeInterpolant.pos;

                    tokens = tokens.concat(t);
                    next = _p;

                    pos = next;
                    break;
                }

                wordEnd.lastIndex = pos + 1;
                wordEnd.test(css);
                if (wordEnd.lastIndex === 0) {
                    next = css.length - 1;
                } else {
                    next = wordEnd.lastIndex - 2;
                }

                tokens.push(['word', css.slice(pos, next + 1), line, pos - offset, line, next - offset]);

                pos = next;

                break;
        }

        pos++;
    }

    return { tokens: tokens, line: line, pos: pos, offset: offset };
}
}, function(modId) { var map = {"./input":1678340948499,"./tokenize-string":1678340948502,"./tokenize-interpolant":1678340948503}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1678340948497);
})()
//miniprogram-npm-outsideDeps=["path","js-base64","source-map","fs"]
//# sourceMappingURL=index.js.map