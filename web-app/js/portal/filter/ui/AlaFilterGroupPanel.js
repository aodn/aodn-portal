Ext.namespace('Portal.details');

Portal.filter.ui.AlaFilterGroupPanel = Ext.extend(Portal.filter.ui.GroupPanel, {

    _filtersLoaded: function(filters) {
        this._sortFilters(filters);
        this._addFilterPanels(filters);
        this._updateAndShow();

        Ext.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_MODIFIED, this.dataCollection);
    },

    _filtersUpdated: function() {
        var subsetIntersects = new Portal.filter.combiner.SpatialSubsetIntersectTester().testSpatialSubsetIntersect(this.dataCollection);
        this.dataCollection.featuresAvailable = (subsetIntersects);
        this._handleEmptyDownloadMsg();
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
