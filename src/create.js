(function (_) {
  'use strict';
  _.addModule('create', function () {
    var separatorRegex = /[>\+\^\*\(\)#\.\{\}\[\]\s]/;
    var attributeRegex = /(\S*=".*?")|(\S*=\S*)|(\S+)/gi;
    var dollarRegex = /(\$+@?.*$)/g;
    var atModifierRegex = /@(.*)/;

    var pad = function (pad, str, padleft) {
      if (typeof str === 'undefined')
        return pad;
      if (padleft) {
        return (pad + str).slice(-pad.length);
      } else {
        return (str + pad).substring(0, pad.length);
      }
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
        if (isSVG) {
          newClone = document.createElementNS('http://www.w3.org/2000/svg', type);
        } else {
          newClone = document.createElement(type);
        }
        clone.removeAttribute('dollarnodename');
        for (i = 0; i < clone.attributes.length; i++) {
          newClone.setAttribute(clone.attributes[i].name, clone.attributes[i].value);
        }
        newClone.innerHTML = clone.innerHTML;
        clone = newClone;
      }
      return clone;
    };

    var makeElem = function (parent, elem, isSVG) {
      if (elem === null) {
        var type = 'div';
        switch (parent.nodeName) {
        case 'EM':
          type = 'span';
          break;
        case 'P':
          type = 'span';
          break;
        case 'UL':
          type = 'li';
          break;
        case 'TABLE':
          type = 'tr';
          break;
        case 'TR':
          type = 'td';
          break;
        }
        if (isSVG) {
          elem = document.createElementNS('http://www.w3.org/2000/svg', type);
        } else {
          elem = document.createElement(type);
        }
        parent.appendChild(elem);
      }
      return elem;
    };

    var create = function (str, isSVG) {
      var parent = document.createDocumentFragment();
      var elem = null,
        nextIndex, head, i;

      while (str.length > 0) {
        switch (str[0]) {
        case '>':
          str = str.slice(1);
          parent = elem;
          elem = null;
          break;

        case '+':
          str = str.slice(1);
          elem = null;
          break;

        case '^':
          str = str.slice(1);
          if (!(parent instanceof DocumentFragment)) parent = parent.parentNode;
          break;

        case '*':
          str = str.slice(1);
          elem = makeElem(parent, elem, isSVG);
          nextIndex = getNextIndex(str, /\D/);
          var num = +str.substring(0, nextIndex);
          elem.setAttribute('toclone', num);
          str = str.substring(nextIndex);
          break;

        case '(':
          str = str.slice(1);
          var group = document.createElement('group');
          parent.appendChild(group);
          parent = group;
          elem = null;
          break;

        case ')':
          str = str.slice(1);
          do {
            elem = parent;
            parent = parent.parentNode;
          } while (elem.nodeName !== 'GROUP');
          break;

        case '[':
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
          break;

        case '{':
          str = str.slice(1);
          elem = makeElem(parent, elem, isSVG);
          nextIndex = getNextIndex(str, '}');
          head = str.substring(0, nextIndex);
          elem.innerText = head;
          str = str.substring(nextIndex + 1);
          break;

        case '#':
          str = str.slice(1);
          elem = makeElem(parent, elem, isSVG);
          nextIndex = getNextIndex(str, separatorRegex);
          head = str.substring(0, nextIndex);
          elem.id = head;
          str = str.substring(nextIndex);
          break;

        case '.':
          str = str.slice(1);
          elem = makeElem(parent, elem, isSVG);
          nextIndex = getNextIndex(str, separatorRegex);
          head = str.substring(0, nextIndex);
          elem.className += (elem.className.length > 0 ? ' ' : '') + head;
          str = str.substring(nextIndex);
          break;

        default:
          nextIndex = getNextIndex(str, separatorRegex);
          head = str.substring(0, nextIndex);
          if (head.indexOf('$') !== -1) {
            if (isSVG) {
              elem = document.createElementNS('http://www.w3.org/2000/svg', head.replace('$', 1));
            } else {
              elem = document.createElement(head.replace('$', 1));
            }
            elem.setAttribute('dollarnodename', head);
          } else {
            if (isSVG) {
              elem = document.createElementNS('http://www.w3.org/2000/svg', head);
            } else {
              elem = document.createElement(head);
            }
          }
          parent.appendChild(elem);
          str = str.substring(nextIndex);
        }
      }

      while(!(parent instanceof DocumentFragment)){
        parent = parent.parentNode;
      }

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

    /**
     * This function will create HTML for you using {@link https://emmet.io/|Emmet} style syntax
     * 
     * ##### Examples
     * ###### Child: >
     * `nav>ul>li`
     * ```html
     * <nav>
     *   <ul>
     *     <li></li>
     *   </ul>
     * </nav>
     * ```
     * ---
     * ###### Sibling: +
     * `div+p+bq`
     * ```html
     * <div></div>
     * <p></p>
     * <blockquote></blockquote>
     * ```
     * ---
     * ###### Climb-up: ^
     * `div+div>p>span+em^bq`
     * ```html
     * <div></div>
     * <div>
     *   <p>
     *     <span></span>
     *     <em></em>
     *   <p>
     *   <blockquote></blockquote>
     * </div>
     * ```
     * `div+div>p>span+em^^bq`
     * ```html
     * <div></div>
     * <div>
     *   <p>
     *     <span></span>
     *     <em></em>
     *   </p>
     * </div>
     * <blockquote></blockquote>
     * ```
     * ---
     * ###### Grouping: ()
     * `div>(header>ul>li*2>a)+footer>p`
     * ```html
     * <div>
     *   <header>
     *     <ul>
     *       <li><a></a></li>
     *       <li><a></a></li>
     *     </ul>
     *   </header>
     *   <footer>
     *     <p></p>
     *   </footer>
     * </div>
     * ```
     * `(div>dl>(dt+dd)*3)+footer>p`
     * ```html
     * <div>
     *   <dl>
     *     <dt></dt>
     *     <dd></dd>
     *     <dt></dt>
     *     <dd></dd>
     *     <dt></dt>
     *     <dd></dd>
     *   </dl>
     * </div>
     * <footer>
     *   <p></p>
     * </footer>
     * ```
     * ---
     * ###### Multiplication: *
     * `ul>li*5`
     * ```html
     * <ul>
     *   <li></li>
     *   <li></li>
     *   <li></li>
     *   <li></li>
     *   <li></li>
     * </ul>
     * ```
     * ---
     * ###### Item numbering: $
     * `ul>li.item$*5`
     * ```html
     * <ul>
     *   <li class="item1"></li>
     *   <li class="item2"></li>
     *   <li class="item3"></li>
     *   <li class="item4"></li>
     *   <li class="item5"></li>
     * </ul>
     * ```
     * `h$[title=item$]{Header $}*3`
     * ```html
     * <ul>
     *   <h1 title="item1">Header 1</h1>
     *   <h2 title="item2">Header 2</h1>
     *   <h3 title="item3">Header 3</h1>
     * </ul>
     * ```
     * `ul>li.item$$$*5`
     * ```html
     * <ul>
     *   <li class="item001"></li>
     *   <li class="item002"></li>
     *   <li class="item003"></li>
     *   <li class="item004"></li>
     *   <li class="item005"></li>
     * </ul>
     * ```
     * `ul>li.item$@-*5`
     * ```html
     * <ul>
     *   <li class="item5"></li>
     *   <li class="item4"></li>
     *   <li class="item3"></li>
     *   <li class="item2"></li>
     *   <li class="item1"></li>
     * </ul>
     * ```
     * `ul>li.item$$$@-3*5`
     * ```html
     * <ul>
     *   <li class="item007"></li>
     *   <li class="item006"></li>
     *   <li class="item005"></li>
     *   <li class="item004"></li>
     *   <li class="item003"></li>
     * </ul>
     * ```
     * ---
     * ###### ID and CLASS attributes
     * `#header`
     * ```html
     * <div id="header"></div>
     * ```
     * `.title`
     * ```html
     * <div class="title"></div>
     * ```
     * `form#search.wide`
     * ```html
     * <form id="search" class="wide"></form>
     * ```
     * `p.class1.class2.class3`
     * ```html
     * <p class="class1 class2 class3"></p>
     * ```
     * ---
     * ###### Custom attributes: []
     * `p[title="Hello world"]`
     * ```html
     * <p title="Hello World"></p>
     * ```
     * `td[rowspan=2 colspan=3 title]`
     * ```html
     * <td rowspan="2" colspan="3" title></td>
     * ```
     * `[a='value1' b="value2"]`
     * ```html
     * <div a="value1" b="value2"></div>
     * ```
     * ---
     * ###### Text: {}
     * `a{Click me}`
     * ```html
     * <a>Click me</a>
     * ```
     * `p>{Click }+a{here}+{ to continue}`
     * ```html
     * <p><span>Click </span><a>here</a><span> to continue</span></p>
     * ```
     * ---
     * ###### Implicit tag names
     * `.class`
     * ```html
     * <div class="class"></div>
     * ```
     * `em>.class`
     * ```html
     * <em>
     *   <span class="class"></span>
     * </em>
     * ```
     * `ul>.class`
     * ```html
     * <ul>
     *   <li class="class"></li>
     * </ul>
     * ```
     * `table>.row>.col`
     * ```html
     * <table>
     *   <tr class="row">
     *     <td class="col"></td>
     *   </tr>
     * </table>
     * ```
     * 
     * @memberof _
     * @alias _.create
     * 
     * @param {object|string} obj - The representation of the html you want to  create.
     * @param {boolean}     isSVG - A boolean determining whether you want to create an SVG heierarchy instead of a standard HTML heierarchy.
     * @return {DocumentFragment} - A DocumentFragment containing the created nodes.
     */
    this.create = create;
  });
})(_ || {});
