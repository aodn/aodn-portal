
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.MapPanel = Ext.extend(Portal.common.MapPanel, {

    constructor: function(cfg) {

        this.appConfig = cfg.appConfig;

        // Stop the pink tiles appearing on error
        OpenLayers.Util.onImageLoadError = function(e) {
            this.style.display = "";
            this.src = "img/blank.png";
        };

        this.initMap();

        var config = Ext.apply({
            region: "center",
            split: true,
            header: false,
            initialBbox: this.appConfig.initialBbox,
            autoZoom: this.appConfig.autoZoom,
            hideLayerOptions: this.appConfig.hideLayerOptions,
            layersLoading: 0,
            layers: new Portal.data.LayerStore()
        }, cfg);

        Portal.ui.MapPanel.superclass.constructor.call(this, config);

        this.initAnimationPanel();
        
        this.spinnerForLayerloading = new Spinner({
            lines: 12, // The number of lines to draw
            length: 16, // The length of each line
            width: 4, // The line thickness
            radius: 12, // The radius of the inner circle
            color: '#0B5584', //#18394E', // #rgb or #rrggbb
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: true // Whether to render a shadow
        });

        this.on('hide', function() {
            // map is never hidden!!!!"
            this.updateLoadingImage("none");
            this._closeFeatureInfoPopup();
        }, this);
		

		this.map.events.register('movestart', this, this.closeDropdowns);

        this.addEvents('tabchange', 'mouseover');

        this.on('afterlayout', function() {
            // cursor mods
            //this.style.cursor="pointer";
            jQuery("div.olControlZoomBoxItemInactive ").click(function(){
                //this.style.cursor="crosshair";
                clickControl.deactivate();
            });
            jQuery("div.olControlNavigationItemActive ").click(function(){
                //this.style.cursor="pointer";
                clickControl.activate();
            });
            jQuery("div.olControlMousePosition,div.olControlScaleLine *").mouseover(function() {
                jQuery("div.olControlMousePosition,div.olControlScaleLine *").addClass('allwhite');
            });
            jQuery("div.olControlMousePosition,div.olControlScaleLine *").mouseout(function() {
                jQuery("div.olControlMousePosition,div.olControlScaleLine *").removeClass('allwhite');
            });


        }, this);

        this.on('tabchange', function() {
            this._closeFeatureInfoPopup();
        }, this);


        // make sure layer store reflects loaded layers
        // even if the map hasn't been rendered yet
        this.layers.bind(this.map);
        
        Ext.MsgBus.subscribe('selectedLayerChanged', function(subject, message) {
            this.onSelectedLayerChanged(message);
        }, this);
        Ext.MsgBus.subscribe('reset', function(subject, message) {
            this.reset();
        }, this);
    },
    
    onSelectedLayerChanged: function(openLayer) {
        
        this.updateAnimationControlsPanel(openLayer);
        
        if (this.autoZoom === true) {
            this.zoomToLayer(openLayer);
        }
    },
    
	closeDropdowns: function(event) {
		this.map.events.triggerEvent('blur',event); // listening in BaseLayerComboBox and mapOptionsPanel
	},	

    afterRender: function() {

        Portal.ui.MapPanel.superclass.afterRender.call(this);
        this.mapOptions.afterRender(this);
    },

	loadSnapshot: function(id) {		

		this.mapOptions.mapActionsControl.actionsPanel.loadSnapshot(id);
	},

    autoZoomCheckboxHandler: function(box, checked) {
        //console.log("autoZoom: " + checked);
        Portal.app.config.autoZoom = checked;
        this.autoZoom = checked;
    },

    layerOptionsCheckboxHandler: function(box, checked) {
        Portal.app.config.hideLayerOptions = checked;
        this.hideLayerOptions = checked;
    },

    reset: function() {
        this.zoomToInitialBbox();
    },

    _handleFeatureInfoClick: function(event) {
        this._closeFeatureInfoPopup();
        this._findFeatureInfo(event);
    },

    _closeFeatureInfoPopup: function() {
        if (this.featureInfoPopup) {
            this.featureInfoPopup.close();
        }
    },

    _findFeatureInfo: function(event) {
        this.featureInfoPopup = new Portal.ui.FeatureInfoPopup({
            map: this.map,
            appConfig: this.appConfig,
            maximisedSize: this.getViewSize(),
            maximisedX: this.getPageX(),
            maximisedY: this.getPageY()
        });
        this.featureInfoPopup.findFeatures(event);
    },

    initMap: function() {

        // The MapActionsControl (in the OpenLayers map tools) needs this.
        this.appConfig.mapPanel = this;

        this.mapOptions = new Portal.ui.openlayers.MapOptions(this.appConfig, this);
        this.map = new OpenLayers.Map(this.mapOptions);
        this.map.restrictedExtent = new OpenLayers.Bounds.fromArray([null, -90, null, 90]);
        this.map.events.register('removelayer', this, this.postRemoveLayer);		
    },

    initAnimationPanel: function() {
    
        this.animationPanel = new Portal.ui.AnimationPanel(this.map);
        this.add(this.animationPanel);
        
        // TODO: remove this - just a short cut as part of refactoring.
        this.animationControlsPanel = this.animationPanel.animationControlsPanel;
    },

    getServer: function(item) {
        return item.server;
    },

    getUri: function(server) {
        return server.uri;
    },

    updateAnimationControlsPanel: function(openLayer){
        
        if (!this.animationControlsPanel.isAnimating()) {
            if (openLayer) {
                if (openLayer.isAnimatable()) {
                    //show the panel for the first time!
                    this.animationControlsPanel.setSelectedLayer(openLayer);
                    this.animationControlsPanel.update();
                    this.animationPanel.setVisible(true);
                }
                else {
                    this.animationPanel.setVisible(false);
                }
            }
            else {
                this.animationControlsPanel.removeAnimation();
            }
        }
    },

    getMapExtent: function()  {
        var bounds = this.map.getExtent();
        var maxBounds = this.map.maxExtent;
        var top = Math.min(bounds.top, maxBounds.top);
        var bottom = Math.max(bounds.bottom, maxBounds.bottom);
        var left = Math.max(bounds.left, maxBounds.left);
        var right = Math.min(bounds.right, maxBounds.right);
        return new OpenLayers.Bounds(left, bottom, right, top);
    },

    zoomToLayer: function(openLayer) {
        if (openLayer) {
            if (openLayer.hasBoundingBox()) {
                // build openlayer bounding box
                var bounds = new OpenLayers.Bounds(openLayer.bboxMinX, openLayer.bboxMinY, openLayer.bboxMaxX, openLayer.bboxMaxY);
                // ensure converted into this maps projection. convert metres into lat/lon etc
                bounds.transform(new OpenLayers.Projection(openLayer.projection), this.map.getProjectionObject());

                // openlayers wants left, bottom, right, top
                // dont support NCWMS-1.3.0 until issues resolved http://www.resc.rdg.ac.uk/trac/ncWMS/ticket/187
                if(this.getServer(openLayer).type == "WMS-1.3.0") {
                    bounds =  new OpenLayers.Bounds.fromArray(bounds.toArray(true));
                }

                if (bounds && bounds.getWidth() > 0 && bounds.getHeight() > 0) {
                    this.zoomTo(bounds);
                }
            }
        }
    },

    zoomTo: function(bounds, closest) {
        if((Math.abs(bounds.left - bounds.right) < 1) && (Math.abs(bounds.top == bounds.bottom) < 1)){
            this.map.setCenter(bounds.getCenterLonLat(), 3);
        }
        else{
            this.map.zoomToExtent(bounds, closest);
        }
    },

    // previously called from addLayer(), if (openLayer.isNcwms()) ...
    getLayerMetadata: function(openLayer) {
        if (openLayer.params.LAYERS) {
            var url = proxyURL + encodeURIComponent(openLayer.url + "?item=layerDetails&layerName=" + openLayer.params.LAYERS + "&request=GetMetadata");
            // see if this layer is flagged a 'cached' layer. a Cached layer is allready requested through our proxy
            if (openLayer.cache === true) {
                // all parameters passed along here will get added to URL
                url = proxyCachedURL + encodeURIComponent(getUri(getServer(openLayer))) + "&item=layerDetails&layerName=" + openLayer.params.LAYERS + "&request=GetMetadata";
            }

            Ext.Ajax.request({
                url: url,
                success: function(resp) {
                    openLayer.metadata = Ext.util.JSON.decode(resp.responseText);
                    // if this layer has been user selected before loading the metadata
                    // reload,  as the date picker details/ form  will be wrong at the very least!
                    Ext.MsgBus.publish("selectedLayerChanged", openLayer);
                }
            });
        }

        return false;
    },

    getLayerText: function(layerCount) {
        return layerCount === 1 ? "Layer" : "Layers";
    },

    getLayersLoadingText: function(layerCount) {
        return layerCount === 0 ? "" : layerCount.toString();
    },

    buildLayerLoadingString: function(layerCount) {
        return "Loading " + this.getLayersLoadingText(layerCount) +"  " + this.getLayerText(layerCount) + "\u2026";
    },

    // TODO: LayerStore should be firing appropriate events which interested views (e.g. this one) should be listening for.
    loadStart: function() {
        if (this.layersLoading == 0) {
            this.updateLoadingImage("block");
        }
        this.layersLoading += 1;
        jQuery("#loader p").text(this.buildLayerLoadingString(this.layersLoading));
    },

    loadEnd: function() {
        this.layersLoading -= 1;
        this.layersLoading = Math.max(this.layersLoading, 0);
        jQuery("#loader p").text(this.buildLayerLoadingString(this.layersLoading));
        if (this.layersLoading == 0) {
            if (this.spinnerTimeOut) {
                clearTimeout(this.spinnerTimeOut);
                delete this.spinnerTimeOut;
            }
            this.updateLoadingImage("none");
        }
    },

    updateLoadingImage: function(display) {
        if (display == "none" || !this.isVisible()) {
            jQuery("#loader").hide('slow');
        }
        else {
            if (this.layersLoading >= 0) {
                var spinner = this.spinnerForLayerloading;
                this.spinnerTimeOut = setTimeout(function() {
                    jQuery("#loader").show();
                    spinner.spin(jQuery("#jsloader").get(0));
                }, 2000);
            }
        }
    },

    getViewSize: function() {
        return this.container.getViewSize();
    },
    
     getPageX: function() {
        return this.getPosition()[0];
    },
    
    getPageY: function() {
        return this.getPosition()[1];
    }
});
