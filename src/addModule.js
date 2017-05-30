(function () {
  /**
   * <strong><i>This function allows you to extend the core underscore object
   * in a safe way, defining other dependencies for your module as well as
   * namespacing if you need.</i></strong>
   * 
   * @param {string}   name         - The name of the module you are adding.
   * @param {function} constructor  - An IIFE to define your module.
   * @param {string[]} dependencies - An array of modules that are required for
   * the module you are defining to run correctly.
   * 
   * @example
   *  // Define a new module.
   *  _.addModule('moduleName',function() {
   *      // This is an internal variable. It won't be accessible outside the module scope.
   *      var default = {'foo':bar}
   * 
   *      // This method is defined directly on the _ object. It will be accessible by _.staticMethod.
   *      this.staticMethod = function(params){
   *          // Using a required module.
   *          _.extend(default,params)
   *      };
   * 
   *      // This method is defined on the _ function. It will be accessible by _().functionMethod.
   *      this.prototype.functionMethod = function(params){};
   * 
   *  // Require the 'extend' module.
   *  },['extend']);
   * 
   *  // Now we can access two new methods.
   *  _.staticMethod({hello:'world'});
   *  _('.style').functionMethod('something');
   */
  _.addModule = function (name, constructor, dependencies) {
    _.includedModules = _.includedModules || ['addModule'];
    dependencies = dependencies || [];
    for (var i = 0; i < dependencies.length; i++) {
      if (_.includedModules.indexOf(dependencies[i]) === -1) {
        throw new Error('\'' + dependencies[i] + '\' is required for module \'' + name + '\': \'' + name + '\' will not be loaded.');
      }
    }
    _.includedModules.push(name);
    constructor.call(this);
  };
})(_ || {});
