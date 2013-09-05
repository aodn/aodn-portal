
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

Portal.search.CloneMapPanel = Ext.extend(Portal.common.MapPanel, {

    constructor: function(cfg) {
        this.initMap(cfg.mapConfig);

        var config = Ext.apply({
            height: 400,
            width: 600,
            initialBbox: cfg.initialBbox
        }, cfg);

        Portal.search.CloneMapPanel.superclass.constructor.call(this, config);

        this.bind(cfg.mainMap);

        this.registerExtentChangeEvents();
    },

    initMap: function(mapConfig) {

        var config = Ext.apply({
            controls: [
                new OpenLayers.Control.Navigation(),
                new OpenLayers.Control.PanZoomBar()
            ],
            restrictedExtent: new OpenLayers.Bounds.fromArray([null, -90, null, 90]),
            displayProjection: new OpenLayers.Projection("EPSG:4326"),
            resolutions: [  0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 0.0006866455078125, 0.00034332275390625,  0.000171661376953125]
        }, mapConfig);

        this.map = new OpenLayers.Map(config);
    },

    // Synchronise with main map layer and extent changes

    bind: function(mainMap) {
        if (!mainMap) return;

        this.mainMap = mainMap;

        mainMap.map.events.register('addlayer', this, this.mainMapLayerAdded);
        mainMap.map.events.register('removelayer', this, this.mainMapLayerRemoved);
        mainMap.map.events.register('changelayer', this, this.mainMapLayerChanged);
        mainMap.map.events.register('zoomend', this, this.mainMapExtentChange);
        mainMap.map.events.register('moveend', this, this.mainMapExtentChange);
    },

    mainMapLayerAdded: function(e) {

        var miniMapClone = e.layer.clone();

        // delete attibutes that cause problems in minimap
        delete miniMapClone.id;
        delete miniMapClone.map;
        delete miniMapClone.tile;
        delete miniMapClone.scales;
        delete miniMapClone.resolutions;
        delete miniMapClone.numLoadingTiles;

        miniMapClone.sourceLayer = e.layer;
        this.map.addLayer(miniMapClone);
        this.applyMainMapLayerOrdering();
    },

    mainMapLayerRemoved: function(e) {

        if (this.map.layers) {

            var miniMapClone = this.map.getLayersBy('sourceLayer', e.layer)[0]; // Should only be one match

            if (miniMapClone) {
                this.map.removeLayer(miniMapClone);
            }
        }
    },

    mainMapLayerChanged: function(e) {

        var miniMapClone = this.map.getLayersBy('sourceLayer', e.layer)[0];

        // When adding baselayers some property change events come before the addlayer event
        // ignore them - properties will be set correctly when the layer is actually added
        if (!miniMapClone) return;

        this.applyLayerChange(miniMapClone, e.layer, e.property);
    },

    applyLayerChange: function(target, source, property) {
        if (property == 'name') {
            target.setName(source.name);
        } else if (property == 'order') {
            this.applyMainMapLayerOrdering();
        } else if (property == 'opacity') {
            target.setOpacity(source.opacity);
        } else if (property == 'params') {
            target.mergeNewParams(source.params);
        } else if (property == 'visibility') {
            this.setLayerVisibility(target, source.getVisibility());
        }
    },

    setLayerVisibility: function(layer, visibility) {
        if (layer.isBaseLayer) {
            if (visibility) this.map.setBaseLayer(layer);
        } else {
            layer.setVisibility(visibility);
        }
    },

    applyMainMapLayerOrdering: function() {
        var nonMainMapLayerCount = this.countNonMainMapLayers();

        for (var mainMapLayerIndex=0; mainMapLayerIndex<this.mainMap.map.layers.length; mainMapLayerIndex++) {
            var mainLayer = this.mainMap.map.layers[mainMapLayerIndex];
            var miniMapClone = this.map.getLayersBy('sourceLayer', mainLayer)[0];
            // main map layers come after mini map layers (i.e. bbox is displayed on top of main map layers)
            this.map.setLayerIndex(miniMapClone, nonMainMapLayerCount + mainMapLayerIndex);
        }
    },

    countNonMainMapLayers: function() {
        var nonMainMapLayerCount = 0;
        var miniMapLayers = this.map.layers;

        for (var i=0; i<miniMapLayers.length; i++) {
            if (miniMapLayers[i] == undefined) {
                nonMainMapLayerCount++;
            }
        }

        return nonMainMapLayerCount;
    },

    mainMapExtentChange: function() {
        var mainMapExtent = this.mainMap.map.getExtent();

        if (!this._miniMapExtentChange) {
            this._mainMapExtentChange = true;
            this.setExtent(mainMapExtent);
            delete this._mainMapExtentChange;
        }
    },

    registerExtentChangeEvents: function() {
        this.addEvents('extentchange');

        this.map.events.register('zoomend', this, this.extentChange);
        this.map.events.register('moveend', this, this.extentChange);
    },

    extentChange: function() {
        var bounds = this.map.getExtent();

        if (this.mainMap && this.initialExtentSet && !this._mainMapExtentChange) {
            this._miniMapExtentChange = true;
            this.mainMap.setExtent(bounds);
            delete this._miniMapExtentChange;
        }

        this.fireEvent('extentchange', {northBL: bounds.top, westBL: bounds.left, eastBL: bounds.right, southBL: bounds.bottom});
    },

    setBounds: function(bounds) {
        var olBounds = new OpenLayers.Bounds(bounds.westBL, bounds.southBL, bounds.eastBL, bounds.northBL);
        this.map.zoomToExtent(olBounds, false);
    }
});

Ext.reg('portal.search.clonemappanel', Portal.search.CloneMapPanel);
