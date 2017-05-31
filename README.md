# JUL

> A nifty little Javascript Utility Library

## Table of Contents
- [Features](#features)
- [Background](#background)
- [Installation](#installation)
- [Usage](#usage)
- [Documentation](#documentation)
- [Contribute](#contribute)
- [License](#license)

## Features
* **Modular** - Each piece of functionality is defined in it's own module and can be included as you please.
* **Tiny** - At under 5kb (Minified and GZipped) it weighs in at less than a sixth of jQuery's size. And that's with _all_ the modules included!
* **Powerful** - Includes the most useful features of other libraries without sacrificing size.
* **Compatible** - Works with IE9 and up as well as all modern browsers.

## Background
This library began as a simple experiment, a project to learn how popular libraries like jQuery and underscore are built. As I worked on it, I started to include the most commonly used functions from these libraries as well as other useful features that weren't found in them. Slowly it evolved to become an incredibly useful library to me in my own work and I decided to make it public to hopefully help other people.

## Installation
This repository only contains the source code for the library, no distribution files. This is intended to prevent people from including the entire library for projects where they only need a few of the libraries features.

If you want to use the library, simply clone, modify `modules.json` to include the modules that you need, and run `npm install`. Concatenated and minified files will be placed in a new **dist** folder and documentation will be generated in a **docs** folder.

## Usage
When JUL is included on the page, it is exposed as an `_` object, with all the modules you included in `modules.json` as available functions. See the [docs](#documentation) for details.

## Documentation
All documentation can be found ***[here](docs/index.html)***

## Contribute
Please feel free to submit a merge request if you would like to contribute to this project.

## License
[MIT © 2017 Isaac Doub](LICENSE)