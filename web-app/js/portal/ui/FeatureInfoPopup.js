
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.FeatureInfoPopup = Ext.extend(GeoExt.Popup, {
	
	constructor: function(cfg) {
	    this.numResultsToLoad = 0;
	    this.numResultQueries = 0;
	    this.numGoodResults = 0;
		
	    var config = Ext.apply({
	    	title: "Searching for Features at your click point",
	        width: cfg.appConfig.popupWidth,
	        height: 80, // set height later when there are results
	        maximizable: true,
	        anchored: true,
	        autoScroll: true,
	        resizable: false
	    }, cfg);

	    Portal.ui.FeatureInfoPopup.superclass.constructor.call(this, config);
	    
	    this._addElements();
	    
	    this.on('maximize', this._onMaximizeRestore,this);
	    this.on('restore', this._onMaximizeRestore,this);
	    
        Ext.MsgBus.subscribe('reset', function() {
            this.close();
        }, this);
    },
    
    unanchorPopup: function() {
    	
    	this._makeResizable();
    	Portal.ui.FeatureInfoPopup.superclass.unanchorPopup.call(this);
    },
    
    _makeResizable: function() {
    	
        this.resizable = true;
        var resizer = new Ext.Resizable(this.getEl());
        var featureInfoPopup = this;
        
        resizer.on('resize', this._onResize,this);
    },
    
    _onResize: function() {
    	this.syncSize();
        this.popupTab.doLayout();
        this.popupTab.delegateUpdates();
    },
    
    _onMaximizeRestore:function() {
    	this.popupTab.doLayout();
        this.popupTab.delegateUpdates();
    },

    _addElements: function() {
    	// Add container for html (empty for now)
    	this.blankContainer = new Ext.Container({
			html: "Loading ...",
			cls: 'popupHtml',
			ref: './popupHtml'
		});		

	    this.add(this.blankContainer);

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

        this._setLocationString();
        this._display();

        this._handleDepthService();
        this._handleLayers();
    },
    
    _handleDepthService: function() {

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
    },
    
    _handleLayers: function() {
    	var resized = false;
    	var wmsLayers = this._collectUniqueLayers();

    	if(wmsLayers.length == 0){
    		this.setTitle("No layer selected.");
    		this.blankContainer.update("");
    	}
    	else{
    		var count = 0;
    		Ext.each(wmsLayers, function(layer, index, all) {
				if (layer.params.QUERYABLE == true && layer.getVisibility()) {
					count++;
					this._requestFeatureInfo(layer);
					if (!resized) {
						this.setSize(this.appConfig.popupWidth, this.appConfig.popupHeight);
						resized = true;
					}
				}
			}, this);

			if(count == 0){
				this.setTitle("No layer selected.");
				this.blankContainer.update("");
			}
    	}
    },
    
    _requestFeatureInfo: function(layer) {
    	this.numResultsToLoad++;
    	Ext.Ajax.request({
        	scope: this,
            url: this._getLayerFeatureInfoRequestString(layer),
            params: {
                name: layer.name,
                expectedFormat: layer.getFeatureInfoFormat(),
                units: layer.metadata.units,
                animation: layer.isAnimated
            },
            success: function(resp, options) {
            	if (options.params.animation) {
            		this.numGoodResults++;
            		this._addPopupTabContent("<div><img src='" + options.url + "'></div>", options.params.name);
            	}
            	else {
	                var newTabContent = formatGetFeatureInfo( resp, options );
	                if (newTabContent) {
	                    this.numGoodResults++;
	                    this._addPopupTabContent(newTabContent, options.params.name);
	                }
            	}
                this._featureInfoRequestCompleted();
                setTimeout(imgSizer, 1000);
            },

            failure: this._featureInfoRequestCompleted
        });
    },
    
    _featureInfoRequestCompleted: function() {
    	this.numResultQueries++;
        this._updateStatus();
    },
    
    _getLayerFeatureInfoRequestString: function(layer) {
    	var extraParams = { BUFFER: this.appConfig.mapGetFeatureInfoBuffer };
        var format = 'text/xml';
    	if (layer.isAnimated && layer.startTime && layer.endTime) {
			extraParams.TIME = layer.startTime.toISOString() + "/" + layer.endTime.toISOString();
			extraParams.FORMAT = "image/png";
			extraParams.INFO_FORMAT = "image/png";
            delete format;
		}

        var result = proxyURL + encodeURIComponent(layer.getFeatureInfoRequestString(this._clickPoint(), extraParams));
        if (format) {
            result += "&format=" + encodeURIComponent(format);
        }
        return result;
    },

    _clickPoint: function() {
        var pixel = this.map.getViewPortPxFromLonLat(this.location);
        return { x: pixel.x, y: pixel.y }
    },
    
    _collectUniqueLayers: function() {
    	var uniqueLayers = [];
    	var rootLayers = {};
    	
    	var allLayers = this.map.getLayersByClass("OpenLayers.Layer.WMS");
    	allLayers.concat(this.map.getLayersByClass("OpenLayers.Layer.Image"));
        Ext.each(allLayers, function(layer, index, all) {
        	if(!layer.isBaseLayer){
				if (layer.isAnimated) {
					var rootLayer = rootLayers[layer.params.LAYERS];
					this._setLayerTimes(layer);
					if (!rootLayer) {
						rootLayers[layer.params.LAYERS] = layer;
						rootLayer = layer;
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
			}
        }, this);
        
        return uniqueLayers;
    },
    
    _setLayerTimes: function(layer) {
    	layer.startTime = this._getLayerTimeFromUrl(layer);
		layer.endTime = this._getLayerTimeFromUrl(layer);
    },
    
    _getLayerTimeFromUrl: function(layer) {
    	if(layer.params.TIME){
			return new Date(layer.params.TIME);
    	}
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
            this.setTitle("Feature information found for " + this.numGoodResults + " layers");
        }
        else if (this.numResultQueries == this.numResultsToLoad) {
            var layerStr = (this.numResultsToLoad == 1) ? "layer" : "layers";
            this.setTitle("No features found for " + this.numResultsToLoad + " queryable " + layerStr);
        }
    },
    
    _updatePopupDepthStatus: function(response) {   
        if (response !== undefined) {
            var xmldoc = response.responseXML;  

            // Depth service can return 204 but our app changes that to a 200 and pipes down nothing
            if (xmldoc && xmldoc.getElementsByTagName('depth') !== undefined) {
                var depth = xmldoc.getElementsByTagName('depth')[0].firstChild.nodeValue;
                var str =  (depth <= 0) ?  "Depth:" : "Altitude:";
                this.blankContainer.update(this.locationString + " " + this._boldify(str) + " " + Math.abs(depth) + "m");
            }
            else {
                this.blankContainer.update("");
            }
        }
        else {
            // clear out any placeholder 'loading' text
            this.blankContainer.update("");
        }
    },
    
    _addPopupTabContent: function(content, title) {
    	
    	// We'll need to set the active tab index later, if there's not one currently.
    	var activeTab = this.popupTab.getActiveTab();
    	
    	this.popupTab.add( {
            xtype: "box",
            title: title,
            padding: 30,
            autoHeight: true,
            cls: "featureinfocontent",
            autoEl: {
					html: content
					},
			listeners: { 
				// find any script loaded as text and run it when this tab is opened
				activate: function(){				
					var code = $('#' + this.getId( ) + ' script').text();
					var codefunc = new Function(code);
					codefunc();
				} 
			}
        });
		
		
    	if (!activeTab)	{
        	this.popupTab.setActiveTab(0);
    	}
		
    	this.popupTab.doLayout();
    	this.popupTab.show();
    },	
	
    fitContainer: function() {
    	if (this.maximisedSize) {
	    	this.setSize(this.maximisedSize.width, this.maximisedSize.height);
	    	if (this.dd) {
	            this.dd.unlock();
	        }
	        
	        if(this.maximisedX && this.maximisedY)
	        	this.setPosition(this.maximisedX, this.maximisedY);
    	}
    	else {
    		GeoExt.Popup.prototype.fitContainer.call(this);
    	}
    }
    
});
