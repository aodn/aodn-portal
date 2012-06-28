// Modifications to OpenLayers class prototypes
OpenLayers.Layer.WMS.prototype.isNcwms = function() {
    if (this.server) {
    	return ["NCWMS-1.1.1", "NCWMS-1.3.0", "THREDDS"].indexOf(this.server.type) >= 0;
    }
}

OpenLayers.Layer.WMS.prototype.getFeatureInfoRequestString = function(clickPoint, overrideParams) {
    var baseFeatureInfoParams = {
		REQUEST: "GetFeatureInfo",
        EXCEPTIONS: "application/vnd.ogc.se_xml",
        BBOX: this._getBoundingBox(),
        INFO_FORMAT: this.getFeatureInfoFormat(),
        QUERY_LAYERS: this.params.LAYERS,
        FEATURE_COUNT: this.isNcwms() ? 1 : 100,
        SRS: 'EPSG:4326',
        CRS: 'EPSG:4326',
        WIDTH: this.map.size.w,
        HEIGHT: this.map.size.h
	};
    
    if (clickPoint) {
    	baseFeatureInfoParams = Ext.apply(baseFeatureInfoParams, {
    		X: clickPoint.x,
            Y: clickPoint.y,
            I: clickPoint.x,
            J: clickPoint.y,
    	});
    }
    
    baseFeatureInfoParams = Ext.apply(baseFeatureInfoParams, overrideParams);
	
    return this.getFullRequestString(baseFeatureInfoParams);
}

OpenLayers.Layer.WMS.prototype.getFeatureInfoFormat = function() {
	var result = "text/html";
	if (this.isAnimated) {
		result = "image/png";
	}
	else if (this.isNcwms()) {
		result = "text/xml";
	}
	
	return result;
}

OpenLayers.Layer.WMS.prototype.getMetadataUrl = function() {
	var result = undefined;
	if (this.overrideMetadataUrl) {
		result = this.overrideMetadataUrl;
	}
	else if (this.metadataUrls && this.metadataUrls.length > 0 && this.metadataUrls[0].type == "other") {  //ideally there would be a MCP type in geoserver to compare with - rather than "other"
    	result = this.metadataUrls[0].onlineResource.href;
    }
	
	return result;
}

OpenLayers.Layer.WMS.prototype._getBoundingBox = function() {
	var bounds = this._is130() 
		? new OpenLayers.Bounds.fromArray(this.getExtent().toArray(true))
		: this.getExtent();
	
	return bounds.toBBOX();
}

OpenLayers.Layer.WMS.prototype._is130 = function() {
	return "WMS-1.3.0" == this.server.type; 
}

OpenLayers.Layer.WMS.prototype.isAnimatable = function(){
	if (this.dimensions != undefined){
		for(var i = 0; i < this.dimensions.length; i++){
			if(this.dimensions[i].name == "time"){
				return true;
			}
		}
	}
	return false;
}
