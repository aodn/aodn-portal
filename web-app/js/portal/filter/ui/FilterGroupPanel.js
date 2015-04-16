/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter.ui');

Portal.filter.ui.FilterGroupPanel = Ext.extend(Ext.Container, {
    constructor: function(cfg) {

        this.layer = cfg.layer;
        this.loadingMessage = this._createLoadingMessageContainer();
        var config = Ext.apply({
            autoDestroy: true,
            cls: 'filterGroupPanel',
            items: [
                this.loadingMessage
            ]
        }, cfg);

        Portal.filter.ui.FilterGroupPanel.superclass.constructor.call(this, config);
    },

    initComponent: function() {
        this.on('addFilter', this._handleAddFilter);

        Portal.filter.ui.FilterGroupPanel.superclass.initComponent.call(this);

        this._initWithLayer();
    },

    _createGroupContainer: function() {
        return new Ext.Container({
            cls: 'filterGroupContainer'
        })
    },

    _createVerticalSpacer: function(sizeInPixels) {
        return new Ext.Spacer({
            cls: 'block',
            height: sizeInPixels
        })
    },

    _createFilterGroupHeading: function(headerText) {
        return new Ext.Container({
            html: "<h4>" + headerText + "</h4>"
        });
    },

    _createLoadingMessageContainer: function() {
        return new Ext.Container({
            autoEl: 'div',
            items: [
                this._createVerticalSpacer(10),
                {
                    html: OpenLayers.i18n('loadingSpinner', {resource: OpenLayers.i18n('subsetParametersText')})
                }
            ]
        });
    },

    _createErrorMessageContainer: function() {
        return new Ext.Container({
            autoEl: 'div',
            html: ""
        })
    },

    _setErrorMessageText: function(msg, errorMsgContainer) {
        errorMsgContainer.html = "<i>" + msg + "</i>";
    },

    _removeLoadingMessage: function() {
        this.remove(this.loadingMessage);
        delete this.loadingMessage;
    },

    _addErrorMessage: function(msg) {
        if (this.errorMessage) {
            this._setErrorMessageText(msg, this.errorMessage);
        }
        else {
            this._removeLoadingMessage();
            this.errorMessage = this._createErrorMessageContainer();
            this._setErrorMessageText(msg, this.errorMessage);
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

    _initWithLayer: function() {

        var filterService = new Portal.filter.FilterService();

        filterService.loadFilters(this.layer, this._filtersLoaded, this._handleFilterLoadFailure, this);
    },

    _filtersLoaded: function(filters) {

        var filterPanels = [];
        var filterService  = new Portal.filter.FilterService();

        Ext.each(filters, function(filter) {

            var filterPanel = this._createFilterPanel(filter);

            filterPanels.push(filterPanel);

            if (filterPanel.needsFilterRange()) {

                filterService.loadFilterRange(
                    filter.getName(),
                    this.layer,
                    function(filterRange) {
                        filterPanel.setFilterRange(filterRange);
                    },
                    function() {
                        filterPanel.setFilterRange([]);
                    },
                    this
                );
            }

        }, this);

        this.filterPanels = this._sortPanels(filterPanels);

        this._organiseFilterPanels(filterPanels);

        if (this.filterPanels.length > 0) {
            this._updateAndShow();
        }
        else {
            this._handleFilterLoadFailure();
        }
    },

    _handleFilterLoadFailure: function() {

        this._addErrorMessage(OpenLayers.i18n('subsetEmptyFiltersText'));
    },

    _sortPanels: function(panels) {

        var panelOrder = [
            Portal.filter.ui.GeometryFilterPanel,
            Portal.filter.ui.DateFilterPanel,
            Portal.filter.ui.BooleanFilterPanel,
            Portal.filter.ui.NumberFilterPanel,
            Portal.filter.ui.ComboFilterPanel
        ];

        var typeOrder = function (panel) {
            return panelOrder.indexOf(panel.constructor) * -1;
        };

        var _this = this;
        panels.sort(function(firstPanel, secondPanel) {
            var comparisonResult = _this._compareElements(typeOrder(firstPanel), typeOrder(secondPanel));

            if (comparisonResult == 0) {
                var firstFilterName = firstPanel.filter.getLabel();
                var secondFilterName = secondPanel.filter.getLabel();
                comparisonResult = _this._compareElements(secondFilterName, firstFilterName);
            }

            return comparisonResult;
        });

        return panels;
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

        var filterClass = Portal.filter.Filter.classFor(filter);
        var uiElementClass = filterClass.prototype.getUiComponentClass();
        var newFilterPanel = new uiElementClass({
            filter: filter,
            layer: this.layer
        });

        this.relayEvents(newFilterPanel, ['addFilter']);

        return newFilterPanel;
    },

    _organiseFilterPanels: function(panels) {

        var currentType;
        var currentContainer;

        Ext.each(panels, function(panel) {

            if (panel.constructor != currentType) {

                currentType = panel.constructor;

                currentContainer = this._includeNewGroupContainer(panel);
            }

            currentContainer.add(panel);
        }, this);
    },

    _includeNewGroupContainer: function(panel) {

        var groupContainer = this._createGroupContainer();
        this.add(groupContainer);

        if (panel.typeLabel != '') {
            this._addLabelToContainer(this._typeLabelForPanel(panel), groupContainer);
        }

        var spacer = this._createVerticalSpacer(15);
        this.add(spacer);

        return groupContainer;
    },

    _typeLabelForPanel: function(panel) {

        return panel.typeLabel;
     },

    _addLabelToContainer: function(label, container) {

        var heading = this._createFilterGroupHeading(label);
        container.add(heading);
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

        this.add(this._createVerticalSpacer(15));
        this.add(this.clearFiltersButton);
        this.add(this._createVerticalSpacer(25));

        if (this._isDisplayed()) {
            this.doLayout();
        }
    },

    _updateLayerFilters: function() {
        if (this._isLayerActive(this.layer)) {

            this.layer.updateCqlFilter();
        }
    },

    _handleAddFilter: function() {
        this._updateLayerFilters();
    },

    _clearFilters: function() {
        Ext.each(this.filterPanels, function(panel) {
            panel.handleRemoveFilter();
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
