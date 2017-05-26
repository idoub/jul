/**
 * This is the core underscore module required for everything else.
 * It defines the selector function which can be used to create a new _ instance
 * wrapping the selected objects as well as defining an 'addModule' function
 * which can be used to extend the base _ object in a safe way.
 */
// var _ = (function(d){
(function(d){
    'use strict';
    var self = {}, modules = [];
    self.e = [];

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
     * @param    o - The object to be wrapped or a selector to identify the
     * elements to be wrapped.
     * @return {_} - A new underscore object.
     */
    // var _ = function(o) {
    this._ = function(o) {
        o = o || [];
        if(o instanceof _) return o;
        self = Object.create(_.prototype);
        self.e = (typeof o === 'string') ? Array.from(d.querySelectorAll(o)) : (Array.isArray(o)) ? o : [o];
        return self;
    };
    // return _;
}.call(this,document));