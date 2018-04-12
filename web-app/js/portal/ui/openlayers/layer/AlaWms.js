OpenLayers.Layer.AlaWMS = OpenLayers.Class(OpenLayers.Layer.WMS, {

    initialize: function(name, url, params, options) {

        params.queryable = true;
        params.ENV = OpenLayers.i18n("ALAOccurrencesStyle");
        options.projection = new OpenLayers.Projection("EPSG:4326");
        options.isBaseLayer = false;
        options.sphericalMercator = true;

        OpenLayers.Layer.WMS.prototype.initialize.apply(this, [name, url, params, options]);
    },

    isAla: function() {
        return true;
    },

    getAlaGetFeatureInfoString: function() {
        return "http://biocache.ala.org.au/ws/ogc/getFeatureInfo";
    },

    // todo not working following https://api.ala.org.au/#ws8
    // probably the projection + wkt ?
    getFeatureInfoRequestString: function(clickPoint, overrideParams) {

        var lonlat = this.map.getLonLatFromPixel(clickPoint);
        var wkt = this.map.getExtent().toGeometry().toWkt();

        var baseFeatureInfoParams = {
            lat: lonlat.lat,
            lon: lonlat.lon,
            radius: 10,
            q: "genus:Macropus",
            wkt: wkt,
            flimit: 10
        };

        var url = this.getAlaGetFeatureInfoString();
        var paramsString = OpenLayers.Util.getParameterString(baseFeatureInfoParams);

        return OpenLayers.Util.urlAppend(url, paramsString);
    },

    getFeatureInfoFormat: function() {
        return "text/xml";
    },

    formatFeatureInfoHtml: function(resp, options) {
        return formatGetFeatureInfo(resp, options);
    }

});
