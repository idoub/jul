(function () {
  _.addModule('ajax', function () {
    var defaultOpts = {
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      async: true,
      user: '',
      password: ''
    };

    /**
     * <strong><i>A simple but flexible ajax call</i></strong>
     * 
     * @property {object}   opts                           - All the options to make the ajax call.
     * @property {string}   opts.method                    - The method of the call. E.g. 'GET','PUT','POST',etc.
     * @property {string}   opts.url                       - The url you want to call.
     * @property {boolean}  opts.async                     - Whether you want the call to be async.
     * @property {string}   opts.user                      - The username for the endpoint security.
     * @property {string}   opts.password                  - The password for the endpoint security.
     * @property {object}   opts.handlers                  - An object defining the handlers for different events fired by the request.
     * @property {function} opts.handlers.abort            - [Docs]{@link https://developer.mozilla.org/en-US/docs/Web/Events/abort}
     * @property {function} opts.handlers.error            - [Docs]{@link https://developer.mozilla.org/en-US/docs/Web/Events/error}
     * @property {function} opts.handlers.load             - [Docs]{@link https://developer.mozilla.org/en-US/docs/Web/Events/load}
     * @property {function} opts.handlers.loadend          - [Docs]{@link https://developer.mozilla.org/en-US/docs/Web/Events/loadend}
     * @property {function} opts.handlers.loadstart        - [Docs]{@link https://developer.mozilla.org/en-US/docs/Web/Events/loadstart}
     * @property {function} opts.handlers.progress         - [Docs]{@link https://developer.mozilla.org/en-US/docs/Web/Events/progress}
     * @property {function} opts.handlers.readystatechange - [Docs]{@link https://developer.mozilla.org/en-US/docs/Web/Events/readystatechange}
     * @property {function} opts.handlers.timeout          - [Docs]{@link https://developer.mozilla.org/en-US/docs/Web/Events/timeout}
     * @property {object}   opts.data                      - The data you want to send for call. E.g. 'PUT' and 'POST' calls.
     * @property {object.<string,string>} opts.headers     - An object defining the headers as key-value pairs of strings.
     */
    this.ajax = function (opts) {
      opts = _.extend({}, defaultOpts, opts);
      var req = new XMLHttpRequest(),
        keys, k;
      req.open(opts.method, opts.url, opts.async, opts.user, opts.password);
      if (_.exists(opts, 'handlers')) {
        keys = Object.keys(opts.handlers);
        for (k in keys) req['on' + keys[k]] = opts.handlers[keys[k]];
      }
      keys = Object.keys(opts.headers);
      for (k in keys) {
        req.setRequestHeader(keys[k], opts.headers[keys[k]]);
      }
      req.send(opts.data);
    };
  }, ['extend', 'exists']);
})(_ || {});
