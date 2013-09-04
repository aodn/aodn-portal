Ext.namespace('Portal.visualise.animations');

Portal.visualise.animations.AnimationState = Ext.extend(Object, {

    LOADING: "LOADING",
    PLAYING: "PLAYING",
    REMOVED: "REMOVED",
    PAUSED: "PAUSED",

    constructor: function(config) {
        var cfg = Ext.apply({}, config);
        this.state = cfg.state || this.LOADING;
        this.observers = cfg.observers || [];
        Portal.visualise.animations.AnimationState.superclass.constructor.call(this, cfg);
    },

    observe: function(observer) {
        observers.push(observer);
        return observer;
    },

    notifyObservers: function() {
        Ext.each(this.observers, function(observer, index, all) {
            if (observer.onStateChanged) {
                observer.onStateChanged.call(observer.scope, this);
            }
        }, this);
    },

    isLoading: function() {
        return this.state == this.LOADING;
    },

    isPlaying: function() {
        return this.state == this.PLAYING;
    },

    isRemoved: function() {
        return this.state == this.REMOVED;
    },

    isPaused: function() {
        return this.state == this.PAUSED;
    },

    setLoading: function() {
        return this._setState(this.LOADING);
    },

    setPlaying: function() {
        return this._setState(this.PLAYING);
    },

    setRemoved: function() {
        return this._setState(this.REMOVED);
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
