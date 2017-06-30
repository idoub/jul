describe('Test jul().add()', function () {
  it('Returned object is a jul', function () {
    var added = jul('#div1').add('#div2');
    chai.assert.isOk(added instanceof jul);
  });
  it('Inner object is concatenation', function () {
    var compare = [document.getElementById('div1'), document.getElementById('div2')];
    var added = jul('#div1').add('#div2').e;
    chai.assert.equal(compare.length, added.length);
    chai.assert.equal(compare[0], added[0]);
    chai.assert.equal(compare[1], added[1]);
  });
});