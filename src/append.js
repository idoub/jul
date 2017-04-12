_.addModule('append',function(){
    this.prototype.append = function(content) {
        var frag = document.createDocumentFragment();
        if(typeof(content) === 'string') {
            var div = document.createElement('div');
            div.innerHTML = content;
            for(var i=0;i<div.childNodes.length;i++) {
                frag.appendChild(div.childNodes[i]);
            }
        } else {
            frag.appendChild(content);
        }
        this.each(function(el){
            if(el instanceof HTMLElement) el.appendChild(frag);
        });
    };
},['each']);