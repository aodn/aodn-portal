Ext.namespace('Portal.ui');

Portal.ui.FeatureInfoPopup = Ext.extend(GeoExt.Popup, {
	
	constructor: function(cfg) {
	    this.numResultsToLoad = 0;
	    this.numResultQueries = 0;
	    this.numGoodResults = 0;
	    this.animationDatePattern = "Y-m-d\\TH:i:s.u\\Z";
		
	    var config = Ext.apply({
	    	title: "Searching for Features at your click point",
	        width: cfg.appConfig.popupWidth,
	        height: 80, // set height later when there are results
	        maximizable: true,
	        //map: cfg.map,
	        anchored: true,
	        autoScroll: true
	    }, cfg);

	    Portal.ui.FeatureInfoPopup.superclass.constructor.call(this, config);
	    
	    this._addElements();
    },
    
    _addElements: function() {
    	// Add container for html (empty for now)
	    this.add(new Ext.Container({
	        html: "Loading ...",
	        cls: 'popupHtml',      
	        ref: 'popupHtml'
		}));

	    // Add tab panel (empty for now)
	    this.add(new Ext.TabPanel({
	        ref: 'popupTab',
	        enableTabScroll : true,
	        deferredRender: true,
	        hidden: true
	    }));
    },
    
    findFeatures: function(event) {
    	this.location = this.map.getLonLatFromViewPortPx(event.xy);
    	this.clickPoint = { x: event.xy.x, y: event.xy.y };
        this._setLocationString();
        this._display();
        
        this._handleDepthService();
        this._handleLayers();
    },
    
    _handleDepthService: function() {
        if (this.appConfig.useDepthService) {
            Ext.Ajax.request({
            	scope: this,
                url: 'depth', 
                params: {
                    lat: this.location.lat,
                    lon: this.location.lon
                },
                success: function(response, options) {
                    this._updatePopupDepthStatus(response);
                },
                failure: function (response, options) {
                	this._updatePopupDepthStatus(null);
                }
            });
        }
        else {
            this._updatePopupDepthStatus( null ); // Update with no info (will still clear 'loading' message)
        }
    },
    
    _handleLayers: function() {
    	var wmsLayers = this._collectUniqueLayers();
    	Ext.each(wmsLayers, function(layer, index, all) {
    		if ((!layer.isBaseLayer) && layer.getVisibility()) {
    			this._requestFeatureInfo(layer);
    		}
    	}, this);
    },
    
    _requestFeatureInfo: function(layer) {
    	this.numResultsToLoad++; // Record layers requested
    	
        Ext.Ajax.request({
        	scope: this,
            url: this._getLayerFeatureInfoRequestString(layer),
            params: {
                name: layer.name,
                id: layer.id,
                expectedFormat: layer.getFeatureInfoFormat(),
                isAnimatedLayer: layer.isAnimated,
                units: layer.metadata.units
            },
            success: function(resp, options) {
                var newTabContent;

                if(options.params.isAnimatedLayer) {
                    newTabContent = "<div><img src='" + url + "'></div>";
                }
                else {
                    newTabContent = formatGetFeatureInfo( resp, options );
                }

                if (newTabContent) {
                    this.numGoodResults++;
                    
                    this.popupTab.add( {
                        xtype: "box",
                        id: options.params.id,
                        title: options.params.name,
                        padding: 30,
                        autoHeight: true,
                        cls: "featureinfocontent",
                        autoEl: {
                            html: newTabContent
                        }
                    });

                    //if (this.numGoodResults == 1) {                                
                        
                        // set to full height and re-pan
                        this.setSize(this.appConfig.popupWidth, this.appConfig.popupHeight);               
                        this.show(); // since the popup is anchored, calling show will move popup to this location 

                        // Make first tab active
                        this.popupTab.setActiveTab( 0 );
                        this.popupTab.doLayout();
                        this.popupTab.show();

                        setTimeout('imgSizer()', 900); // ensure the popup is ready
                    //}
                }
                // got a result, maybe empty
                this.numResultQueries++;
                
                this._updateStatus();
            },

            failure: function(resp, options) { // Popup may have been closed since request was sent
            	this._updateStatus();
                // got a fail but its still a result
                this.numResultQueries++;
            }
        });
    },
    
    _getLayerFeatureInfoRequestString: function(layer) {
    	var extraParams = { BUFFER: this.appConfig.mapGetFeatureInfoBuffer };
    	if (layer.startTime && layer.endTime) {
			extraParams.TIME = layer.startTime.format(this.animationDatePattern) + "/" + layer.endTime.format(this.animationDatePattern);
		}
    	return proxyURL + encodeURIComponent(layer.getFeatureInfoRequestString(this.clickPoint, extraParams)) + "&format=" + encodeURIComponent(layer.getFeatureInfoFormat());
    },
    
    _collectUniqueLayers: function() {
    	var uniqueLayers = [];
    	var rootLayers = {};
    	
    	var allLayers = this.map.getLayersByClass("OpenLayers.Layer.WMS");
    	allLayers.concat(this.map.getLayersByClass("OpenLayers.Layer.Image"));
        Ext.each(allLayers, function(layer, index, all) {
        	if (layer.isAnimated) {
        		var rootLayer = rootLayers[layer.params.LAYERS];
	        	this._setLayerTimes(layer);
	        	if (!rootLayer) {
	        		rootLayers[layer.params.LAYERS] = layer;
	        		animatedLayer = layer;
	        		uniqueLayers.push(rootLayer);
	        	}
	        	if (this._after(rootLayer, layer)) {
	        		rootLayer.endTime = layer.endTime;
	        	}
	        	if (this._before(rootLayer, layer)) {
	        		rootLayer.startTime = layer.startTime;
	        	}
        	}
        	else {
        		uniqueLayers.push(layer);
        		rootLayers[layer.params.LAYERS] = layer;
        	}
        }, this);
        
        return uniqueLayers;
    },
    
    _setLayerTimes: function(layer) {
    	layer.startTime = this._getLayerTimeFromUrl(layer);
		layer.endTime = this._getLayerTimeFromUrl(layer);
    },
    
    _getLayerTimeFromUrl: function(layer) {
    	return Date.parseDate(layer.params.TIME, this.animationDatePattern);
    },
    
    _after: function(layer, other) {
    	var result = false;
    	if (other.endTime && !layer.endTime) {
    		result = true;
    	}
    	else if (layer.endTime && other.endTime) {
    		result = other.endTime.getTime() > layer.endTime.getTime();
    	}
    	return result;
    },
    
    _before: function(layer, other) {
    	var result = false;
    	if (other.startTime && !layer.startTime) {
    		result = true;
    	}
    	else if (layer.startTime && other.startTime) {
    		result = other.startTime.getTime() < layer.startTime.getTime();
    	}
    	return result;
    },
    
    _display: function(clickLocation) {
        this.doLayout();
        this.show();
    },
    
    _setLocationString: function() {
    	this.locationString = this._getCoordinateLabel("Lat:", this.location.lat) + " " + this._getCoordinateLabel("Lon:", this.location.lon);
    },
    
    _getCoordinateLabel: function(latLonLabel, coord) {
    	// TODO move toNSigFigs into a class somewhere
    	return this._boldify(latLonLabel) + " " + toNSigFigs(coord, 4);
    },
    
    _boldify: function(text) {
    	return "<b>" + text + "</b>";
    },
    
    _updateStatus: function() {
        if (this.numGoodResults > 0) {
            this.setTitle("Feature information found for " + this.numGoodResults + " / " + this.numResultsToLoad + " layers");
        }
        else if (this.numResultQueries == this.numResultsToLoad) {
            var layerStr = (this.numResultsToLoad == 1) ? "layer" : "layers";
            this.setTitle("No features found for " + this.numResultsToLoad + " queryable " + layerStr);
        }
    },
    
    _updatePopupDepthStatus: function(response) {   
        if (response !== undefined) {
            var xmldoc = response.responseXML;  

            if (xmldoc.getElementsByTagName('depth') !== undefined) {
                var depth = xmldoc.getElementsByTagName('depth')[0].firstChild.nodeValue;
                var str =  (depth <= 0) ?  "Depth:" : "Altitude:";
                this.popupHtml.update(this.locationString + " <b>" + str + "</b> " + Math.abs(depth) + "m");
            }
        }
        else {
            // clear out any placeholder 'loading' text
            this.popupHtml.update("");
        }
    }
});