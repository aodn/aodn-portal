/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.data.Server', function() {
    describe('getInfo', function() {
        var server1Info;

        beforeEach(function() {
            Ext4.namespace('Portal.app.appConfig');

            server1Info = {
                uri: 'http://server1',
                type: 'GeoServer'
            };
            server2Info = {
                uri: 'http://server2',
                type: 'NcWMS'
            };

            Portal.app.appConfig.knownServers = [
                server1Info,
                server2Info
            ];
        });

        it('returns info for known server', function() {
            expect(Portal.data.Server.getInfo('http://server1')).toBe(server1Info);
            expect(Portal.data.Server.getInfo('http://server2')).toBe(server2Info);
        });

        it('returns undefined for unknown server', function() {
            expect(Portal.data.Server.getInfo('http://unknown')).toBe(Portal.data.Server.UNKNOWN);
        });

        it('returns appropriate OpenLayers type', function() {
            expect(Portal.data.Server.getInfo('http://server1').getLayerType()).toBe(OpenLayers.Layer.WMS);
            expect(Portal.data.Server.getInfo('http://server2').getLayerType()).toBe(OpenLayers.Layer.NcWMS);
            expect(Portal.data.Server.getInfo('http://unknown').getLayerType()).toBe(OpenLayers.Layer.WMS);
        });
    });
});
