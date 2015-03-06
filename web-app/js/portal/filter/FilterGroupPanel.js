/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.FilterGroupPanel = Ext.extend(Ext.Container, {
    constructor: function(cfg) {

        this.layer = cfg.layer;
        this.loadingMessage = this.createLoadingMessageContainer();
        var config = Ext.apply({
            autoDestroy: true,
            cls: 'filterGroupPanel',
            items: [
                this.loadingMessage
            ]
        }, cfg);

        Portal.filter.FilterGroupPanel.superclass.constructor.call(this, config);
    },

    initComponent: function() {
        this.AND_QUERY = " AND ";
        this.on('addFilter', this._handleAddFilter);

        Portal.filter.FilterGroupPanel.superclass.initComponent.call(this);

        this._initWithLayer();
    },

    _getGroupContainer: function() {
        return new Ext.Container({
            cls: 'filterGroupContainer'
        })
    },

    _getVerticalSpacer: function(sizeInPixels) {
        return new Ext.Spacer({
            cls: 'block',
            height: sizeInPixels
        })
    },

    createLoadingMessageContainer: function() {
        return new Ext.Container({
            autoEl: 'div',
            items: [
                this._getVerticalSpacer(10),
                {
                    html: OpenLayers.i18n('loadingSpinner', {resource: OpenLayers.i18n('subsetParametersText')})
                }
            ]
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

    _addLabelToFilterPanel: function(filter) {

        var labelText = filter.getDisplayLabel();
        var label = new Ext.form.Label({
            html: "<label>" + labelText + "</label>"
        });
        this.currentGroupContainer.add(label);
    },

    _initWithLayer: function() {

        var filterService  = new Portal.filter.FilterService();

        filterService.loadFilters(this.layer, this._filtersLoaded, this);
    },

    _filtersLoaded: function(filters) {

        var filterPanels = [];

        filters = this._filtersSort(filters);

        Ext.each(filters, function(filterObject) {

            var filterPanel = this._createFilterPanel(filterObject);

            filterPanels.push(filterPanel);

            if (filterPanel.needsFilterRange()) {

                var filterService  = new Portal.filter.FilterService();

                filterService.loadFilterRange(filterObject.getName(), this.layer, function(filterRange) {
                    this._filterRangeLoaded(filterRange, filterPanel)
                }, this);
            }

        }, this);

        this.filterPanels = filterPanels;

        if (this.filterPanels.length > 0) {
            this._updateAndShow();
        }
        else {
            this.addErrorMessage(OpenLayers.i18n('subsetEmptyFiltersText'));
        }
    },

    _filterRangeLoaded: function(filterRange, filterPanel) {

        filterPanel.enableFilterPanel();
        filterPanel.setFilterRange(filterRange);
    },

    _filtersSort: function(filters) {

        // override server order by adding the type in topFilters
        var topFilters = ['String', 'Number', 'Boolean', 'DateRange', 'Date', 'BoundingBox']; // add in reverse order

        Ext.each(
            filters,
            function(filter) {
                var sortOrder = topFilters.indexOf(filter.getType(), 0);
                filter.setSortOrder(sortOrder);
            },
            this
        );

        var _this = this;

        filters.sort(function(firstFilter, secondFilter) {
            var comparisonResult = _this._compareElements(firstFilter.getSortOrder(), secondFilter.getSortOrder());

            if (comparisonResult == 0) {
                comparisonResult = _this._compareElements(secondFilter.getDisplayLabel(), firstFilter.getDisplayLabel());
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

    _createFilterPanel: function(filter) {

        var layer  = this.layer;
        var newFilterPanel = Portal.filter.BaseFilterPanel.newFilterPanelFor({
            filter: filter,
            layer: layer
        });

        if (newFilterPanel) {
            this.relayEvents(newFilterPanel, ['addFilter']);
            this._createNewGroupContainer(filter, newFilterPanel);

            if (newFilterPanel.getFilterName()) {
                this._addLabelToFilterPanel(filter);
            }
            this.currentGroupContainer.add(newFilterPanel);

            return newFilterPanel;
        }
    },

    _createNewGroupContainer: function(filter, filterPanel) {

        if (filterPanel.typeLabel != this.currentFilterTypeLabel) {
            var label = new Ext.Container({
                html: "<h4>" + filterPanel.typeLabel + "</h4>"
            });

            this.currentFilterTypeLabel = filterPanel.typeLabel;

            this.currentGroupContainer = this._getGroupContainer();
            this.currentGroupContainer.add(label);
            this.add(this.currentGroupContainer);
        }
        else {
            // add spacer if filter type has changed
            this._addFilterTypeSpacer(filter);
        }

        this.currentFilterType = filter.getType();

    },

    _addFilterTypeSpacer: function(filter) {

        if (this.currentFilterType != filter.getType()) {
            this.currentGroupContainer.add(this._getVerticalSpacer(15));
        }
    },

    _updateAndShow: function() {

        this.clearFiltersButton = new Ext.Button({
            cls: "x-btn-text-icon clearFiltersButton",
            icon: "images/go-back-icon.png",
            text: OpenLayers.i18n('clearFilterButtonLabel'),
            listeners: {
                scope: this,
                click: this._clearFilters
            }
        });

        this.loadingMessage.hide();

        this._updateLayerFilters();

        this.add(this._getVerticalSpacer(15));
        this.add(this.clearFiltersButton);
        this.add(this._getVerticalSpacer(25));

        if (this._isDisplayed()) {
            this.doLayout();
        }
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

        Ext.each(this.filterPanels, function(filter) {
            if (filter.hasValue()) {
                activeFilters.push(filter.getFilterData());
            }
        });

        return activeFilters;
    },

    _getVisualisationCQLFilters: function(layerFilterData) {
        var cql = [];
        Ext.each(layerFilterData, function(data) {

            var filterCQL = data.cql;

            if (data.visualised) {

                if (data.visualisationCql != undefined) {
                    filterCQL = data.visualisationCql;
                }

                if (filterCQL) {
                    cql.push(filterCQL);
                }
            }
        });

        return cql.join(this.AND_QUERY);
    },

    _logFilterRequest: function(aFilter) {
        var layer = this.layer;
        var filterData = layer.filterData;

        var jsonStringifyObject = {};
        jsonStringifyObject['title'] = layer.name;
        jsonStringifyObject['filters'] = {};

        filterData.forEach(function(filter) {
            if (filter.cql) {
                jsonStringifyObject['filters'][filter.name] = filter.cql;
            }
        });

        log.info(
            "Filtering collection: " + JSON.stringify(jsonStringifyObject)
        );
    },

    _handleAddFilter: function(aFilter) {
        this._updateLayerFilters();
        this._logFilterRequest(aFilter.filter);
    },

    _clearFilters: function() {
        Ext.each(this.filterPanels, function(filter) {
            filter.handleRemoveFilter();
        });
        this._updateLayerFilters();
    },

    _isDisplayed: function() {
        var foundHiddenParent = false;

        this.bubble(function() {
            if (this.isVisible && !this.isVisible()) {
                foundHiddenParent = true;
            }
        });

        return !foundHiddenParent;
    }
});