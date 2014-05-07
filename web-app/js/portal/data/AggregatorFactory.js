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
            aggregator = this._getAodaacAggregator();
        }

        if (name == this.BODAAC_PROTOCOL_NAME) {
            aggregator = this._getBodaacAggregator();
        }

        if (name == this.GOGODUCK_PROTOCOL_NAME) {
            aggregator = this._getGogoduckAggregator();
        }

        return aggregator;
    },

    _getAodaacAggregator: function() {
        if (!this.aodaacAggregator) {
            this.aodaacAggregator = new Portal.data.AodaacAggregator();
        }

        return this.aodaacAggregator;
    },

    _getBodaacAggregator: function() {
        if (!this.bodaacAggregator) {
            this.bodaacAggregator = new Portal.data.BodaacAggregator();
        }

        return this.bodaacAggregator;
    },

    _getGogoduckAggregator: function() {
        if (!this.gogoduckAggregator) {
            this.gogoduckAggregator = new Portal.data.GogoduckAggregator();
        }

        return this.gogoduckAggregator;
    }
});
