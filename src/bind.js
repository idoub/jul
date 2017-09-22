import _ from './jul.js';
import Gem from './Gem.js';
import each from './each.js';
import on from './on.js';
import ready from './ready.js';
import find from './find.js';

var model = new Gem();
var events = {};

var getDescendant = function (context, ancestry) {
  return ancestry.split('.').reduce(function (parent, child, i, arr) {
    return parent && parent[child] || (parent.addProp(child), parent[child]);
  }, context);
};

var getGem = function (element, gem, context) {
  context = context || model;
  if (!gem) gem = element.getAttribute('data-j') || '';
  return typeof gem === 'string' ? getDescendant(context, gem) : gem;
};

var getElementType = function (element) {
  var type = element.nodeName;
  if (type === 'INPUT') type = element.type.toUpperCase();
  return type;
};

var bindLoop = function (element, context) {
  if (element.children.length > 1) return console.log('Cannot bind multiple children within loop.');

  var path = element.getAttribute('data-j-loop'),
    gem = getGem(element, path, context),
    inner = element.inner || document.createDocumentFragment(),
    i = 0;

  if (inner.children.length === 0) inner.appendChild(element.children[0].cloneNode(true));
  element.innerHTML = '';

  gem.subscribe(function () {
    element.innerHTML = '';
    for (var i = 0; i < gem.value.length; i++) {
      element.appendChild(inner.cloneNode(true));
      bindAll(element.lastElementChild, new Gem(gem.value[i]));
    }
  });
  element.setAttribute('bound', true);
};

var bindData = function (element, context) {
  var binding = element.getAttribute('data-j').split(':'),
    path = binding[0],
    prop = binding[1],
    gem = getGem(element, path, context);

  element[prop] = gem.value;

  gem.subscribe(function () {
    element[prop] = gem.value;
  });

  _(element).on('change input', function () {
    gem.value = element.value;
  });

  element.setAttribute('bound', true);
};

var bindEvent = function (element, context) {
  var binding = element.getAttribute('data-j-event').split(':'),
    evt = binding[0],
    name = binding[1],
    path = binding.length > 2 ? binding[2] : undefined,
    gem = path ? getGem(element, path, context) : undefined,
    cb = console.log;

  _(element).on(evt, function (e) {
    e.preventDefault();
    if (events.hasOwnProperty(name)) cb = events[name];
    cb(gem.value || e);
  });
};

var bindElement = function (element, context) {
  if (element.getAttribute('data-j-event') && !element.getAttribute('bound')) bindEvent(element, context);
  if (element.getAttribute('data-j-loop') && !element.getAttribute('bound')) bindLoop(element, obj);
  if (element.getAttribute('data-j') && !element.getAttribute('bound')) bindData(element, context);
};

/**
 * Bind all html elements within an element that have a data-j* attribute.
 * 
 * @memberof jul
 * @alias jul(o).bindAll
 * 
 * @param {Node}   [parent=document] - The parent within which you want to bind elements. Defaults to document.
 * @param {Object} [context]         - The object you want to use to bind to the element.
 */
var bindAll = _.bindAll = function (parent, context) {
  parent = parent || document;
  _(parent).find('[data-j-event]:not([bound])').each(function (e) {
    bindEvent(e, context);
  });
  _(parent).find('[data-j-loop]:not([bound])').each(function (e) {
    bindLoop(e, context);
  });
  _(parent).find('[data-j]:not([bound])').each(function (e) {
    bindData(e, context);
  });
};

/**
 * Bind a function as an event on the page.
 * 
 * If there is an element on the page with a binding that has the same name as
 * the name you are giving to the function, then the provided function will be
 * called when the event is triggered.
 * 
 * @param {string}   name - The name of the function. If it is the same as a bound
 * event name on the page, then the next parameter will be called when the event fires.
 * @param {Function} cb   - The function you wish to use when a bound event with
 * the same name fires.
 */
_.bindEvent = function (name, cb) {
  events[name] = cb;
};

_.ready(function (evt) {
  bindAll(document);
});

/**
 * Write a javascript object to a model. Model defaults to jul's internal model.
 * 
 * @memberof jul
 * @alias jul(o).writeModel
 * 
 * @param {Object} obj   - 
 * @param {Gem}    [mod] - 
 */
var writeModel = _.writeModel = function (obj, mod) {
  (mod || model).write(obj);
};

/**
 * Read a model as a standard javascript object. Model defaults to jul's internal model.
 * 
 * @memberof jul
 * @alias jul(o).readModel
 * 
 * @param {Gem}    [mod] - 
 */
var readModel = _.readModel = function (mod) {
  return (mod || model).read();
};

export default _;