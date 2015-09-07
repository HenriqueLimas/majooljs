;(function() {
"use strict";

window.mjs = {};

/**
 * Modules to be used.
 * @type {Object}
 * @private
 */
mjs.modules_ = {};

/**
 * Mantain the name of the current module
 * @type {String}
 * @private
 */
mjs.current_ = null;

/**
 * Create a module and define the current module.
 * @param  {String} name of module to be created
 * @return {Bool}      return created or not.
 */
function module(name) {
  'use strict';

  if (!mjs.modules_[name]) {
    mjs.modules_[name] = {};
  }

  mjs.current_ = mjs.modules_[name];

  return true;
}

/**
 * Append the new component in the current module.
 * @param  {String | Function | object}  name name or function to add on module.
 * @param  {any}  component Component to be appended
 * @return {Bool}            return if its succed.
 */
function exportComponent (name, component) {
  'use strict';

  if (!mjs.current_) {
    throw new Error('Majool says: current module is not defined!');
  }

  var typeOf = typeof name;

  if (typeOf === 'string') {
    if (!component) {
      throw new Error('Majool says: you need to define the component!');
    }

    mjs.current_[name] = component;
  } else if (typeOf === 'function') {
    // TODO: Implement for IE.
    mjs.current_[name.name] = name;
  } else if (typeOf  === 'object') {
    for (var key in name) {
      if ({}.hasOwnProperty.call(name, key)) {
        mjs.current_[key] = name[key];
      }
    }
  } else {
    throw new Error('Majool says: you need to pass a correct first parameter!');
  }
}

/**
 * Append the new component in the current module and set that as default
 * @param  {String | Function}  name name or function to add on module.
 * @param  {any}  component Component to be appended
 * @return {Bool}            return if its succed.
 */
function exportDefault(name, component) {
  'use strict';

  if (!mjs.current_) {
    throw new Error('Majool says: current module is not defined!');
  }

  var typeOf = typeof name;

  mjs.current_.default_ = mjs.current_.default_ || {};

  if (typeOf === 'string') {
    if (!component) {
      throw new Error('Majool says: you need to define the component!');
    }

    mjs.current_.default_[name] = component;
  } else if (typeOf === 'function') {
    mjs.current_.default_[name.name] = name;
  } else {
    throw new Error('Majool says: you need to pass a correct first parameter!');
  }
}

/**
 * Prepare keys to be imported from module
 * @param  {String|Array} properties properties exported to be imported
 * @return {Object}            Object with a from function.
 */
function importComponent (properties) {
  'use strict';

  /**
   * Name of module to take properties imported.
   * @param  {String} moduleName Name of the module
   * @return {Object}            Module with components required.
   */
  function from(moduleName) {
    var module = {};
    var moduleRequested = mjs.modules_[moduleName];

    if (Array.isArray(properties)) {
      for (var i = 0, length = properties.length; i < length; i++) {
        var componentKey = properties[i];

        if (componentKey in moduleRequested) {
          module[componentKey] = moduleRequested[componentKey];
        } else {
          throw new Error('Majool says: the component "' + componentKey + '" does not exist into "' + moduleName + '"');
        }
      }

      return module;
    }

    if (!(properties in moduleRequested.default_)) {
      throw new Error('Majool says: the component "' + properties + '" does not exist into "' + moduleName + '"');
    }

    return moduleRequested.default_[properties];
  }

  return {
    from: from
  };
}

mjs.module = module;
mjs.export = exportComponent;
mjs.exportDefault = exportDefault;
mjs.import = importComponent;
}());
