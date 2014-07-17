/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.FilterGroupPanel = Ext.extend(Ext.Panel, {
    constructor: function(cfg) {

        this.layer = cfg.layer;
        this.loadingMessage = this.createLoadingMessageContainer();

        var config = Ext.apply({
            layout: 'table',
            autoScroll: true,
            layoutConfig: {
                // The total column count must be specified here
                columns: 1,
                tableAttrs: {
                    cellspacing: '10px',
                    style: {
                        width: '100%'
                    }
                }
            },
            autoDestroy: true,
            items: [this.loadingMessage]
        }, cfg);

        this.GET_FILTER = "layer/getFiltersAsJSON";
        this.filters = [];

        Portal.filter.FilterGroupPanel.superclass.constructor.call(this, config);
    },

    initComponent: function() {
        this.AND_QUERY = " AND ";
        this.on('addFilter', this._handleAddFilter);

        Portal.filter.FilterGroupPanel.superclass.initComponent.call(this);

        this._initWithLayer();
    },

    createLoadingMessageContainer: function() {
        return new Ext.Container({
            autoEl: 'div',
            html: OpenLayers.i18n('loadingSpinner', {resource: OpenLayers.i18n('subsetParametersText')})
        });
    },

    createErrorMessageContainer: function() {
        return new Ext.Container({
            autoEl: 'div',
            html: ""
        })
    },

    setErrorMessageText: function(msg, errorMsgContainer) {
        errorMsgContainer.html = "<i>" + msg + "</i>";
    },

    removeLoadingMessage: function() {
        this.remove(this.loadingMessage);
        delete this.loadingMessage;
    },

    addErrorMessage: function(msg) {
        if (this.errorMessage) {
            this.setErrorMessageText(msg, this.errorMessage);
        }
        else {
            this.removeLoadingMessage();
            this.errorMessage = this.createErrorMessageContainer();
            this.setErrorMessageText(msg, this.errorMessage);
            this.add(this.errorMessage);
            this.doLayout();
        }
    },

    _isLayerActive: function(layer) {
        var active = false;

        if (layer.parentGeoNetworkRecord != undefined) {
            active = (Portal.data.ActiveGeoNetworkRecordStore.instance().isRecordActive(layer.parentGeoNetworkRecord));
        }
        return active;
    },

    _addLabel: function(filter) {

        var labelText = filter.label.split('_').join(' ').toTitleCase();
        var label = new Ext.form.Label({
            html: "<h4>" + labelText + "</h4>"
        });
        this.add(label);
    },

    _initWithLayer: function() {
        if (this._layerShouldBeHandled()) {

            if (this.layer.filters) {
                this._showHideFilters();
            }
            else if (this.layer.isKnownToThePortal()) {

                this.layerIsBeingHandled = true;

                Ext.Ajax.request({
                    url: this.GET_FILTER,
                    params: {
                        layerId: this.layer.grailsLayerId
                    },
                    scope: this,
                    failure: function() {
                        this.hide();
                        this.layerIsBeingHandled = false;
                    },
                    success: function(resp, opts) {
                        this.layer.filters = Ext.util.JSON.decode(resp.responseText);
                        this._showHideFilters();
                        this.layerIsBeingHandled = false;
                    }
                });
            }
            else {
                this.addErrorMessage(OpenLayers.i18n('subsetParametersErrorText'));
            }
        }
    },

    _showHideFilters: function() {

        var layer = this.layer;
        var aFilterIsEnabled = false;
        if (this._isLayerActive(layer) && (layer.filters.length > 0)) {

            layer.filters = this._filtersSort(layer.filters);

            Ext.each(
                layer.filters,
                function(filterConfig, index, all) {
                    this._createFilterPanel(layer, filterConfig);
                    aFilterIsEnabled = true;
                },
                this
            );
        }

        if (aFilterIsEnabled) {
            this._updateAndShow();
        }
        else {
            this.addErrorMessage(OpenLayers.i18n('subsetEmptyFiltersText'));
        }
    },

    _filtersSort: function(filters) {

        // override server order by adding the type in topFilters
        var topFilters = ['DateRange', 'Date', 'BoundingBox']; // add in reverse order

        Ext.each(
            filters,
            function(filterConfig, index, all) {
                filterConfig.sortOrder = topFilters.indexOf(filterConfig.type, 0);
            },
            this
        );

        var _this = this;

        filters.sort(function(firstFilter, secondFilter) {
            var comparisonResult = _this._compareElements(firstFilter.sortOrder, secondFilter.sortOrder);

            if (comparisonResult == 0) {
                comparisonResult = _this._compareElements(secondFilter.label, firstFilter.label)
            }

            return comparisonResult;
        });

        return filters;
    },

    _compareElements: function(first, second) {
        var result;

        if (first > second) {
            result = -1;
        }
        else {
            if (first < second) {
                result = 1;
            }
            else {
                result = 0;
            }
        }

        return result;
    },

    _createFilterPanel: function(layer, filter) {

        var newFilterPanel = Portal.filter.BaseFilterPanel.newFilterPanelFor({
            filter: filter,
            layer: layer
        });

        if (newFilterPanel) {
            this.relayEvents(newFilterPanel, ['addFilter']);
            if (newFilterPanel.getFilterName()) {
                this._addLabel(filter);
            }

            this.add(newFilterPanel);
            this.filters.push(newFilterPanel);

            return newFilterPanel;
        }
    },

    _updateAndShow: function() {

        this.clearFiltersButton = new Ext.Button({
            cls: "x-btn-text-icon",
            icon: "images/go-back-icon.png",
            text: OpenLayers.i18n('clearFilterButtonLabel'),
            listeners: {
                scope: this,
                click: this._clearFilters
            }
        });

        this.loadingMessage.hide();

        this._updateLayerFilters();

        this.add(this.clearFiltersButton);
        this.doLayout();

        this.show();
    },

    _hide: function(hideFunction, hideFunctionTarget) {

        hideFunction.call(hideFunctionTarget, this);
    },

    _updateLayerFilters: function() {
        if (this._isLayerActive(this.layer)) {

            this.layer.filterData = this._getActiveFilterData();
            this.layer.setCqlFilter(this._getVisualisationCQLFilters(this.layer.filterData));
        }
    },

    _getActiveFilterData: function() {
        var activeFilters = [];

        Ext.each(this.filters, function(filter) {
            if (filter.hasValue()) {
                activeFilters.push(filter.getFilterData());
            }
        });

        return activeFilters;
    },

    _getVisualisationCQLFilters: function(layerFilterData) {
        var cql = [];
        Ext.each(layerFilterData, function(data) {
            if (!data.downloadOnly) {

                var filterCQL = data.cql;
                if (filterCQL) {
                    cql.push(filterCQL);
                }
            }
        });

        return cql.join(this.AND_QUERY);
    },

    _handleAddFilter: function(aFilter) {
        this._updateLayerFilters();
    },

    _clearFilters: function() {
        Ext.each(this.filters, function(filter) {
            filter.handleRemoveFilter();
        });

        this._updateLayerFilters();
    },

    _layerHasBeenHandled: function() {
        return this.filters.length > 0;
    },

    _layerShouldBeHandled: function() {
        return !(this.layerIsBeingHandled || this._layerHasBeenHandled());
    }
});
