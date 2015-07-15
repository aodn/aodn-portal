/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data');

Portal.data.Server = {
    getInfo: function(uri) {
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

        return serverInfo;
    }
};
