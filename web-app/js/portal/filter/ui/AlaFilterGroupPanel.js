Ext.namespace('Portal.details');

Portal.filter.ui.AlaFilterGroupPanel = Ext.extend(Portal.filter.ui.GroupPanel, {

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
