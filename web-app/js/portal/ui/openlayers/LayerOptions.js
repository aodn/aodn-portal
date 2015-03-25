
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui.openlayer');

Portal.ui.openlayers.LayerOptions = Ext.extend(Object, {

    constructor: function(layerDescriptor, overrides) {

        var gutterSize = 20;

        if (layerDescriptor.isBaseLayer) {
            gutterSize = 0;
        }

        var defaultOptions = {
            wrapDateLine: true,
            opacity: 1.0,
            version: layerDescriptor.server.wmsVersion,
            transitionEffect: 'resize',
            isBaseLayer: layerDescriptor.isBaseLayer,
            buffer: 1,
            gutter: gutterSize,
            projection: new OpenLayers.Projection(layerDescriptor.projection)
        };

        Ext.apply(this, defaultOptions);
        Ext.apply(this, overrides);
    }
});
