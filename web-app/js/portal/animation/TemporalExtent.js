Ext.namespace('Portal.animation');

Portal.animation.TemporalExtent = Ext.extend(Object, {

    constructor: function(cfg) {
        Ext.apply(this, cfg);
    },

    expandExtendedISO8601Dates: function(splitDates, startIndex, endIndex) {

        /*
         Expand setISO8601 repeating intervals from array
         EG: [ "2001-01-10T22:36:00.000Z/2001-01-12T21:48:00.000Z/PT23H36M", "2002-01-10T22:36:00.000Z/2003-01-12T21:48:00.000Z/PT23H36M" ]
         */

        // Allow passing start and end index, for handling really large arrays
        var _startIndex = typeof startIndex !== 'undefined' ? startIndex : 0;
        var _endIndex   = typeof endIndex   !== 'undefined' ? endIndex   : splitDates.length;

        var expandedDates = [];
        for (var i = _startIndex; i < _endIndex; i++) {
            // no default condition
            switch (splitDates[i].split("/").length)  {
                case 1: {
                    expandedDates.push(moment.utc(splitDates[i]));
                    break;
                }
                case 2: {
                    console.log("ERROR: Unhandled date format: " + splitDates[i]);
                    break;
                }
                case 3: {
                    var arrayOfDateTimes = this._expand3sectionExtendedISO8601Date(splitDates[i]);
                    for (var x = 0; x < arrayOfDateTimes.length; x++) {
                        expandedDates.push(arrayOfDateTimes[x]);
                    }
                    break;
                }
            }
        }

        return expandedDates;
    },

    _expand3sectionExtendedISO8601Date: function(extendedDate) {

        /* expecting the 3 part format as seen from ncWMS
         start / endate / interval
         EG: 2001-01-10T22:36:00.000Z/2001-01-12T21:48:00.000Z/PT23H36M
         */

        var expandedDates = [];

        var dateParts = extendedDate.split("/");
        var period = dateParts[2];

        // 'P' indicates that the duration that follows is specified by the number of years, months, days, hours, minutes, and seconds
        if (period.indexOf("P") == 0) {

            var duration = moment.duration(this._getISO8601Period(period));
            var nextDate = moment.utc(dateParts[0]);
            var endDate = moment.utc(dateParts[1]);

            if (nextDate.isValid()) {
                while (!nextDate.isAfter(endDate)) {
                    expandedDates.push(nextDate.clone());
                    nextDate.add(duration);
                }

                // always end with the last date
                if (!expandedDates[expandedDates.length - 1].isSame(endDate)) {
                    expandedDates.push(endDate.clone());
                }
            }
        }
        else {
            console.log('Date not understood: ' + period);
        }

        // Don't try to sort it, it's an array of moment()s, it'll sort
        // references in memory rather than compare dates.
        return expandedDates;
    },


    _getISO8601Period: function(period) {
        //var durationKeys = ["seconds", "minutes", "hours", "days", "weeks", "months", "years"];
        var durationKeys = ["years", "months", "weeks", "days", "hours", "minutes", "seconds"];
        var duration = this._initDuration(durationKeys);

        // rip off the 'P'
        var dateParts = period.substring(1);
        var timeParts = "";

        // 'T' indicates start of time elements
        var parts = dateParts.split("T");
        if (parts.length > 1) {
            dateParts = parts[0];
            timeParts = parts[1];
        }

        this._parseDateTimeDurationComponent(["Y", "M", "W", "D"], dateParts, function(index, periodValue) {
            duration[durationKeys[index]] = parseInt(periodValue);
        });

        var offset = 4;
        this._parseDateTimeDurationComponent(["H", "M", "S"], timeParts, function(index, periodValue) {
            duration[durationKeys[index + offset]] = parseInt(periodValue);
        });

        return duration;
    },

    _parseDateTimeDurationComponent: function(component, componentParts, valueFn) {
        Ext.each(component, function(character, index, all) {
            componentParts = this._splitDurationOn(componentParts, character, index, valueFn);
        }, this);
    },

    _splitDurationOn: function(dateTimeString, character, index, valueFn) {
        var splitParts = dateTimeString.split(character);
        if (splitParts.length > 1) {
            valueFn.call(this, index, splitParts[0]);
            return splitParts[1];
        }
        return dateTimeString;
    },

    _initDuration: function(keys) {
        var duration = {};
        Ext.each(keys, function(key, index, all) {
            duration[key] = null;
        }, this);

        return duration;
    }

});