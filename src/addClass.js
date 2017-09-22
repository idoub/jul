import _ from './jul.js';
import each from './each.js';

/**
 * Adds a class or classes to wrapped elements
 * 
 * @memberof jul
 * @alias jul(o).addClass
 * 
 * @param {string|string[]} cls - A class or array of classes that you want to add to the wrapped elements.
 * @return {jul}           - The jul that the method was called on.
 */
_.prototype.addClass = function (cls) {
  if (!Array.isArray(cls)) cls = [cls];
  this.each(function (el) {
    var classList = el.className.split(' ');
    for (var j = 0; j < cls.length; j++) {
      if (classList.indexOf(cls[j]) === -1) classList.push(cls[j]);
    }
    el.className = classList.join(' ');
  });
  return this;
};

export default _;