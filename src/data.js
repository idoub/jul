import _ from './jul.js';
import each from './each.js';

/**
 * Provides an object representing the data attributes of the wrapped elements.
 * 
 * @return {object}                - An object mapping attribute names to their values.
 */
_.prototype.data = function () {
  var out = {};
  this.each(function (el) {
    if (el.hasAttributes()) {
      var attrs = el.attributes;
      for(var i=0; i<attrs.length; i++) {
        var data = attrs[i].name.split('data-')[1];
        if(typeof data !== 'undefined') {
          out[data] = attrs[i].value;
        }
      }
    }
  });
  return out;
};

export default _;