/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.FilterPanel = Ext.extend(Ext.Panel, {
    constructor: function(cfg){
        var config = Ext.apply({
            id: 'filterPanel',
            title: 'Filters',
            layout: 'table',
            autoScroll: true,
            layoutConfig: {
                // The total column count must be specified here
                columns: 2,
                tableAttrs: {
                    cellspacing: '10px',
                    style: {
                        width: '100%',
                        font: '11 px'
                    }
                }
            },
            autoDestroy: true
        }, cfg);

        this.GET_FILTER = "layer/getFiltersAsJSON";
        this.activeFilters = {};

        Portal.filter.FilterPanel.superclass.constructor.call(this, config);
    },

    initComponent: function(cfg){
        this.AND_QUERY = " AND ";
        this.on('addFilter', this._handleAddFilter);

        Portal.filter.FilterPanel.superclass.initComponent.call(this);
    },

    setLayer: function(layer){
        this.layer = layer;
        this.update();
    },

    createFilterPanel: function(layer, filter) {

        var newFilterPanel = Portal.filter.BaseFilter.newFilterPanelFor(filter);

        if (newFilterPanel) {
            newFilterPanel.setLayerAndFilter(layer, filter);
            this.relayEvents(newFilterPanel, ['addFilter']);
            this._addLabel(filter);
            this.add(newFilterPanel);
        }
    },

    _addLabel: function(filter) {

        var labelText = filter.label.split('_').join(' ').toTitleCase();

        var label = new Ext.form.Label({
            text: labelText + ": ",
            style: 'font-size: 11px;'
        });
        this.add(label);
    },

    update: function(layer, show, hide, target){
        this.layer = layer;

        if (layer.grailsLayerId) {

            Ext.Ajax.request({
                url: this.GET_FILTER,
                params: {
                    layerId: layer.grailsLayerId
                },
                scope: this,
                failure: function(resp){
                    this.setVisible(false);
                    hide.call(target, this);
                },
                success: function(resp, opts){

                    var filters = Ext.util.JSON.decode(resp.responseText);
                    var aFilterIsEnabled = false;

                    Ext.each(filters,
                        function(filter, index, all) {
                            this.createFilterPanel(layer, filter);
                            aFilterIsEnabled = true
                        },
                        this
                    );

                    if (aFilterIsEnabled) {
                        this.setVisible(true);

                        this.clearFiltersButton = new Ext.Button({
                            cls: "x-btn-text-icon",
                            icon: "images/go-back-icon.png",
                            text: 'Clear Filters',
                            listeners: {
                                scope: this,
                                click: this._clearFilters
                            }
                        });

                        this.add(this.clearFiltersButton);

                        this.doLayout();
                        show.call(target, this);
                    }
                    else {
                        hide.call(target, this);
                    }
                }
            });
        }
        else {
            //probably some other layer added in through getfeatureinfo, or user added WMS
        }
    },

    _updateFilter: function() {

        var combinedCQL = "";

        if (this._hasAnyActiveFilters()) {
            for (var name in this.activeFilters) {
                if (this.activeFilters[name].hasValue()) {
                    combinedCQL += this.activeFilters[name].getCQL() + this.AND_QUERY;
                }
            }

            if (combinedCQL.length > 0) {
                combinedCQL = combinedCQL.substr(0, combinedCQL.length - this.AND_QUERY.length);

                this.layer.mergeNewParams({
                    CQL_FILTER: combinedCQL
                });
            }
        }
        else {
            delete this.layer.params["CQL_FILTER"];
            this.layer.redraw();
        }
    },

    _hasAnyActiveFilters: function() {

        return Object.keys(this.activeFilters).length > 0;
    },

    _handleAddFilter: function(aFilter) {
        this.activeFilters[aFilter.getFilterName()] = aFilter;
        this._updateFilter();
    },

    _clearFilters: function() {

        var keys = Object.keys(this.activeFilters);

        for (var i = 0; i < keys.length; i++) {

            var key = keys[i];

            this.activeFilters[key].handleRemoveFilter();
            delete this.activeFilters[key];
        }

        this._updateFilter();
    }
});
