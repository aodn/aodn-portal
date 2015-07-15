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
            Ext.namespace('Portal.app.appConfig');

            server1Info = {
                uri: 'http://server1'
            };

            Portal.app.appConfig.knownServers = [
                server1Info,
                {
                    uri: 'http://server2'
                }
            ];
        });

        it('returns info for known server', function() {
            expect(Portal.data.Server.getInfo('http://server1')).toBe(server1Info);
        });

        it('returns undefined for unknown server', function() {
            expect(Portal.data.Server.getInfo('http://xyz')).toBe(undefined);
        });
    });
});
