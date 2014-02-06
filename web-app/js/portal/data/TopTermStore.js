
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data');

/**
 * Store top terms for a field extracted from a GeoNetwork summary document
 */

Portal.data.TopTermStore = Ext.extend(Ext.data.XmlStore, {

    constructor : function(cfg) {
        cfg = cfg || {};

        var defaults = {
            showAll: false,
            limitTo: 10
        };

        var config = Ext.apply({
            record : '*',
            fields : [{
                name : 'value',
                mapping : '@name'
            }, {
                name : 'count',
                mapping : '@count',
                type : 'integer'
            }, {
                name : 'display',
                mapping : '@name',
                convert : this._getDisplay.createDelegate(this)
            }, {
                name : 'sortOrder',
                mapping : '@sortOrder'
            }]
        }, cfg, defaults);

        Portal.data.TopTermStore.superclass.constructor.call(this, config);

        this.addEvents('termsloaded');
    },

    // Load store with topterms for indexed field from the passed GeoNetwork summary
    // document, filtering loaded values to those starting with filter if supplied

    loadTopTerms: function(summary, fieldGroup, filter) {
        var topTerms = Ext.DomQuery.selectNode('response/summary/'+fieldGroup, summary);

        if (topTerms) {
            this.loadData(topTerms);
        }
        else {
            this.removeAll();
        }

        this.filterValue = filter;
        this._applyFilters();

        this.fireEvent('termsloaded');
    },

    setShowAll: function(showAll) {
        if (this.showAll == showAll)
            return;

        this.showAll = showAll;
        this._applyFilters();
    },

    _applyFilters: function() {
        this.clearFilter();

        this._matchPreviousSelection();
        this._limitRecords();
        this._sortBySortOrderAndDisplay();
    },

    _matchPreviousSelection: function() {
        // Only want terms matching previous selections
        if (this.filterValue) {
            this.filter('value', this.filterValue);
        }
    },

    _limitRecords: function() {
        this.canLimit = this.getCount() > this.limitTo;

        this._applySortOrder();

        if (!this.showAll && this.canLimit) {
            // only want first limitTo records
            var includeList = this.getRange(0, this.limitTo - 1);

            this.filterBy(function(rec) {
                return includeList.indexOf(rec) >= 0;
            });
        }
    },

    _sortBySortOrderAndDisplay: function() {
        this.multiSort([
            { field: 'sortOrder', direction: 'ASC' },
            { field: 'display', direction: 'ASC' }
        ]);
    },

    _applySortOrder: function() {
        this.each(function(record) {
            record.set('sortOrder', this._getSortOrderForRecord(record));
        }, this);

        this.multiSort([
            { field: 'sortOrder', direction: 'ASC' },
            { field: 'count', direction: 'DESC' }
        ]);
    },

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

    _isSortOrderDefinedForRecord: function(record) {
       return (   this.SORT_ORDER
               && this.SORT_ORDER[this.titleText]
               && this.SORT_ORDER[this.titleText][record.get('value')]);
    },

    _getSortOrderForRecord: function(record) {
        if (this._isSortOrderDefinedForRecord(record)) {
            return this.SORT_ORDER[this.titleText][record.get('value')];
        }
        else {
            return this.MAX_SORT_ORDER;
        }
    },

    _getDisplay: function(v, rec) {
        return v.substring(v.lastIndexOf(this.separator)+1).trim();
    }
});
