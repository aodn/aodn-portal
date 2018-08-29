Ext.namespace('Portal.filter');

Portal.filter.StringDepthFilter = Ext.extend(Portal.filter.StringFilter, {

    setUnits: function(units) {

        this.units = units;
    },

    getUnits: function() {

        return this.units;
    },

    getHumanReadableForm: function() {

        //  The format for a StringFilter is <Label>: <value>
        //  In this case it will be something like 'Depth: 0,5000'
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
