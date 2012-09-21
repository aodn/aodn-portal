Ext.namespace('Portal.filter');

Portal.filter.FilterPanel = Ext.extend(Ext.Panel, {
    constructor: function(cfg) {
    	var config = Ext.apply({
	    	id: 'filterPanel',
	        title: 'Filters',
	        layout:'table',
	        bodyStyle:'padding:5px',
			layoutConfig: {
				// The total column count must be specified here
				columns: 3,
				tableAttrs: {
					cellspacing: '10px',
					style: {
						width: '100%'
					}
				}
			},
	        autoDestroy: true
    	}, cfg);

    	this.GET_FILTER = "layer/getFiltersAsJSON";
    	this.activeFilters = {};

        Portal.filter.FilterPanel.superclass.constructor.call(this, config);
    },

    initComponent: function(cfg) {
    	this.AND_QUERY = " AND ";
    	this.on('addFilter', this._handleAddFilter);
    	Portal.filter.FilterPanel.superclass.initComponent.call(this);
    },

    setLayer: function(layer){
    	this.layer = layer;
    	this.update();
    },

    createFilter: function(layer, filter){
    	var newFilter = undefined;
    	if(filter.type === "String"){
    		newFilter = new  Portal.filter.FilterCombo({
    			fieldLabel: filter.label
    		});

    	}
    	else if(filter.type == "Date"){
    		newFilter = new Portal.filter.TimeFilter({
				fieldLabel: filter.label
			});
    	}
    	else if(filter.type === "Number"){
    		//...
    	}

    	if(newFilter != undefined){
    		newFilter.setLayerAndFilter(layer, filter);
			this.relayEvents(newFilter, ['addFilter']);
			this._addLabel(filter);
    		this.add(newFilter);
    		this._addRemoveFieldButton(newFilter);
    	}
    },

	_addLabel: function(filter){
		var label = new Ext.form.Label({
			text: filter.label + ": ",
			style: 'font-size: 11px; text-align: top;'
		});
		this.add(label);
	},

    _addRemoveFieldButton: function(field){
    	var removeButton = new Ext.Button({
			width: 14,
			iconCls: 'p-remove-filter',
			field: field,
			listeners:{
				scope: this,
				'click': function(button, event){
					this._handleRemoveFilter(button.field);
					button.field.handleRemoveFilter();
				}
			}
		});

		this.add(removeButton);
    },

    update: function(layer, show, hide, target){
    	if(layer != this.layer){
    		this.layer = layer;
			this.removeAll();
			if(layer.grailsLayerId != undefined){

				Ext.Ajax.request({
					url: this.GET_FILTER,
					params: {
						layerId: layer.grailsLayerId
					},
					scope: this,
					failure: function(resp) {
						hide.call(target, this);
					},
					success: function(resp, opts) {
					   var filters = Ext.util.JSON.decode(resp.responseText);
						Ext.each(filters,
							function(filter, index, all) {
								this.createFilter(layer, filter);
							},
							this
						);

						this.doLayout();

						show.call(target, this);
					}
				});
			}
			else{
				//probably some other layer added in through getfeatureinfo, or user added WMS
			}
    	}
    	else{
    		//same layer, don't do anything
    	}
    },

    _updateFilter: function(){
    	var combinedCQL = "";
    	var count = 0;
		for(var key in this.activeFilters){
			count++;
		}

		if(count > 0){
			for(var name in this.activeFilters){
				if(this.activeFilters[name].hasValue()){
					combinedCQL += this.activeFilters[name].getCQL() + this.AND_QUERY
				}
			}

			if(combinedCQL.length > 0){
				combinedCQL = combinedCQL.substr(0, combinedCQL.length - this.AND_QUERY.length);

				this.layer.mergeNewParams({
					CQL_FILTER: combinedCQL
				});
			}
		}
		else{
         	delete this.layer.params["CQL_FILTER"];
         	this.layer.redraw();
		}
    },

    _handleAddFilter: function(aFilter){
    	this.activeFilters[aFilter.getFilterName()] = aFilter;
		this._updateFilter();
    },

    _handleRemoveFilter: function(aFilter){
    	delete this.activeFilters[aFilter.getFilterName()];
    	this._updateFilter();
    }
});