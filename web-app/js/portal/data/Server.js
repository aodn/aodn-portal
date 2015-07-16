/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data');

Portal.data.Server = {
    UNKNOWN: {
        uri: 'BLOCKED',
        type: 'BLOCKED'
    },

    getInfo: function(uri) {
        var serverInfo = this._getConfig(uri);
        serverInfo.getType = this._getType;

        return serverInfo;
    },

    _getConfig: function(uri) {
        var serverInfo;

        Ext.each(Portal.app.appConfig.knownServers, function(server) {
            if (server.uri == uri) {
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

    _getType: function(serverInfo) {
        if (this.type.toLowerCase() == 'ncwms') {
            return OpenLayers.Layer.NcWMS;
        }

        return OpenLayers.Layer.WMS;
    }
};
