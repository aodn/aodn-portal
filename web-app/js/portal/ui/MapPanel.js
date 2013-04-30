/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.MapPanel = Ext.extend(Portal.common.MapPanel, {

    constructor:function (cfg) {

        this.appConfig = cfg.appConfig;

        var config = Ext.apply({
            id:'mapPanel',
            region:"center",
            split:true,
            header:false,
            initialBbox:this.appConfig.initialBbox,
            autoZoom:this.appConfig.autoZoom,
            enableDefaultDatelineZoom: this.appConfig.enableDefaultDatelineZoom,
            defaultDatelineZoomBbox: this.appConfig.defaultDatelineZoomBbox,
            hideLayerOptions:this.appConfig.hideLayerOptions,
            layersLoading:0,
            layers:new Portal.data.LayerStore(),
            html:" \
                    <div id='loader' style='position: absolute; top: 50%; left: 43%; z-index: 9000;'> \
                        <div id='jsloader' style='height: 70px; width: 70px; float: left;'></div> \
                        <span></span> \
                    </div>" // This is the "Loading 'n' layers" pop-up; message is inserted into the span.

        }, cfg);

        Portal.ui.MapPanel.superclass.constructor.call(this, config);

        this.initMap();
        this.map.events.register('movestart', this, this.closeDropdowns);

        this.on('hide', function () {
            // map is never hidden!!!!"
            this._closeFeatureInfoPopup();
        }, this);

        // Without this, the mini-map does not load properly because it ends up without
        // any base layers.
        this.layers.bind(this.map);

        this.addEvents('tabchange', 'mouseover');

        this.on('afterlayout', function () {
            jQuery("div.olControlMousePosition,div.olControlScaleLine *").mouseover(function () {
                jQuery("div.olControlMousePosition,div.olControlScaleLine *").addClass('allwhite');
            });
            jQuery("div.olControlMousePosition,div.olControlScaleLine *").mouseout(function () {
                jQuery("div.olControlMousePosition,div.olControlScaleLine *").removeClass('allwhite');
            });

            // The 'afterLayout' event is called many times, this check prevents us from creating more than one spinner.
            // Alternatively we could move this spinner creation but it needs to happen in the proper place
            if ( !this.spinnerCreated ) {

                new Spinner({
                    lines:12, // The number of lines to draw
                    length:16, // The length of each line
                    width:4, // The line thickness
                    radius:12, // The radius of the inner circle
                    color:'#0d67a0', //#18394E', // #rgb or #rrggbb
                    speed:1, // Rounds per second
                    trail:60, // Afterglow percentage
                    shadow:true // Whether to render a shadow
                }).spin(document.getElementById("jsloader"));

                this.spinnerCreated = true;
            }
        }, this);

        this.on('tabchange', function () {
            this._closeFeatureInfoPopup();
            //if layers get loaded when the mappanel isn't visible, the loadingspinner gets stuck,
            this._updateLayerLoadingSpinner(this.layers.getLayersLoadingCount());
        }, this);

        Ext.MsgBus.subscribe('selectedLayerChanged', function (subject, message) {
            this.onSelectedLayerChanged(message);
        }, this);

        Ext.MsgBus.subscribe('baseLayerChanged', function(subject, message) {
            this.onBaseLayerChanged(message);
        }, this);

        Ext.MsgBus.subscribe('reset', function () {
            this.reset();
        }, this);

        Ext.MsgBus.subscribe('removeAllLayers', function () {
            this._closeFeatureInfoPopup();
        }, this);

        Ext.MsgBus.subscribe('layersLoading', function (subject, numLayersLoading) {
            this._updateLayerLoadingSpinner(numLayersLoading);
        }, this);

        this.startSnapshot = cfg.startSnapshot;
    },

    _updateLayerLoadingSpinner:function (numLayersLoading) {

        jQuery("#loader span").text(this.buildLayerLoadingString(numLayersLoading));

        // Show spinner.
        if (numLayersLoading > 0) {
            jQuery("#loader").show();
        }
        else {
            jQuery("#loader").hide('slow');
        }
    },

    onSelectedLayerChanged:function (openLayer) {

        if (this.autoZoom === true) {
            this.zoomToLayer(openLayer);
        }
    },

    onBaseLayerChanged: function(openLayer) {
        this.map.setBaseLayer(openLayer);
    },

    closeDropdowns:function (event) {
        this.map.events.triggerEvent('blur', event); // listening in BaseLayerComboBox and mapOptionsPanel
    },

    afterRender:function () {

        Portal.ui.MapPanel.superclass.afterRender.call(this);
        this.mapOptions.afterRender(this);

        if(this.startSnapshot)
            this.mapOptions.mapActionsControl.actionsPanel.loadSnapshot(this.startSnapshot);
    },

    loadSnapshot:function (id) {

        this.mapOptions.mapActionsControl.actionsPanel.loadSnapshot(id);
    },

    autoZoomCheckboxHandler:function (box, checked) {
        Portal.app.config.autoZoom = checked;
        this.autoZoom = checked;
    },

    reset:function () {
        this._closeFeatureInfoPopup();
        this.zoomToInitialBbox();
    },

    handleFeatureInfoClick:function (event) {
        this._closeFeatureInfoPopup();
        this._findFeatureInfo(event);
    },

    _closeFeatureInfoPopup:function () {
        if (this.featureInfoPopup) {
            this.featureInfoPopup.close();
        }
    },

    _findFeatureInfo:function (event) {
        this.featureInfoPopup = new Portal.ui.FeatureInfoPopup({
            map: this.map,
            appConfig: this.appConfig,
            maximisedPosition: { x: this.getPanelX(), y: this.getPanelY() }
        });
        this.featureInfoPopup.findFeatures(event);
    },

    initMap:function () {

        // The MapActionsControl (in the OpenLayers map tools) needs this.
        this.appConfig.mapPanel = this;

        this.mapOptions = new Portal.ui.openlayers.MapOptions(this.appConfig, this);
        this.map = this.mapOptions.newMap();
    },

    getServer:function (item) {
        return item.server;
    },

    zoomToLayer:function (openLayer) {
        if (openLayer) {

            if (openLayer.zoomOverride) {
                this.map.setCenter(
                    new OpenLayers.LonLat(
                        openLayer.zoomOverride.centreLon,
                        openLayer.zoomOverride.centreLat),
                    openLayer.zoomOverride.openLayersZoomLevel);
            }
            else if (openLayer.hasBoundingBox()) {
                // build openlayer bounding box
            	var bounds = null;
            	if (openLayer.bboxMinY == -180 && openLayer.bboxMaxY == 180 && this.enableDefaultDatelineZoom) {
            		// Geoserver can't represent bounding boxes that cross the date line - so, optionally, use a default
            		var defaultBbox = this.defaultDatelineZoomBbox.split(',');
            		bounds = new OpenLayers.Bounds(parseFloat(defaultBbox[1]),parseFloat(defaultBbox[0]),parseFloat(defaultBbox[3]),parseFloat(defaultBbox[2]));
            	}
                else {
            		bounds = new OpenLayers.Bounds(openLayer.bboxMinX, openLayer.bboxMinY, openLayer.bboxMaxX, openLayer.bboxMaxY);
            	}

            	// ensure converted into this maps projection. convert metres into lat/lon etc
                bounds.transform(new OpenLayers.Projection(openLayer.projection), this.map.getProjectionObject());

                // openlayers wants left, bottom, right, top
                // dont support NCWMS-1.3.0 until issues resolved http://www.resc.rdg.ac.uk/trac/ncWMS/ticket/187
                if (openLayer._is130()) {
                    bounds = new OpenLayers.Bounds.fromArray(bounds.toArray(true));
                }

                if (bounds && bounds.getWidth() > 0 && bounds.getHeight() > 0) {
                    this.zoomTo(bounds);
                }
                // when layer has no bbox volume
                else if (bounds) {
                    this.map.setCenter(
                        bounds.getCenterLonLat(),3);
                }
            }
        }
    },

    zoomTo:function (bounds, closest) {
        if ((Math.abs(bounds.left - bounds.right) < 1) && (Math.abs(bounds.top == bounds.bottom) < 1)) {
            this.map.setCenter(bounds.getCenterLonLat(), 3);
        }
        else {
            this.map.zoomToExtent(bounds, closest);
        }
    },

    getLayerText:function (layerCount) {
        return layerCount === 1 ? "Layer" : "Layers";
    },

    getLayersLoadingText:function (layerCount) {
        return layerCount === 0 ? "" : layerCount.toString();
    },

    buildLayerLoadingString:function (layerCount) {
        return "Loading " + this.getLayersLoadingText(layerCount) + "  " + this.getLayerText(layerCount) + "\u2026";
    },

    getPanelX:function () {
        return this.getPosition()[0];
    },

    getPanelY:function () {
        return this.getPosition()[1];
    }
});

function setExtWmsLayer(url, label, type, layer, sld, options, style) {
    var cql;
    var _label = label;

    // options are comma delimited to include a unique label from a single value such as a dropdown box
    if (options.length > 1) {
        var opts = options.split(",");
        cql = opts[0];

        if (opts.length > 1) {
            _label += " " + opts[1];
        }

        if (_label.length <= 0) {
            cql = '';
        }
    }

    Ext.MsgBus.publish('addLayerUsingDescriptor', new Portal.common.LayerDescriptor({
        server:{
            uri:url,
            type:type,
            opacity:100,
            infoFormat:"text/html"
        },
        queryable:true,
        // style in .ftl's but should be styles
        defaultStyle:style,
        name:layer,
        title:_label,
        cql:cql
    }));
}
