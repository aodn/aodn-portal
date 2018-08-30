Ext.namespace('Portal.filter');

Portal.filter.StringDepthFilter = Ext.extend(Portal.filter.StringFilter, {

    setUnits: function(units) {

        this.units = units;
    },

    getUnits: function() {

        return this.units;
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
    }

});
