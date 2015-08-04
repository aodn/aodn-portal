Ext.namespace('Portal.ui.openlayer');

Portal.ui.openlayers.LayerParams = Ext.extend(Object, {

    constructor: function(layerDescriptor, overrides) {

        if (layerDescriptor.namespace != null) {
            layerDescriptor.name = layerDescriptor.namespace + ":" + layerDescriptor.name;
        }

        var defaultParams = {
            layers: layerDescriptor.name,
            transparent: 'TRUE',
            version: layerDescriptor.server.wmsVersion,
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
    }
});
