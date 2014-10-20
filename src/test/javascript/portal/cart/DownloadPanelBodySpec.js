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

    describe('clear all', function() {
        it('calls to active geo network record store remove all', function() {
            spyOn(Portal.data.ActiveGeoNetworkRecordStore.instance(), 'removeAll');
            window.setViewPortTab = jasmine.createSpy();
            downloadPanelBody._clearAllAndReset();
            expect(Portal.data.ActiveGeoNetworkRecordStore.instance().removeAll).toHaveBeenCalled();
        });
    });

    describe('_contentForEmptyView', function() {
        it('returns marked-up text', function() {
            expect(downloadPanelBody.emptyMessage.html).toContain( OpenLayers.i18n('noActiveCollectionSelected'));
        });
    });

    describe('generateBodyContent', function() {

        var mockTemplate;

        var makeTestCollection = function(uuid) {
            return {
                uuid: uuid,
                aggregator: { childAggregators: []},
                wmsLayer: {
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
                    data: collection,
                    loaded: true
                });
            });

            downloadPanelBody.store.data.items = items;

            downloadPanelBody.rendered = true;
            spyOn(downloadPanelBody.bodyContent, 'update');

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

            downloadPanelBody.generateBodyContent();

            expect(Portal.cart.DownloadPanelItemTemplate).toHaveBeenCalled();
        });

        it('reverse view order enforced', function() {

            downloadPanelBody = makeTestDownloadPanelBody([
                testCollection1,
                testCollection2,
                testCollection3,
                testCollection4
            ]);

            downloadPanelBody.generateBodyContent();

            // Order of items is reversed!!
            expect(mockTemplate.apply.callCount).toBe(4);
            expect(mockTemplate.apply.argsForCall[3][0].uuid).toBe(testCollection1.uuid);
            expect(mockTemplate.apply.argsForCall[2][0].uuid).toBe(testCollection2.uuid);
            expect(mockTemplate.apply.argsForCall[1][0].uuid).toBe(testCollection3.uuid);
            expect(mockTemplate.apply.argsForCall[0][0].uuid).toBe(testCollection4.uuid);
        });

        it('calls update', function() {

            downloadPanelBody = makeTestDownloadPanelBody([]);

            downloadPanelBody.generateBodyContent();

            expect(downloadPanelBody.bodyContent.update).toHaveBeenCalled();
        });

        it('calls _contentForEmptyView when empty', function() {
            downloadPanelBody = makeTestDownloadPanelBody([]);

            spyOn(downloadPanelBody.emptyMessage, 'show');

            downloadPanelBody.generateBodyContent();

            expect(downloadPanelBody.emptyMessage.show).toHaveBeenCalled();
        });

        it('includes menu items from download handlers', function() {

            testCollection1.dataDownloadHandlers = [{
                getDownloadOptions: function() {
                    return [
                        {
                            textKey: 'key1',
                            handler: {},
                            handlerParams: {}
                        },
                        {
                            textKey: 'key2',
                            handler: {},
                            handlerParams: {}
                        }
                    ];
                }
            }];

            spyOn(Portal.cart, 'InsertionService').andReturn({
                insertionValues: function() {return {menuItems: []}}
            });

            downloadPanelBody = makeTestDownloadPanelBody([
                testCollection1
            ]);

            spyOn(OpenLayers, 'i18n');

            downloadPanelBody.generateBodyContent();
            var applyArgs = mockTemplate.apply.mostRecentCall.args;
            var processedValues = applyArgs[0];

            expect(OpenLayers.i18n.argsForCall).toEqual([['key1'], ['key2']]);
            expect(processedValues.menuItems.length).toBe(2);
        });
    });
});
