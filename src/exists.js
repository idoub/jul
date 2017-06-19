import _ from './jul.js';
/**
 * Checks whether a property exists on an object and is not undefined.
 * 
 * @memberof _
 * @alias _.exists
 * 
 * @param {object} obj  - The object you want to check the property exists on.
 * @param {string} prop - The name of the property you want to check is not undefined.
 * @return {boolean}    - Whether the property exists on the object and is not undefined.
 */
_.exists = function (obj, prop) {
  return obj.hasOwnProperty(prop) && typeof (obj[prop]) !== 'undefined';
};

export default _;
