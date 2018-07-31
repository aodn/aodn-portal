Ext.namespace('Portal.details');

Portal.filter.ui.AlaFilterGroupPanel = Ext.extend(Portal.filter.ui.GroupPanel, {

    constructor: function(cfg) {
        Portal.filter.ui.AlaFilterGroupPanel.superclass.constructor.call(this, cfg);
    },

    initComponent: function() {
        Portal.filter.ui.AlaFilterGroupPanel.superclass.initComponent.call(this);
    },

    _attachEvents: function() {
        var filters = this.dataCollection.getFilters();
        if (filters == undefined) {
            this.dataCollection.on(Portal.data.DataCollection.EVENTS.FILTERS_LOAD_SUCCESS, this._filtersLoaded, this);
            this.dataCollection.on(Portal.data.DataCollection.EVENTS.FILTERS_LOAD_FAILURE, function() { this._filtersLoaded([]); }, this);
        }
        else {
            this._filtersLoaded(filters);
        }
    },

    _filtersLoaded: function(filters) {
        this._sortFilters(filters);
        this._addFilterPanels(filters);
        this._updateAndShow();
    },

    _addFilterPanels: function(filters) {
        var filterPanels = [];

        Ext.each(filters, function(filter) {
            var filterPanel = this._createFilterPanel(filter);
            filterPanels.push(filterPanel);
        }, this);

        this.filterPanels = filterPanels;

        this._organiseFilterPanels(filterPanels);
    }
});
