
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
        this._applySortOrder();

        if (this._onlyShowRecordsUpToLimit()) {
            this.filterBy(function(rec) {
                return this._getRecordsUpToLimit().indexOf(rec) >= 0;
            });
        }
    },

    _getRecordsUpToLimit: function() {
        return this.getRange(0, this.limitTo - 1);
    },

    _onlyShowRecordsUpToLimit: function() {
        return !this.showAll && this.canLimit();
    },

    canLimit: function() {
        return this.getCount() > this.limitTo;
    },

    _sortBySortOrderAndDisplay: function() {
        this.multiSort([
            { field: 'sortOrder', direction: 'ASC' },
            { field: 'display', direction: 'ASC' }
        ]);
    },

    _applySortOrder: function() {
        this.each(function(record) {
            record.set(
                'sortOrder',
                Portal.data.TopTermStoreStoreOrder.getSortOrder(this.titleText, record)
            );
        }, this);

        this.multiSort([
            { field: 'sortOrder', direction: 'ASC' },
            { field: 'count', direction: 'DESC' }
        ]);
    },

    _getDisplay: function(v, rec) {
        return v.substring(v.lastIndexOf(this.separator)+1).trim();
    }
});
