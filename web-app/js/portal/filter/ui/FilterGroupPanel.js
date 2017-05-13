Ext.namespace('Portal.filter.ui');

Portal.filter.ui.FilterGroupPanel = Ext.extend(Ext.Container, {
    constructor: function(cfg) {

        this.map = cfg.map;
        this.loadingMessage = this._createLoadingMessageContainer();
        var config = Ext.apply({
            autoDestroy: true,
            autoHeight: true,
            cls: 'filterGroupPanel',
            items: [
                this.loadingMessage
            ]
        }, cfg);

        Portal.filter.ui.FilterGroupPanel.superclass.constructor.call(this, config);
    },

    initComponent: function() {
        Portal.filter.ui.FilterGroupPanel.superclass.initComponent.call(this);

        var filters = this.dataCollection.getFilters();
        if (filters == undefined) {
            this.dataCollection.on(Portal.data.DataCollection.EVENTS.FILTERS_LOAD_SUCCESS, this._filtersLoaded, this);
            this.dataCollection.on(Portal.data.DataCollection.EVENTS.FILTERS_LOAD_FAILURE, function() { this._filtersLoaded([]); }, this);
        }
        else {
            this._filtersLoaded(filters);
        }
    },

    _createVerticalSpacer: function(sizeInPixels) {
        return new Ext.Spacer({
            cls: 'block',
            height: sizeInPixels
        });
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
                    html: OpenLayers.i18n('loadingMessage', {resource: OpenLayers.i18n('subsetParametersText')})
                }
            ]
        });
    },

    _createErrorMessageContainer: function() {
        return new Ext.Container({
            autoEl: 'div',
            html: ""
        });
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

    _filtersLoaded: function(filters) {
        var filterPanels = [];
        var filterService  = new Portal.filter.FilterService();
        this._sortFilters(filters);

        Ext.each(filters, function(filter) {

            var filterPanel = this._createFilterPanel(filter);

            filterPanels.push(filterPanel);

            if (filterPanel.needsFilterRange()) {

                filterService.loadFilterRange(
                    filter.getName(),
                    this.dataCollection,
                    this.createSafeCallback(function(filterRange) {
                        filterPanel.setFilterRange(filterRange);
                    }),
                    this.createSafeCallback(function() {
                        filterPanel.setFilterRange([]);
                    }),
                    this
                );
            }
        }, this);

        this.filterPanels = filterPanels;

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

    _sortFilters: function(filters) {

        var panelOrder = [
            Portal.filter.GeometryFilter,
            Portal.filter.WmsDateFilter,
            Portal.filter.BooleanFilter,
            Portal.filter.NumberFilter,
            Portal.filter.StringFilter
        ];

        var typeOrder = function (filter) {
            return panelOrder.indexOf(filter.constructor);
        };

        var _this = this;
        filters.sort(function(firstFilter, secondFilter) {
            return _this._numericalCompare(typeOrder(firstFilter), typeOrder(secondFilter)) ||
                   _this._stringCompare(firstFilter.getLabel(), secondFilter.getLabel());
        });
    },

    _numericalCompare: function(first, second) {
        return first - second;
    },

    _stringCompare: function(first, second) {
        return (first == second) ? 0 : (first > second ? 1 : -1);
    },

    _createFilterPanel: function(filter) {

        var filterClass = Portal.filter.Filter.classFor(filter);
        var uiElementClass = filterClass.prototype.getUiComponentClass();
        return new uiElementClass({
            filter: filter,
            dataCollection: this.dataCollection,
            map: this.map
        });
    },

    _organiseFilterPanels: function(panels) {

        var currentLabel;
        var currentType;

        Ext.each(panels, function(panel) {

            var newLabel = this._typeLabelForPanel(panel);
            var newType = panel.constructor;

            if (newLabel) {
                if (newLabel != currentLabel) {
                    this._addLabelToContainer(newLabel, this);
                }
                else if (newType != currentType) {
                    this.add(this._createVerticalSpacer(15));
                }
            }

            this.add(panel);

            currentLabel = newLabel;
            currentType = newType;
        }, this);
    },

    _typeLabelForPanel: function(panel) {
        return panel.typeLabel;
     },

    _addLabelToContainer: function(label, container) {

        container.add(this._createFilterGroupHeading(label));
    },

    _updateAndShow: function() {

        this.resetLink = new Ext.ux.Hyperlink({
            cls: 'resetText clearFiltersLink small',
            text: OpenLayers.i18n('clearLinkLabel', {text: OpenLayers.i18n('clearSubsetLabel')})
        });
        this.resetLink.on('click', function() {
            this._clearFilters();
        }, this);

        this.loadingMessage.hide();

        this.add(this._createVerticalSpacer(15));
        this.add(this.resetLink);
        this.add(this._createVerticalSpacer(25));

        this.doLayout();
    },

    _clearFilters: function() {
        Ext.each(this.filterPanels, function(panel) {
            panel.handleRemoveFilter();
        });
    }
});
