import _ from './jul.js';
import on from './on.js';
import ready from './ready.js';

/**
 * Get a new jul from the concatenation of an existing jul and a new one constructed from the passed parameter.
 * 
 * @param {object|string} obj - The object you want wrapped and concatenated or a string representing a css selector.
 * @return {jul}              - A new jul wrapping both the original object and the added object.
 * 
 * @alias jul().add
 * @memberof jul
 */
_.route = (function () {
  var routes = {};

  _.ready(function () {
    var ls = document.links
    var numLinks = ls.length;
    for (var i = 0; i < numLinks; i++) {
      ls[i].addEventListener('click', function (evt) {
        evt.preventDefault();
        console.log(evt.target.href);
      });
    }
  })

  window.addEventListener('DOMWindowCreated', function (evt) {
    alert('Hello World');
  });

  var router = function (path) {}

  /** routeDefinition
   * {
   *    name: 'name',
   *    path: '/user/:uid/profile,
   *    preware: [
   *      function1,
   *      function2,
   *      [
   *        asyncFunction1,
   *        asyncFunction2
   *      ]
   *    ],
   *    middleware: [],
   *    postware: []
   * }
   */
  return function (routeDefinition) {
    routes[routeDefinition.path] = routeDefinition;
  };
}());

export default _;