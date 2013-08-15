/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.cart.DownloadToolbar", function() {

    var toolbar;
    var store;
    var myRecord = new Portal.data.GeoNetworkRecord({
        title: 'my record'
    });

    beforeEach(function() {
        toolbar = new Portal.cart.DownloadToolbar();
        store = Portal.data.ActiveGeoNetworkRecordStore.instance();
    });

    afterEach(function() {
        Portal.data.ActiveGeoNetworkRecordStore.THE_ACTIVE_RECORDS_INSTANCE = undefined;
    });

    describe('download all button', function() {

        var downloadAllButton;

        beforeEach(function() {
            downloadAllButton = toolbar.items.get(0);
        });

        it('exists', function() {
            expect(downloadAllButton).toBeTruthy();
        });

        it('is of type button', function() {
            expect(downloadAllButton).toBeInstanceOf(Ext.Button);
        });

        it('has correct text', function() {
            expect(downloadAllButton.text).toBe(OpenLayers.i18n('okdownload'));
        });

        it('click opens confirmation window', function() {
            spyOn(Portal.cart.DownloadCartConfirmationWindow.prototype, 'show');
            downloadAllButton.fireEvent('click');
            expect(Portal.cart.DownloadCartConfirmationWindow.prototype.show).toHaveBeenCalled();
        });
    });

    describe('clear cart button', function() {

        var clearCartButton;

        beforeEach(function() {
            clearCartButton = toolbar.items.get(1);
        });

        it('exists', function() {
            expect(clearCartButton).toBeTruthy();
        });

        it('is of type button', function() {
            expect(clearCartButton).toBeInstanceOf(Ext.Button);
        });

        it('has correct text', function() {
            expect(clearCartButton.text).toBe(OpenLayers.i18n('clearcart'));
        });

        it('click clears the ActiveGeoNetworkRecordStore', function() {
            spyOn(store, 'removeAll');
            clearCartButton.fireEvent('click');
            expect(store.removeAll).toHaveBeenCalled();
        });
    });

    describe('button states', function() {

        var clearCartButton;
        var downloadAllButton;

        beforeEach(function() {
            downloadAllButton = toolbar.items.get(0);
            clearCartButton = toolbar.items.get(1);
        });

        var expectButtonDisabledStates = function(downloadButtonDisabled, clearButtonDisabled) {
            expect(downloadAllButton.disabled).toBe(downloadButtonDisabled, clearButtonDisabled);
        };

        var initStoreWithRecord = function(record) {
            store.add(record);

            // This isn't strictly required (it's tested by the following test), but doesn't hurt to be sure.
            expectButtonDisabledStates(false, false);
        };

        it('disabled when store is initially empty', function() {
            expectButtonDisabledStates(true, true);
        });

        it('disabled when store becomes empty', function() {
            initStoreWithRecord(myRecord);
            store.remove(myRecord);
            expectButtonDisabledStates(true, true);
        });

        it('disabled when store is cleared', function() {
            initStoreWithRecord(myRecord);
            store.removeAll();
            expectButtonDisabledStates(true, true);
        });

        it('enabled when store initially has at least one item', function() {
            initStoreWithRecord(myRecord);

            // Create a new toolbar (so it gets a store with one record).
            toolbar = new Portal.cart.DownloadToolbar();
            downloadAllButton = toolbar.items.get(0);

            expectButtonDisabledStates(false, false);
        });

        it('enabled when store becomes non-empty', function() {
            expectButtonDisabledStates(true, true);
            store.add(myRecord);
            expectButtonDisabledStates(false, false);
        });

        describe('disabled during a download', function() {

            it('goes from disabled to enabled after success', function() {
                spyOn(Portal.utils.FormUtil, 'createAndSubmit').andReturn(true);

                initStoreWithRecord(myRecord);
                startDownload();

                expectButtonDisabledStates(false, false);
            });

            it('goes from disabled to enabled after failure', function() {
                spyOn(Portal.utils.FormUtil, 'createAndSubmit').andReturn(false);

                initStoreWithRecord(myRecord);
                startDownload();

                expectButtonDisabledStates(false, false);
            });

            it('item added during download, buttons stay disabled', function() {
                // TODO: is this even possible?
            });
        });

        var startDownload = function() {
            store.downloader.start();
        };

        var successDownload = function() {
            store.downloader._onDownloadSuccess();
        };

        var failDownload = function() {
            store.downloader._onDownloadFailure();
        }
    });
});
