/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.MapPanel = Ext.extend(Portal.common.MapPanel, {
    loadSpinner: null,

    defaultSpatialConstraintType: OpenLayers.i18n('comboBoxTypeLabels')[0].value,

    constructor: function (cfg) {

        this.appConfig = Portal.app.appConfig;
        var portalConfig = this.appConfig.portal;

        var config = Ext.apply({
            stateful: false,
            forceLayout: true,   // Makes the map appear (almost) instantly when user clicks the 'map' button.
            split: true,
            header: false,
            initialBbox: portalConfig.initialBbox,
            autoZoom: portalConfig.autoZoom,
            enableDefaultDatelineZoom: portalConfig.enableDefaultDatelineZoom,
            defaultDatelineZoomBbox: portalConfig.defaultDatelineZoomBbox,
            hideLayerOptions: this.appConfig.hideLayerOptions
        }, cfg);

        Portal.ui.MapPanel.superclass.constructor.call(this, config);

        this.initMap();

        this.on('afterlayout', function () {
            jQuery("div.olControlMousePosition,div.olControlScaleLine *").mouseover(function () {
                jQuery("div.olControlMousePosition,div.olControlScaleLine *").addClass('allwhite');
            });
            jQuery("div.olControlMousePosition,div.olControlScaleLine *").mouseout(function () {
                jQuery("div.olControlMousePosition,div.olControlScaleLine *").removeClass('allwhite');
            });
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
            this._closeFeatureInfoPopup();
        }, this);
    },

    _maximiseMapActionsControl: function() {
        if (this.mapOptions.mapActionsControl) {
            this.mapOptions.mapActionsControl.maximizeControl();
        }
    },

    onSelectedLayerChanged: function (openLayer) {
        if (!openLayer) {
            this.map.resetSpatialConstraint();
        }
        this._autoZoomToLayer(openLayer);
    },

    onBaseLayerChanged: function(openLayer) {
        this.map.setBaseLayer(openLayer);
    },

    afterRender: function () {
        Portal.ui.MapPanel.superclass.afterRender.call(this);
        this.mapOptions.afterRender(this);
    },

    autoZoomCheckboxHandler: function (box, checked) {
        Portal.app.appConfig.portal.autoZoom = checked;
        this.autoZoom = checked;
    },

    reset: function () {
        this._closeFeatureInfoPopup();
        this.map.resetSpatialConstraint();
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

    renderMap: function() {
        if (this.layers.getBaseLayers().getCount() > 0) {
            Portal.common.MapPanel.superclass.renderMap.call(this);
        }
        else {
            var mapPanel = this;
            Ext.MsgBus.subscribe(PORTAL_EVENTS.BASE_LAYER_LOADED_FROM_SERVER, function() {
                Ext.MsgBus.unsubscribe(PORTAL_EVENTS.BASE_LAYER_LOADED_FROM_SERVER);
                Portal.common.MapPanel.superclass.renderMap.call(mapPanel);
            });
        }
    },

    initMap: function () {

        // The MapActionsControl (in the OpenLayers map tools) needs this.
        this.appConfig.mapPanel = this;

        this.mapOptions = new Portal.ui.openlayers.MapOptions(this.appConfig, this);
        this.map = this.mapOptions.newMap();
        this.map.setDefaultSpatialConstraintType(this.defaultSpatialConstraintType);
    },

    getServer: function (item) {
        return item.server;
    },

    _autoZoomToLayer: function(openLayer) {
        if (this.autoZoom === true) {
            this.zoomToLayer(openLayer);
        }
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
                    bounds = new OpenLayers.Bounds(parseFloat(defaultBbox[1]), parseFloat(defaultBbox[0]), parseFloat(defaultBbox[3]), parseFloat(defaultBbox[2]));
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
                    this.map.setCenter(bounds.getCenterLonLat(), 3);
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

    getPanelX: function () {
        return this.getPosition()[0];
    },

    getPanelY: function () {
        return this.getPosition()[1];
    },

    beforeParentHide: function() {

        this._closeFeatureInfoPopup();
    }
});
