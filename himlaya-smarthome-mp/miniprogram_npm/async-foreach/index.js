module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1678340947555, function(require, module, exports) {
/*!
 * Sync/Async forEach
 * https://github.com/cowboy/javascript-sync-async-foreach
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

(function(exports) {

  // Iterate synchronously or asynchronously.
  exports.forEach = function(arr, eachFn, doneFn) {
    var i = -1;
    // Resolve array length to a valid (ToUint32) number.
    var len = arr.length >>> 0;

    // This IIFE is called once now, and then again, by name, for each loop
    // iteration.
    (function next(result) {
      // This flag will be set to true if `this.async` is called inside the
      // eachFn` callback.
      var async;
      // Was false returned from the `eachFn` callback or passed to the
      // `this.async` done function?
      var abort = result === false;

      // Increment counter variable and skip any indices that don't exist. This
      // allows sparse arrays to be iterated.
      do { ++i; } while (!(i in arr) && i !== len);

      // Exit if result passed to `this.async` done function or returned from
      // the `eachFn` callback was false, or when done iterating.
      if (abort || i === len) {
        // If a `doneFn` callback was specified, invoke that now. Pass in a
        // boolean value representing "not aborted" state along with the array.
        if (doneFn) {
          doneFn(!abort, arr);
        }
        return;
      }

      // Invoke the `eachFn` callback, setting `this` inside the callback to a
      // custom object that contains one method, and passing in the array item,
      // index, and the array.
      result = eachFn.call({
        // If `this.async` is called inside the `eachFn` callback, set the async
        // flag and return a function that can be used to continue iterating.
        async: function() {
          async = true;
          return next;
        }
      }, arr[i], i, arr);

      // If the async flag wasn't set, continue by calling `next` synchronously,
      // passing in the result of the `eachFn` callback.
      if (!async) {
        next(result);
      }
    }());
  };

}(typeof exports === "object" && exports || this));
}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1678340947555);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map