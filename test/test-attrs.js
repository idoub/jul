describe('Core', function () {
  describe('Test attrs()', function () {
    it('Get specific attribute', function () {
      var attrs = _('#div1').attrs('data-attr1');
      assert.equal(attrs['data-attr1'],'attribute 1');
    });
    it('Get list of attributes', function() {
      var attrs = _('#div1').attrs(['class','data-attr1']);
      assert.equal(attrs['data-attr1'],'attribute 1');
      assert.equal(attrs['class'],'div1class red');
    });
    it('Get all attributes', function() {
      var attrs = _('#div1').attrs();
      assert.equal(attrs['id'],'div1');
      assert.equal(attrs['class'],'div1class red');
      assert.equal(attrs['data-attr1'],'attribute 1');
      assert.equal(attrs['data-attr2'],'Another Attribute');
    });
  });
});
