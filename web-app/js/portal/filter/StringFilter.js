

Ext.namespace('Portal.filter');

Portal.filter.StringFilter = Ext.extend(Portal.filter.Filter, {

    getSupportedGeoserverTypes: function() {

        return ['string'];
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

        return String.format(
            '{0}: {1}',
            this.getLabel(),
            this.getValue()
        );
    },

    _escapeSingleQuotes: function(text) {

        return text.replace(/'/g, "''");
    }
});
