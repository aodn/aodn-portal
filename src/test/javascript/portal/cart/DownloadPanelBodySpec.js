
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.cart.DownloadPanelBody", function() {

    var DownloadPanelBody;

    beforeEach(function() {

        DownloadPanelBody = new Portal.cart.DownloadPanelBody();
    });

    describe('initComponent()', function() {

        it('store is the ActiveGeoNetworkRecordStore singleton instance', function() {
            expect(DownloadPanelBody.store).toBe(Portal.data.ActiveGeoNetworkRecordStore.instance());
        });

    });

    describe('generateContent', function() {

        var mockTemplate;
        var testCollection1 = {value: '[Content 1]'};
        var testCollection2 = {value: '[Content 2]'};
        var testCollection3 = {value: '[Content 3]'};
        var testCollection4 = {value: '[Content 4]'};

        beforeEach(function() {

            mockTemplate = {
                apply: jasmine.createSpy('template apply').andCallFake(function(collection) { return collection.value })
            };

            spyOn(Portal.cart, 'DownloadPanelBodyTemplate').andReturn(mockTemplate);

            DownloadPanelBody = new Portal.cart.DownloadPanelBody();
            DownloadPanelBody.store.data.items = [
                {data: testCollection1},
                {data: testCollection2},
                {data: testCollection3},
                {data: testCollection4}
            ];

            spyOn(DownloadPanelBody, 'update');

            DownloadPanelBody.generateContent();
        });

        it('creates a DownloadPanelBodyTemplate', function() {

            expect(Portal.cart.DownloadPanelBodyTemplate).toHaveBeenCalled();
        });

        it('reverse view order enforced', function() {

            // Order of items is reversed!!
            expect(mockTemplate.apply.callCount).toBe(4);
            expect(mockTemplate.apply.argsForCall[3][0]).toBe(testCollection1);
            expect(mockTemplate.apply.argsForCall[2][0]).toBe(testCollection2);
            expect(mockTemplate.apply.argsForCall[1][0]).toBe(testCollection3);
            expect(mockTemplate.apply.argsForCall[0][0]).toBe(testCollection4);
        });

        it('calls update', function() {

            // Order of items is reversed!!
            expect(DownloadPanelBody.update).toHaveBeenCalledWith('[Content 4][Content 3][Content 2][Content 1]');
        });

        it('calls _contentForEmptyView when empty', function() {

            spyOn(DownloadPanelBody, '_contentForEmptyView').andReturn('empty cart content');

            DownloadPanelBody.store.data.items = [];

            DownloadPanelBody.generateContent();

            expect(DownloadPanelBody._contentForEmptyView).toHaveBeenCalled();
            expect(DownloadPanelBody.update).toHaveBeenCalledWith('empty cart content');
        });
    });

    describe('generateContent', function() {

        it('returns marked-up text', function() {

            var content = DownloadPanelBody._contentForEmptyView();

            expect(content).toBe('<i>' + OpenLayers.i18n('noCollectionsMessage') + '</i>');
        });
    });
});
