/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.BooleanFilter = Ext.extend(Portal.filter.Filter, {

    getSupportedGeoserverTypes: function() {

        return ['boolean'];
    },

    getUiComponentClass: function() {

        return Portal.filter.ui.BooleanFilterPanel;
    },

    getCql: function() {

        return this._getCql(this.getName());
    },

    getHumanReadableForm: function() {

        return this._getCql(this.getLabel());
    },

    _getCql: function(fieldName) {

        return String.format(
            '{0} = true',
            fieldName
        );
    }
});
