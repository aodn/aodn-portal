

Ext.namespace('Portal.data');

Portal.data.Server = {
    UNKNOWN: {
        uri: 'BLOCKED',
        type: 'BLOCKED'
    },

    getInfo: function(uri) {
        var serverInfo = this._getConfig(uri);
        serverInfo.getLayerType = this._getLayerType;

        return serverInfo;
    },

    _getConfig: function(uri) {
        var serverInfo;

        Ext.each(Portal.app.appConfig.knownServers, function(server) {
            if (uri.startsWith(server.uri)) {
                serverInfo = server;
                return false;
            }
            else {
                return true;
            }
        });

        if (!serverInfo) {
            serverInfo = this.UNKNOWN;
        }

        return serverInfo;
    },

    _getLayerType: function() {
        if (this.type.toLowerCase() == 'ncwms') {
            return OpenLayers.Layer.NcWms;
        }

        return OpenLayers.Layer.WMS;
    }
};
