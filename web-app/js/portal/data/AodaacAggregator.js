/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data');

Portal.data.AodaacAggregator = Ext.extend(Portal.data.Aggregator, {

    isAodaacLayer: function() {
        return true;
    },

    isGogoduckLayer: function() {
        return false;
    },

    isBodaacLayer: function() {
        return false;
    }
});
