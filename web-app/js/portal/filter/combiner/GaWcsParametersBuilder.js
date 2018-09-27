Ext.namespace('Portal.filter.combiner');

Portal.filter.combiner.GaWcsParametersBuilder = Ext.extend(Portal.filter.combiner.BaseFilterCombiner, {

    buildWCSParameters: function(layerName) {

        var geomFilter = this.filters.map(function(filter) {

            if (filter.constructor == Portal.filter.GeometryFilter) {
                return filter;
            }
        });

        return this.buildParameters(geomFilter[0], layerName);
    },

    buildParameters: function(geomFilter, layerName) {

        var downloadConfig = this.getLayerConfig(layerName);
        downloadConfig.selectedBBOX = (geomFilter.value != undefined) ? geomFilter.value.getBounds().toBBOX() : geomFilter.map.getExtent().toBBOX();
        downloadConfig.size = this.getGridEnvelope(downloadConfig);
        return downloadConfig;
    },

    getLayerConfig: function(layerName) {

        var clipConfig = this.getClipConfig();
        var selected = {};

        Ext.each(clipConfig.datasets, function(dataset) {
             if (dataset.layers ==  layerName) {
                 Ext.apply(selected, dataset);
             }
        }, this);

        return selected;

    },

    getGridEnvelope: function (wcsParameters) {

        var maxBounds = new OpenLayers.Bounds(wcsParameters.maxBoundingBox);
        var newBounds = new OpenLayers.Bounds(wcsParameters.selectedBBOX.split(','));
        var widthPercentage = newBounds.getWidth() / maxBounds.getWidth();
        var heightPercentage = newBounds.getHeight() / maxBounds.getHeight();
        return {
            width: ((wcsParameters.maxGridEnvelope[0] * widthPercentage) * wcsParameters.scaleFactor).toFixed(0),
            height: ((wcsParameters.maxGridEnvelope[1] * heightPercentage) * wcsParameters.scaleFactor).toFixed(0)
        };
    },

    getClipConfig: function() {
        return {
            "datasets": [
                {
                    "title": "Bathymetry 150m",
                    "layers": "marine:bathymetry_150m_all_3857",
                    "coverage": "marine:bathymetry_150m_all_3857",
                    "removeBasicFormats": true,
                    "maxBoundingBox": [79.3688, -42.1365, 115.7668, -9.5229],
                    "maxGridEnvelope": [27011, 27443],
                    "displayScaleFactor": 0.05,
                    "scaleFactor": 0.5,
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [
                                [78.3398, -41.9301],
                                [97.4121, -29.3764],
                                [105.0146, -8.6614],
                                [113.8477, -11.6027],
                                [108.8818, -18.2231],
                                [116.8799, -32.2816],
                                [79.4385, -42.4510],
                                [78.3398, -41.9301]
                            ]
                        ]
                    }
                },
                {
                    "title": "Backscatter 30m",
                    "layers": "marine:backscatter_30m_all_3857",
                    "coverage": "marine:backscatter_30m_all_3857",
                    "removeBasicFormats": true,
                    "maxBoundingBox": [84.9593, -40.3442, 102.1066, -24.7343],
                    "maxGridEnvelope": [69460, 63232],
                    "displayScaleFactor": 0.01,
                    "scaleFactor": 0.2,
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [
                                [84.1406, -38.7832],
                                [93.9844, -33.1320],
                                [101.8066, -24.1207],
                                [103.1250, -25.1592],
                                [95.6543, -34.6639],
                                [85.8545, -41.0081],
                                [84.1406, -38.7832]
                            ]
                        ]
                    }
                },
                {
                    "title": "Autonomous Underwater Vehicle SSS",
                    "layers": "marine:Fugro_AUV_5m_WGS84",
                    "coverage": "marine:Fugro_AUV_5m_WGS84",
                    "maxBoundingBox": [86.0195, -39.6670, 96.3108, -32.8080],
                    "maxGridEnvelope": [185000, 152585],
                    "displayScaleFactor": 0.005,
                    "scaleFactor": 0.10,
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [
                                [85.5908, -39.1420],
                                [95.3687, -32.5227],
                                [96.1157, -33.1320],
                                [86.9531, -40.0730],
                                [85.5908, -39.1420]
                            ]
                        ]
                    }
                },
                {
                    "title": "Deep Tow SSS",
                    "layers": "marine:Fugro_DT_5m_WGS84",
                    "coverage": "marine:Fugro_DT_5m_WGS84",
                    "maxBoundingBox": [85.0901, -40.0870, 94.0564, -34.3037],
                    "maxGridEnvelope": [159118, 128481],
                    "displayScaleFactor": 0.005,
                    "scaleFactor": 0.10,
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [
                                [84.8547, -39.0141],
                                [93.3142, -34.2200],
                                [94.0613, -34.9166],
                                [92.1277, -36.3983],
                                [92.2156, -36.5926],
                                [89.9524, -38.1207],
                                [86.0193, -40.2326],
                                [84.8547, -39.0141]
                            ]
                        ]
                    }
                },
                {
                    "title": "Synthetic Aperture Sonar 2014-2015",
                    "layers": "marine:GoPhoenix_SAS_5m_WGS84",
                    "coverage": "marine:GoPhoenix_SAS_5m_WGS84",
                    "removeBasicFormats": true,
                    "maxBoundingBox": [92.7145, -35.2825, 95.8506, -32.7121],
                    "maxGridEnvelope": [57922, 57020],
                    "displayScaleFactor": 0.005,
                    "scaleFactor": 0.10,
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [
                                [92.6056, -35.0336],
                                [95.4620, -32.6708],
                                [95.8575, -32.9847],
                                [93.0450, -35.3434],
                                [92.6056, -35.0336]
                            ]
                        ]
                    }
                },
                {
                    "title": "Synthetic Aperture Sonar 2016",
                    "layers": "marine:DHJ_SAS_5m_WGS84",
                    "coverage": "marine:DHJ_SAS_5m_WGS84",
                    "removeBasicFormats": true,
                    "maxBoundingBox": [88.6800, -37.8996, 95.3757, -33.0372],
                    "maxGridEnvelope": [135439, 98355],
                    "displayScaleFactor": 0.005,
                    "scaleFactor": 0.10,
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [
                                [88.4967, -37.8523],
                                [95.3632, -32.9017],
                                [95.4840, -33.1044],
                                [91.9464, -36.0260],
                                [92.2870, -36.3452],
                                [89.3756, -38.1121],
                                [88.4967, -37.8523]
                            ]
                        ]
                    }
                }
            ],
            "getLayerUrl": "/geoserver/marine/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS={layers}&CRS=EPSG:3857&TRANSPARENT=true&BBOX={bbox}&FORMAT=image/png&WIDTH={width}&HEIGHT={height}",
            "getCoverageUrl": "http://localhost:8080/geoserver/marine/wcs?SERVICE=WCS&VERSION=1.0.0&REQUEST=GetCoverage&COVERAGE={coverage}&CRS={crs}&BBOX={bbox}&FORMAT={format}&WIDTH={width}&HEIGHT={height}&RESX={width}&RESY={height}"
        }
    }


});
