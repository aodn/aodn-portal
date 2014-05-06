/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data');

Portal.data.BodaacAggregator = Ext.extend(Portal.data.Aggregator, {

    isAodaacLayer: function() {
        return false;
    },

    isGogoduckLayer: function() {
        return false;
    },

    isBodaacLayer: function() {
        return true;
    }
});
