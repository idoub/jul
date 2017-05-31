/**
 * This is the core underscore module required for everything else.
 * It defines the selector function which can be used to create a new _ instance
 * wrapping the selected objects as well as defining an 'addModule' function
 * which can be used to extend the base _ object in a safe way.
 * 
 * @namespace _
 */
(function (d) {
  'use strict';
  var self = {},
    modules = [];
  self.e = [];

  /**
   * ***The underscore selector and constructor.***
   * 
   * Calling underscore as a function internally creates a new object with
   * the underscore object as it's prototype. It also creates a property `_.e`
   * which is a reference to either:
   * * a list of elements located by the selector passed in as a parameter,
   * * the object passed in as a parameter if it is an array,</li>
   * * the object wrapped in an array if it is anything else.</li>
   *
   * Internally, this function uses [document.querySelectorAll]{@link https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll}
   * to get an arraylike object of all matching elements when a selector is
   * passed to it.
   * 
   * @memberof _
   * @alias _
   * 
   * @param    o - The object to be wrapped or a selector to identify the
   * elements to be wrapped.
   * @return {_} - A new underscore object.
   */
  this._ = function (o) {
    o = o || [];
    if (o instanceof _) return o;
    self = Object.create(_.prototype);
    self.e = (typeof o === 'string') ? [].slice.call(d.querySelectorAll(o)) : (Array.isArray(o)) ? o : [o];
    return self;
  };
}.call(this, document));
