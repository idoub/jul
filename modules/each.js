_.addModule('each',function(){
    /**
     * <strong><i>Loop through every member wrapped by an underscore object and
     * run a function on each.</i></strong>
     * 
     * @param  {function} cb - The callback you want run on each member.
     * @param  {...*} params - Any params you want passed to the callback.
     * @return {_}           - The underscore object that the method was called
     * on.
     * 
     * @example
     *  _('.hidden').each(function(element,index,array,newClass,color){
     *      element.classList.add(newClass);
     *      element.style.color = color;
     *  },'shown','#444444');
     */
    this.prototype.each = function(cb,params) {
        var args = Array.from(arguments); args.shift();
        for(var key in Object.keys(this.e)) {
            cb.apply(this,[this.e[key],key,this.e].concat(args));
        }
        return this;
    };

    /**
     * <strong><i>Loop through every member of an array passed as an object and
     * run a function on each element.</i></strong>
     * 
     * @param  {array}   arr - The array whose elements you want to execute the
     * function on.
     * @param  {function} cb - The callback you want run on each member.
     * @param  {...*} params - Any params you want passed to the callback.
     * @return {array}       - The original array that was passed in.
     * 
     * @example
     *  _.each([2,4,8,16],function(num,i,array,exponent){
     *      array[i] = Math.pow(num,exponent);
     *  },3);
     */
    this.each = function(arr,cb,params) {
        return _(arr).each(cb,params).e;
    };
});