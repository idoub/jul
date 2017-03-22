describe('Core', function() {
  describe('Constructor',function() {
    it('Wrap object in array',function() {
        var obj = {key: 'LDVVglMWV0!9C5x8'};
        var wrapped = _(obj);
        assert.equal(wrapped.e[0].key,obj.key);
    });

    it('Locate an id type css selector',function(){
      var el = _('#div1').e;
      assert(el[0].classList.contains('div1class'));
    });

    it('Locate multiple elements sharing a class',function(){
      var els = _('.red').e;
      assert(els.length === 2);
    });
  });
});