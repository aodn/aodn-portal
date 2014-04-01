
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.cart.DownloadPanelBody", function() {

    var downloadPanelBody;

    beforeEach(function() {
        downloadPanelBody = new Portal.cart.DownloadPanelBody();
    });

    describe('initComponent()', function() {
        it('store is the ActiveGeoNetworkRecordStore singleton instance', function() {
            expect(downloadPanelBody.store).toBe(Portal.data.ActiveGeoNetworkRecordStore.instance());
        });
    });

    describe('generateContent', function() {

        var mockTemplate;

        var testCollection1 = {uuid: '[Content 1]', wmsLayer: {wfsLayer: null, isNcwms: noOp()}};
        var testCollection2 = {uuid: '[Content 2]', wmsLayer: {wfsLayer: null, isNcwms: noOp()}};
        var testCollection3 = {uuid: '[Content 3]', wmsLayer: {wfsLayer: null, isNcwms: noOp()}};
        var testCollection4 = {uuid: '[Content 4]', wmsLayer: {wfsLayer: null, isNcwms: noOp()}};

        beforeEach(function() {

            mockTemplate = {
                apply: jasmine.createSpy('template apply').andCallFake(function(collection) { return collection.value })
            };

            spyOn(Portal.cart, 'DownloadPanelItemTemplate').andReturn(mockTemplate);

            downloadPanelBody = new Portal.cart.DownloadPanelBody();
            downloadPanelBody.store.data.items = [
                {data: testCollection1},
                {data: testCollection2},
                {data: testCollection3},
                {data: testCollection4}
            ];

            spyOn(downloadPanelBody, 'update');

            downloadPanelBody.generateContent();
        });

        it('creates a DownloadPanelItemTemplate', function() {

            expect(Portal.cart.DownloadPanelItemTemplate).toHaveBeenCalled();
        });

        it('reverse view order enforced', function() {

            // Order of items is reversed!!
            expect(mockTemplate.apply.callCount).toBe(4);
            expect(mockTemplate.apply.argsForCall[3][0].uuid).toBe(testCollection1.uuid);
            expect(mockTemplate.apply.argsForCall[2][0].uuid).toBe(testCollection2.uuid);
            expect(mockTemplate.apply.argsForCall[1][0].uuid).toBe(testCollection3.uuid);
            expect(mockTemplate.apply.argsForCall[0][0].uuid).toBe(testCollection4.uuid);
        });

        it('calls update', function() {

            expect(downloadPanelBody.update).toHaveBeenCalled();
        });

        it('calls _contentForEmptyView when empty', function() {
            spyOn(downloadPanelBody, '_contentForEmptyView').andReturn('empty cart content');

            downloadPanelBody.store.data.items = [];
            downloadPanelBody.generateContent();

            expect(downloadPanelBody._contentForEmptyView).toHaveBeenCalled();
            expect(downloadPanelBody.update).toHaveBeenCalledWith('empty cart content');
        });
    });

    describe('generateContent', function() {
        it('returns marked-up text', function() {
            var content = downloadPanelBody._contentForEmptyView();

            expect(content).toBe('<i>' + OpenLayers.i18n('noCollectionsMessage') + '</i>');
        });
    });
});
