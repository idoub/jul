## Table of Contents
- [Introduction](#introduction)
- [Intent](#intent)
- [Prototypal Structure](#prototypal-structure)
- [File Structure](#file-structure)
- [Modules](#modules)
- [Building](#building)

## Introduction
This tutorial should get you up and running with **JUL** and give you an introduction into how it is structured and more importantly, _why_ it is written the way it is.

## Intent
#### **JUL** is _NOT_ ...
 * a "plug-n-play" library,
 * a library that obscures it's implementation,
 * an unbiased library,
 * a package manager,
 * a replacement for jQuery (or any other library for that matter)

#### **JUL** _IS_ ...
 * a front end library (not NODE compatible),
 * a collection of useful utility functions,
 * small, fast, and efficient,
 * a library that encourages good coding,
 * a good learning tool!

#### **JUL** wants to help you help yourself
**JUL** is **NOT** intended to be a "plug-n-play" library and was written in such a way as to encourage developer interaction, understanding and modification. **JUL** is intentionally written to provide useful utility functions without obscuring the implementation, maintaining state, or discouraging the use of native JavaScript functions. It is best to think of **JUL** as a combination of useful utility functions that you might gather from a website like [StackOverflow](https://stackoverflow.com). It is not meant to solve all your needs, but to **provide a platform to help you meet your own needs**.

That is important. **JUL** wants to help you meet your own needs. Many JavaScript libraries provide such a host of useful functionality that is otherwise difficult for new developers to implement, that the new developers often fall into the pit of _library dependency_. They don't know how to meet their own needs without the help of the library. **JUL** intends to break that dependency. As a result it provides simple, concise, easy-to-understand functions that do very specific things and are intended to be wrapped, extended or even rewritten to suit your specific needs.

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
Whatever your case may be, it is probably better to define those functions yourself and simply have the `_().each` and `_.subscribe` functions available to you than to have the `_().subsribe` function defined in a way that is difficult for you to make use of.

## Prototypal Structure
This is the prototypal structure.

## File Structure

## Modules

## Building