Ext.namespace('Portal.details');

Portal.details.DetailsPanel = Ext.extend(Ext.Panel, {
	id: 'detailsPanelItems',
	//hidden: true,
	layout: 'vbox',
	layoutConfig: {
		align: 'stretch'
	},

	initComponent: function(){
		this.detailsPanelTabs = new Portal.details.DetailsPanelTab();
		this.opacitySlider = new Ext.slider.SingleSlider({
			id: "opacitySlider",
			//hidden: true,
			//hideParent: true,
			keyIncrement: 10,
			increment: 5,
			minValue: 20, // we dont want a user to be able to give zero vis
			maxValue: 100,
			inverse: false,
			fieldLabel: "Opacity",
			plugins: new GeoExt.LayerOpacitySliderTip({
				template: '<div class="opacitySlider" >Opacity: {opacity}%</div>'
			}),
			listeners: {
				scope: this,
				// call show when a layer is chosen so we can access this listener
				show: function(slider) {
					this.opacitySlider.setValue(this.selectedLayer.opacity * 100,true);
					this.opacitySlider.syncThumb();
				},
				// user changed opacity
				changeComplete: function(slider, val, thumb){
					this.selectedLayer.setOpacity(val / 100);
				}
			}
		});

		this.opacitySliderContainer = new Ext.Panel({
			layout: 'form',
			height: 26,
			margins: {
				top: 5,
				right: 5,
				bottom: 0,
				left: 5
			},
			items: [this.opacitySlider]
		});


		this.transectControl = new Portal.mainMap.TransectControl({
			ref: 'transectControl',
			height: 30,
			listeners: {
				scope: this,
				transect: function(inf) {
					var newTab = this.detailsPanelTabs.add(
							{
								title: OpenLayers.i18n('transectTab'),
								closable: true,
								layout:'fit',
								autoScroll: true,
								items : [{
									layout: 'vbox',
									layoutConfig: {
										align: 'stretch'
									},
									items: [
										{
											//TODO: use template
											height: 335,
											html: "<img src=\"" + inf.transectUrl + "\" />"
										},
										
										{
											items: [{
												width: 200,
												//TODO: use template
												html: "<h5>" + OpenLayers.i18n('transectDataHeading')+ "</h5>" + inf.line +  " "
											},{
												hidden: inf.dimensionValues == '',
												//TODO: use template
												html: "<h5>" + OpenLayers.i18n('dimensionValuesHeading') + "</h5>" + inf.dimensionValues
											}]
										}]
								}]
							}		
					);
					if (this.ownerCt.width <  430) {
						this.ownerCt.setWidth(430);
						if (this.ownerCt.ownerCt) this.ownerCt.ownerCt.doLayout();
					}

					this.detailsPanelTabs.setActiveTab(this.detailsPanelTabs.items.indexOf(newTab));
				}
			}
		});

		this.items = [
		              this.opacitySliderContainer,
		              this.transectControl,
		              this.detailsPanelTabs
		              ];

		Portal.details.DetailsPanel.superclass.initComponent.call(this);	
	},

	getOpacitySlider: function(){
		return this.opacitySlider;
	},


	updateDetailsPanel: function(layer){
		// show new layer unless user requested 'hideLayerOptions' or
		// check if the map is still in focus - not the search
		if (!(Portal.app.config.hideLayerOptions === true || !viewport.isMapVisible() )) {

			
			this.selectedLayer = layer;
			this.detailsPanelTabs.setSelectedLayer(layer);
			this.detailsPanelTabs.update(layer);
			this.detailsPanelTabs.show();
			this.transectControl.hide();

			// remove any transect tabs for previous layer
			var transectTabs = this.detailsPanelTabs.find('title', OpenLayers.i18n('transectTab'));
			for (var i=0;i<transectTabs.length;i++) {
				this.detailsPanelTabs.remove(transectTabs[i]);
			}

			this.updateDimensions(layer); // time and elevation

			if(layer.server.type.search("NCWMS") > -1)  {
				this.transectControl.setMapPanel(getMapPanel());
				this.transectControl.layer = layer;
				this.transectControl.show();
				
			}			
			this.opacitySlider.show(); // will reset slider
		}
		else {
			this.collapseAndHide();
		}
	},

	hideDetailsPanelContents: function(){
		// clear the details Panel. ie. Don't show any layer options
		this.detailsPanelTabs.hide();
		this.opacitySlider.hide(); // reset slider
		this.transectControl.hide();
	},

	deactivateDrawingControl: function() {
		if (this.transectControl != null) {
			this.transectControl.deactivateDrawingControl();
		}
	},


//	TODO: revisit this method when elevation and other dimensions are passed into javascript
	updateDimensions: function(layer){

		var dims = layer.metadata.dimensions;
		if(dims != undefined)
		{
			for(var dimType in dims)
			{
				if(dims[dimType].values != undefined)
				{
					var valList = dims[dimType].values;
					var dimStore;
					var dimData = new Array();

					var tpl = '<tpl for="."><div class="x-combo-list-item"><p>{displayText}</p></div></tpl>';

					var fields = [{
						name: 'myId'
					},{
						name: 'displayText'
					}];

					var valueStore  = new Ext.data.ArrayStore({
						autoDestroy: true,
						itemId: dimType,
						name: type,
						fields: fields
					});

					var dimCombo = new Ext.form.ComboBox({
						fieldLabel: dimType,
						triggerAction: 'all',
						editable : false,
						lazyRender:true,
						mode: 'local',
						store: valueStore,
						emptyText: OpenLayers.i18n('pickAStyle'),
						valueField: 'myId',
						displayField: 'displayText',
						tpl: tpl,
						style: {
							// marginTop: '10px'
						},
						listeners:{
							select: function(cbbox, record, index){
								selectedLayer.mergeNewParams({
									//Not sure if this works...
									dimType : record.get('myId')
								});
							}
						}
					});

					dimStore = dimCombo.store;
					dimStore.removeAll();

					for(var j = 0; j < valList.length; j++)
					{
						//trimming function thanks to
						//http://developer.loftdigital.com/blog/trim-a-string-in-javascript
						var trimmed = valList[j].replace(/^\s+|\s+$/g, '') ;
						dimData.push([j, trimmed, trimmed]);
					}

					dimStore.loadData(dimData);
					detailsPanel.add(dimCombo);
				}

			}
		}

	}
});