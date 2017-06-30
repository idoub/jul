describe('Test Each', function () {
  describe('Test jul().each()', function () {
    it('Each works', function () {
      var arr = [],
        compare = ['div1', 'div2'];
      var tst = jul('.red').each(function (e) {
        arr.push(e.id);
      });
      chai.assert.deepEqual(arr, compare);
    });
    it('Returned object is a jul', function () {
      var arr = [];
      var tst = jul('.red').each(function (e) {
        arr.push(e.id);
      });
      chai.assert.isOk(tst instanceof jul);
    });
    it('Inner object cannot be replaced', function () {
      var tst = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      var compare = tst.slice();
      jul(tst).each(function (e) {
        e = e * e;
      });
      chai.assert.deepEqual(tst, compare);
    });
    it('Arguments can be passed', function () {
      var tst = [1, 2, 3, 4, 5, 6, 7, 8, 9];

      var out = [];
      var multiply = function (e, i, arr, factor) {
        out.push(e * factor);
      };

      jul(tst).each(multiply, 2);
      chai.assert.deepEqual(out, [2, 4, 6, 8, 10, 12, 14, 16, 18]);

      out = [];
      jul(tst).each(multiply, 4);
      chai.assert.deepEqual(out, [4, 8, 12, 16, 20, 24, 28, 32, 36]);
    });
  });
  describe('Test jul.each()', function () {
    it('Each works', function () {

    });
  });
});