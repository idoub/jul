import _ from './jul.js';

var separatorRegex = /[>\+\^\*\(\)#\.\{\}\[\]\s]/;
var attributeRegex = /(\S*=".*?")|(\S*=\S*)|(\S+)/gi;
var dollarRegex = /(\$+@?.*$)/g;
var atModifierRegex = /@(.*)/;


var typeMap = {
  'EM': 'span',
  'P': 'span',
  'UL': 'li',
  'TABLE': 'tr',
  'TR': 'td'
};

var pad = function (pad, str, padleft) {
  if (typeof str === 'undefined') return pad;
  return (padleft) ? (pad + str).slice(-pad.length) : (str + pad).substring(0, pad.length);
};

var getNextIndex = function (str, srch) {
  var nextIndex = str.search(srch);
  if (nextIndex === -1) nextIndex = str.length;
  return nextIndex;
};

var replaceDollar = function (str, count, max) {
  var num = count;
  var dollars = str.match(dollarRegex);
  for (var i = 0; i < dollars.length; i++) {
    var dollar = dollars[i];
    var atIndex = dollar.indexOf('@');
    if (atIndex !== -1) {
      var modifier = dollar.match(atModifierRegex)[1];
      if (modifier[0] === '-') num = max - count + 1;
      if (!isNaN(modifier)) num += Math.abs(modifier) - 1;
      dollar = dollar.substring(0, atIndex);
      str = str.substring(0, str.indexOf('@'));
    }
    var len = dollar.length;
    num = pad(Array(len + 1).join('0'), num, true);
    str = str.replace(/\$+/, num);
  }
  return str;
};

var handleNumbering = function (clone, count, max, isSVG) {
  var i;
  if (clone.className.indexOf('$') !== -1) {
    var classes = clone.className.split(' ');
    for (i = 0; i < classes.length; i++) {
      if (classes[i].indexOf('$') !== -1) {
        classes[i] = replaceDollar(classes[i], count, max);
      }
    }
    clone.className = classes.join(' ');
  }

  var attributes = clone.attributes;
  for (i = 0; i < attributes.length; i++) {
    if (attributes[i].value.indexOf('$') !== -1) {
      attributes[i].value = replaceDollar(attributes[i].value, count, max);
    }
  }

  if (clone.innerText.indexOf('$') !== -1) {
    clone.innerText = replaceDollar(clone.innerText, count, max);
  }

  if (clone.hasAttribute('dollarnodename')) {
    var newClone, type = clone.getAttribute('dollarnodename');
    newClone = createElem(type, isSVG);
    clone.removeAttribute('dollarnodename');
    for (i = 0; i < clone.attributes.length; i++) {
      newClone.setAttribute(clone.attributes[i].name, clone.attributes[i].value);
    }
    newClone.innerHTML = clone.innerHTML;
    clone = newClone;
  }

  return clone;
};

var createElem = function (type, isSVG) {
  return (isSVG) ? document.createElementNS('http://www.w3.org/2000/svg', type) : document.createElement(type);
};

var makeElem = function (parent, elem, isSVG) {
  if (elem === null) {
    var type = typeMap[parent.nodeName] || 'div';
    elem = createElem(type, isSVG);
    parent.appendChild(elem);
  }
  return elem;
};

/**
 * This function will create HTML for you using {@link https://emmet.io/|Emmet} style syntax
 * 
 * @memberof _
 * @alias _.create
 * 
 * @param {string} str - The representation of the html you want to  create.
 * @param {boolean}     isSVG - A boolean determining whether you want to create an SVG heierarchy instead of a standard HTML heierarchy.
 * @return {DocumentFragment} - A DocumentFragment containing the created nodes.
 */
_.create = function (str, isSVG) {
  var parent = document.createDocumentFragment();
  var elem = null,
    nextIndex, head, i;

  var functionMap = {
    '>': function () {
      str = str.slice(1);
      parent = elem;
      elem = null;
    },
    '+': function () {
      str = str.slice(1);
      elem = null;
    },
    '^': function () {
      str = str.slice(1);
      if (!(parent instanceof DocumentFragment)) parent = parent.parentNode;
    },
    '*': function () {
      str = str.slice(1);
      elem = makeElem(parent, elem, isSVG);
      nextIndex = getNextIndex(str, /\D/);
      var num = +str.substring(0, nextIndex);
      elem.setAttribute('toclone', num);
      str = str.substring(nextIndex);
    },
    '(': function () {
      str = str.slice(1);
      var group = document.createElement('group');
      parent.appendChild(group);
      parent = group;
      elem = null;
    },
    ')': function () {
      str = str.slice(1);
      do {
        elem = parent;
        parent = parent.parentNode;
      } while (elem.nodeName !== 'GROUP');
    },
    '[': function () {
      str = str.slice(1);
      elem = makeElem(parent, elem, isSVG);
      nextIndex = getNextIndex(str, ']');
      head = str.substring(0, nextIndex);
      var attributes = head.match(attributeRegex);
      for (i = 0; i < attributes.length; i++) {
        if (attributes[i].indexOf('=') !== -1) {
          var keyVal = attributes[i].split('=');
          var val = keyVal[1];
          if (val[0] === '"') val = val.substring(1, val.length - 1);
          elem.setAttribute(keyVal[0], val);
        } else {
          elem.setAttribute(attributes[i], '');
        }
      }
      str = str.substring(nextIndex + 1);
    },
    '{': function () {
      str = str.slice(1);
      elem = makeElem(parent, elem, isSVG);
      nextIndex = getNextIndex(str, '}');
      head = str.substring(0, nextIndex);
      elem.innerText = head;
      str = str.substring(nextIndex + 1);
    },
    '#': function () {
      str = str.slice(1);
      elem = makeElem(parent, elem, isSVG);
      nextIndex = getNextIndex(str, separatorRegex);
      head = str.substring(0, nextIndex);
      elem.id = head;
      str = str.substring(nextIndex);
    },
    '.': function () {
      str = str.slice(1);
      elem = makeElem(parent, elem, isSVG);
      nextIndex = getNextIndex(str, separatorRegex);
      head = str.substring(0, nextIndex);
      elem.className += (elem.className.length > 0 ? ' ' : '') + head;
      str = str.substring(nextIndex);
    }
  };

  var defaultFunction = function () {
    nextIndex = getNextIndex(str, separatorRegex);
    head = str.substring(0, nextIndex);
    if (head.indexOf('$') !== -1) {
      elem = createElem(head.replace('$', 1), isSVG);
      elem.setAttribute('dollarnodename', head);
    } else {
      elem = createElem(head, isSVG);
    }
    parent.appendChild(elem);
    str = str.substring(nextIndex);
  };

  // This is the main loop, that goes through each character in the string and
  // calls the correct function for that character from either the function map
  // or the default function.
  while (str.length > 0)(functionMap[str[0]] || defaultFunction)();

  // Crawl back up the tree until we find the root parent node.
  while (!(parent instanceof DocumentFragment)) parent = parent.parentNode;

  // Handle postponed clones - that is, elements that should be duplicated.
  var cloneables = parent.querySelectorAll('[toclone]');
  for (i = 0; i < cloneables.length; i++) {
    elem = cloneables[i];
    var numTimes = +elem.getAttribute('toclone');
    elem.removeAttribute('toclone');

    for (var j = 1; j < numTimes + 1; j++) {
      var clone = handleNumbering(elem.cloneNode(true), j, numTimes, isSVG);
      elem.insertAdjacentElement('beforebegin', clone);
    }

    elem.parentNode.removeChild(elem);
  }

  // Handle postponed groups.
  var groups = parent.querySelectorAll('group');
  for (i = 0; i < groups.length; i++) {
    var groupParent = groups[i].parentNode;
    while (groups[i].hasChildNodes()) {
      groups[i].insertAdjacentElement('beforebegin', groups[i].removeChild(groups[i].firstChild));
    }
    groupParent.removeChild(groups[i]);
  }
  return parent;
};

export default _;