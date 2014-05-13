/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data');

Portal.data.AggregatorGroup = Ext.extend(Object, {

    childAggregators: null,

    constructor: function() {
        this.childAggregators = [];
    },

    add: function(aggr) {
        this.childAggregators.push(aggr);
    },

    supportsSubsettedNetCdf: function() {

        for (var i = 0; i < this.childAggregators.length; i++) {
            if (this.childAggregators[i].supportsSubsettedNetCdf()) {
                return true;
            }
        }
    },

    supportsNetCdfUrlList: function() {

        for (var i = 0; i < this.childAggregators.length; i++) {
            if (this.childAggregators[i].supportsNetCdfUrlList()) {
                return true;
            }
        }

        return false;
    }


});
