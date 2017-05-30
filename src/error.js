(function () {
  _.addModule('error', function () {
    this.errorSubscriber = this.subscribe('error', function (err) {
      console.log('woohoo!', err);
    });
  }, ['pubsub']);
})(_ || {});
