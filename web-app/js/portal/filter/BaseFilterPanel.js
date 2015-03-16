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
            typeLabel: '',
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

    setLayerAndFilter: function(layer, filter) {
        this.filter = filter;
        this.layer = layer;
        this._createField();
        this._setExistingFilters();
    },

    isVisualised: function() {
        return this.filter.getVisualised();
    },

    hasValue: function() {
        return this.layer.filterData != undefined;
    },

    _fireAddEvent: function() {
        this.fireEvent('addFilter', this);
    },

    /**
       You must implement this method in subclass.

       This method generates all the component fields required for this filter to work, e.g. textfields, buttons, etc.
       Note that the "x" button is created in the filterGroupPanel. See also handleRemoveFilter.
    **/
    _createField: function() {
    },

    getFilterData: function() {
        throw "subclasses must override this function";
    },

    /**
       You must implement this method in subclass.

       This is called whenever the "x" button next to a field has been clicked, i.e. clearing/removing a filter.
       In this method, implement actions like clearing a textfield, reset values.
    **/
    handleRemoveFilter: function() {
    },

    _setExistingFilters: function() {
    },

    needsFilterRange: function() {
        throw "must implement this function";
    },

    enableFilterPanel: function() {
        throw "must implement this function if needs filterRange returns true";
    },

    setFilterRange: function() {
        throw "must override this function if needs filterRange returns true";
    }
});

Portal.filter.BaseFilterPanel.newFilterPanelFor = function(cfg) {

    var type = cfg.filter.getType().toLowerCase();

    // Todo - DN: Remove when loading filters from DBis removed
    // Portal types --> GeoServer types (temporary)
    if (type == "daterange") {
        type = 'datetime'
    }
    else if (type === "boundingbox") {
        type = 'geometrypropertytype'
    }
    else if (type === "number") {
        type = 'decimal'
    }
    // Todo - DN: End of temp code

    var typeMatches = function(toMatch) {
        var anyMatch = false;

        Ext.each(toMatch, function(currentMatch) {
            anyMatch |= type === currentMatch;
        });

        return anyMatch;
    };

    var newFilterPanel;

    if (typeMatches('string')) {
        newFilterPanel = new Portal.filter.ComboFilterPanel(cfg);
    }
    else if (typeMatches('boolean')) {
        newFilterPanel = new Portal.filter.BooleanFilterPanel(cfg);
    }
    else if (typeMatches(['date', 'datetime'])) {
        newFilterPanel = new Portal.filter.DateFilterPanel(cfg);
    }
    else if (typeMatches(['double', 'float', 'integer', 'int', 'long', 'short', 'decimal'])) {
        newFilterPanel = new Portal.filter.NumberFilterPanel(cfg);
    }
    else if (typeMatches(['pointpropertytype', 'geometrypropertytype', 'multilinepropertytype', 'surfacepropertytype', 'curvepropertytype'])) {
        newFilterPanel = new Portal.filter.GeometryFilterPanel(cfg);
    }
    else {
        //Filter hasn't been defined
        log.error("Could not create filter panel for type'" + type + "'");
    }

    return newFilterPanel;
};
