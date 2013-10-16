Ext.namespace('Portal.form');

Portal.form.UtcExtentDateTime = Ext.extend(Ext.ux.form.DateTime, {

    setExtent: function(extent) {
        this.extent = extent;
        this.df.setMinValue(this.getLocalDateFromUtcValues(extent.min().utc().toDate()));
        this.df.setMaxValue(this.getLocalDateFromUtcValues(extent.max().utc().toDate()));
        this.df.setDisabledDates(extent.getMissingDays());
    },

    setValue: function(momentDate, toMaxTime) {
        this.df.setValue(this.getLocalDateFromUtcValues(momentDate.utc().toDate()));
        this._setTimeValues(momentDate.utc(), this.extent, toMaxTime);
    },

    _setTimeValues: function(date, extent, toMaxTime) {
        var dayExtent = extent.subExtentForDate(date);
        this.tf.setMinValue(this.getLocalDateFromUtcValues(dayExtent.min().utc().toDate()));
        this.tf.setMaxValue(this.getLocalDateFromUtcValues(dayExtent.max().utc().toDate()));
        if (toMaxTime) {
            this.tf.setValue(this.getLocalDateFromUtcValues(dayExtent.max().utc().toDate()));
            this.dateValue = dayExtent.max().toDate();
        }
        else {
            this.tf.setValue(this.getLocalDateFromUtcValues(dayExtent.min().utc().toDate()));
            this.dateValue = dayExtent.min().toDate();
        }
    },

    getLocalDateFromUtcValues: function(utcDate) {
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
});