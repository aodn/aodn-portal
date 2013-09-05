Ext.namespace('Portal.visualise.animations');

Portal.visualise.animations.AnimationState = Ext.extend(Object, {

    PLAYING: "PLAYING",
    PAUSED: "PAUSED",

    constructor: function(config) {
        var cfg = Ext.apply({}, config);
        this.state = cfg.state || this.PAUSED;
        this.observers = cfg.observers || [];
        Portal.visualise.animations.AnimationState.superclass.constructor.call(this, cfg);
    },

    observe: function(observer) {
        observers.push(observer);
        return observer;
    },

    notifyObservers: function() {
        Ext.each(this.observers, function(observer) {
            if (observer.onStateChanged) {
                observer.onStateChanged.call(observer.scope, this);
            }
        }, this);
    },

    isPlaying: function() {
        return this.state == this.PLAYING;
    },

    isPaused: function() {
        return this.state == this.PAUSED;
    },

    setPlaying: function() {
        return this._setState(this.PLAYING);
    },

    setPaused: function() {
        return this._setState(this.PAUSED);
    },

    _setState: function(state) {
        this.state = state;
        this.notifyObservers();

        return this;
    }
});
