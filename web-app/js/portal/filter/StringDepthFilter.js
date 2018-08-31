Ext.namespace('Portal.filter');

Portal.filter.StringDepthFilter = Ext.extend(Portal.filter.Filter, {

    getSupportedGeoserverTypes: function() {
        return ['depthstring'];
    },

    setUnits: function(units) {

        this.units = units;
    },

    getUnits: function() {

        return this.units;
    },

    getUiComponentClass: function() {

        return Portal.filter.ui.ComboFilterPanel;
    },

    getCql: function() {

        return String.format(
            "{0} LIKE '{1}'",
            this.getName(),
            this._escapeSingleQuotes(this.getValue())
        );
    },

    getHumanReadableForm: function() {
        //  Desired format: 0m to 5000m
        if(this.getValue().length > 1) {
            zAxisMin = this.getValue()[0];
            zAxisMax = this.getValue()[1];
            zAxisString = zAxisMin + this.getUnits() + " to " + zAxisMax + this.getUnits();
        }

        return String.format(
            '{0}: {1}',
            this.getLabel(),
            zAxisString
        );
    },

    _escapeSingleQuotes: function(text) {

        return text.replace(/'/g, "''");
    }

});
