Ext.namespace('Portal.utils');

Portal.utils.Date = {

    getEarliestPortalDate: function() {
        // configured date or the ubiquitous 1970
        return new Date(Portal.app.appConfig.portal.earliestDate || 0 );
    },

    getLatestPortalDate: function() {
        // configured date (hopefully in the future) or returns today
        return new Date(Portal.app.appConfig.portal.latestDate);
    },

    getUtcDateFromLocalDate: function(localDate) {
        try {
            return Portal.utils.Date._getUtcDateFromLocalDate(localDate);
        } catch (err) {
            return null;
        }
    },

    getLocalDateFromUtcDate: function(utcDate) {
        try {
            return Portal.utils.Date._getLocalDateFromUtcDate(utcDate);
        } catch (err) {
            return null;
        }
    },

    _getUtcDateFromLocalDate: function(localDate) {
        var utcDate = new Date();

        utcDate.setUTCFullYear(localDate.getFullYear());
        utcDate.setUTCMonth(localDate.getMonth());
        utcDate.setUTCDate(localDate.getDate());
        utcDate.setUTCHours(localDate.getHours());
        utcDate.setUTCMinutes(localDate.getMinutes());
        utcDate.setUTCSeconds(localDate.getSeconds());
        utcDate.setUTCMilliseconds(localDate.getMilliseconds());

        return utcDate;
    },

    _getLocalDateFromUtcDate: function(utcDate) {
        return new Date(
            utcDate.getUTCFullYear(),
            utcDate.getUTCMonth(),
            utcDate.getUTCDate(),
            utcDate.getUTCHours(),
            utcDate.getUTCMinutes(),
            utcDate.getUTCSeconds(),
            utcDate.getUTCMilliseconds()
        );
    }
};
