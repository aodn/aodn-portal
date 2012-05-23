Ext.namespace('Portal.details');

Portal.details.InfoPanel = Ext.extend(Ext.Panel, {

    id: 'infoPanel',
    title: 'Info',
    layout: 'fit',
    autoScroll: true,
    html: "Loading ...",

	initComponent: function(cfg){
		Portal.details.InfoPanel.superclass.initComponent.call(this);
	},


	setSelectedLayer: function(layer){
		this.selectedLayer = layer;
	},

	updateInfo: function(metaUrl) {
		this.body.update("Loading...");
		if (metaUrl) {
			this.updateLayer(metaUrl);
		} else if (this.selectedLayer.server.type.search("NCWMS") > -1) {
			this.updateNcwmsLayer();  //Show the getFeatureInfo response for ncWMS if there's no metadata
		}
	},


	updateLayer: function(metaUrl){
		var conn = new Ext.data.Connection; 
		Ext.Ajax.request({
			url: 'layer/getFormattedMetadata?metaURL=' + metaUrl,
			scope: this,
			success: function(resp, options) {
				this.body.update(resp.responseText);
			},
			failure: function(resp) {
				this.body.update("No information available at this time.");
			}
		});
	},

	updateNcwmsLayer: function(){
		var infoPanel = this;
		var isAnimatedLayer = this.selectedLayer.originalWMSLayer != undefined;

		// this is an animated image
		if (isAnimatedLayer) {

			if ( this.selectedLayer.getVisibility() ) { // Only show if visible

				var chart_bbox = this.selectedLayer.url.match("BBOX=[^\&]*")[0].substring(5);
				var chart_time =  this.selectedLayer.url.match("TIME=[^\&]*")[0].substring(5);
				var chart_style =  this.selectedLayer.url.match("STYLES=[^\&]*")[0].substring(7);

				url = this.selectedLayer.url.substring(0, this.selectedLayer.url.indexOf("?")) +
				"?SERVICE=WMS&REQUEST=GetFeatureInfo" +
				"&EXCEPTIONS=application/vnd.ogc.se_xml" +
				"&BBOX=" + this.selectedLayer.extent.toBBOX() +
				"&INFO_FORMAT=image/png" +
				"&QUERY_LAYERS=" + this.selectedLayer.originalWMSLayer.params.LAYERS +
				"&FEATURE_COUNT=1" +
				"&STYLES=" + chart_style +
				"&CRS=EPSG:4326" +
				"&BUFFER="+ Portal.app.config.mapGetFeatureInfoBuffer +
				"&WIDTH=1"  +
				"&HEIGHT=1" +
				"&X=0"  +
				"&Y=0" +
				"&TIME=" + chart_time +
				"&VERSION=" + layer.originalWMSLayer.params.VERSION;
			}
		}
		else {

			var bboxBounds = this.selectedLayer.getExtent();
			// only handling WMS-1.3.0 reversing here not ncWMS
			if(this.selectedLayer.server.type == "WMS-1.3.0") { 
				bboxBounds =  new OpenLayers.Bounds.fromArray(bboxBounds.toArray(true));
			} 

			if ((!this.selectedLayer.isBaseLayer) && this.selectedLayer.getVisibility()) {
				if (this.selectedLayer.params.VERSION == "1.1.1" || this.selectedLayer.params.VERSION == "1.1.0") {                
					url = this.selectedLayer.getFullRequestString({
						REQUEST: "GetFeatureInfo",
						EXCEPTIONS: "application/vnd.ogc.se_xml",
						BBOX: bboxBounds.toBBOX(),
						X: 0,
						Y: 0,
						I: 0, // buggy IVEC NCWMS-1.1.1
						J: 0, // buggy IVEC NCWMS-1.1.1
						INFO_FORMAT: 'text/xml',
						QUERY_LAYERS: this.selectedLayer.params.LAYERS,
						FEATURE_COUNT: 1,
						BUFFER: Portal.app.config.mapGetFeatureInfoBuffer,
						SRS: 'EPSG:4326',
						WIDTH: 1,
						HEIGHT: 1
					});                    
				}
				else if (this.selectedLayer.params.VERSION == "1.3.0") {
					url = this.selectedLayer.getFullRequestString({
						REQUEST: "GetFeatureInfo",
						EXCEPTIONS: "application/vnd.ogc.se_xml",
						BBOX: bboxBounds.toBBOX(),
						I: 0,
						J: 0,
						INFO_FORMAT: expectedFormat,
						QUERY_LAYERS: this.selectedLayer.params.LAYERS,
						FEATURE_COUNT: 1,
						CRS: 'EPSG:4326',
						BUFFER: Portal.app.config.mapGetFeatureInfoBuffer,
						WIDTH: 1,
						HEIGHT: 1
					});
				}
			}
		}

		if ( url != "none" ) {
			Ext.Ajax.request({
				url: proxyURL + encodeURIComponent( url ) + "&format=" + encodeURIComponent('text/xml'), // add format for grails proxy
				params: {
					name: this.selectedLayer.name,
					id: this.selectedLayer.id,
					expectedFormat: 'text/xml',
					isAnimatedLayer: isAnimatedLayer,
					units: this.selectedLayer.metadata.units
				},
				success: function(resp, options){
					var newTabContent;

					if(options.params.isAnimatedLayer)
						newTabContent = "<div><img src='" + url + "'></div>";
					else {
						var xmldoc = resp.responseXML;  
						var copyright =  xmldoc.getElementsByTagName('copyright')[0];
						if(copyright != undefined) {
							newTabContent = "<p>" + copyright.childNodes[0].nodeValue + "</p>";
						} else {
							Ext.getCmp("detailsPanelTabs").hideInfoTab();
						}
					}

					if (newTabContent) {
						infoPanel.body.update(newTabContent);
						infoPanel.body.show();
					}
				}
			});
		}
	}
});