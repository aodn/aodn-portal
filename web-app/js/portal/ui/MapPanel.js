/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.MapPanel = Ext.extend(Portal.common.MapPanel, {
    loadSpinner: null,

    constructor: function (cfg) {

        this.appConfig = Portal.app.config;

        var config = Ext.apply({
            id: 'mapPanel',
            stateful: false,
            forceLayout: true,   // Makes the map appear (almost) instantly when user clicks the 'map' button.
            split: true,
            header: false,
            initialBbox: this.appConfig.initialBbox,
            autoZoom: this.appConfig.autoZoom,
            enableDefaultDatelineZoom:  this.appConfig.enableDefaultDatelineZoom,
            defaultDatelineZoomBbox:  this.appConfig.defaultDatelineZoomBbox,
            hideLayerOptions: this.appConfig.hideLayerOptions
        }, cfg);

        Portal.ui.MapPanel.superclass.constructor.call(this, config);

        this.initMap();

        this.addEvents('tabchange', 'mouseover');

        this.on('afterlayout', function () {
            jQuery("div.olControlMousePosition,div.olControlScaleLine *").mouseover(function () {
                jQuery("div.olControlMousePosition,div.olControlScaleLine *").addClass('allwhite');
            });
            jQuery("div.olControlMousePosition,div.olControlScaleLine *").mouseout(function () {
                jQuery("div.olControlMousePosition,div.olControlScaleLine *").removeClass('allwhite');
            });
        }, this);

        this.on('tabchange', function () {
            this._closeFeatureInfoPopup();
        }, this);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.BEFORE_SELECTED_LAYER_CHANGED, function(subject, openlayer) {
            this._onBeforeSelectedLayerChanged(openlayer);
        }, this);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, function (subject, message) {
            this.onSelectedLayerChanged(message);
        }, this);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.BASE_LAYER_CHANGED, function(subject, message) {
            this.onBaseLayerChanged(message);
        }, this);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.ACTIVE_GEONETWORK_RECORD_ADDED, function() {
            this._maximiseMapActionsControl();
        }, this);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.RESET, function () {
            this.reset();
        }, this);

        Ext.MsgBus.subscribe('removeAllLayers', function () {
            this._closeFeatureInfoPopup();
        }, this);

        Ext.MsgBus.subscribe(
            Portal.form.PolygonTypeComboBox.prototype.VALUE_CHANGED_EVENT,
            function(type, event) {
                this._setSpatialConstraintStyle(event.value)
            },
            this
        );
    },

    _maximiseMapActionsControl: function() {
        if (this.mapOptions.mapActionsControl) {
            this.mapOptions.mapActionsControl.maximizeControl();
        }
    },

    _onBeforeSelectedLayerChanged: function(openLayer) {

    },

    onSelectedLayerChanged: function (openLayer) {

        if (this.autoZoom === true) {
            this.zoomToLayer(openLayer);
        }
    },

    onBaseLayerChanged: function(openLayer) {
        this.map.setBaseLayer(openLayer);
    },

    afterRender: function () {
        Portal.ui.MapPanel.superclass.afterRender.call(this);
        this.mapOptions.afterRender(this);
        this.loadSpinner = new Portal.common.LoadMask(this.el);
    },

    autoZoomCheckboxHandler: function (box, checked) {
        Portal.app.config.autoZoom = checked;
        this.autoZoom = checked;
    },

    reset: function () {
        this._closeFeatureInfoPopup();
        this.zoomToInitialBbox();
    },

    handleFeatureInfoClick: function (event) {
        this._closeFeatureInfoPopup();
        this._findFeatureInfo(event);
    },

    _closeFeatureInfoPopup: function () {
        try {
            if (this.featureInfoPopup) {
                this.featureInfoPopup.close();
            }
        }
        catch (e) {
            /**
             * Explicitly ignoring exception
             *
             * https://github.com/aodn/aodn-portal/issues/175
             *
             * This appears to have existed forever in IE, it basically comes down to Shadow.realign in Ext where the
             * height value is determined as -1 which is invalid. At no point do we set the height to -1 so I assume that
             * IE does this when the FeatureInfoPopup is hidden from view or something else crazy. I _hope_ that the popup
             * is still destroyed effectively, it all seems to still work. I'm happy for someone else to find a better
             * solution, I take no pride in this fix whatsoever.
             */
        }
    },

    _findFeatureInfo: function (event) {
        this.featureInfoPopup = new Portal.ui.FeatureInfoPopup({
            map: this.map,
            appConfig: this.appConfig,
            maximisedPosition: { x: this.getPanelX(), y: this.getPanelY() }
        });
        this.featureInfoPopup.findFeatures(event);
    },

    initMap: function () {

        // The MapActionsControl (in the OpenLayers map tools) needs this.
        this.appConfig.mapPanel = this;

        this.mapOptions = new Portal.ui.openlayers.MapOptions(this.appConfig, this);
        this.map = this.mapOptions.newMap();
    },

    getServer: function (item) {
        return item.server;
    },

    zoomToLayer: function (openLayer) {
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
                else if (bounds) {
                    // when layer has no bbox volume
                    this.map.setCenter(
                        bounds.getCenterLonLat(),3);
                }
            }
        }
    },

    zoomTo: function (bounds, closest) {
        if ((Math.abs(bounds.left - bounds.right) < 1) && (Math.abs(bounds.top == bounds.bottom) < 1)) {
            this.map.setCenter(bounds.getCenterLonLat(), 3);
        }
        else {
            this.map.zoomToExtent(bounds, closest);
        }
    },

    getLayerText: function (layerCount) {
        return layerCount === 1 ? "Collection" : "Collections";
    },

    getLayersLoadingText: function (layerCount) {
        return layerCount === 0 ? "" : layerCount.toString();
    },

    buildLayerLoadingString: function (layerCount) {
        return "Loading " + this.getLayersLoadingText(layerCount) + "  " + this.getLayerText(layerCount) + "\u2026";
    },

    getPanelX: function () {
        return this.getPosition()[0];
    },

    getPanelY: function () {
        return this.getPosition()[1];
    },

    beforeParentHide: function() {

        this._closeFeatureInfoPopup();
    },

    _setSpatialConstraintStyle: function(polygonStyle) {

        this.map.navigationControl.deactivate();
        if (this.map.spatialConstraintControl) {
            this.map.spatialConstraintControl.removeFromMap();
        }

        if (polygonStyle == Portal.form.PolygonTypeComboBox.prototype.NONE.style) {
            this.map.spatialConstraintControl = undefined;
            this.map.navigationControl.activate();
        }
        else if (polygonStyle == Portal.form.PolygonTypeComboBox.prototype.POLYGON.style) {
            this.map.spatialConstraintControl = new Portal.ui.openlayers.control.SpatialConstraint({
                initialConstraint: Portal.utils.geo.bboxAsStringToGeometry(Portal.app.config.initialBbox),
                handler: OpenLayers.Handler.Polygon
            });
            this.map.addControl(this.map.spatialConstraintControl);
        }
        else if (polygonStyle == Portal.form.PolygonTypeComboBox.prototype.BOUNDING_BOX.style) {
            this.map.spatialConstraintControl = new Portal.ui.openlayers.control.SpatialConstraint({
                initialConstraint: Portal.utils.geo.bboxAsStringToGeometry(Portal.app.config.initialBbox)
            });
            this.map.addControl(this.map.spatialConstraintControl);
        }
    }
});
