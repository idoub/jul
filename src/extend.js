import _ from './jul.js';

/**
 * A deep extend method.
 * 
 * @memberof _
 * @alias _.extend
 * 
 * @param  {object}    out - The function that you want to extend.
 * @param  {...object} o   - Any objects you want to grab properties from and add to the extended object.
 * @return {object}        - The first parameter with added properties.
 */
_.extend = function (out, o) {
  out = out || {};
  for (var i = 1; i < arguments.length; i++) {
    var obj = arguments[i];
    if (!obj) continue;
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        out[key] = (typeof obj[key] === 'object') ? this.extend(out[key], obj[key]) : obj[key];
      }
    }
  }
  return out;
};

/**
 * Deep extend an already wrapped object.
 * 
 * @memberof _
 * @alias _(o).extend
 * 
 * @param  {...*} o - Any objects you want to grab properties from and add to the currently wrapped object.
 * @return {object} - The wrapped object that has been extended with additional parameters.
 */
_.prototype.extend = function (o) {
  var args = Array.from(arguments);
  return this.extend(this.e, args);
};

export default _;