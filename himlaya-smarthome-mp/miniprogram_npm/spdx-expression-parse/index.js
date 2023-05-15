module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1678340948510, function(require, module, exports) {


var scan = require('./scan')
var parse = require('./parse')

module.exports = function (source) {
  return parse(scan(source))
}

}, function(modId) {var map = {"./scan":1678340948511,"./parse":1678340948512}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340948511, function(require, module, exports) {


var licenses = []
  .concat(require('spdx-license-ids'))
  .concat(require('spdx-license-ids/deprecated'))
var exceptions = require('spdx-exceptions')

module.exports = function (source) {
  var index = 0

  function hasMore () {
    return index < source.length
  }

  // `value` can be a regexp or a string.
  // If it is recognized, the matching source string is returned and
  // the index is incremented. Otherwise `undefined` is returned.
  function read (value) {
    if (value instanceof RegExp) {
      var chars = source.slice(index)
      var match = chars.match(value)
      if (match) {
        index += match[0].length
        return match[0]
      }
    } else {
      if (source.indexOf(value, index) === index) {
        index += value.length
        return value
      }
    }
  }

  function skipWhitespace () {
    read(/[ ]*/)
  }

  function operator () {
    var string
    var possibilities = ['WITH', 'AND', 'OR', '(', ')', ':', '+']
    for (var i = 0; i < possibilities.length; i++) {
      string = read(possibilities[i])
      if (string) {
        break
      }
    }

    if (string === '+' && index > 1 && source[index - 2] === ' ') {
      throw new Error('Space before `+`')
    }

    return string && {
      type: 'OPERATOR',
      string: string
    }
  }

  function idstring () {
    return read(/[A-Za-z0-9-.]+/)
  }

  function expectIdstring () {
    var string = idstring()
    if (!string) {
      throw new Error('Expected idstring at offset ' + index)
    }
    return string
  }

  function documentRef () {
    if (read('DocumentRef-')) {
      var string = expectIdstring()
      return { type: 'DOCUMENTREF', string: string }
    }
  }

  function licenseRef () {
    if (read('LicenseRef-')) {
      var string = expectIdstring()
      return { type: 'LICENSEREF', string: string }
    }
  }

  function identifier () {
    var begin = index
    var string = idstring()

    if (licenses.indexOf(string) !== -1) {
      return {
        type: 'LICENSE',
        string: string
      }
    } else if (exceptions.indexOf(string) !== -1) {
      return {
        type: 'EXCEPTION',
        string: string
      }
    }

    index = begin
  }

  // Tries to read the next token. Returns `undefined` if no token is
  // recognized.
  function parseToken () {
    // Ordering matters
    return (
      operator() ||
      documentRef() ||
      licenseRef() ||
      identifier()
    )
  }

  var tokens = []
  while (hasMore()) {
    skipWhitespace()
    if (!hasMore()) {
      break
    }

    var token = parseToken()
    if (!token) {
      throw new Error('Unexpected `' + source[index] +
                      '` at offset ' + index)
    }

    tokens.push(token)
  }
  return tokens
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340948512, function(require, module, exports) {


// The ABNF grammar in the spec is totally ambiguous.
//
// This parser follows the operator precedence defined in the
// `Order of Precedence and Parentheses` section.

module.exports = function (tokens) {
  var index = 0

  function hasMore () {
    return index < tokens.length
  }

  function token () {
    return hasMore() ? tokens[index] : null
  }

  function next () {
    if (!hasMore()) {
      throw new Error()
    }
    index++
  }

  function parseOperator (operator) {
    var t = token()
    if (t && t.type === 'OPERATOR' && operator === t.string) {
      next()
      return t.string
    }
  }

  function parseWith () {
    if (parseOperator('WITH')) {
      var t = token()
      if (t && t.type === 'EXCEPTION') {
        next()
        return t.string
      }
      throw new Error('Expected exception after `WITH`')
    }
  }

  function parseLicenseRef () {
    // TODO: Actually, everything is concatenated into one string
    // for backward-compatibility but it could be better to return
    // a nice structure.
    var begin = index
    var string = ''
    var t = token()
    if (t.type === 'DOCUMENTREF') {
      next()
      string += 'DocumentRef-' + t.string + ':'
      if (!parseOperator(':')) {
        throw new Error('Expected `:` after `DocumentRef-...`')
      }
    }
    t = token()
    if (t.type === 'LICENSEREF') {
      next()
      string += 'LicenseRef-' + t.string
      return { license: string }
    }
    index = begin
  }

  function parseLicense () {
    var t = token()
    if (t && t.type === 'LICENSE') {
      next()
      var node = { license: t.string }
      if (parseOperator('+')) {
        node.plus = true
      }
      var exception = parseWith()
      if (exception) {
        node.exception = exception
      }
      return node
    }
  }

  function parseParenthesizedExpression () {
    var left = parseOperator('(')
    if (!left) {
      return
    }

    var expr = parseExpression()

    if (!parseOperator(')')) {
      throw new Error('Expected `)`')
    }

    return expr
  }

  function parseAtom () {
    return (
      parseParenthesizedExpression() ||
      parseLicenseRef() ||
      parseLicense()
    )
  }

  function makeBinaryOpParser (operator, nextParser) {
    return function parseBinaryOp () {
      var left = nextParser()
      if (!left) {
        return
      }

      if (!parseOperator(operator)) {
        return left
      }

      var right = parseBinaryOp()
      if (!right) {
        throw new Error('Expected expression')
      }
      return {
        left: left,
        conjunction: operator.toLowerCase(),
        right: right
      }
    }
  }

  var parseAnd = makeBinaryOpParser('AND', parseAtom)
  var parseExpression = makeBinaryOpParser('OR', parseAnd)

  var node = parseExpression()
  if (!node || hasMore()) {
    throw new Error('Syntax error')
  }
  return node
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1678340948510);
})()
//miniprogram-npm-outsideDeps=["spdx-license-ids","spdx-license-ids/deprecated","spdx-exceptions"]
//# sourceMappingURL=index.js.map