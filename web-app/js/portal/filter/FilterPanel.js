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

    createFilter: function(layer, filter){

        filter.label = filter.label.split('_').join(' ').toTitleCase();

    	var newFilter = undefined;

    	if (filter.type === "String") {
    		newFilter = new  Portal.filter.ComboFilter({
    			fieldLabel: filter.label
    		});
    	}
    	else if (filter.type == "Date") {
    		newFilter = new Portal.filter.TimeFilter({
				fieldLabel: filter.label
			});
    	}
    	else if (filter.type === "Boolean") {
    		newFilter = new Portal.filter.BooleanFilter({
    		   fieldLabel: filter.label
    		});
    	}
    	else if (filter.type === "BoundingBox") {
            newFilter = new Portal.filter.BoundingBoxFilter({
                fieldLabel: filter.label
            })
        }
        else if (filter.type === "Number") {
            newFilter = new Portal.filter.NumberFilter({
                fieldLabel: filter.label
            });
        }
        else {
            //Filter hasn't been defined
        }

    	if (newFilter) {
    		newFilter.setLayerAndFilter(layer, filter);
			this.relayEvents(newFilter, ['addFilter']);
			this._addLabel(filter);
    		this.add(newFilter);
    	}
    },

    _addLabel: function(filter){
        var label = new Ext.form.Label({
            text: filter.label + ": ",
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
                            this.createFilter(layer, filter);
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

		if (Object.keys(this.activeFilters).length > 0) {
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

    _handleAddFilter: function(aFilter){
        this.activeFilters[aFilter.getFilterName()] = aFilter;
        this._updateFilter();
    },

    _clearFilters: function() {

		this.activeFilters[key].handleRemoveFilter();
		delete this.activeFilters[key];
	}
});
