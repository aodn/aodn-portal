Ext.namespace('Portal.ui');

Portal.ui.Options = Ext.extend(Object, {
	
	controls: [
		new OpenLayers.Control.Navigation(),
		new OpenLayers.Control.Attribution(),
		new OpenLayers.Control.PanPanel(),
		new OpenLayers.Control.MousePosition(),
		new OpenLayers.Control.ScaleLine(),
		new OpenLayers.Control.NavigationHistory(),
		new OpenLayers.Control.OverviewMap({
            autoPan: true,
            minRectSize: 30,
            mapOptions:{
            	resolutions: [0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 0.0006866455078125, 0.00034332275390625,  0.000171661376953125]
            }
        })
	],
	
	options: {
		controls: this.controls,
        displayProjection: new OpenLayers.Projection("EPSG:4326"),
        prettyStateKeys: true, // for pretty permalinks,
        resolutions : [  0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 0.0006866455078125, 0.00034332275390625,  0.000171661376953125]
	},
	
	constructor: function(cfg) {
		var config = Ext.apply({}, cfg);
		Portal.ui.Options.superclass.constructor.call(this, config);
		
		this.map = new OpenLayers.Map(this.options);
	    this.map.restrictedExtent = new OpenLayers.Bounds.fromString("-360,-90,360,90");
	}	
});

Portal.ui.Map = Ext.extend(GeoExt.MapPanel, {
	
	constructor: function(cfg) {
		
		// Stop the pink tiles appearing on error
	    OpenLayers.Util.onImageLoadError = function(e) {
	        this.style.display = "";
	        this.src="img/blank.png";
	    };
		
		var config = Ext.apply({}, cfg);
		
		Portal.ui.Map.superclass.constructor.call(this, config);
	},

	addBaseLayers: function() {
		Ext.Ajax.request({
	        url: 'layer/configbase',
	        scope: this,
	        success: function(resp, opts) {        
	        	var layerDescriptors = Ext.util.JSON.decode(resp.responseText);
	        	Ext.each(layerDescriptors, 
	    			function(layerDescriptor, index, all) {
		        		layerDescriptor.isBaseLayer = true;
		                layerDescriptor.queryable = false;
	        			this.map.addLayer(this.createLayer(layerDescriptor));
	    			},
	        		this
	        	);
	        	this.onAdd();
	        }
	    });
	},
	
	getServer: function(layerDescriptor) {
		return layerDescriptor.server;
	},

	getServerImageFormat: function (server) {
		if (server) {
			if (server.imageFormat) {
				return server.imageFormat;
			}
			return 'image/png';
		}
		return undefined;
	},
	
	getWmsVersionString: function(server) {
	    // list needs to match Server.groovy
	    var versionList = ["1.0.0","1.0.7","1.1.0","1.1.1","1.3.0"];
	    for(var i = 0; i < versionList.length; i++){
	        if (server.type.indexOf(versionList[i]) != -1) {
	            return versionList[i];
	        }
	    }
	    return "undefined";
	                
	},
	
	getServerOpacity: function(server) {
		var opacity = server.opacity ? server.opacity : 100;
		return Math.round((opacity / 100)*10)/10;
	},
	
	getOpenLayerOptions: function(layerDescriptor) {
		return {
	        wrapDateLine: true,   
	        opacity: this.getServerOpacity(this.getServer(layerDescriptor)),
	        version: this.getWmsVersionString(this.getServer(layerDescriptor)),
	        transitionEffect: 'resize',
	        isBaseLayer: layerDescriptor.isBaseLayer,
	        projection: new OpenLayers.Projection(layerDescriptor.projection)
	    };
	},
	
	getOpenLayerParams: function (layerDescriptor) {
		return {
	        layers: layerDescriptor.name,
	        transparent: 'TRUE',
	        buffer: 1, 
	        gutter: 0,
	    	version: this.getWmsVersionString(this.getServer(layerDescriptor)),
	    	format: this.getServerImageFormat(this.getServer(layerDescriptor)),
	    	CQL_FILTER: layerDescriptor.cql,
	    	queryable: layerDescriptor.queryable,
	    	styles: layerDescriptor.styles
	    };
	},
	
	createLayer: function(layerDescriptor, overrides) {
		var server = layerDescriptor.server;
		var params = this.getOpenLayerParams(layerDescriptor);
	    var options = this.getOpenLayerOptions(layerDescriptor);
	    
	    if (overrides) {
	    	Ext.apply(options, overrides);
	    }
	    
	    var serverUri;
	    // proxy to use if this layer is cached    
	    if (dl.cache == true) {
	        serverUri =  window.location.href + proxyCachedURL + URLEncode(dl.server.uri);         
	    }
	    else {
	        serverUri = dl.server.uri;
	    }
	
	    var layer = new OpenLayers.Layer.WMS(
	        dl.title,
	        serverUri,
	        params,
	        options
	        );
	            
	    var parentLayerId; // useful when the same server has layers named the same yet in subfolders
	    if (dl.parent) {
	        parentLayerId = dl.parent.id
	        layer.parentLayerName = dl.parent.name; 
	    }
	    
	    //
	    // extra info to keep
	    layer.grailsLayerId = dl.id; // grails layer id
	    layer.server= dl.server;
	    layer.cql = dl.cql;  
	    layer.bbox = dl.bbox;
	    layer.cache = dl.cache;
	    layer.projection = dl.projection;
	    layer.parentLayerId = parentLayerId;
	    layer.blacklist = dl.blacklist; // shouldn't really see blacklisted layers here
	    layer.abstractTrimmed = dl.abstractTrimmed;
	      
	    
	    // don't add layer twice 
	    if (layerAlreadyAdded(layer)) {
	        Ext.Msg.alert(OpenLayers.i18n('layerExistsTitle'),OpenLayers.i18n('layerExistsMsg'));
	    }
	    else {
	        return layer;
	    }
	}
});