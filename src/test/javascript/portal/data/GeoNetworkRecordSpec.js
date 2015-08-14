/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe('Portal.data.GeoNetworkRecord', function() {

    var record;

    beforeEach(function() {
        record = new Portal.data.GeoNetworkRecord({
            abstract: 'the abstract',
            links: [
                {
                    href: 'http://geoserver.imos.org.au/geoserver/wms',
                    name: 'imos:radar_stations',
                    protocol: 'OGC:WMS-1.1.1-http-get-map',
                    title: 'ACORN Radar Stations',
                    type: 'application/vnd.ogc.wms_xml'
                },
                {
                    href: 'http://geonetwork.imos.org.au/1234',
                    name: 'imos:radar_stations',
                    protocol: 'WWW:LINK-1.0-http--metadata-URL',
                    title: 'ACORN Radar Stations',
                    type: 'text/html'
                }
            ],
            title: 'the layer title',
            wmsLayer: {
                server: {
                    uri: "server_url"
                },
                params: {
                    LAYERS: 'layer name',
                    CQL_FILTER: 'cql_filter'
                },
                someUnusedField: 'la la la'
            }
        });
    });

    describe('wms link', function() {

        it('has wms link', function() {
            record.get('links')[0].protocol = 'OGC:WMS-1.1.1-http-get-map';
            expect(record.hasWmsLink()).toBeTruthy();
        });

        it('does not have wms link', function() {
            record.get('links')[0].protocol = 'some protocol';
            expect(record.hasWmsLink()).toBeFalsy();
        });

        it('does not have any links', function() {
            record.set('links', undefined);
            expect(record.hasWmsLink()).toBeFalsy();
        });

        it('get first wms link', function() {
            record.get('links')[0].protocol = 'OGC:WMS-1.1.1-http-get-map';
            var link = record.getFirstWmsLink();
            expect(link.server.uri).toBe('http://geoserver.imos.org.au/geoserver/wms');
            expect(link.protocol).toBe('OGC:WMS-1.1.1-http-get-map');
        });
    });
});
