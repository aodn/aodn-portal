/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.cart.DownloadPanel", function() {

    var downloadPanel;

    beforeEach(function() {
        downloadPanel = new Portal.cart.DownloadPanel({
            dataCollectionStore: { removeAll: jasmine.createSpy('removeAll') }
        });

        spyOn(downloadPanel, 'generateContent');
        spyOn(downloadPanel, '_generateBodyContentForCollection');
        spyOn(window, 'trackDataCollectionSelectionUsage');
    });

    afterEach(function() {
        downloadPanel.destroy();
    });

    describe('event handlers', function() {
        it('listens for beforeshow event', function() {
            downloadPanel.fireEvent('beforeshow');

            expect(downloadPanel.generateContent).toHaveBeenCalled();
        });

        describe('active geonetwork record events', function() {
            it('listens for DATA_COLLECTION_ADDED event', function() {
                Ext.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_ADDED);

                expect(downloadPanel.generateContent).toHaveBeenCalled();
            });

            it('listens for DATA_COLLECTION_REMOVED event', function() {
                Ext.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_REMOVED);

                expect(downloadPanel.generateContent).toHaveBeenCalled();
            });
        });

        describe('downloader event listeners', function() {

            var collection;

            beforeEach(function() {
                collection = {};
                spyOn(downloadPanel, 'onDownloadRequested').andCallThrough();
                spyOn(downloadPanel, 'onDownloadStarted').andCallThrough();
                spyOn(downloadPanel, 'onDownloadFailed').andCallThrough();
            });

            it('listens for downloadrequested', function() {
                downloadPanel.downloader.fireEvent('downloadrequested', 'url', collection);
                expect(downloadPanel.onDownloadRequested).toHaveBeenCalledWith('url', collection);
                expect(downloadPanel.generateContent).toHaveBeenCalled();
            });

            it('listens for downloadstarted', function() {
                downloadPanel.downloader.fireEvent('downloadstarted', 'url', collection);
                expect(downloadPanel.onDownloadStarted).toHaveBeenCalledWith('url', collection);
                expect(downloadPanel.generateContent).toHaveBeenCalled();
            });

            it('listens for downloadfailed', function() {
                downloadPanel.downloader.fireEvent('downloadfailed', 'url', collection, 'msg');
                expect(downloadPanel.onDownloadFailed).toHaveBeenCalledWith('url', collection, 'msg');
                expect(downloadPanel.generateContent).toHaveBeenCalled();
            });
        });
    });

    describe('step title', function() {
        it('is correct', function() {
            var expectedTitle = OpenLayers.i18n('stepHeader', { stepNumber: 3, stepDescription: OpenLayers.i18n('step3Description') });
            expect(downloadPanel.title).toEqual(expectedTitle);
        });
    });

    describe('clear all', function() {
        beforeEach(function() {
            window.setViewPortTab = jasmine.createSpy();
            downloadPanel._clearAllAndReset();
        });

        it('calls to data collection store remove all', function() {
            expect(downloadPanel.dataCollectionStore.removeAll).toHaveBeenCalled();
        });

        it('logs to Google Analytics', function() {
            expect(window.trackDataCollectionSelectionUsage).toHaveBeenCalledWith('dataCollectionClearAndReset', '');
        });
    });

    describe('_contentForEmptyView', function() {
        it('returns marked-up text', function() {
            expect(downloadPanel.emptyMessage.html).toContain( OpenLayers.i18n('noActiveCollectionSelected'));
        });
    });

    describe('generateBodyContent', function() {

        var testCollection1;
        var testCollection2;
        var testCollection3;
        var testCollection4;

        var makeTestDownloadPanel = function(collections) {
            var downloadPanel = new Portal.cart.DownloadPanel({
                dataCollectionStore: {
                    getLoadedRecords: returns(collections)
                }
            });

            spyOn(downloadPanel.bodyContent, 'update');
            spyOn(downloadPanel, '_applyTemplate');

            return downloadPanel;
        };

        beforeEach(function() {

            testCollection1 = makeTestCollection('[Content 1]');
            testCollection2 = makeTestCollection('[Content 2]');
            testCollection3 = makeTestCollection('[Content 3]');
            testCollection4 = makeTestCollection('[Content 4]');

            spyOn(Portal.cart, 'DownloadPanelItemTemplate');
            spyOn(Portal.cart, 'InsertionService').andReturn({
                insertionValues: returns({})
            });
        });

        it('creates a DownloadPanelItemTemplate', function() {

            downloadPanel = makeTestDownloadPanel([]);

            downloadPanel.generateBodyContent();

            expect(Portal.cart.DownloadPanelItemTemplate).toHaveBeenCalled();
        });

        it('reverse view order enforced', function() {
            spyOn(Portal.cart.DownloadHandler, 'handlersForDataCollection').andReturn([]);

            downloadPanel = makeTestDownloadPanel([
                testCollection1,
                testCollection2,
                testCollection3,
                testCollection4
            ]);

            downloadPanel.generateBodyContent();

            expect(downloadPanel._applyTemplate.callCount).toBe(4);
            expect(downloadPanel._applyTemplate.argsForCall[3][1].uuid).toBe(testCollection4.uuid);
            expect(downloadPanel._applyTemplate.argsForCall[2][1].uuid).toBe(testCollection3.uuid);
            expect(downloadPanel._applyTemplate.argsForCall[1][1].uuid).toBe(testCollection2.uuid);
            expect(downloadPanel._applyTemplate.argsForCall[0][1].uuid).toBe(testCollection1.uuid);
        });

        it('calls update', function() {

            downloadPanel = makeTestDownloadPanel([]);

            downloadPanel.generateBodyContent();

            expect(downloadPanel.bodyContent.update).toHaveBeenCalled();
        });

        it('calls _contentForEmptyView when empty', function() {
            downloadPanel = makeTestDownloadPanel([]);

            spyOn(downloadPanel.emptyMessage, 'show');

            downloadPanel.generateBodyContent();

            expect(downloadPanel.emptyMessage.show).toHaveBeenCalled();
        });

        it('includes menu items from download handlers', function() {
            spyOn(Portal.cart.DownloadHandler, 'handlersForDataCollection').andReturn([{
                getDownloadOptions: returns([
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
                ])
            }]);

            downloadPanel = makeTestDownloadPanel([
                testCollection1
            ]);

            spyOn(OpenLayers, 'i18n');

            downloadPanel.generateBodyContent();
            var processedValues = downloadPanel._applyTemplate.mostRecentCall.args[1];

            expect(OpenLayers.i18n.argsForCall).toEqual([['key1'], ['key2']]);
            expect(processedValues.menuItems.length).toBe(2);
        });
    });

    describe('confirmDownload', function() {

        it('calls trackUsage when the user accepts download', function() {
            var testParams = {
                filenameFormat: "{0}.csv"
            };
            var testCollection = makeTestCollection();
            var callbackScope = downloadPanel;
            var callback = noOp;
            var testKey = "downloadAsCsvLabel";
            $.fileDownload = noOp;

            spyOn(downloadPanel.confirmationWindow, 'show');
            spyOn(window, 'trackUsage');

            downloadPanel.confirmDownload(testCollection, callbackScope, callback, testParams, testKey);
            testParams.onAccept(testParams);
            expect(window.trackUsage).toHaveBeenCalledWith(OpenLayers.i18n('downloadTrackingCategory'), OpenLayers.i18n('downloadTrackingActionPrefix') + OpenLayers.i18n(testKey), testCollection.getTitle(), undefined);
        });
    });

    var makeTestCollection = function(uuid) {
        return {
            getUuid: returns(uuid),
            getTitle: returns("Argo")
        };
    };
});
