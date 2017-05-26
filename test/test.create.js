describe('Create', function () {
  describe('Test Implicit', function () {
    it('Only an ID', function () {
      chai.assert.equal(_.create('#header').outerHTML, '<wrapper><div id="header"></div></wrapper>');
    });

    it('Only a Class', function () {
      chai.assert.equal(_.create('.title').outerHTML, '<wrapper><div class="title"></div></wrapper>');
    });

    it('An ID and Class', function () {
      chai.assert.equal(_.create('form#search.wide').outerHTML, '<wrapper><form id="search" class="wide"></form></wrapper>');
    });

    it('Multiple Classes', function() {
      chai.assert.equal(_.create('p.class1.class2.class3').outerHTML, '<wrapper><p class="class1 class2 class3"></p></wrapper>');
    });

    it('Child of EM', function() {
      chai.assert.equal(_.create('em>.class').outerHTML, '<wrapper><em><span class="class"></span></em></wrapper>');
    });

    it('Child of UL', function() {
      chai.assert.equal(_.create('ul>.class').outerHTML, '<wrapper><ul><li class="class"></li></ul></wrapper>');
    });

    it('Child of TABLE and TR', function() {
      chai.assert.equal(_.create('table>.row>.col').outerHTML, '<wrapper><table><tr class="row"><td class="col"></td></tr></table></wrapper>');
    });

    it('Child of P', function() {
      chai.assert.equal(_.create('p>.class').outerHTML, '<wrapper><p><span class="class"></span></p></wrapper>');
    });
  });

  describe('Test Hierarchy', function() {
    it('Children', function() {
      chai.assert.equal(_.create('nav>ul>li').outerHTML, '<wrapper><nav><ul><li></li></ul></nav></wrapper>');
    });

    it('Siblings', function() {
      chai.assert.equal(_.create('div+p+bq').outerHTML, '<wrapper><div></div><p></p><bq></bq></wrapper>');
    });

    it('Climb once', function() {
      chai.assert.equal(_.create('div+div>p>span+em^bq').outerHTML, '<wrapper><div></div><div><p><span></span><em></em></p><bq></bq></div></wrapper>');
    });

    it('Climb multiple', function() {
      chai.assert.equal(_.create('div+div>p>span+em^^bq').outerHTML, '<wrapper><div></div><div><p><span></span><em></em></p></div><bq></bq></wrapper>');
    });
  });
  
  describe('Test Attributes and Text', function() {
    it('Single Quoted', function() {
      chai.assert.equal(_.create('p[title="Hello world"]').outerHTML, '<wrapper><p title="Hello world"></p></wrapper>');
    });

    it('Multiple non-quoted', function() {
      chai.assert.equal(_.create('td[rowspan=2 colspan=3 title]').outerHTML, '<wrapper><td rowspan="2" colspan="3" title=""></td></wrapper>');
    });

    it('Multiple Quoted', function() {
      chai.assert.equal(_.create('[a="value1" b="value2"]').outerHTML, '<wrapper><div a="value1" b="value2"></div></wrapper>');
    });

    it('Text', function() {
      chai.assert.equal(_.create('a{Click me}').outerHTML, '<wrapper><a>Click me</a></wrapper>');
    });

    it('Sibling Text', function() {
      chai.assert.equal(_.create('p>{Click }+a{here}+{ to continue}').outerHTML, '<wrapper><p><span>Click </span><a>here</a><span> to continue</span></p></wrapper>');
    });
  });

  describe('Test Multiplication', function(){
    it('Single digit number', function() {
      chai.assert.equal(_.create('ul>li*5').outerHTML, '<wrapper><ul><li></li><li></li><li></li><li></li><li></li></ul></wrapper>');
    });

    it('Multiple digit number', function() {
      chai.assert.equal(_.create('ul>li*12').outerHTML, '<wrapper><ul><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul></wrapper>');
    });
  });

  describe('Test Numbering', function() {
    it('Single digit', function() {
      chai.assert.equal(_.create('ul>li.item$*5').outerHTML, '<wrapper><ul><li class="item1"></li><li class="item2"></li><li class="item3"></li><li class="item4"></li><li class="item5"></li></ul></wrapper>');
    });

    it('Nodename, Attribute and Text', function() {
      chai.assert.equal(_.create('h$[title=item$]{Header $}*3').outerHTML, '<wrapper><h1 title="item1">Header 1</h1><h2 title="item2">Header 2</h2><h3 title="item3">Header 3</h3></wrapper>');
    });

    it('Multiple digits', function() {
      chai.assert.equal(_.create('ul>li.item$$$*5').outerHTML, '<wrapper><ul><li class="item001"></li><li class="item002"></li><li class="item003"></li><li class="item004"></li><li class="item005"></li></ul></wrapper>');
    });

    it('Single digit reverse order', function() {
      chai.assert.equal(_.create('ul>li.item$@-*5').outerHTML, '<wrapper><ul><li class="item5"></li><li class="item4"></li><li class="item3"></li><li class="item2"></li><li class="item1"></li></ul></wrapper>');
    });

    it('Single digit offset', function() {
      chai.assert.equal(_.create('ul>li.item$@3*5').outerHTML, '<wrapper><ul><li class="item3"></li><li class="item4"></li><li class="item5"></li><li class="item6"></li><li class="item7"></li></ul></wrapper>');
    });

    it('Multiple digit offset reverse order', function() {
      chai.assert.equal(_.create('ul>li.item$$$@-3*5').outerHTML, '<wrapper><ul><li class="item007"></li><li class="item006"></li><li class="item005"></li><li class="item004"></li><li class="item003"></li></ul></wrapper>');
    });
  });

  describe('Test Grouping', function() {
    it('Single Group', function() {
      chai.assert.equal(_.create('div>(header>ul>li*2>a)+footer>p').outerHTML, '<wrapper><div><header><ul><li><a></a></li><li><a></a></li></ul></header><footer><p></p></footer></div></wrapper>');
    });

    it('Nested Groups', function() {
      chai.assert.equal(_.create('(div>dl>(dt+dd)*3)+footer>p').outerHTML, '<wrapper><div><dl><dt></dt><dd></dd><dt></dt><dd></dd><dt></dt><dd></dd></dl></div><footer><p></p></footer></wrapper>');
    });

    it('Complex Grouping', function() {
      chai.assert.equal(_.create('#page>(#header>h1{Title})+(#body>(.article>h2{Article 1})+(.artcle>h2{Article 2}))+(#footer>#copyright)').outerHTML, '<wrapper><div id="page"><div id="header"><h1>Title</h1></div><div id="body"><div class="article"><h2>Article 1</h2></div><div class="artcle"><h2>Article 2</h2></div></div><div id="footer"><div id="copyright"></div></div></div></wrapper>');
    });

    // it('', function() {
    //   chai.assert.equal(_.create('').outerHTML, '');
    // });
  });
});