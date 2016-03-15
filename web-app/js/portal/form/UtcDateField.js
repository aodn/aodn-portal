Ext.namespace('Portal.form');

// Date field which can be set using or return UTC dates

Portal.form.UtcDateField = Ext.extend(Ext.form.DateField, {

    getUtcValue: function() {
        var localDate = this.getValue();
        return Portal.utils.Date.getUtcDateFromLocalDate(localDate);
    },

    setUtcValue: function(value) {
        var localDate = this._getLocalDateFromUtcDate(value);
        this.setValue(localDate);
    },

    setMinUtcValue: function(value) {
        var localDate = this._getLocalDateFromUtcDate(value);
        this.setMinValue(localDate);
    },

    setMaxUtcValue: function(value) {
        var localDate = this._getLocalDateFromUtcDate(value);
        this.setMaxValue(localDate);
    },

    _getLocalDateFromUtcDate: function(value) {
        if (value instanceof Date) {
            return Portal.utils.Date.getLocalDateFromUtcDate(value);
        } else {
            return value;
        }
    }
});
