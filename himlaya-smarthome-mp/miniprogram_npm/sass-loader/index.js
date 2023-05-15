module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1678340948479, function(require, module, exports) {


const loader = require('./index');

module.exports = loader.default;
}, function(modId) {var map = {"./index":1678340948480}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340948480, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _neoAsync = _interopRequireDefault(require("neo-async"));

var _pify = _interopRequireDefault(require("pify"));

var _semver = _interopRequireDefault(require("semver"));

var _loaderUtils = require("loader-utils");

var _formatSassError = _interopRequireDefault(require("./formatSassError"));

var _webpackImporter = _interopRequireDefault(require("./webpackImporter"));

var _getSassOptions = _interopRequireDefault(require("./getSassOptions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let nodeSassJobQueue = null; // Very hacky check

function hasGetResolve(loaderContext) {
  return loaderContext.getResolve && // eslint-disable-next-line no-underscore-dangle
  loaderContext._compiler && // eslint-disable-next-line no-underscore-dangle
  loaderContext._compiler.resolverFactory && // eslint-disable-next-line no-underscore-dangle
  loaderContext._compiler.resolverFactory._create && /cachedCleverMerge/.test( // eslint-disable-next-line no-underscore-dangle
  loaderContext._compiler.resolverFactory._create.toString());
}
/**
 * The sass-loader makes node-sass and dart-sass available to webpack modules.
 *
 * @this {LoaderContext}
 * @param {string} content
 */


function loader(content) {
  const options = (0, _loaderUtils.getOptions)(this) || {};
  const callback = this.async();

  const addNormalizedDependency = file => {
    // node-sass returns POSIX paths
    this.dependency(_path.default.normalize(file));
  };

  if (typeof callback !== 'function') {
    throw new Error('Synchronous compilation is not supported anymore. See https://github.com/webpack-contrib/sass-loader/issues/333');
  }

  let resolve = (0, _pify.default)(this.resolve); // Supported since v4.36.0

  if (hasGetResolve(this)) {
    resolve = this.getResolve({
      mainFields: ['sass', 'style', 'main', '...'],
      mainFiles: ['_index', 'index', '...'],
      extensions: ['.scss', '.sass', '.css', '...']
    });
  }

  const sassOptions = (0, _getSassOptions.default)(this, options, content);
  const shouldUseWebpackImporter = typeof options.webpackImporter === 'boolean' ? options.webpackImporter : true;

  if (shouldUseWebpackImporter) {
    sassOptions.importer.push((0, _webpackImporter.default)(this.resourcePath, resolve, addNormalizedDependency));
  } // Skip empty files, otherwise it will stop webpack, see issue #21


  if (sassOptions.data.trim() === '') {
    callback(null, '');
    return;
  }

  const render = getRenderFuncFromSassImpl( // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  options.implementation || getDefaultSassImpl());
  render(sassOptions, (error, result) => {
    if (error) {
      (0, _formatSassError.default)(error, this.resourcePath);

      if (error.file) {
        this.dependency(error.file);
      }

      callback(error);
      return;
    }

    if (result.map && result.map !== '{}') {
      // eslint-disable-next-line no-param-reassign
      result.map = JSON.parse(result.map); // result.map.file is an optional property that provides the output filename.
      // Since we don't know the final filename in the webpack build chain yet, it makes no sense to have it.
      // eslint-disable-next-line no-param-reassign

      delete result.map.file; // One of the sources is 'stdin' according to dart-sass/node-sass because we've used the data input.
      // Now let's override that value with the correct relative path.
      // Since we specified options.sourceMap = path.join(process.cwd(), "/sass.map"); in getSassOptions,
      // we know that this path is relative to process.cwd(). This is how node-sass works.
      // eslint-disable-next-line no-param-reassign

      const stdinIndex = result.map.sources.findIndex(source => source.indexOf('stdin') !== -1);

      if (stdinIndex !== -1) {
        // eslint-disable-next-line no-param-reassign
        result.map.sources[stdinIndex] = _path.default.relative(process.cwd(), this.resourcePath);
      } // node-sass returns POSIX paths, that's why we need to transform them back to native paths.
      // This fixes an error on windows where the source-map module cannot resolve the source maps.
      // @see https://github.com/webpack-contrib/sass-loader/issues/366#issuecomment-279460722
      // eslint-disable-next-line no-param-reassign


      result.map.sourceRoot = _path.default.normalize(result.map.sourceRoot); // eslint-disable-next-line no-param-reassign

      result.map.sources = result.map.sources.map(_path.default.normalize);
    } else {
      // eslint-disable-next-line no-param-reassign
      result.map = null;
    }

    result.stats.includedFiles.forEach(addNormalizedDependency);
    callback(null, result.css.toString(), result.map);
  });
}
/**
 * Verifies that the implementation and version of Sass is supported by this loader.
 *
 * @param {Object} module
 * @returns {Function}
 */


function getRenderFuncFromSassImpl(module) {
  const {
    info
  } = module;

  if (!info) {
    throw new Error('Unknown Sass implementation.');
  }

  const components = info.split('\t');

  if (components.length < 2) {
    throw new Error(`Unknown Sass implementation "${info}".`);
  }

  const [implementation, version] = components;

  if (!_semver.default.valid(version)) {
    throw new Error(`Invalid Sass version "${version}".`);
  }

  if (implementation === 'dart-sass') {
    if (!_semver.default.satisfies(version, '^1.3.0')) {
      throw new Error(`Dart Sass version ${version} is incompatible with ^1.3.0.`);
    }

    return module.render.bind(module);
  } else if (implementation === 'node-sass') {
    if (!_semver.default.satisfies(version, '^6.0.1')) {
      throw new Error(`Node Sass version ${version} is incompatible with ^6.0.1.`);
    } // There is an issue with node-sass when async custom importers are used
    // See https://github.com/sass/node-sass/issues/857#issuecomment-93594360
    // We need to use a job queue to make sure that one thread is always available to the UV lib


    if (nodeSassJobQueue === null) {
      const threadPoolSize = Number(process.env.UV_THREADPOOL_SIZE || 4);
      nodeSassJobQueue = _neoAsync.default.queue(module.render.bind(module), threadPoolSize - 1);
    }

    return nodeSassJobQueue.push.bind(nodeSassJobQueue);
  }

  throw new Error(`Unknown Sass implementation "${implementation}".`);
}

function getDefaultSassImpl() {
  let sassImplPkg = 'node-sass';

  try {
    require.resolve('node-sass');
  } catch (error) {
    try {
      require.resolve('sass');

      sassImplPkg = 'sass';
    } catch (ignoreError) {
      sassImplPkg = 'node-sass';
    }
  } // eslint-disable-next-line import/no-dynamic-require, global-require


  return require(sassImplPkg);
}

var _default = loader;
exports.default = _default;
}, function(modId) { var map = {"./formatSassError":1678340948481,"./webpackImporter":1678340948482,"./getSassOptions":1678340948484}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340948481, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _os = _interopRequireDefault(require("os"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// A typical sass error looks like this
// const SassError = {
//   message: "invalid property name",
//   column: 14,
//   line: 1,
//   file: "stdin",
//   status: 1
// };

/**
 * Enhances the sass error with additional information about what actually went wrong.
 *
 * @param {SassError} error
 * @param {string} resourcePath
 */
function formatSassError(error, resourcePath) {
  // Instruct webpack to hide the JS stack from the console
  // Usually you're only interested in the SASS stack in this case.
  // eslint-disable-next-line no-param-reassign
  error.hideStack = true; // The file property is missing in rare cases.
  // No improvement in the error is possible.

  if (!error.file) {
    return;
  }

  let msg = error.message;

  if (error.file === 'stdin') {
    // eslint-disable-next-line no-param-reassign
    error.file = resourcePath;
  } // node-sass returns UNIX-style paths
  // eslint-disable-next-line no-param-reassign


  error.file = _path.default.normalize(error.file); // The 'Current dir' hint of node-sass does not help us, we're providing
  // additional information by reading the err.file property

  msg = msg.replace(/\s*Current dir:\s*/, ''); // msg = msg.replace(/(\s*)(stdin)(\s*)/, `$1${err.file}$3`);
  // eslint-disable-next-line no-param-reassign

  error.message = `${getFileExcerptIfPossible(error) + msg.charAt(0).toUpperCase() + msg.slice(1) + _os.default.EOL}      in ${error.file} (line ${error.line}, column ${error.column})`;
}
/**
 * Tries to get an excerpt of the file where the error happened.
 * Uses err.line and err.column.
 *
 * Returns an empty string if the excerpt could not be retrieved.
 *
 * @param {SassError} error
 * @returns {string}
 */


function getFileExcerptIfPossible(error) {
  try {
    const content = _fs.default.readFileSync(error.file, 'utf8');

    return `${_os.default.EOL + content.split(/\r?\n/)[error.line - 1] + _os.default.EOL + new Array(error.column - 1).join(' ')}^${_os.default.EOL}      `;
  } catch (ignoreError) {
    // If anything goes wrong here, we don't want any errors to be reported to the user
    return '';
  }
}

var _default = formatSassError;
exports.default = _default;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340948482, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _importsToResolve = _interopRequireDefault(require("./importsToResolve"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @name PromisedResolve
 * @type {Function}
 * @param {string} dir
 * @param {string} request
 * @returns Promise
 */

/**
 * @name Importer
 * @type {Function}
 * @param {string} url
 * @param {string} prev
 * @param {Function<Error, string>} done
 */
const matchCss = /\.css$/;
/**
 * Returns an importer that uses webpack's resolving algorithm.
 *
 * It's important that the returned function has the correct number of arguments
 * (based on whether the call is sync or async) because otherwise node-sass doesn't exit.
 *
 * @param {string} resourcePath
 * @param {PromisedResolve} resolve
 * @param {Function<string>} addNormalizedDependency
 * @returns {Importer}
 */

function webpackImporter(resourcePath, resolve, addNormalizedDependency) {
  function dirContextFrom(fileContext) {
    return _path.default.dirname( // The first file is 'stdin' when we're using the data option
    fileContext === 'stdin' ? resourcePath : fileContext);
  } // eslint-disable-next-line no-shadow


  function startResolving(dir, importsToResolve) {
    return importsToResolve.length === 0 ? Promise.reject() : resolve(dir, importsToResolve[0]).then(resolvedFile => {
      // Add the resolvedFilename as dependency. Although we're also using stats.includedFiles, this might come
      // in handy when an error occurs. In this case, we don't get stats.includedFiles from node-sass.
      addNormalizedDependency(resolvedFile);
      return {
        // By removing the CSS file extension, we trigger node-sass to include the CSS file instead of just linking it.
        file: resolvedFile.replace(matchCss, '')
      };
    }, () => {
      const [, ...tailResult] = importsToResolve;
      return startResolving(dir, tailResult);
    });
  }

  return (url, prev, done) => {
    startResolving(dirContextFrom(prev), (0, _importsToResolve.default)(url)) // Catch all resolving errors, return the original file and pass responsibility back to other custom importers
    .catch(() => {
      return {
        file: url
      };
    }).then(done);
  };
}

var _default = webpackImporter;
exports.default = _default;
}, function(modId) { var map = {"./importsToResolve":1678340948483}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340948483, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _loaderUtils = _interopRequireDefault(require("loader-utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Examples:
// - ~package
// - ~package/
// - ~@org
// - ~@org/
// - ~@org/package
// - ~@org/package/
const matchModuleImport = /^~([^/]+|[^/]+\/|@[^/]+[/][^/]+|@[^/]+\/?|@[^/]+[/][^/]+\/)$/;
/**
 * When libsass tries to resolve an import, it uses a special algorithm.
 * Since the sass-loader uses webpack to resolve the modules, we need to simulate that algorithm. This function
 * returns an array of import paths to try. The last entry in the array is always the original url
 * to enable straight-forward webpack.config aliases.
 *
 * @param {string} url
 * @returns {Array<string>}
 */

function importsToResolve(url) {
  const request = _loaderUtils.default.urlToRequest(url); // Keep in mind: ext can also be something like '.datepicker' when the true extension is omitted and the filename contains a dot.
  // @see https://github.com/webpack-contrib/sass-loader/issues/167


  const ext = _path.default.extname(request); // In case there is module request, send this to webpack resolver


  if (matchModuleImport.test(url)) {
    return [request, url];
  } // Because @import is also defined in CSS, Sass needs a way of compiling plain CSS @imports without trying to import the files at compile time.
  // To accomplish this, and to ensure SCSS is as much of a superset of CSS as possible, Sass will compile any @imports with the following characteristics to plain CSS imports:
  //  - imports where the URL ends with .css.
  //  - imports where the URL begins http:// or https://.
  //  - imports where the URL is written as a url().
  //  - imports that have media queries.
  //
  // The `node-sass` package sends `@import` ending on `.css` to importer, it is bug, so we skip resolve


  if (ext === '.css') {
    return [];
  }

  const dirname = _path.default.dirname(request);

  const basename = _path.default.basename(request); // In case there is file extension:
  //
  // 1. Try to resolve `_` file.
  // 2. Try to resolve file without `_`.
  // 3. Send a original url to webpack resolver, maybe it is alias.


  if (['.scss', '.sass'].includes(ext)) {
    return [`${dirname}/_${basename}`, `${dirname}/${basename}`, url];
  } // In case there is no file extension and filename starts with `_`:
  //
  // 1. Try to resolve files with `scss`, `sass` and `css` extensions.
  // 2. Try to resolve directory with `_index` or `index` filename.
  // 3. Send the original url to webpack resolver, maybe it's alias.


  if (basename.charAt(0) === '_') {
    return [`${request}.scss`, `${request}.sass`, `${request}.css`, request, url];
  } // In case there is no file extension and filename doesn't start with `_`:
  //
  // 1. Try to resolve file starts with `_` and with extensions
  // 2. Try to resolve file with extensions
  // 3. Try to resolve directory with `_index` or `index` filename.
  // 4. Send a original url to webpack resolver, maybe it is alias.


  return [`${dirname}/_${basename}.scss`, `${dirname}/_${basename}.sass`, `${dirname}/_${basename}.css`, `${request}.scss`, `${request}.sass`, `${request}.css`, request, url];
}

var _default = importsToResolve;
exports.default = _default;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340948484, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _os = _interopRequireDefault(require("os"));

var _path = _interopRequireDefault(require("path"));

var _cloneDeep = _interopRequireDefault(require("clone-deep"));

var _proxyCustomImporters = _interopRequireDefault(require("./proxyCustomImporters"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isProductionLikeMode(loaderContext) {
  return loaderContext.mode === 'production' || !loaderContext.mode || loaderContext.minimize;
}
/**
 * Derives the sass options from the loader context and normalizes its values with sane defaults.
 *
 * Please note: If loaderContext.query is an options object, it will be re-used across multiple invocations.
 * That's why we must not modify the object directly.
 *
 * @param {LoaderContext} loaderContext
 * @param {string} loaderOptions
 * @param {object} content
 * @returns {Object}
 */


function getSassOptions(loaderContext, loaderOptions, content) {
  const options = (0, _cloneDeep.default)(loaderOptions);
  const {
    resourcePath
  } = loaderContext; // allow opt.functions to be configured WRT loaderContext

  if (typeof options.functions === 'function') {
    options.functions = options.functions(loaderContext);
  }

  let {
    data
  } = options;

  if (typeof options.data === 'function') {
    data = options.data(loaderContext);
  }

  options.data = data ? data + _os.default.EOL + content : content; // opt.outputStyle

  if (!options.outputStyle && isProductionLikeMode(loaderContext)) {
    options.outputStyle = 'compressed';
  } // opt.sourceMap
  // Not using the `this.sourceMap` flag because css source maps are different
  // @see https://github.com/webpack/css-loader/pull/40


  if (options.sourceMap) {
    // Deliberately overriding the sourceMap option here.
    // node-sass won't produce source maps if the data option is used and options.sourceMap is not a string.
    // In case it is a string, options.sourceMap should be a path where the source map is written.
    // But since we're using the data option, the source map will not actually be written, but
    // all paths in sourceMap.sources will be relative to that path.
    // Pretty complicated... :(
    options.sourceMap = _path.default.join(process.cwd(), '/sass.map');

    if ('sourceMapRoot' in options === false) {
      options.sourceMapRoot = process.cwd();
    }

    if ('omitSourceMapUrl' in options === false) {
      // The source map url doesn't make sense because we don't know the output path
      // The css-loader will handle that for us
      options.omitSourceMapUrl = true;
    }

    if ('sourceMapContents' in options === false) {
      // If sourceMapContents option is not set, set it to true otherwise maps will be empty/null
      // when exported by webpack-extract-text-plugin.
      options.sourceMapContents = true;
    }
  } // indentedSyntax is a boolean flag.


  const ext = _path.default.extname(resourcePath); // If we are compiling sass and indentedSyntax isn't set, automatically set it.


  if (ext && ext.toLowerCase() === '.sass' && 'indentedSyntax' in options === false) {
    options.indentedSyntax = true;
  } else {
    options.indentedSyntax = Boolean(options.indentedSyntax);
  } // Allow passing custom importers to `node-sass`. Accepts `Function` or an array of `Function`s.


  options.importer = options.importer ? (0, _proxyCustomImporters.default)(options.importer, resourcePath) : []; // `node-sass` uses `includePaths` to resolve `@import` paths. Append the currently processed file.

  options.includePaths = options.includePaths || [];
  options.includePaths.push(_path.default.dirname(resourcePath));
  return options;
}

var _default = getSassOptions;
exports.default = _default;
}, function(modId) { var map = {"./proxyCustomImporters":1678340948485}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1678340948485, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Creates new custom importers that use the given `resourcePath` if libsass calls the custom importer with `prev`
 * being 'stdin'.
 *
 * Why do we need this? We have to use the `data` option of node-sass in order to compile our sass because
 * the `resourcePath` might not be an actual file on disk. When using the `data` option, libsass uses the string
 * 'stdin' instead of a filename.
 *
 * We have to fix this behavior in order to provide a consistent experience to the webpack user.
 *
 * @param {Function|Array<Function>} importer
 * @param {string} resourcePath
 * @returns {Array<Function>}
 */
function proxyCustomImporters(importer, resourcePath) {
  return [].concat(importer).map( // eslint-disable-next-line no-shadow
  importer => function customImporter() {
    return importer.apply(this, // eslint-disable-next-line prefer-rest-params
    Array.from(arguments).map((arg, i) => i === 1 && arg === 'stdin' ? resourcePath : arg));
  });
}

var _default = proxyCustomImporters;
exports.default = _default;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1678340948479);
})()
//miniprogram-npm-outsideDeps=["path","neo-async","pify","semver","loader-utils","os","fs","clone-deep"]
//# sourceMappingURL=index.js.map