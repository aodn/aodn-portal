
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.utils');

Portal.utils.TimeUtil = Ext.extend(Object, {
    constructor:function(config){
        this.DATE_FORMAT = 'Y-m-d';
        this.TIME_FORMAT = 'H:i:s (P)';
        this.DATE_TIME_FORMAT = this.DATE_FORMAT + ' ' + this.TIME_FORMAT;
    },

    _parseIso8601Date : function(string) {
        return Date.parseDate(string, "c");
    },

    _toDateString : function(date) {
        return date.format(this.DATE_FORMAT);
    },

    _toUtcDateString : function(date) {
        return date.getUTCFullYear() + "-"
                + this._pad((date.getUTCMonth() + 1)) + "-"
                + this._pad(date.getUTCDate());
    },

    _toTimeString : function(date) {
        return date.format(this.TIME_FORMAT);
    },

    _toUtcTimeString : function(date) {
        return this._pad(date.getUTCHours()) + ":"
                + this._pad(date.getUTCMinutes()) + ":"
                + this._pad(date.getUTCSeconds()) + 'Z';
    },

    _pad : function(val) {
        return val < 10 ? '0' + val : val.toString();
    },

    _toUtcIso8601DateString : function(date, timeString) {
        if (timeString) {
            return this._toUtcIso8601DateString(Date.parseDate(date
                            .format(this.DATE_FORMAT)
                            + ' ' + timeString, this.DATE_TIME_FORMAT));
        }
        return this._toUtcDateString(date) + 'T' + this._toUtcTimeString(date);
    }
});
