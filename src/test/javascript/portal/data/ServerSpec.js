describe('Portal.data.Server', function() {
    describe('getInfo', function() {
        var server1Info;
        var server2Info;
        var server3Info;
        var server4Info;

        beforeEach(function() {
            Ext.namespace('Portal.app.appConfig');

            server1Info = {
                uri: 'http://server1',
                type: 'GeoServer'
            };
            server2Info = {
                uri: 'http://server2',
                type: 'ncWMS'
            };
            server3Info = {
                uri: 'https://maybesecureserver3',
                type: 'GeoServer'
            };

            server4Info = {
                uri: 'http://server2/like/server2Info',
                type: 'ncWMS'
            };

            Portal.app.appConfig.knownServers = [
                server4Info,
                server1Info,
                server2Info,
                server3Info
            ];
        });

        it('returns info for known server', function() {
            expect(Portal.data.Server.getInfo('http://server1')).toBe(server1Info);
            expect(Portal.data.Server.getInfo('http://server2/someExtraPath')).toBe(server2Info);
        });

        it('not blocked by protocol ', function() {
            expect(Portal.data.Server.getInfo('http://maybesecureserver3')).not.toBe(Portal.data.Server.UNKNOWN);
        });

        it('unknown is UNKNOWN. (No JS errors)', function() {
            expect(Portal.data.Server.getInfo('http://rogueServer')).toBe(Portal.data.Server.UNKNOWN);
        });

        it('returns appropriate OpenLayers type', function() {
            expect(Portal.data.Server.getInfo('http://server1').getLayerType()).toBe(OpenLayers.Layer.WMS);
            expect(Portal.data.Server.getInfo('http://server2').getLayerType()).toBe(OpenLayers.Layer.NcWms);
            expect(Portal.data.Server.getInfo('http://unknown').getLayerType()).toBe(OpenLayers.Layer.WMS);
        });
    });
});
