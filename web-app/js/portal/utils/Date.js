Ext.namespace('Portal.utils');

Portal.utils.Date = {
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
        var localDate = null;

        localDate = new Date(
            utcDate.getUTCFullYear(),
            utcDate.getUTCMonth(),
            utcDate.getUTCDate(),
            utcDate.getUTCHours(),
            utcDate.getUTCMinutes(),
            utcDate.getUTCSeconds(),
            utcDate.getUTCMilliseconds()
        );

        return localDate;
    }
};
