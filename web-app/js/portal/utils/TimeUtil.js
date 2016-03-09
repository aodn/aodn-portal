Ext.namespace('Portal.utils');

Portal.utils.TimeUtil = Ext.extend(Object, {
    _parseIso8601Date : function(string) {
        return Date.parseDate(string, "c");
    },

    _toIso8601DateString : function(date) {
        return date.getFullYear() + "-"
                + this._pad((date.getMonth() + 1)) + "-"
                + this._pad(date.getDate());
    },

    _toIso8601TimeString : function(date) {
        return this._pad(date.getHours()) + ":"
                + this._pad(date.getMinutes()) + ":"
                + this._pad(date.getSeconds());
    },

    _pad : function(val) {
        return val < 10 ? '0' + val : val.toString();
    },

    toUtcIso8601DateString : function(date) {
        return this._toIso8601DateString(date) + 'T' + this._toIso8601TimeString(date) + 'Z';
    }
});
