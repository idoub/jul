describe('Create', function () {
  var fragToStr = function(frag){
    var div = document.createElement('div');
    div.appendChild(frag);
    return div.innerHTML;
  };
  describe('Test Implicit', function () {
    it('Only an ID', function () {
      chai.assert.equal(fragToStr(_.create('#header')), '<div id="header"></div>');
    });

    it('Only a Class', function () {
      chai.assert.equal(fragToStr(_.create('.title')), '<div class="title"></div>');
    });

    it('An ID and Class', function () {
      chai.assert.equal(fragToStr(_.create('form#search.wide')), '<form id="search" class="wide"></form>');
    });

    it('Multiple Classes', function() {
      chai.assert.equal(fragToStr(_.create('p.class1.class2.class3')), '<p class="class1 class2 class3"></p>');
    });

    it('Child of EM', function() {
      chai.assert.equal(fragToStr(_.create('em>.class')), '<em><span class="class"></span></em>');
    });

    it('Child of UL', function() {
      chai.assert.equal(fragToStr(_.create('ul>.class')), '<ul><li class="class"></li></ul>');
    });

    it('Child of TABLE and TR', function() {
      chai.assert.equal(fragToStr(_.create('table>.row>.col')), '<table><tr class="row"><td class="col"></td></tr></table>');
    });

    it('Child of P', function() {
      chai.assert.equal(fragToStr(_.create('p>.class')), '<p><span class="class"></span></p>');
    });
  });

  describe('Test Hierarchy', function() {
    it('Children', function() {
      chai.assert.equal(fragToStr(_.create('nav>ul>li')), '<nav><ul><li></li></ul></nav>');
    });

    it('Siblings', function() {
      chai.assert.equal(fragToStr(_.create('div+p+bq')), '<div></div><p></p><bq></bq>');
    });

    it('Climb once', function() {
      chai.assert.equal(fragToStr(_.create('div+div>p>span+em^bq')), '<div></div><div><p><span></span><em></em></p><bq></bq></div>');
    });

    it('Climb multiple', function() {
      chai.assert.equal(fragToStr(_.create('div+div>p>span+em^^bq')), '<div></div><div><p><span></span><em></em></p></div><bq></bq>');
    });
  });
  
  describe('Test Attributes and Text', function() {
    it('Single Quoted', function() {
      chai.assert.equal(fragToStr(_.create('p[title="Hello world"]')), '<p title="Hello world"></p>');
    });

    it('Multiple non-quoted', function() {
      chai.assert.equal(fragToStr(_.create('td[rowspan=2 colspan=3 title]')), '<td rowspan="2" colspan="3" title=""></td>');
    });

    it('Multiple Quoted', function() {
      chai.assert.equal(fragToStr(_.create('[a="value1" b="value2"]')), '<div a="value1" b="value2"></div>');
    });

    it('Text', function() {
      chai.assert.equal(fragToStr(_.create('a{Click me}')), '<a>Click me</a>');
    });

    it('Sibling Text', function() {
      chai.assert.equal(fragToStr(_.create('p>{Click }+a{here}+{ to continue}')), '<p><span>Click </span><a>here</a><span> to continue</span></p>');
    });
  });

  describe('Test Multiplication', function(){
    it('Single digit number', function() {
      chai.assert.equal(fragToStr(_.create('ul>li*5')), '<ul><li></li><li></li><li></li><li></li><li></li></ul>');
    });

    it('Multiple digit number', function() {
      chai.assert.equal(fragToStr(_.create('ul>li*12')), '<ul><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul>');
    });
  });

  describe('Test Numbering', function() {
    it('Single digit', function() {
      chai.assert.equal(fragToStr(_.create('ul>li.item$*5')), '<ul><li class="item1"></li><li class="item2"></li><li class="item3"></li><li class="item4"></li><li class="item5"></li></ul>');
    });

    it('Nodename, Attribute and Text', function() {
      chai.assert.equal(fragToStr(_.create('h$[title=item$]{Header $}*3')), '<h1 title="item1">Header 1</h1><h2 title="item2">Header 2</h2><h3 title="item3">Header 3</h3>');
    });

    it('Multiple digits', function() {
      chai.assert.equal(fragToStr(_.create('ul>li.item$$$*5')), '<ul><li class="item001"></li><li class="item002"></li><li class="item003"></li><li class="item004"></li><li class="item005"></li></ul>');
    });

    it('Single digit reverse order', function() {
      chai.assert.equal(fragToStr(_.create('ul>li.item$@-*5')), '<ul><li class="item5"></li><li class="item4"></li><li class="item3"></li><li class="item2"></li><li class="item1"></li></ul>');
    });

    it('Single digit offset', function() {
      chai.assert.equal(fragToStr(_.create('ul>li.item$@3*5')), '<ul><li class="item3"></li><li class="item4"></li><li class="item5"></li><li class="item6"></li><li class="item7"></li></ul>');
    });

    it('Multiple digit offset reverse order', function() {
      chai.assert.equal(fragToStr(_.create('ul>li.item$$$@-3*5')), '<ul><li class="item007"></li><li class="item006"></li><li class="item005"></li><li class="item004"></li><li class="item003"></li></ul>');
    });
  });

  describe('Test Grouping', function() {
    it('Single Group', function() {
      chai.assert.equal(fragToStr(_.create('div>(header>ul>li*2>a)+footer>p')), '<div><header><ul><li><a></a></li><li><a></a></li></ul></header><footer><p></p></footer></div>');
    });

    it('Nested Groups', function() {
      chai.assert.equal(fragToStr(_.create('(div>dl>(dt+dd)*3)+footer>p')), '<div><dl><dt></dt><dd></dd><dt></dt><dd></dd><dt></dt><dd></dd></dl></div><footer><p></p></footer>');
    });

    it('Complex Grouping', function() {
      chai.assert.equal(fragToStr(_.create('#page>(#header>h1{Title})+(#body>(.article>h2{Article 1})+(.artcle>h2{Article 2}))+(#footer>#copyright)')), '<div id="page"><div id="header"><h1>Title</h1></div><div id="body"><div class="article"><h2>Article 1</h2></div><div class="artcle"><h2>Article 2</h2></div></div><div id="footer"><div id="copyright"></div></div></div>');
    });

    // it('', function() {
    //   chai.assert.equal(fragToStr(_.create('')), '');
    // });
  });
});