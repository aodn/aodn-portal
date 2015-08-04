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

    missingDays: null,

    firstDay: undefined,
    lastDay: undefined,

    constructor: function() {
        this.extent = {};
        this.missingDays = [];
    },

    min: function() {
        var firstDay = this.getFirstDay();
        if (firstDay) {
            return this.getDay(firstDay)[0].clone();
        }

        return undefined;
    },

    max: function() {
        var lastDay = this.getLastDay();
        if (lastDay) {
            return this.getDay(lastDay).last().clone();
        }

        return undefined;
    },

    addDays: function(days) {
        if (days && days.length == 0) {
            return;
        }

        Ext.each(days, function(day, index) {
            // Create the day
            this._createDay(day);

            // Fill the gap for all the non existing dates
            if (index > 0) {
                var previousExistingDay = days[index-1].clone().startOf('day');
                var currentExistingDay  = days[index].clone().startOf('day');

                // Fill in all the days in this gap (if there's any), a day after
                // the previous existing date, until a day before the current
                // existing date
                for (var nonExistingDay = previousExistingDay.clone().add('days', 1);
                    nonExistingDay.isBefore(currentExistingDay);
                    nonExistingDay = nonExistingDay.add('days', 1))
                {
                    this.missingDays.push(nonExistingDay.toDate().clone());
                }
            }
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
            var lastTimeOfCurrent = this.lastTimeOfDay(current);
            if (this._equalToOrBefore(lastTimeOfCurrent, current)) {
                var nextDay = this._nextDay(current);
                if (nextDay && nextDay.length > 0) {
                    return nextDay[0].clone();
                }
                else {
                    return undefined;
                }
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
            var firstTimeOfCurrent = this.firstTimeOfDay(current);
            if (this._equalToOrAfter(firstTimeOfCurrent, current)) {
                var previousDay = this._previousDay(current);
                if (previousDay && previousDay.length > 0) {
                    return previousDay.last().clone();
                }
                else {
                    return undefined;
                }
            }
            else {
                return this._previousTimeInDay(current);
            }
        }
    },

    firstTimeOfDay: function(dateTime) {
        return this.getDay(dateTime)[0].clone();
    },

    lastTimeOfDay: function(dateTime) {
        return this.getDay(dateTime).last().clone();
    },

    _previousTimeInDay: function(dateTime) {
        for (var i = this.getDay(dateTime).length - 1; i >= 0; --i) {
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
        var previousDay = this.previousValidDate(dateTime);
        if (previousDay) {
            return this.getDay(previousDay);
        }
        else {
            // If we failed to find anything, return the first day
            return this.getDay(this.min());
        }
    },

    _nextDay: function(dateTime) {
        var nextDay = this.nextValidDate(dateTime);
        if (nextDay) {
            return this.getDay(nextDay);
        }
        else {
            // If we failed to find anything, return the last day
            return this.getDay(this.max());
        }
    },

    previousValidDate: function(dateTime) {
        var iter = dateTime.clone().utc().subtract(1, 'days');
        var startDate = this.min();

        // In the case no times were loaded
        if (!startDate) {
            return undefined;
        }

        while (iter.isAfter(startDate)) {
            if (this.getDay(iter)) {
                return this._destringifyDate(iter);
            }
            iter = iter.clone().subtract(1, 'days');
        }

        // If we failed to find anything, return first day
        return this._destringifyDate(startDate);
    },

    nextValidDate: function(dateTime) {
        var iter = dateTime.clone().utc().add(1, 'days');
        var endDate = this.max();

        // In the case no times were loaded
        if (!endDate) {
            return undefined;
        }

        while (iter.isBefore(endDate)) {
            if (this.getDay(iter)) {
                return this._destringifyDate(iter);
            }
            iter = iter.clone().add(1, 'days');
        }

        return this._destringifyDate(endDate);
    },

    _createDay: function(date) {
        date = new moment.utc(date);
        if (date.isValid() && ! this.extent[this._stringifyDate(date)]) {
            this.extent[this._stringifyDate(date)] = [];
        }

        // When creating new days, initialize the min/max (firstDay/lastDay)
        this._setFirstDay(date);
        this._setLastDay(date);
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

    _setFirstDay: function(day) {
        if (!this.firstDay || day.isBefore(this.firstDay)) {
            this.firstDay = this._startOfDay(day);
        }
    },

    getFirstDay: function() {
        if (this.firstDay) {
            return this.firstDay.clone();
        }
        else {
            return undefined;
        }
    },

    _setLastDay: function(day) {
        if (!this.lastDay || day.isAfter(this.lastDay)) {
            this.lastDay = this._startOfDay(day);
        }
    },

    getLastDay: function() {
        if (this.lastDay) {
            return this.lastDay.clone();
        }
        else {
            return undefined;
        }
    },

    _stringifyDate: function(date) {
        return moment.utc(date).format(this.DATE_FORMAT);
    },

    _destringifyDate: function(stringifiedDate) {
        return new moment.utc(stringifiedDate, this.DATE_FORMAT);
    },

    getMissingDays: function(reindex) {
        if (reindex) {
            // Find leaps in the array, in terms of dates
            var missingDays = [];
            var iter = this.getFirstDay();
            var endDate = this.getLastDay();

            while (iter.isBefore(endDate)) {
                if (!this.getDay(iter)) {
                    missingDays.push(iter.clone().toDate());
                }
                iter = iter.add(1, 'days');
            }
            this.missingDays = missingDays;
        }

        return this.missingDays;
    },

    getDays: function() {
        // Return an array of all days
        var days = [];

        var iter = this.getFirstDay();
        var endDate = this.getLastDay();

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

    getExtentAsArray: function() {
        // Returns extent as array (just the loaded dates)
        var flatExtent = [];

        var iter = this.getFirstDay();
        var endDate = this.getLastDay();

        if (!iter || !iter.isValid() || !endDate || !endDate.isValid()) {
            return flatExtent;
        }

        while (this._equalToOrBefore(iter, endDate)) {
            if (this.getDay(iter)) {
                Ext.each(this.getDay(iter), function(date, index) {
                    flatExtent.push(date.clone());
                }, this);
            }
            iter = iter.add(1, 'days');
        }

        return flatExtent;
    },

    subExtentForDate: function(date) {
        var sub = new Portal.visualise.animations.TemporalExtent();

        if (this.getDay(date)) {
            for (var j = 0; j < this.getDay(date).length; ++j) {
                sub.add(moment.utc(this.getDay(date)[j]).clone());
            }
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
