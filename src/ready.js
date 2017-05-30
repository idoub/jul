(function () {
  'use strict';
  _.addModule('ready', function () {
    /**
     * <strong><i>This is a simple method to test whether the document is ready
     * for javascript. It should work in >IE7.</i></strong>
     * 
     * @param {function} cb - The callback you want executed when the page is
     * done loading.
     */
    this.ready = function (cb) {
      if (document.readyState != 'loading') cb();
      else document.addEventListener('DOMContentLoaded', cb, false);
    };
  });
})(_ || {});
