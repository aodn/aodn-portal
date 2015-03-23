/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.NumberFilter = Ext.extend(Portal.filter.Filter, {

    getSupportedGeoserverTypes: function() {

        return ['double', 'float', 'integer', 'int', 'long', 'short', 'decimal'];
    }
});
