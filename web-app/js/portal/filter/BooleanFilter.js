Ext.namespace('Portal.filter');

Portal.filter.BooleanFilter = Ext.extend(Portal.filter.Filter, {

    getSupportedGeoserverTypes: function() {

        return ['boolean'];
    },

    getUiComponentClass: function() {

        return Portal.filter.ui.BooleanFilterPanel;
    },

    getCql: function() {

        return String.format(
            '{0} = true',
            this.getName()
        );
    },

    getHumanReadableForm: function() {

        return String.format(
            '{0}: true',
            this.getLabel()
        );
    }
});
