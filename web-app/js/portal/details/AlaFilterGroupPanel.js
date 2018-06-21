Ext.namespace('Portal.details');

Portal.details.AlaFilterGroupPanel = Ext.extend(Ext.Container, {

    constructor: function(cfg) {

        this.map = cfg.map;
        this.loadingMessage = this._createLoadingMessageContainer();
        this.errorMessageContainer = this._createErrorMessageContainer();
        this.warningEmptyDownloadMessage = new Portal.common.AlertMessagePanel({
            message: OpenLayers.i18n('subsetRestrictiveFiltersText')
        });

        var config = Ext.apply({
            autoDestroy: true,
            autoHeight: true,
            cls: 'filterGroupPanel',
            items: [
                this.loadingMessage,
                this.errorMessageContainer,
                this.warningEmptyDownloadMessage
            ]
        }, cfg);

        Portal.details.AlaFilterGroupPanel.superclass.constructor.call(this, config);
    },

    initComponent: function() {

        Portal.details.AlaFilterGroupPanel.superclass.initComponent.call(this);

        this._attachSpatialEvents();

        var filters = this.dataCollection.getFilters();
        if (filters == undefined) {
            this.dataCollection.on(Portal.data.DataCollection.EVENTS.FILTERS_LOAD_SUCCESS, this._filtersLoaded, this);
            //this.dataCollection.on(Portal.data.DataCollection.EVENTS.FILTERS_UPDATED, this.dosomething, this);
            this.dataCollection.on(Portal.data.DataCollection.EVENTS.FILTERS_LOAD_FAILURE, function() { this._filtersLoaded([]); }, this);
        }
        else {
            this._filtersLoaded(filters);
        }
    },

    // todo handle spatial extent
    _attachSpatialEvents: function() {

        if (!this.attachedSpatialEvents) {

            this.map.events.on({
                scope: this,
                'spatialconstraintadded': function() {
                    this._applyGeometryToCollection();
                },
                'spatialconstraintcleared': function() {
                    this._applyGeometryToCollection();
                }
            });

            this.attachedSpatialEvents = true;
        }
    },

    _getGeometryFilter: function() {
        return this.map.geometryFilter;
    },

    _applyGeometryToCollection: function() {
        if (this.isDestroyed !== true) {
            var filters = this.dataCollection.getFilters();
            var geometry = this._getGeometryFilter();
            var geometryFilter = Portal.filter.FilterUtils.getFilter(filters, 'position');
            geometryFilter.value = geometry;
        }
    },

    _filtersLoaded: function(filters) {

        this._addFilterPanels(filters);


        if (this.resetLink == undefined) {
            this._createResetLink();
        }

        this._updateAndShow();
    },

    _createResetLink: function() {

        this.resetLink = new Ext.ux.Hyperlink({
            cls: 'resetText clearFiltersLink small',
            text: OpenLayers.i18n('clearLinkLabel', {text: OpenLayers.i18n('clearSubsetLabel')})
        });
        this.resetLink.on('click', function() {
            this._clearFilters();
        }, this);

        this._removeLoadingMessage();

        this.add(this._createVerticalSpacer(15));
        this.add(this.resetLink);
        this.add(this._createVerticalSpacer(25));
    },

    _createVerticalSpacer: function(sizeInPixels) {
        return new Ext.Spacer({
            cls: 'block',
            height: sizeInPixels
        });
    },

    _createLoadingMessageContainer: function() {
        return new Ext.Container({
            autoEl: 'div',
            items: [
                this._createVerticalSpacer(10),
                {
                    html: OpenLayers.i18n('loadingResourceMessage', {resource: OpenLayers.i18n('subsetParametersText')})
                }
            ]
        });
    },

    _createErrorMessageContainer: function() {
        return new Portal.common.AlertMessagePanel({
            message: OpenLayers.i18n('layerProblem')
        });
    },

    _addFilterPanels: function(filters) {

        var speciesFilter = filters.filter(function(filter) {
            return filter.constructor == Portal.filter.ALASpeciesStringArrayFilter;
        })[0];

        var dateFilter = filters.filter(function(filter) {
            return filter.constructor == Portal.filter.DateFilter;
        })[0];

        var spatialFilter = Portal.filter.FilterUtils.getFilter(filters, 'position');
        spatialFilter.map = this.map;

        this.speciesFilterPanel = new Portal.filter.ui.ALASpeciesFilterPanel({
            speciesFilter: speciesFilter,
            dataCollection: this.dataCollection
        });

        this.dateFilterPanel = new Portal.filter.ui.DateFilterPanel({
            filter: dateFilter,
            dataCollection: this.dataCollection
        });

        this.add(this._createVerticalSpacer(15));
        this.add(this._createFilterLabel(speciesFilter.label));
        this.add(this.speciesFilterPanel);
        this.add(this._createVerticalSpacer(15));
        this.add(this._createFilterLabel(OpenLayers.i18n('temporalExtentHeading')));
        this.add(this.dateFilterPanel);
    },

    _createFilterLabel: function(label) {
        return new Ext.Container({
            autoEl: 'div',
            html: String.format("<h4>{0}</h4>", label)
        })
    },

    _removeLoadingMessage: function() {
        this.remove(this.loadingMessage);
        delete this.loadingMessage;
    },

    showErrorMessage: function() {
        this._removeLoadingMessage();
        this.errorMessageContainer.show();
    },

    _updateAndShow: function() {

        this._removeLoadingMessage();
        this.doLayout();
    },

    _clearFilters: function() {
        this.dateFilterPanel.handleRemoveFilter();
        this.speciesFilterPanel._clearAllFilters();
    }

});
