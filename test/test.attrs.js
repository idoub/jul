describe('Core', function () {
  describe('Test attrs()', function () {
    it('Get specific attribute', function () {
      var attrs = jul('#div1').attrs('data-attr1');
      chai.assert.equal(attrs['data-attr1'], 'attribute 1');
    });
    it('Get list of attributes', function () {
      var attrs = jul('#div1').attrs(['class', 'data-attr1']);
      chai.assert.equal(attrs['data-attr1'], 'attribute 1');
      chai.assert.equal(attrs['class'], 'div1class red');
    });
    it('Get all attributes', function () {
      var attrs = jul('#div1').attrs();
      chai.assert.equal(attrs['id'], 'div1');
      chai.assert.equal(attrs['class'], 'div1class red');
      chai.assert.equal(attrs['data-attr1'], 'attribute 1');
      chai.assert.equal(attrs['data-attr2'], 'Another Attribute');
    });
  });
});