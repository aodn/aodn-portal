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

    stripProtocol: function(uri) {
        return uri.replace(/^https?:\/\//,'');
    },

    _getConfig: function(uri) {
        var serverInfo;
        var thisUri = this.stripProtocol(uri);
        var that = this;

        Ext.each(Portal.app.appConfig.knownServers, function(server) {

            var currentKnownHost = that.stripProtocol(server.uri);

            if (thisUri.indexOf(currentKnownHost) != -1) {
                if (serverInfo != undefined) {
                    log.error("More than one knownServer matching:" + uri + ". Using first match. Ignoring: " + server.uri);
                }
                else {
                    serverInfo = server;
                }
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
        if (this.type.toLowerCase() == 'ala') {
            return OpenLayers.Layer.AlaWMS;
        }

        return OpenLayers.Layer.WMS;
    }
};
