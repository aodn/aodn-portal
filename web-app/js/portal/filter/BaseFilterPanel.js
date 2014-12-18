/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

/**
   This is the base type of all filters for geoserver layers.
**/
Portal.filter.BaseFilterPanel = Ext.extend(Ext.Panel, {

    MAX_COMPONENT_WIDTH: 300,

    constructor: function(cfg) {
        var config = Ext.apply({
            emptyText: OpenLayers.i18n("pleasePickCondensed"),
            typeLabel: OpenLayers.i18n('generalFilterHeading'),
            listeners: {
                beforeremove: function(panel, component) {
                    this.removeAll(true);
                }
            }
        }, cfg);

        Portal.filter.BaseFilterPanel.superclass.constructor.call(this, config);
        this.setLayerAndFilter(cfg.layer, cfg.filter);
    },

    initComponent: function(cfg) {
        this.addEvents('addFilter');
        Portal.filter.BaseFilterPanel.superclass.initComponent.call(this);
    },

    /**
       You must implement this method in subclass.

       This method generates all the component fields required for this filter to work, e.g. textfields, buttons, etc.
       Note that the "x" button is created in the filterGroupPanel. See also handleRemoveFilter.
    **/
    _createField: function() {
    },

    setLayerAndFilter: function(layer, filter) {
        this.filter = filter;
        this.layer = layer;
        this._createField();
        this._setExistingFilters();
    },

    getFilterNameAsTitleCase: function() {
        return this.filter.name.split('_').join(' ').toTitleCase();
    },

    getFilterData: function() {
        throw "subclasses must override this function";
    },

    getFilterName: function() {
        return this.filter.name;
    },

    isVisualised: function() {
        return this.filter.visualised;
    },

    /**
       You must implement this method in subclass.

       This is called whenever the "x" button next to a field has been clicked, i.e. clearing/removing a filter.
       In this method, implement actions like clearing a textfield, reset values.
    **/
    handleRemoveFilter: function() {
    },

    hasValue: function() {
        return this.layer.filterData != undefined;
    },

    _fireAddEvent: function() {
        this.fireEvent('addFilter', this);
    },

    _setExistingFilters: function() {
    }
});

Portal.filter.BaseFilterPanel.newFilterPanelFor = function(cfg) {

    var newFilterPanel;

    if (cfg.filter.type === "String") {
        newFilterPanel = new Portal.filter.ComboFilterPanel(cfg);
    }
    else if (cfg.filter.type == "Date") {
        newFilterPanel = new Portal.filter.DateFilterPanel(cfg);
    }
    else if (cfg.filter.type == "DateRange") {
        newFilterPanel = new Portal.filter.DateFilterPanel(cfg);
    }
    else if (cfg.filter.type === "Boolean") {
        newFilterPanel = new Portal.filter.BooleanFilterPanel(cfg);
    }
    else if (cfg.filter.type === "BoundingBox") {
        newFilterPanel = new Portal.filter.BoundingBoxFilterPanel(cfg);
    }
    else if (cfg.filter.type === "Number") {
        newFilterPanel = new Portal.filter.NumberFilterPanel(cfg);
    }
    else {
        //Filter hasn't been defined
    }

    return newFilterPanel;
};
