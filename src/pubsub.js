_.addModule('pubsub',function(){
    var topics = {};

    /**
     * <strong><i>Publish to a topic that any listeners to the topic will pick
     * up.</i></strong>
     * <p>If the topic has not been created (there are no subscribers) then
     * nothing will happen.</p>
     * 
     * @param {string} topic - The name of the topic you wish to publish to.
     * @param {object} data  - Any data you want passed to listeners of the
     * topic.
     */
    this.publish = function(topic,data) {
        if(!topics.hasOwnProperty(topic)) return;
        for(var i=0; i<topics[topic].length; i++) {
            topics[topic][i](data !== undefined ? data : {});
        }
    };

    /**
     * <strong><i>Make a listener to an topic.</i></strong>
     * <p>If the topci does not exist, then it will be created and the listener
     * added.</p>
     * 
     * @param  {string}   topic    - The name of the topic you wish to subscribe
     * to/create.
     * @param  {function} listener - A function you want called when something
     * publishes to the topic.
     * @return {{unsubscribe: function}} - The subscriber. Use this to
     * unsubscribe a listener from a topic using subscriber.unsubscribe.
     */
    this.subscribe = function(topic,listener) {
        if(!topics.hasOwnProperty(topic)) topics[topic] = [];
        var index = topics[topic].push(listener) -1;
        return {
            unsubscribe: function() {delete topics[topic][index];}
        };
    };
});