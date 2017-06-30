describe('Core', function () {
  describe('Test jul()', function () {
    it('Wrap object in array', function () {
      var obj = {
        key: 'LDVVglMWV0!9C5x8'
      };
      var wrapped = jul(obj);
      chai.assert.equal(wrapped.e[0].key, obj.key);
    });

    it('Locate an id type css selector', function () {
      var el = jul('#div1').e;
      chai.assert(el[0].classList.contains('div1class'));
    });

    it('Locate multiple elements sharing a class', function () {
      var els = jul('.red').e;
      chai.assert(els.length === 2);
    });
  });
});