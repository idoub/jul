import _ from './jul.js';

/**
 * This is a simple method to test whether the document is ready for javascript. It should work in >IE7.
 * 
 * @memberof _
 * @alias _.ready
 * 
 * @param {function} cb - The callback you want executed when the page is done loading.
 */
_.ready = function (cb) {
  if (document.readyState != 'loading') cb();
  else document.addEventListener('DOMContentLoaded', cb, false);
};
    
export default _;