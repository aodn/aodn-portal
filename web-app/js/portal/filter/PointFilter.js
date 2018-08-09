Ext.namespace('Portal.filter');

Portal.filter.PointFilter = Ext.extend(Portal.filter.Filter, {

    hasValue: function() {
        var value = this.getValue();
        return value && 'longitude' in value && 'latitude' in value;
    },

    isVisualised: function() {
        return false;
    },

    getHumanReadableForm: function() {
        var label = OpenLayers.i18n("timeSeriesAtHeading");
        var value = this.getValue();
        return String.format(
            '{0}: {1},{2}<br>',
            label,
            value.latitude  != "" ? value.latitude  : " - ",
            value.longitude != "" ? value.longitude : " - "
        );
    }
});
