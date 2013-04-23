/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.FilterPanel = Ext.extend(Ext.Panel, {
    constructor: function(cfg) {
    	var config = Ext.apply({
	    	id: 'filterPanel',
	        title: 'Filters',
	        layout:'table',
			layoutConfig: {
				// The total column count must be specified here
				columns: 3,
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
    		newFilter = new  Portal.filter.ComboFilter({
    			fieldLabel: filter.label
    		});

    	}
    	else if(filter.type == "Date"){
    		newFilter = new Portal.filter.TimeFilter({
				fieldLabel: filter.label
			});
    	}
    	else if(filter.type === "Boolean"){
    		newFilter = new Portal.filter.BooleanFilter({
    		   fieldLabel: filter.label
    		});
    	}
    	else if (filter.type === "BoundingBox"){
            newFilter = new Portal.filter.BoundingBoxFilter({
            	fieldLabel: filter.label
            })
    	}
        else if (filter.type === "Number") {
            newFilter = new Portal.filter.NumberFilter({
                fieldLabel: filter.label
            });
        }
    	else{
    		//Filter hasn't been defined
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
			style: 'font-size: 11px;'
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
		this.layer = layer;

		if(layer.grailsLayerId != undefined){

			Ext.Ajax.request({
				url: this.GET_FILTER,
				params: {
                    /*if(layer.hasWFSLayer())
                        layerId: layer.wfsLayer.hrailsID
                    else
					    layerId: layer.grailsLayerId
                    */
                    layerId: layer.grailsLayerId
				},
				scope: this,
				failure: function(resp) {
					this.setVisible(false);
					hide.call(target, this);
				},
				success: function(resp, opts) {
					var filters = Ext.util.JSON.decode(resp.responseText);
                    var aFilterIsEnabled = false;

                    Ext.each(filters,
                        function(filter, index, all) {
                            if(filter.enabled){
                                this.createFilter(layer, filter);
                                aFilterIsEnabled = true
                            }
                        },
                        this
                    );

					if(aFilterIsEnabled){
						this.setVisible(true);

						this.addButton = new Ext.Button({
							cls: "x-btn-text-icon",
							icon: "images/basket_add.png",
							anchor: 'right',
							text: 'Add to Cart',
							listeners: {
								scope: this,
								click: this._addToCart
							}
						});

						this.add({html: "&nbsp;"});
						this.add(this.addButton);

						this.doLayout();
						show.call(target, this);
					}
					else{
						hide.call(target, this);
					}
				}
			});
		}
		else{
			//probably some other layer added in through getfeatureinfo, or user added WMS
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
    },

    _makeWFSURL: function(serverURL, layerName){

    	var query = Ext.urlEncode({
			typeName: layerName,
			SERVICE: "WFS",
			outputFormat: "csv",
			REQUEST: "GetFeature",
			VERSION: "1.0.0",  	//This version has BBOX the same as WMS. It's flipped in 1.1.0
			CQL_FILTER: this.layer.params.CQL_FILTER      //Geonetwork only works with URL encoded filters
		});

    	var wfsURL =  serverURL.replace("/wms", "/wfs");

    	if(wfsURL.indexOf("?") > -1)
    		wfsURL +=  "&" + query;
    	else
    		wfsURL += "?" + query;

		return wfsURL;
    },

    _makeDownloadURL: function(){
        if(this.layer.wfsLayer == null){
            return this._makeWFSURL(this.layer.server.uri, this.layer.params.LAYERS);
        }

        return this._makeWFSURL(this.layer.wfsLayer.server.uri, this.layer.wfsLayer.name);
    },

    _addToCart: function(){
		var tup = new Object();
		tup.record = new Object();
		tup.record.data = new Object();
		tup.link = new Object();

		//pretending to be a geonetwork metadata record
		tup.record.data["uuid"] = this.layer.getMetadataUrl();
		tup.record.data["title"] =  this.layer.name;
		tup.link["type"] =  "text/csv";
		tup.link["href"] =  this._makeDownloadURL();
		tup.link["protocol"] =  "WWW:DOWNLOAD-1.0-http--downloaddata";
		tup.link["preferredFname"] = this._makePreferredFname();
        tup.link["title"] = "Filtered " + this.layer.name + " data";

        addToDownloadCart(tup);
    },

    _makePreferredFname: function(){
        // replace ':' used to namespace layers by geoserver with '#'
        // as its not allowed in windows filenames
        var preferredName = this.layer.params.LAYERS.replace(':', '#');

        return preferredName + ".csv"
    }
});
