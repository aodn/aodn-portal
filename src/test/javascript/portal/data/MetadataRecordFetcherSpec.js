
describe("Portal.data.MetadataRecordFetcher", function() {

    var catalogUrl;
    var fetcher;
    var uuid;

    beforeEach(function() {
        catalogUrl = 'http://geonetwork123';

        Ext.namespace('Portal.app.appConfig.geonetwork');
        Portal.app.appConfig.geonetwork.url = catalogUrl;
        fetcher = new Portal.data.MetadataRecordFetcher({
            dataCollectionStore: {
                add: jasmine.createSpy('add')
            }
        });
        uuid = '1234';

        viewport = {
            setActiveTab: jasmine.createSpy('setActiveTab')
        };
    });

    it('makes ajax request to catalogue', function() {
        spyOn(Ext.Ajax, 'request');

        fetcher.get(uuid);

        expect(Ext.Ajax.request).toHaveBeenCalledWith({
            url: 'proxy?url=http%3A%2F%2Fgeonetwork123%2Fsrv%2Feng%2Fxml.search.summary%3Fuuid%3D1234%26fast%3Dindex',
            headers : { 'Content-Type': 'application/xml' }
        });
    });

    it('calls success listener on success', function() {
        spyOn(Ext.Ajax, 'request').andCallFake(
            function(params) {
                params.success.call();
            }
        );
        var successCallback = jasmine.createSpy('onSuccess');
        fetcher.get(uuid, successCallback);
        expect(successCallback).toHaveBeenCalled();
    });

    describe('load data collection', function() {
        var dataCollectionRecord = {};

        beforeEach(function() {
            var response = {
                responseXML: '<some_xml></some_xml>'
            };
            spyOn(Portal.data.MetadataRecordStore.prototype, 'loadData');
            spyOn(Portal.data.DataCollection, 'fromMetadataRecord').andReturn(dataCollectionRecord);
            spyOn(Ext.Ajax, 'request').andCallFake(
                function(params) {
                    params.success.call(fetcher, response);
                }
            );
        });

        it('record into DataCollectionStore', function() {
            spyOn(Portal.data.MetadataRecordStore.prototype, 'getAt').andReturn({});
            var params = {};

            fetcher.load(uuid, params);
            expect(Portal.data.MetadataRecordStore.prototype.getAt).toHaveBeenCalled();
            expect(fetcher.dataCollectionStore.add).toHaveBeenCalledWith(dataCollectionRecord);
        });

        it('with error', function() {
            spyOn(Portal.data.MetadataRecordStore.prototype, 'getAt').andReturn(undefined);
            spyOn(fetcher, '_errorLoadingDataCollection');

            fetcher.load(uuid);
            expect(Portal.data.MetadataRecordStore.prototype.getAt).toHaveBeenCalled();
            expect(Portal.data.DataCollection.fromMetadataRecord).not.toHaveBeenCalled();
            expect(fetcher._errorLoadingDataCollection).toHaveBeenCalledWith(uuid);
        });
    });

    describe('getParamsFromUrl', function() {

        var baseUrl = 'http://imos.aodn.org.au/portal/';
        var testCases = [
            [baseUrl + '', {}],
            [baseUrl + '?', {}],
            [baseUrl + '?val=something', { val : 'something' }],
            [baseUrl + '?uuid=uuid1', { uuid : 'uuid1' }],
            [baseUrl + '?uuid=uuid1&val=something#', { uuid : 'uuid1', val : 'something#' }],
            [baseUrl + '?uuid=uuid1&info=true&uuid=uuid2', { uuid : [ 'uuid1', 'uuid2' ], info : 'true' }]
        ];

        it('returns correct values for various inputs', function() {

            Ext.each(testCases, function(testValues) {
                var testUrl = testValues[0];
                var expectedOutput = testValues[1];
                fetcher._getUrl = returns(testUrl);

                var actualOutput = fetcher.getParamsFromUrl();

                expect(actualOutput).toEqual(expectedOutput);
            });
        });
    });
});
