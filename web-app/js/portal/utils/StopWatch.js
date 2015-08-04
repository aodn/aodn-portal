

Ext.namespace('Portal.utils');

Portal.utils.StopWatch = Ext.extend(Ext.util.Observable, {

    start: function() {
        this.startTimestamp = this._now();
    },

    stop: function() {
        this.endTimestamp = this._now();
        this.fireEvent('stopped');
    },

    getElapsedMillis: function() {
        return this.endTimestamp.diff(this.startTimestamp);
    },

    _now: function() {
        return moment();
    }
});
