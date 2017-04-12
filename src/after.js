_.addModule('after',function() {
    this.prototype.after = function(content) {
        if(content instanceof Node) content = content.outerHTML;
        this.each(function(el){el.insertAdjacentHTML('afterend',content);});
    };
},['each']);