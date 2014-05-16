/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data');

Portal.data.AggregatorFactory = Ext.extend(Object, {

    AODAAC_PROTOCOL_NAME: "AODAAC",
    GOGODUCK_PROTOCOL_NAME: "GoGoDuck",
    BODAAC_PROTOCOL_NAME: "BODAAC",

    newAggregatorGroup: function(links) {

        var group = new Portal.data.AggregatorGroup();
        var linksWithOneAggr = this.cutAodaac(links);
        var supportedProtocols = [
            this.AODAAC_PROTOCOL_NAME,
            this.BODAAC_PROTOCOL_NAME,
            this.GOGODUCK_PROTOCOL_NAME
        ];

        Ext.each(linksWithOneAggr, function(linkToCheck) {
            if (inArray(supportedProtocols, linkToCheck.name)) {
                var aggr = this.newAggregator(linkToCheck.name);
                group.add(aggr);
            }
        }, this);

        return group;
    },

    cutAodaac: function(links) {

        var gogoduck = false;

        Ext.each(links, function(link) {
            if (link.name == this.GOGODUCK_PROTOCOL_NAME) {
                gogoduck = true;
            }
        }, this);

        if (gogoduck) {
            Ext.each(links, function(link, index) {
                if (link.name == this.AODAAC_PROTOCOL_NAME) {
                    links.splice(index, 1);
                }
            }, this);
        }

        return links;
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
