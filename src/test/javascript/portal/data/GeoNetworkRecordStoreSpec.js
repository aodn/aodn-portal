/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.data.GeoNetworkRecordStore", function() {

    describe('load XML in to store', function() {

        var recordsAsXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> \
<dataset> \
  <summary count='1' /> \
  <metadata> \
    <popularity>206</popularity> \
    <source>987654321</source> \
    <link>|Point of truth URL of this metadata record|http://imosmest/metadata?uuid=1a69252d|WWW:LINK-1.0-http--metadata-URL|text/html</link> \
    <link>imos:radar_stations|ACORN Radar Stations|http://geoserver.imos.org.au/geoserver/wms|OGC:WMS-1.1.1-http-get-map|application/vnd.ogc.wms_xml</link> \
    <link>imos:radar_stations|ACORN Radar Stations csv|http://geoserver/stations.csv|downloadable|text/csv</link> \
    <link>imos:radar_stations|OGC WFS service|http://geoserver/ows|OGC:WFS-1.0.0-http-get-capabilities|OGC:WFS-1.0.0-http-get-capabilities</link> \
    <title>ANFOG</title> \
    <abstract>This is about ANFOGs, man</abstract> \
    <geoBox>112|-44|154|-9</geoBox> \
    <geoPolygon>POLYGON((-80 -38,-80 -36,-78 -36,-78 -38,-80 -38))</geoPolygon> \
    <geonet:info xmlns:geonet=\"http://www.fao.org/geonetwork\"> \
      <uuid>123456789</uuid> \
    </geonet:info> \
  </metadata> \
</dataset> \
";

        var doc = new DOMParser().parseFromString(recordsAsXml, 'text/xml');
        var geoNetworkRecordStore;

        beforeEach(function() {
            Portal.app.appConfig = {
                portal: {
                    downloadCartDownloadableProtocols: [ 'downloadable', 'some other downloadable protocol']
                }
            };

            geoNetworkRecordStore = new Portal.data.GeoNetworkRecordStore();
            geoNetworkRecordStore.loadData(doc);
        });

        it('title', function() {
            expect(geoNetworkRecordStore.getAt(0).get('title')).toEqual('ANFOG');
        });

        it('abstract', function() {
            expect(geoNetworkRecordStore.getAt(0).get('abstract')).toEqual('This is about ANFOGs, man');
        });

        it('uuid', function() {
            expect(geoNetworkRecordStore.getAt(0).get('uuid')).toEqual('123456789');
        });

        describe('links', function() {
            describe('first link', function() {
                it('name', function() {
                    expect(geoNetworkRecordStore.getAt(0).get('links')[0].name).toEqual('');
                });

                it('title', function() {
                    expect(geoNetworkRecordStore.getAt(0).get('links')[0].title).toEqual('Point of truth URL of this metadata record');
                });

                it('href', function() {
                    expect(geoNetworkRecordStore.getAt(0).get('links')[0].href).toEqual('http://imosmest/metadata?uuid=1a69252d');
                });

                it('protocol', function() {
                    expect(geoNetworkRecordStore.getAt(0).get('links')[0].protocol).toEqual('WWW:LINK-1.0-http--metadata-URL');
                });

                it('type', function() {
                    expect(geoNetworkRecordStore.getAt(0).get('links')[0].type).toEqual('text/html');
                });
            });

            describe('second link', function() {
                it('name', function() {
                    expect(geoNetworkRecordStore.getAt(0).get('links')[1].name).toEqual('imos:radar_stations');
                });
            });
        });

        it('source', function() {
            expect(geoNetworkRecordStore.getAt(0).get('source')).toEqual('987654321');
        });

        describe('bbox', function() {
            it('west', function() {
                expect(geoNetworkRecordStore.getAt(0).get('bbox').getBounds().left).toBe(-80);
            });

            it('south', function() {
                expect(geoNetworkRecordStore.getAt(0).get('bbox').getBounds().bottom).toBe(-44);
            });

            it('east', function() {
                expect(geoNetworkRecordStore.getAt(0).get('bbox').getBounds().right).toBe(154);
            });

            it('north', function() {
                expect(geoNetworkRecordStore.getAt(0).get('bbox').getBounds().top).toBe(-9);
            });
        });

        describe('downloadable links', function() {
            it('field exists', function() {
                expect(geoNetworkRecordStore.getAt(0).get('linkedFiles')).toBeTruthy();
            });

            it('contains only downloadable links', function() {
                var linkedFiles = geoNetworkRecordStore.getAt(0).get('linkedFiles');
                expect(linkedFiles.length).toBe(1);
                expect(linkedFiles[0].title).toBe('ACORN Radar Stations csv');
            });
        });

        describe('download handlers', function() {
            it('python download handler', function() {

                spyOn(Portal.cart.PythonDownloadHandler.prototype, 'getDownloadOptions');


                geoNetworkRecordStore = new Portal.data.GeoNetworkRecordStore();
                geoNetworkRecordStore.loadData(doc);

                var downloadHandlers = geoNetworkRecordStore.getAt(0).get('dataDownloadHandlers');

                // This is a bit of an indirect way of checking the download handler type,
                // since it doesn't seem possible to do it directly.
                Ext.each(downloadHandlers, function(downloadHandler) {
                    downloadHandler.getDownloadOptions();
                });

                expect(Portal.cart.PythonDownloadHandler.prototype.getDownloadOptions).toHaveBeenCalled();
            });
        });

        it('returns UUIDs array', function() {
            expect(geoNetworkRecordStore.getUuids()).toEqual(['123456789']);

        });

    });
});
