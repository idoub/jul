/**
 * This is the core underscore module required for everything else.
 * It defines the selector function which can be used to create a new _ instance
 * wrapping the selected objects as well as defining an 'addModule' function
 * which can be used to extend the base _ object in a safe way.
 * 
 * @namespace _
 */
var _ = (function(d){
    'use strict';
    var self = {}, modules = []; self.e = [];  _.fn = _.prototype;

    /**
     * <strong><i>The underscore selector and constructor.</i></strong>
     * 
     * <p>Calling underscore as a function internally creates a new object with
     * the underscore object as it's prototype. It also creates a property '_.e'
     * which is a reference to either:</p>
     * <ol>
     * <li>a list of elements located by the selector passed in as a parameter,
     * </li>
     * <li>the object passed in as a parameter if it is an array,</li>
     * <li>the object wrapped in an array if it is anything else.</li>
     * </ol>
     * <p>Internally, this function uses [document.querySelectorAll]{@link
     * https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll}
     * to get an arraylike object of all matching elements when a selector is
     * passed to it.</p>
     * 
     * @memberof _
     * @param    o - The object to be wrapped or a selector to identify the
     * elements to be wrapped.
     * @return {_} - A new underscore object.
     */
    function _(o) {
        o = o || [];
        if(o instanceof _) return o;
        self = Object.create(_.fn);
        self.e = (typeof o === 'string') ? Array.from(d.querySelectorAll(o)) : (Array.isArray(o)) ? o : [o];
        return self;
    }

    /**
     * <strong><i>This function allows you to extend the core underscore object
     * in a safe way, defining other dependencies for your module as well as
     * namespacing if you need.</i></strong>
     * 
     * @memberof _
     * @param {string}   name     - The name of the module you are adding.
     * @param {function} fn       - An IIFE to define your module.
     * @param {string[]}    required - An array of modules that are required for
     * the module you are defining to run correctly.
     * 
     * @example
     *  // Define a new module.
     *  _.addModule('moduleName',function() {
     *      // This is an internal variable. It won't be accessible outside the module scope.
     *      var default = {'foo':bar}
     * 
     *      // This method is defined directly on the _ object. It will be accessible by _.staticMethod.
     *      this.staticMethod = function(params){
     *          // Using a required module.
     *          _.extend(default,params)
     *      };
     * 
     *      // This method is defined on the _ function. It will be accessible by _().functionMethod.
     *      this.prototype.functionMethod = function(params){};
     * 
     *  // Require the 'extend' module.
     *  },['extend']);
     * 
     *  // Now we can access two new methods.
     *  _.staticMethod({hello:'world'});
     *  _('.style').functionMethod('something');
     */
    _.addModule = function(name,fn,required) {
        required = required || [];
        for(var i=0; i<required.length; i++) {
            if(modules.indexOf(required[i]) === -1) {
                throw new Error('\''+required[i]+'\' is required for module \''+ name+'\': \''+name+'\' will not be loaded.');
            }
        }
        modules.push(name);
        fn.call(this);
    };
    return _;
}.call(this,document));