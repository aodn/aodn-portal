/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data');

Portal.data.AggregatorFactory = Ext.extend(Object, {

    constructor: function() {
        this.AODAAC_PROTOCOL_NAME = "AODAAC";
        this.GOGODUCK_PROTOCOL_NAME = "GoGoDuck";
        this.BODAAC_PROTOCOL_NAME = "BODAAC";
    },

    newAggregator: function(name) {
        var aggregator;

        if (name == this.AODAAC_PROTOCOL_NAME) {
            aggregator = new Portal.data.AodaacAggregator();
        }

        if (name == this.BODAAC_PROTOCOL_NAME) {
            aggregator = new Portal.data.BodaacAggregator();
        }

        if (name == this.GOGODUCK_PROTOCOL_NAME) {
            aggregator = new Portal.data.GogoduckAggregator();
        }

        return aggregator;
    }
});
