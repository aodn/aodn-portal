/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.visualise.animations');

/* This class is managing a temporal extent. The way we manage the temporal
 * extent is by having a hash (this.extent) which will hold dates as keys. Each
 * value in the hash will be an array of of dates (moment objects). So think
 * about this class as something like:
 * this.extent['2011-01-01'] = [ '2011-01-01 12:00', '2011-01-01 13:00' ]
 * this.extent['2011-01-02'] = [ '2011-01-02 10:00', '2011-01-02 15:30' ]
 * this.extent['2011-01-03'] = [ '2011-01-03 00:00', '2011-01-03 01:00' ]
 *
 * The moments in the array are not guaranteed to be ordered. The hash of the
 * dates is also not ordered because it's a hash!
 */
Portal.visualise.animations.TemporalExtent = Ext.extend(Ext.util.Observable, {
    // Date format used for stringifying/destringifying moments
    DATE_FORMAT: "YYYY-MM-DD",

    constructor: function() {
        this.extent = {};
    },

    min: function() {
        var minDate = null;
        if (this.notEmpty()) {
            for (var date in this.extent) {
                if (!minDate || this.extent[date][0].isBefore(minDate)) {
                    minDate = this.extent[date][0].clone();
                }
            }
        }
        return minDate;
    },

    max: function() {
        if (this.notEmpty()) {
            var maxDate = null;
            for (var date in this.extent) {
                if (!maxDate || this.extent[date].last().isAfter(maxDate)) {
                    maxDate = this.extent[date].last().clone();
                }
            }
        }
        return maxDate;
    },

    addDays: function(days) {
        Ext.each(days, function(day, index) {
            this._createDay(day);
        }, this);
    },

    add: function(date) {
        this._createDay(date);
        this.getDay(date).push(moment.utc(date));
    },

    length: function() {
        var length = 0;
        for (var date in this.extent) {
            length += this.extent[date].length;
        }
        return length;
    },

    next: function(dateTime) {
        var current = moment.utc(dateTime);

        if (this._equalToOrAfter(current, this.max())) {
            return undefined;
        }
        else if (current.isBefore(this.min())) {
            return this.min();
        }
        else {
            var lastTimeOfCurrent = this._lastTimeOfDay(current);
            if (this._equalToOrBefore(lastTimeOfCurrent, current)) {
                return this._nextDay(current)[0];
            }
            else {
                return this._nextTimeInDay(current);
            }
        }
    },

    previous: function(dateTime) {
        var current = moment.utc(dateTime);

        if (this._equalToOrBefore(current, this.min())) {
            return undefined;
        }
        else if (current.isAfter(this.max())) {
            return this.max();
        }
        else {
            var firstTimeOfCurrent = this._firstTimeOfDay(current);
            if (this._equalToOrAfter(firstTimeOfCurrent, current)) {
                return this._previousDay(current).last();
            }
            else {
                return this._previousTimeInDay(current);
            }
        }
    },

    _firstTimeOfDay: function(dateTime) {
        return this.getDay(dateTime)[0].clone();
    },

    _lastTimeOfDay: function(dateTime) {
        return this.getDay(dateTime).last().clone();
    },

    _previousTimeInDay: function(dateTime) {
        for (var i = this.getDay(dateTime).length - 1; i > 0; --i) {
            if (this.getDay(dateTime)[i].isBefore(dateTime)) {
                return this.getDay(dateTime)[i].clone();
            }
        }
    },

    _nextTimeInDay: function(dateTime) {
        for (var i = 0; i < this.getDay(dateTime).length; ++i) {
            if (this.getDay(dateTime)[i].isAfter(dateTime)) {
                return this.getDay(dateTime)[i].clone();
            }
        }
    },

    _previousDay: function(dateTime) {
        var iter = dateTime.substract(1, 'days');
        var startDate = this.min();
        while (iter.isAfter(startDate)) {
            if (this.getDay(iter)) {
                return this.getDay(iter);
            }
            iter = iter.clone().substract(1, 'days');
        }

        // If we failed to find anything, return the first time of the first day
        return this.getDay(startDate);
    },

    _nextDay: function(dateTime) {
        var iter = dateTime.add(1, 'days');
        var endDate = this.max();
        while (iter.isBefore(endDate)) {
            if (this.getDay(iter)) {
                return this.getDay(iter);
            }
            iter = iter.clone().add(1, 'days');
        }

        // If we failed to find anything, return the last time of the last day
        return this.getDay(endDate);
    },

    _createDay: function(date) {
        date = new moment.utc(date);
        if (date.isValid() && ! this.extent[this._stringifyDate(date)]) {
            this.extent[this._stringifyDate(date)] = [];
        }
    },

    getDay: function(date) {
        var day = this._stringifyDate(date);
        if (this.extent[day]) {
            return this.extent[day];
        }
        else {
            return null;
        }
    },

    _getFirstDay: function() {
        var firstDay = undefined;
        Ext.iterate(this.extent, function(day, arrayOfDateTime) {
            var iter = this._destringifyDate(day);
            if (!firstDay || iter.isBefore(firstDay)) {
                firstDay = iter.clone();
            }
        }, this);
        return firstDay;
    },

    _getLastDay: function() {
        var lastDay = undefined;
        Ext.iterate(this.extent, function(day, arrayOfDateTime) {
            var iter = this._destringifyDate(day);
            if (!lastDay || iter.isAfter(lastDay)) {
                lastDay = iter.clone();
            }
        }, this);
        return lastDay;
    },

    _stringifyDate: function(date) {
        return moment.utc(date).format(this.DATE_FORMAT);
    },

    _destringifyDate: function(stringifiedDate) {
        return new moment.utc(stringifiedDate, this.DATE_FORMAT);
    },

    getMissingDays: function() {
        // Find leaps in the array, in terms of dates
        var missingDays = [];
        var iter = this._getFirstDay();
        var endDate = this._getLastDay();

        while (iter.isBefore(endDate)) {
            if (!this.getDay(iter)) {
                missingDays.push(iter.clone().toDate());
            }
            iter = iter.add(1, 'days');
        }

        return missingDays;
    },

    getDays: function() {
        // Return an array of all days
        var days = [];

        var iter = this._getFirstDay();
        var endDate = this._getLastDay();

        if (!iter || !iter.isValid() || !endDate || !endDate.isValid()) {
            return days;
        }

        while (this._equalToOrBefore(iter, endDate)) {
            if (this.getDay(iter)) {
                days.push(iter.clone());
            }
            iter = iter.add(1, 'days');
        }

        return days;
    },

    subExtentForDate: function(date) {
        var sub = new Portal.visualise.animations.TemporalExtent();

        for (var j = 0; j < this.getDay(date).length; ++j) {
            sub.add(moment.utc(this.getDay(date)[j]));
        }

        return sub;
    },

    empty: function() {
        return this.length() <= 0;
    },

    notEmpty: function() {
        return !this.empty();
    },

    parse: function(extent) {
        var _extent;
        if (extent instanceof Array) {
            _extent = extent;
        }
        else {
            _extent = extent.split(",");
        }

        // Expand dates
        var extentParser = new Portal.visualise.animations.TemporalExtentParser();
        _extent = extentParser.expandExtendedDates(_extent);

        for (var i = 0; i < _extent.length; ++i) {
            this.add(_extent[i]);
        }
    },

    _equalToOrAfter: function(date1, date2) {
        return date1.isSame(date2) || date1.isAfter(date2);
    },

    _equalToOrBefore: function(date1, date2) {
        return date1.isSame(date2) || date1.isBefore(date2);
    },

    _isSameDay: function(left, right) {
        return this._startOfDay(left).isSame(this._startOfDay(right));
    },

    _startOfDayIsAfter: function(left, right) {
        return this._startOfDay(left).isAfter(this._startOfDay(right));
    },

    _startOfDay: function(momentDate) {
        return momentDate.clone().startOf('day');
    },

    isValid: function(searchDate) {
        return this.getDay(searchDate) &&
            binSearch(this.getDay(searchDate), searchDate, this._startOfDayIsAfter, this) != -1;
    }
});
