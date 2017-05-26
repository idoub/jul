// This setup file allows us to either run mocha in the browser or terminal
if (typeof process === 'object') {
  var fs = require('fs');
  global.package = JSON.parse(fs.readFileSync('./package.json'));
  global.assert = require('chai').assert;

  global.jsdom = require('mocha-jsdom');
  jsdom({
    src: fs.readFileSync(`./dist/jul${package.version}.js`, 'utf-8')
  });
} else {
  window.require = function () {};
  window.assert = window.chai.assert;
  window.package = { version: '0.0.1' };
}
describe('Setup', function () {
  it('Create test HTML', function () {
    var html = document.createElement('div');
    html.innerHTML = '<div id="div1" class="div1class red" data-attr1="attribute 1" data-attr2="Another Attribute"></div><div id="div2" class="div2class red">';
    document.body.appendChild(html);
  });
});
