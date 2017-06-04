## Table of Contents
- [Introduction](#introduction)
- [Intent](#intent)
- [Prototypal Structure](#jul's-prototypal-structure)
- [File Structure](#file-structure)
- [Modules](#modules)
- [Building](#building)

## Introduction
This tutorial should get you up and running with **JUL** and give you an introduction into how it is structured and more importantly, _why_ it is written the way it is.

## Intent
<table style="width:100%">
  <tr>
    <th align="left"><h4><strong>JUL</strong> <em>IS</em></h4></th>
    <th align="left"><h4><strong>JUL</strong> is <em>NOT</em></h4></th>
  </tr>
  <tr>
    <td>
      <ul>
        <li>a front end library (not NODE compatible)</li>
        <li>a library that encourages good coding</li>
        <li>a collection of useful utility functions</li>
        <li>small, fast, and efficient</li>
        <li>a good learning tool!</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>a "plug-n-play" library</li>
        <li>a library that obscures it's implementation</li>
        <li>an unbiased library</li>
        <li>a package manager</li>
        <li>a replacement for jQuery (or any other library for that matter)</li>
      </ul>
    </td>
  </tr>
</table>

#### **JUL** wants to help you help yourself
**JUL** is **NOT** intended to be a "plug_n_play" library and was written in such a way as to encourage developer interaction, understanding and modification. **JUL** is intentionally written to provide useful utility functions without obscuring the implementation, maintaining state, or discouraging the use of native JavaScript functions. It is best to think of **JUL** as a combination of useful utility functions that you might gather from a website like [StackOverflow](https://stackoverflow.com). It is not meant to solve all your needs, but to **provide a platform to help you meet your own needs**.

That is important. **JUL** wants to help you meet your own needs. Many JavaScript libraries provide such a host of useful functionality that is otherwise difficult for new developers to implement, that the new developers often fall into the pit of _library dependency_. They don't know how to meet their own needs without the help of the library. **JUL** intends to break that dependency. As a result it provides simple, concise, easy_to_understand functions that do very specific things and are intended to be wrapped, extended or even rewritten to suit your specific needs.

#### An example
For example, the **pubsub** module allows you to create topics, create listeners that subscribe to those topics, and publish topics. It does so through the `_.publish(topic, data)` and `_.subscribe(topic, listener)` functions. An immediate extension to the functionality of **pubsub** would be to subscribe an already wrapped object to a topic or to publish to a topic with an already wrapped function as the data. These functions might look like `_(selector).subscribe(topic)` and `_(selector).publish(topic)` respectively and could be implemented like:
```
this.prototype.publish = function(topic) {
  this.publish(topic,this.e);
  return this;
};

this.prototype.subscribe = function(topic) {
  var subscribers = [];
  this.each(function(e){
    subscribers.push(this.subscribe(topic,e));
  });
  return subscribers;
};
```
In this case, the `_(selector).subscribe` method returns an array of subscribers that can be used to unsubscribe the originally wrapped elements from their topics. But what if you don't want, or can't, keep the original list of wrapped elements, and in between subscribing and wanting to unsubscribe the DOM is modified leading to a different list of wrapped elements when you call `_(selector)`. Perhaps for your use case it would be better to store the subscriber on the object so you can just grab the object again to unsubscribe.
```
this.prototype.subscribe = function(topic) {
  this.each(function(e){
    e.subscriber = e.subscriber || {};
    e.subscriber[topic] = this.subscribe(topic,e);
  });
  return this;
}
```
Whatever your case may be, it is probably better to define those functions yourself and simply have the `_().each` and `_.subscribe` functions available to you than to have the `_().subscribe` function defined in a way that is difficult for you to make use of.

## JUL's Prototypal Structure
In order to understand **JUL**, it is important to understand how the core library works. It's only a few lines of code, but it's doing a some interesting things and taking advantage of JavaScript's prototypal inheritance. Let's start by taking a look at the code and then breaking it down.
```
var _ = function (o) {
  o = o || [];
  if (o instanceof _) return o;
  var self = Object.create(_.prototype);
  self.e = (typeof o === 'string') ? [].slice.call(document.querySelectorAll(o)) : (Array.isArray(o)) ? o : [o];
  return self;
};
```
(_NOTE_: The function has been unwrapped and slightly rewritten to be clearer. The real function should be easy to understand once you know how this works.)

So what's going on here? To start with, `_` itself is a function, which means it has a `.prototype` property and can be used as a constructor for new objects. So if you run the above code to create a minial **JUL** you can then run:
```
var obj = new _
console.log(obj);           // prints _ {e: Array(0)}
console.log(obj.__proto__); // prints Object {constructor: function}
console.log(obj.prototype); // prints undefined
```
This is straightforward enough. `_` is a function with a _prototype property_ that will be used as a new object's actual _prototype_ (accessed using the ____proto____ property) when `_` is used as a constructor (done by calling the **new** keyword).

The first line, `var o = o || [];`, simply sets a default `o`.

The second line, `if (o instanceof _) return o;`, says that if the object passed in is already an instance of `_`, then we don't need to do any more work and we can just return that.

Now the third line, `var self = Object.create(_.prototype);`, is where it gets interesting. Up to this point, `_` has been called as a function, usually through something like `_('#id')`. What we are doing here is using `_`'s prototype to create a new object _without actually calling `_` as a function_. If we tried to do `var self = new _`, it would use the `_` _function_ to try to create the new object and we would end up in an infinite loop. This way, `self` becomes a new object that has `_`'s prototype as it's own prototype without re-calling `_`.

Here's some code to demonstrate:
```
var _ = function(){console.log('running');};
_.prototype = {'foo':'bar'};
var obj = Object.create(_.prototype);
var tmp = new _;                             // prints running
obj                                          // prints Object {}
tmp                                          // prints _ {}
obj.__proto__                                // prints Object {foo: "bar"}
tmp.__proto__                                // prints Object {foo: "bar"}
```
So 

## File Structure

## Modules

## Building