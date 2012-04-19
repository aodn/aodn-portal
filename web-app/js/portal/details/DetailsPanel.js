Ext.namespace('Portal.details');

Portal.details.DetailsPanel = Ext.extend(Ext.Panel, {
    id: 'detailsPanelItems',
    autoWidth: true,

    initComponent: function(){
        this.detailsPanelTabs = new Portal.details.DetailsPanelTab();
        this.opacitySlider = new Ext.slider.SingleSlider({
                id: "opacitySlider",
                title: 'Opacity',
                layer: "layer",
                minValue: 20, // we dont want a user to be able to give zero vis
                maxValue: 100,
                margins: {
                    top: 0,
                    right: 10,
                    bottom: 10,
                    left: 10
                },
                inverse: false,
                fieldLabel: "Opacity",
                plugins: new GeoExt.LayerOpacitySliderTip({
                    template: '<div class="opacitySlider" >Opacity: {opacity}%</div>'
                }),
                listeners: {
                    scope: this,
                    // call show when a layer is chosen so we can access this listener
                    show: function(slider) {
                        slider.setValue(0,this.selectedLayer.opacity * 100,true);
                    },
                    changeComplete: function(slider, val, thumb){
                        this.selectedLayer.setOpacity(val / 100);
                    }
                }
            });

        this.opacitySliderContainer = new Ext.Panel({
            height: 'auto',
            layout: 'form',
            items: [this.opacitySlider]
        });

        this.transectControl = new Portal.mainMap.TransectControl({
            ref: 'transectControl',
            listeners: {
                scope: this,
                transect: function(inf) {
                    var newTab = this.detailsPanelTabs.add({
                        title: OpenLayers.i18n('transectTab'),
                        autoHeight: true,
                        closable: true,
                        items: [{
                        layout: 'hbox',
                        items: [{
                            autoHeight: true,
                            width: 200,
                            //TODO: use template
                            html: "<h5>" + OpenLayers.i18n('transectDataHeading')+ "</h5>" + inf.line +  " "
                            },{
                                autoHeight: true,
                                hidden: inf.dimensionValues == '',
                                //TODO: use template
                                html: "<h5>" + OpenLayers.i18n('dimensionValuesHeading') + "</h5>" + inf.dimensionValues
                        }]
                        },{
                            autoHeight: true,
                            //TODO: use template
                            html: "<img src=\"" + inf.transectUrl + "\" />"
                        }]
                    });

                    if (this.detailsPanelItems.ownerCt.width <  430) {
                        this.detailsPanelItems.ownerCt.setWidth(430);
                        if (this.detailsPanelItems.ownerCt.ownerCt) this.detailsPanelItems.ownerCt.ownerCt.doLayout();
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

    updateDetailsPanel: function(layer){
    	console.log("updating details panel");
        // show new layer unless user requested 'hideLayerOptions' or
        // check if the map is still in focus - not the search
        if (!(Portal.app.config.hideLayerOptions === true || !viewport.isMapVisible() )) {
            this.selectedLayer = layer;
            this.detailsPanelTabs.setSelectedLayer(layer);
            this.detailsPanelTabs.update();
            this.opacitySlider.show(); // reset slider

            this.transectControl.hide();

            // remove any transect tabs for previous layer
            var transectTabs = this.detailsPanelTabs.find('title', OpenLayers.i18n('transectTab'));
            for (var i=0;i<transectTabs.length;i++) {
                this.detailsPanelTabs.remove(transectTabs[i]);
            }



            //TODO:  add this back in
            this.updateDimensions(layer); // time and elevation

            if(layer.server.type.search("NCWMS") > -1)  {

                this.transectControl.setMapPanel(getMapPanel());
                this.transectControl.layer = layer;
                this.transectControl.show();

                /*Ext.getCmp('animationPanel').setSelectedLayer(layer);

                // show the animate tab if we can animate through time
                if (layer.metadata.datesWithData != undefined) {

                    if (layer.dates == undefined) {
                        setLayerDates(layer); // pass in the layer as there are going to be many async Json requests
                    }
                    else {

                        Ext.getCmp('animationPanel').setDisabled(false);
                    }

                    // ensure to 're-set' the Start Stop buttons (if rendered);
                    if (Ext.getCmp('startNCAnimationButton') != undefined) {
                        Ext.getCmp('startNCAnimationButton').setVisible(true);
                    }
                    this.stopNCAnimationButton.setVisible(false);
                    Ext.getCmp('animationPanel').doLayout();
                }*/
            }

            this.detailsPanelTabs.activate(0); // always set the first item active

        }
    },

    updateDimensions: function(layer){
        var dims = layer.metadata.dimensions;
        if(dims != undefined)
        {
            for(var d in dims)
            {
                if(dims[d].values != undefined)
                {
                    var valList = dims[d].values;
                    var dimStore, dimData;

                    dimData = new Array();

                    dimCombo = makeCombo(d);
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