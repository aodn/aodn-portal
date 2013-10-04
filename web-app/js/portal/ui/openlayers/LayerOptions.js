
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
            opacity: this._getServerOpacity(layerDescriptor.server),
            version: this._getWmsVersionString(layerDescriptor.server),
            transitionEffect: 'resize',
            isBaseLayer: layerDescriptor.isBaseLayer,
            buffer: 1,
            gutter: gutterSize,
            projection: new OpenLayers.Projection(layerDescriptor.projection)
        };

        Ext.apply(this, defaultOptions);
        Ext.apply(this, overrides);
    },

    _getServerOpacity: function(server) {
        var opacity = server.opacity ? server.opacity : 100;
        return Math.round((opacity / 100)*10)/10;
    },

    _getWmsVersionString: function(server) {
        // list needs to match Server.groovy
        var versionList = ["1.0.0","1.0.7","1.1.0","1.1.1","1.3.0"];
        for(var i = 0; i < versionList.length; i++){
            if (server.type.indexOf(versionList[i]) != -1) {
                return versionList[i];
            }
        }
        return "undefined";
    }
});
