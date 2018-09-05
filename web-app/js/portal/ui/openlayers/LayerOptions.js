Ext.namespace('Portal.ui.openlayer');

Portal.ui.openlayers.LayerOptions = Ext.extend(Object, {

    constructor: function(layerDescriptor, overrides) {

        var gutterSize = 0;

        if (layerDescriptor.isBaseLayer) {
            gutterSize = 0;
        }

        var defaultOptions = {
            wrapDateLine: true,
            opacity: 1.0,
            version: layerDescriptor.server.wmsVersion,
            transitionEffect: 'resize',
            isBaseLayer: layerDescriptor.isBaseLayer,
            isDataLayer: layerDescriptor.isDataLayer,
            buffer: 1,
            gutter: gutterSize,
            projection: new OpenLayers.Projection(layerDescriptor.projection),
            displayInLayerSwitcher: (layerDescriptor.isBaseLayer === true || layerDescriptor.displayInLayerSwitcher === true),
            visibility: (layerDescriptor.visibility === false) ? false : true
        };

        Ext.apply(this, defaultOptions);
        Ext.apply(this, overrides);
    }
});
