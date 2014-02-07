/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data');

Portal.data.TopTermStoreStoreOrder = {

    MAX_SORT_ORDER: 1000,

    SORT_ORDER: {
        'Measured parameter': {
            'Abundance of biota': 1,
            'Concentration of chlorophyll per unit volume of the water body': 2,
            'Concentration of oxygen {O2} per unit mass of the water body': 3,
            'Current speed in the water body': 4,
            'Practical salinity of the water body': 5,
            'Pressure (measured variable) exerted by the atmosphere': 6,
            'Significant height of waves on the water body': 7,
            'Temperature of the water body': 8,
            'Turbidity of the water body': 9,
            'Wind speed in the atmosphere': 10
        }
    },

    _isSortOrderDefined: function(facetTitle, record) {
       return (   this.SORT_ORDER
               && this.SORT_ORDER[facetTitle]
               && this.SORT_ORDER[facetTitle][record.get('value')]);
    },

    getSortOrder: function(facetTitle, record) {
        if (this._isSortOrderDefined(facetTitle, record)) {
            return this.SORT_ORDER[facetTitle][record.get('value')];
        }
        else {
            return this.MAX_SORT_ORDER;
        }
    }
};
