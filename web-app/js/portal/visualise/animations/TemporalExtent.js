/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.visualise.animations');

Portal.visualise.animations.TemporalExtent = Ext.extend(Ext.util.Observable, {

    constructor: function() {
        this.extent = [];
        this.missingDays = [];
        this.addEvents('extentparsed');
    },

    min: function() {
        if (this.notEmpty()) {
            return this.extent[0].clone();
        }
    },

    max: function() {
        if (this.notEmpty()) {
            return this.extent[this.extent.length - 1].clone();
        }
    },

    add: function(date) {
        this.extent.push(moment.utc(date));
    },

    length: function() {
        return this.extent.length;
    },

    next: function(dateTime) {
        var current = moment.utc(dateTime);

        if (this._equalToOrAfter(current, this.max())) {
            return undefined;
        }
        else if (current.isBefore(this.min())) {
            return this.min();
        }

        var indexOfDay = this._findFirstIndexOfDay(
            this._zeroIfNegative(binSearch(this.extent, current, this._startOfDayIsAfter, this)),
            current
        );

        return this.extent[this._findFirstIndexAfter(current, indexOfDay)].clone();
    },

    previous: function(dateTime) {
        var current = moment.utc(dateTime);

        if (this._equalToOrBefore(current, this.min())) {
            return undefined;
        }
        else if (current.isAfter(this.max())) {
            return this.max();
        }

        var indexOfDay = this._findFirstIndexOfDay(
            this._zeroIfNegative(binSearch(this.extent, current, this._startOfDayIsAfter, this)),
            current
        );

        return this.extent[this._findFirstIndexBefore(current, indexOfDay)].clone();
    },

    getMissingDays: function() {
        return this.missingDays;
    },

    emptyExtent: function() {
        return new Portal.visualise.animations.TemporalExtent();
    },

    subExtentForDate: function(extentStart) {
        if (this.empty()) {
            return this.emptyExtent();
        }

        var _extentStart = moment.utc(extentStart);
        // Will give us an occurrence of the date given, not necessarily
        // the first or last
        var indexOfSameDate = binSearch(this.extent, _extentStart, this._startOfDayIsAfter, this);

        // No dates found - return
        if (indexOfSameDate < 0) {
            return this.emptyExtent();
        }

        return this._getSubExtent(
            this._findFirstIndexOfDay(indexOfSameDate, _extentStart),
            this._findLastIndexOfDay(indexOfSameDate, _extentStart)
        );
    },

    subExtent: function(extentStart, extentEnd) {
        if (this.empty()) {
            return this.emptyExtent();
        }

        var _extentStart = moment.utc(extentStart);
        var _extentEnd = extentEnd ? moment.utc(extentEnd) : this.max().add('days', 1);

        // Will give us an occurrence of the date given, not necessarily
        // the first or last
        var indexOfStartDate = this._zeroIfNegative(binSearch(this.extent, _extentStart, this._startOfDayIsAfter, this));
        var indexOfEndDate = this._whenNegative(binSearch(this.extent, _extentEnd, this._startOfDayIsAfter, this), this.length() - 1);

        return this._getSubExtent(
            this._findIndexOrNearestAfter(_extentStart, indexOfStartDate),
            this._findIndexOrNearestBefore(_extentEnd, indexOfEndDate)
        );
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

        this.extent = [];

        var chunkSize = 1024;

        var that = this;
        var extentParser = new Portal.visualise.animations.TemporalExtentParser();
        (function () {
            function _parseChunk() {
                var chunkStart = 0;
                (function () {
                    var chunkEnd = chunkStart + chunkSize;
                    if (chunkEnd >= _extent.length) {
                        chunkEnd = _extent.length;
                    }
                    that.extent.push.apply(
                        that.extent,
                        extentParser.expandExtendedISO8601Dates(_extent, chunkStart, chunkEnd)
                    );

                    that._generateMissingDays(chunkStart, chunkEnd);
                    chunkStart = chunkEnd;

                    if (_extent.length > chunkStart) {
                        setTimeout(arguments.callee, 0);
                    }
                    else {
                        that.fireEvent('extentparsed');
                    }
                })();
            }
            _parseChunk();
        })();
    },

    _getSubExtent: function(startIndex, endIndex) {
        var sub = new Portal.visualise.animations.TemporalExtent();
        for (var i = startIndex; i <= endIndex; i++) {
            sub.add(moment.utc(this.extent[i]));
        }

        return sub;
    },

    _findIndexOrNearestAfter: function(date, startIndex) {
        var index = startIndex;
        var _nearest = this.extent[startIndex];
        if (_nearest.isAfter(date)) {
            while (index > 0 && this._equalToOrAfter(this.extent[index - 1], date)) {
                index--;
            }
        }
        else if (_nearest.isBefore(date)) {
            while (index < this.length() - 1 && !this._equalToOrAfter(this.extent[index], date)) {
                index++;
            }
        }
        return index;
    },

    _findIndexOrNearestBefore: function(date, startIndex) {
        var index = startIndex;
        var _nearest = this.extent[startIndex];
        if (_nearest.isAfter(date)) {
            while (index > 0 && !this._equalToOrBefore(this.extent[index], date)) {
                index--;
            }
        }
        else if (_nearest.isBefore(date)) {
            while (index < this.length() - 1 && !this._equalToOrAfter(this.extent[index + 1], date)) {
                index++;
            }
        }

        return index;
    },

    _findFirstIndexAfter: function(date, startIndex) {
        var index = startIndex;
        var _nearest = this.extent[startIndex];
        if (_nearest.isAfter(date)) {
            while (index > 0 && this.extent[index - 1].isAfter(date)) {
                index--;
            }
        }
        else if (this._equalToOrBefore(_nearest, date)) {
            while (index < this.length() - 1 && !this.extent[index].isAfter(date)) {
                index++;
            }
        }

        if (this.extent[index].isAfter(date)) {
            return index;
        }
        return -1;
    },

    _findFirstIndexBefore: function(date, startIndex) {
        var index = startIndex;
        var _nearest = this.extent[startIndex];
        if (this._equalToOrAfter(_nearest, (date))) {
            while (index > 0 && !this.extent[index].isBefore(date)) {
                index--;
            }
        }
        else if (_nearest.isBefore(date)) {
            while (index < this.length() - 1 && !this._equalToOrAfter(this.extent[index + 1], date)) {
                index++;
            }
        }

        if (this.extent[index].isBefore(date)) {
            return index;
        }
        return -1;
    },

    _equalToOrAfter: function(date1, date2) {
        return date1.isSame(date2) || date1.isAfter(date2);
    },

    _equalToOrBefore: function(date1, date2) {
        return date1.isSame(date2) || date1.isBefore(date2);
    },

    _findFirstIndexOfDay: function(indexOfDay, day) {
        var firstIndex = indexOfDay;
        while (firstIndex - 1 >= 0 && this._isSameDay(this.extent[firstIndex - 1], day)) {
            --firstIndex;
        }

        return firstIndex;
    },

    _findLastIndexOfDay: function(indexOfDay, day) {
        var endIndex = indexOfDay;
        while (endIndex + 1 < this.length() && this._isSameDay(this.extent[endIndex + 1], day)) {
            ++endIndex;
        }

        return endIndex;
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

    // TODO write tests for this
    _generateMissingDays: function(startIndex, endIndex) {
        var _startIndex = startIndex || 0;
        var _endIndex = endIndex || this.extent.length;

        // Find leaps in the array, in terms of dates
        // Note: i does not necessarily start from 0, as we do
        // chunk processing here...
        for (var i = _startIndex; i < _endIndex; i++) {
            // If we're at 0, then skip the first iteration, as we reference
            // temporalExtent[i-1]
            if (i > 0) {
                var previousExistingDay = this.extent[i - 1].clone().startOf('day');
                var currentExistingDay  = this.extent[i].clone().startOf('day');

                // Fill in all the days in this gap (if there's any), a day after
                // the previous existing date, until a day before the current
                // existing date
                for (var nonExistingDay = previousExistingDay.clone().add('days', 1);
                     nonExistingDay.isBefore(currentExistingDay);
                     nonExistingDay = nonExistingDay.add('days', 1)) {
                    this.missingDays.push(nonExistingDay.clone());
                }
            }
        }
    },

    _zeroIfNegative: function(value) {
        return this._whenNegative(value, 0);
    },

    _whenNegative: function(value, defaultValue) {
        if (value < 0) {
            return defaultValue;
        }
        return value;
    }

});