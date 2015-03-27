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

    getHumanReadableForm: function() {

        return String.format(
            '{0} = true',
            this.getLabel()
        );
    },

    _getCql: function() {

        return String.format(
            '{0} = true',
            this.getName()
        );
    }
});
