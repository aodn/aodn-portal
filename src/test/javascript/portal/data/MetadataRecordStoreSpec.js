
describe("Portal.data.MetadataRecordStore", function() {

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
        var metadataRecordStore;

        beforeEach(function() {
            Portal.app.appConfig = {
                portal: {
                    metadataProtocols: {
                        dataFile: [ 'downloadable', 'some other downloadable protocol'],
                        supplementary: [ 'extrdownloadable', 'some other downloadable thing'],
                        metadataRecord: [ 'metadata', 'the metadata link']
                    }
                }
            };

            metadataRecordStore = new Portal.data.MetadataRecordStore();
            metadataRecordStore.loadData(doc);
        });

        it('title', function() {
            expect(metadataRecordStore.getAt(0).get('title')).toEqual('ANFOG');
        });

        it('abstract', function() {
            expect(metadataRecordStore.getAt(0).get('abstract')).toEqual('This is about ANFOGs, man');
        });

        it('uuid', function() {
            expect(metadataRecordStore.getAt(0).get('uuid')).toEqual('123456789');
        });

        describe('links', function() {
            describe('first link', function() {
                it('name', function() {
                    expect(metadataRecordStore.getAt(0).get('links')[0].name).toEqual('');
                });

                it('title', function() {
                    expect(metadataRecordStore.getAt(0).get('links')[0].title).toEqual('Point of truth URL of this metadata record');
                });

                it('href', function() {
                    expect(metadataRecordStore.getAt(0).get('links')[0].href).toEqual('http://imosmest/metadata?uuid=1a69252d');
                });

                it('protocol', function() {
                    expect(metadataRecordStore.getAt(0).get('links')[0].protocol).toEqual('WWW:LINK-1.0-http--metadata-URL');
                });

                it('type', function() {
                    expect(metadataRecordStore.getAt(0).get('links')[0].type).toEqual('text/html');
                });
            });

            describe('second link', function() {
                it('name', function() {
                    expect(metadataRecordStore.getAt(0).get('links')[1].name).toEqual('imos:radar_stations');
                });
            });
        });

        describe('bbox', function() {
            it('west', function() {
                expect(metadataRecordStore.getAt(0).get('bbox').getBounds().left).toBe(-80);
            });

            it('south', function() {
                expect(metadataRecordStore.getAt(0).get('bbox').getBounds().bottom).toBe(-44);
            });

            it('east', function() {
                expect(metadataRecordStore.getAt(0).get('bbox').getBounds().right).toBe(154);
            });

            it('north', function() {
                expect(metadataRecordStore.getAt(0).get('bbox').getBounds().top).toBe(-9);
            });
        });

        describe('downloadable links', function() {
            it('field exists', function() {
                expect(metadataRecordStore.getAt(0).get('linkedFiles')).toBeTruthy();
            });

            it('contains only downloadable links', function() {
                var linkedFiles = metadataRecordStore.getAt(0).get('linkedFiles');
                expect(linkedFiles.length).toBe(1);
                expect(linkedFiles[0].title).toBe('ACORN Radar Stations csv');
            });
        });
    });
});
