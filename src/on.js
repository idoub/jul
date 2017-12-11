import _ from './jul.js';
import each from './each.js';

/**
 * Set a handler as a callback for one or more events on contained elements.
 * 
 * @param {string} events - A space delimited list of events you want the handler to be used for.
 * @return {jul}          - The jul containing the elements the handler has been added to.
 */
_.prototype.on = function (events, handler) {
  events = events.trim().split(' ');
  this.each(function (element) {
    for (var i = 0; i < events.length; i++) {
      element.addEventListener(events[i], handler);
    }
  });
  return this;
};

export default _;