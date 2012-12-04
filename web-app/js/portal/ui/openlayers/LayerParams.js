
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui.openlayer');

Portal.ui.openlayers.LayerParams = Ext.extend(Object, {
    
    constructor: function(layerDescriptor, overrides) {
       
        if (layerDescriptor.namespace != null) {
            layerDescriptor.name = layerDescriptor.namespace + ":" + layerDescriptor.name;
        }
        
        var defaultStyle = "";
        if (layerDescriptor.defaultStyle != null)
        {
            defaultStyle = this.defaultStyle;
        }

        var defaultParams = {
            layers: layerDescriptor.name,
            transparent: 'TRUE',
            version: this._getWmsVersionString(layerDescriptor.server),
            format: this._getServerImageFormat(layerDescriptor.server),
            CQL_FILTER: layerDescriptor.cql,
            cql: layerDescriptor.cql,
            queryable: layerDescriptor.queryable,
            styles:layerDescriptor.defaultStyle,
            exceptions: 'application/vnd.ogc.se_xml'   // Don't display stack traces on the map!
        };
          
        Ext.apply(this, defaultParams);
        Ext.apply(this, overrides);
    },
    
    _getServerImageFormat: function (server) {
        
        if (server) {
            if (server.imageFormat) {
                return server.imageFormat;
            }
            
            return 'image/png';
        }
        
        return undefined;
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
