/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.data.GeoNetworkRecordFetcher", function() {

    var catalogUrl;
    var fetcher;
    var uuid;

    beforeEach(function() {
        catalogUrl = 'http://geonetwork123';

        Ext.namespace('Portal.app.appConfig.geonetwork');
        Portal.app.appConfig.geonetwork.url = catalogUrl;
        fetcher = new Portal.data.GeoNetworkRecordFetcher();
        uuid = '1234';
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
        successCallback = jasmine.createSpy('onSuccess');
        fetcher.get(uuid, successCallback);
        expect(successCallback).toHaveBeenCalled();
    });

    it('loads retrieved record in to ActiveGeoNetworkRecordStore', function() {
        var response = {
            responseXML: '<some_xml></some_xml>'
        };
        var record = {};
        spyOn(Portal.data.GeoNetworkRecordStore.prototype, 'loadData');
        spyOn(Portal.data.GeoNetworkRecordStore.prototype, 'getCount').andReturn(1);
        spyOn(Portal.data.GeoNetworkRecordStore.prototype, 'getAt').andReturn(record);
        spyOn(Portal.data.ActiveGeoNetworkRecordStore.instance(), 'add');

        spyOn(Ext.Ajax, 'request').andCallFake(
            function(params) {
                params.success.call(fetcher, response);
            }
        );

        fetcher.load(uuid);
        expect(Portal.data.ActiveGeoNetworkRecordStore.instance().add).toHaveBeenCalledWith(record);
    });
});
