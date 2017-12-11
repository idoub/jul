/**
 * @license
 * Copyright © 2017, Isaac Doub
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
 * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 * 
 */

var self = {};
self.e = [];

/**
 * This is the core underscore module required for everything else.
 * It defines the selector function which can be used to create a new `_` instance
 * wrapping the selected objects as well as defining an 'addModule' function
 * which can be used to extend the base `_` object in a safe way.
 * 
 * Calling underscore as a function internally creates a new object with
 * the jul as it's prototype. It also creates a property `_.e`
 * which is a reference to either:
 * * a list of elements located by the selector passed in as a parameter,
 * * the object passed in as a parameter if it is an array,</li>
 * * the object wrapped in an array if it is anything else.</li>
 *
 * Internally, this function uses [document.querySelectorAll]{@link https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll}
 * to get an arraylike object of all matching elements when a selector is
 * passed to it.
 * 
 * @param    o - The object to be wrapped or a selector to identify the
 * elements to be wrapped.
 * @return {jul} - A new jul.
 * 
 * @constructor
 * @alias jul
 */
var _ = function (o) {
  self.o = o = o || [];
  if (o instanceof _) return o;
  self = Object.create(_.prototype);
  self.e = (typeof o === 'string') ? [].slice.call(document.querySelectorAll(o)) : (Array.isArray(o)) ? o : [o];
  return self;
};

export default _;