
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

        var testCollection1 = {wmsLayer: {wfsLayer: null, isNcwms: noOp()}};
        var testCollection2 = {wmsLayer: {wfsLayer: null, isNcwms: noOp()}};
        var testCollection3 = {wmsLayer: {wfsLayer: null, isNcwms: noOp()}};
        var testCollection4 = {wmsLayer: {wfsLayer: null, isNcwms: noOp()}};

        beforeEach(function() {

            mockTemplate = {
                apply: jasmine.createSpy('template apply')
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
