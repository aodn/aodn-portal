/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter.ui');

/**
   This is the base type of all filters for geoserver layers.
**/
Portal.filter.ui.BaseFilterPanel = Ext.extend(Ext.Panel, {

    MAX_COMPONENT_WIDTH: 300,

    constructor: function(cfg) {
        var config = Ext.apply({
            typeLabel: '',
            listeners: {
                beforeremove: function() {
                    this.removeAll(true);
                }
            }
        }, cfg);

        Portal.filter.ui.BaseFilterPanel.superclass.constructor.call(this, config);
        this.setLayerAndFilter(cfg.layer, cfg.filter);
    },

    initComponent: function() {
        this.addEvents('addFilter');
        Portal.filter.ui.BaseFilterPanel.superclass.initComponent.call(this);
    },

    setLayerAndFilter: function(layer, filter) {
        this.filter = filter;
        this.layer = layer;
        this._createField();
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
       This method generates all the component fields required for this filter to work, e.g. textfields, buttons, etc.
       Note that the "x" button is created in the filterGroupPanel. See also handleRemoveFilter.
    **/
    _createField: function() {
        throw "Subclasses must implement the _createField function";
    },

    getFilterData: function() {
        throw "Subclasses must implement the getFilterData function";
    },

    /**
       This is called whenever the "x" button next to a field has been clicked, i.e. clearing/removing a filter.
       In this method, implement actions like clearing a textfield, reset values.
    **/
    handleRemoveFilter: function() {
        throw "Subclasses must implement the handleRemoveFilter function";
    },

    needsFilterRange: function() {
        throw "Subclasses must implement the needsFilterRange function";
    },

    setFilterRange: function() {
        throw "Subclasses must implement the setFilterRange function if needsFilterRange() returns true";
    }
});
