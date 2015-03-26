/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.StringFilter = Ext.extend(Portal.filter.Filter, {

    getSupportedGeoserverTypes: function() {

        return ['string'];
    },

    getUiComponentClass: function() {

        return Portal.filter.ui.ComboFilterPanel;
    },

    getHumanReadableForm: function() {

        return String.format(
            '{0} like {1}',
            this.getLabel(),
            this.getValue()
        );
    },

    _getCql: function() {

        return String.format(
            "{0} LIKE '{1}'",
            this.getName(),
            this._escapeSingleQuotes(this.getValue())
        );
    },

    _escapeSingleQuotes: function(text) {

        return text.replace(/'/g, "''");
    }
});
