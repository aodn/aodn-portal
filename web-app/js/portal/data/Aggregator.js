/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data');

Portal.data.Aggregator = Ext.extend(Object, {

    supportsSubsettedNetCdf: function() {
        return false;
    },

    supportsNetCdfUrlList: function() {
        return false;
    },

    buildParams: function() {
        return '';
    }
});
