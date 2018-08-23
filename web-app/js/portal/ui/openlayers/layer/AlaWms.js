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
            radius: 50,
            q: "genus:Macropus", // needs fixing
            wkt: wkt,
            pageSize: 2
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
            return resp.responseText
        }
    },

    mergeNewParams:function(params) {

        var newParams = {};
        for (var key in params) {
            if (key == 'fq') {
                newParams['fq'] = this.buildFqParams(params[key]);
            }
            else {
                newParams[key] = params[key];
            }
        }

        var newArguments = [newParams];
        return OpenLayers.Layer.Grid.prototype.mergeNewParams.apply(this,
            newArguments);
    },

    buildFqParams: function(fq) {
        return  (Portal.app.appConfig.ala.index != undefined) ? Portal.app.appConfig.ala.index + " " + fq : fq;
    },

    applyFilters: function(filters) {

        var builder = new Portal.filter.combiner.AlaParametersBuilder({
            filters: filters
        });

        var style = "ALAOccurrencesStyle";
        var newParams = builder.refactorDateTimeParameters(builder.buildParameters());

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
