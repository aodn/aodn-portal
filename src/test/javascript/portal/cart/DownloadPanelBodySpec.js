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

    describe('_contentForEmptyView', function() {
        it('returns marked-up text', function() {
            var content = downloadPanelBody._contentForEmptyView();

            expect(content).toContain( OpenLayers.i18n('noCollectionsMessage'));
        });
    });

    describe('generateContent', function() {

        var mockTemplate;

        var makeTestCollection = function(uuid) {
            return {
                uuid: uuid,
                aggregator: { childAggregators: []},
                wmsLayer: {
                    wfsLayer: null,
                    isNcwms: noOp
                },
                dataDownloadHandlers: []
            };
        };

        var makeTestDownloadPanelBody = function(collections) {
            var downloadPanelBody = new Portal.cart.DownloadPanelBody();

            var items = [];
            Ext.each(collections, function(collection) {
                items.push({
                    data: collection
                });
            });

            downloadPanelBody.store.data.items = items;

            downloadPanelBody.rendered = true;
            spyOn(downloadPanelBody, 'update');

            return downloadPanelBody;
        };

        var testCollection1 = makeTestCollection('[Content 1]');
        var testCollection2 = makeTestCollection('[Content 2]');
        var testCollection3 = makeTestCollection('[Content 3]');
        var testCollection4 = makeTestCollection('[Content 4]');

        beforeEach(function() {

            mockTemplate = {
                apply: jasmine.createSpy('template apply').andCallFake(function(collection) { return collection.value })
            };

            spyOn(Portal.cart, 'DownloadPanelItemTemplate').andReturn(mockTemplate);
        });

        it('creates a DownloadPanelItemTemplate', function() {

            downloadPanelBody = makeTestDownloadPanelBody([]);

            downloadPanelBody.generateContent();

            expect(Portal.cart.DownloadPanelItemTemplate).toHaveBeenCalled();
        });

        it('reverse view order enforced', function() {

            downloadPanelBody = makeTestDownloadPanelBody([
                testCollection1,
                testCollection2,
                testCollection3,
                testCollection4
            ]);

            downloadPanelBody.generateContent();

            // Order of items is reversed!!
            expect(mockTemplate.apply.callCount).toBe(4);
            expect(mockTemplate.apply.argsForCall[3][0].uuid).toBe(testCollection1.uuid);
            expect(mockTemplate.apply.argsForCall[2][0].uuid).toBe(testCollection2.uuid);
            expect(mockTemplate.apply.argsForCall[1][0].uuid).toBe(testCollection3.uuid);
            expect(mockTemplate.apply.argsForCall[0][0].uuid).toBe(testCollection4.uuid);
        });

        it('calls update', function() {

            downloadPanelBody = makeTestDownloadPanelBody([]);

            downloadPanelBody.generateContent();

            expect(downloadPanelBody.update).toHaveBeenCalled();
        });

        it('calls _contentForEmptyView when empty', function() {
            downloadPanelBody = makeTestDownloadPanelBody([]);

            spyOn(downloadPanelBody, '_contentForEmptyView').andReturn('empty cart content');

            downloadPanelBody.generateContent();

            expect(downloadPanelBody._contentForEmptyView).toHaveBeenCalled();
            expect(downloadPanelBody.update).toHaveBeenCalledWith('empty cart content');
        });
    });
});
