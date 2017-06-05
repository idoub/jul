## Table of Contents
- [Introduction](#introduction)
- [Example](#example)
- [Static vs Function Methods](#static-vs-function-methods)
- [Private Methods and Properties](#private-methods-and-properties)
- [Add an Existing Library](#add-an-existing-library)
- [Wrapping in IIF](#wrapping-in-iif)
- [Dependencies](#dependencies)

## Introduction
Creating a new module is pretty straightforward. All it requires is calling the {@link addModule} function with the name of the new module, the constructor function for the module, and an array of the other modules the new one depends on.

## Example
```javascript
// Define a new module.
_.addModule('moduleName',function() {
  // This is an internal variable. It won't be accessible outside the module scope.
  var default = {'foo':bar}

  // This method is defined directly on the _ object. It will be accessible by _.staticMethod.
  this.staticMethod = function(params){
    // Using a required module.
    _.extend(default,params)
  };

  // This method is defined on the _ function. It will be accessible by _().functionMethod.
  this.prototype.functionMethod = function(params){};

// Require the 'extend' module.
},['extend']);

// Now we can access two new methods.
_.staticMethod({hello:'world'});
_('.style').functionMethod('something');
```

## Static vs Function Methods
Notice the difference in how to declare static methods vs function methods in the example above. We won't go into the prototype inheritance of **JUL** here (see {@tutorial intro} to learn more), we just need to remember that in the module constructor function, any methods added using `this.method = function(){}` will be accessible by calling `_.method()`, and any methods added using `this.prototype.method = function(){}` will be accessible by calling `_().method()`.

## Private Methods and Properties
Since the function passed as the second parameter of the **addModule** function is a straightforward constructor function, you can make private methods and properties just as you would in any constructor function. Simply declaring them within the scope of the constructor function and _not_ adding them to the `this` object, will keep them private, but still make them accessible to exposed functions.

For example:
```javascript
_.addModule('foo',function(){
  var privateProperty = 'Hello World';
  var privateMethod = function(){
    console.log(privateProperty);
  }

  this.foo = function(prop) {
    if(prop) privateProperty = prop;
    privateMethod();
  }
})
```
will define a new module, **foo**, that can be called using `_.foo()`. Neither `privateProperty` or `privateMethod` are available to the outside, but calling `_.foo('bar')` will update `privateProperty` and then call `privateMethod`, so the console will log `"bar"`.

***However*** this is strongly advised against, as it creates hidden, internal state for your modules. Observe the following:
```javascript
_.foo();      // prints "Hello World"
_.foo('bar'); // prints "bar"
_.foo();      // prints "bar"
```
If another module unexpectedly calls one of the functions that updates internal state, then a user of your module, expecting a specific state, may end up with a very difficult bug to track down.

There are some situations though where this can be useful. Say for example, a pseudo-random number generator that maintains and updates an internal **seed** to create a reproducible sequence of numbers given a specific seed.

The conclusion? Internal state can be both useful and dangerous, so use it wisely.

## Add an Existing Library
The module system makes it fairly straightforward to add an existing library to **JUL**. Simply wrap the existing code in an **addModule** block, and then expose the library by adding it in some way to `this`.

For example, if you have a library function **double** which takes an array and duplicates every element in the array like so:
```javascript
var double = function(arr) {
  var newArr = new Array(arr.length*2);
  for(var i=0; i<arr.length; i++) {
    newArr[i*2] = arr[i];
    newArr[i*2+1] = arr[i];
  }
  return newArr;
}
```
you can create a new module from the function by wrapping it in the **addModule** function like so:
```javascript
_.addModule('double',function(){
  var double = function(arr) {
    var newArr = new Array(arr.length*2);
    for(var i=0; i<arr.length; i++) {
      newArr[i*2] = arr[i];
      newArr[i*2+1] = arr[i];
    }
    return newArr;
  }
  // Expose the function here
  this.double = double;
});
```
You will notice that the **double** code is completely unmodified.

## Wrapping in IIF
It is recommended that you wrap your module definition in an immediately invoked function definition. This is useful as you can use the function version of `'use strict';` as well as handling name-spacing of any external dependencies.

Let's say, for examples sake, that you want to add a module that depends on **jQuery**, but you are using the `jQuery` name on your site rather than `$` because of conflicts with another library, but the module uses `$` (pretty contrived right?). The solution is simply to wrap your module definition in an IIF that exposes `jQuery` as `$` to your module like so:
```javascript
(function($,_){
  'use strict';
  _.addModule('foo',function(){
    var bar = function(str) {
      return $(str);
    }
    this.bar = bar;
  });
})(jQuery,_ || {});
```

## Dependencies
The **addModule** function is not a package manager, nor even a dependency manager. It is easier to define a module directly on the `_` object than to go through the process of calling `_.addModule()`. Rewriting the double example, it is perfectly legitimate to write:
```javascript
_.double = function(arr) {
  var newArr = new Array(arr.length*2);
  for(var i=0; i<arr.length; i++) {
    newArr[i*2] = arr[i];
    newArr[i*2+1] = arr[i];
  }
  return newArr;
}
```
and it will work as expected. So what's the point of **addModule**?

What **addModule** does give you is quick insight into dependency _failures_. Take the **addClass** module for example. It relies on the **each** module which mimics ECMAScript 5's Array.forEach but allows you to pass parameters to the internal function. If **addClass** was included in the library build, but you forgot to add **each** before it, as soon as you opened up a page that included **JUL** you would see the following error logged out to the console.
```none
'each' is required for module 'addClass': 'addClass' will not be loaded.
```
If the module was added using **addModule**, you get immediate feedback that a dependency is missing rather than waiting until you call `_().addClass()` in your code and getting the following error:
```none
Uncaught TypeError: this.each is not a function
```

**addModule** also requires the developer to _think_ about dependencies and clearly calls out any dependencies in modules. It would be possible to override the **addModule** module itself and to redefine it so that it handles dependency order, but the importance of a library calling out it's functionality and _not_ hiding implementation features cannot be overstated. Libraries that hide their implementation encourage poor developer understanding which often leads to extremely time consuming bugs. **JUL** is intentionally written to provide useful utility functions without obscuring the implementation, maintaining state, or discouraging the use of native JavaScript functions.