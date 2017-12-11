import _ from './jul.js';
import each from './each.js';

/**
 * Get a new jul from a query of elements within a current jul.
 * 
 * @param {string} query - The query string you want to use to search within the current jul.
 * @return {jul}         - A new jul if found, otherwise the current jul.
 */
_.prototype.find = function (query) {
  if (typeof query !== 'string') return this;
  var arr = [];
  this.each(function (e) {
    if (e instanceof Node) arr = arr.concat([].slice.call(e.querySelectorAll(query)));
  });
  return _(arr);
};

export default _;