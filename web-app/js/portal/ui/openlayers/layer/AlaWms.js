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
        return Portal.app.appConfig.ala.gfi_endpoint;
    },

    getFeatureInfoRequestString: function(clickPoint) {

        var lonlat = this.map.getLonLatFromPixel(clickPoint);
        var wkt = this.map.getExtent().toGeometry().toWkt();

        var baseFeatureInfoParams = {
            lat: lonlat.lat,
            lon: lonlat.lon,
            fq: Portal.app.appConfig.ala.index,
            q: "rank:species",
            fsort: "count",
            dir: "desc",
            radius: 50,
            //wkt: wkt,
            pageSize: 3
        };

        var url = this.getAlaGetFeatureInfoString();
        var paramsString = OpenLayers.Util.getParameterString(baseFeatureInfoParams);

        return OpenLayers.Util.urlAppend(url, paramsString);
    },

    getFeatureInfoFormat: function() {
        return "text/json";
    },

    formatFeatureInfoHtml: function(resp) {
        if (resp.status == 200 ) {
            if (!resp.responseText.contains("No records at this point")) {
                return resp.responseText
            }
        }
    },

    mergeNewParams:function(params) {

        // dont uppercase using Grid direct
        OpenLayers.Layer.Grid.prototype.mergeNewParams.apply(this,
            [params]);
    },

    applyFilters: function(filters) {

        var builder = new Portal.filter.combiner.AlaParametersBuilder({
            filters: filters
        });

        var style = "ALAOccurrencesStyle";
        var newParams = builder.getExpandedParameters();

        if (newParams.Q) {
            style = "ALAPerSpeciesStyle";
        }
        else {
            newParams.Q = null;
        }

        this.mergeNewParams(newParams);
        this.mergeNewParams({ ENV: OpenLayers.i18n(style)});

    }

});
