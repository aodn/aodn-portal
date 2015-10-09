
OpenLayers.Layer.MiniMapBaseLayer = OpenLayers.Class(OpenLayers.Layer.WMS, {
    initialize: function() {
        OpenLayers.Layer.WMS.prototype.initialize.apply(this, [
            Portal.app.appConfig.minimap.baselayer.name,
            Portal.app.appConfig.minimap.baselayer.url,
            { layers: Portal.app.appConfig.minimap.baselayer.params.layers },
            { wrapDateLine: true }
        ]);
    }
});
