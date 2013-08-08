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

        it('click makes call to server downloadCart/download', function() {

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

        it('disabled when store is initially empty', function() {
            toolbar = new Portal.cart.DownloadToolbar({
                store: store
            });

            expect(downloadAllButton.disabled).toBeTruthy();
            expect(clearCartButton.disabled).toBeTruthy();
        });

        it('disabled when store becomes empty', function() {
            store.add(myRecord);
            expect(downloadAllButton.disabled).toBeFalsy();
            expect(clearCartButton.disabled).toBeFalsy();

            store.remove(myRecord);
            expect(downloadAllButton.disabled).toBeTruthy();
            expect(clearCartButton.disabled).toBeTruthy();
        });

        it('disabled when store is cleared', function() {
            store.add(myRecord);
            expect(downloadAllButton.disabled).toBeFalsy();
            expect(clearCartButton.disabled).toBeFalsy();

            store.removeAll();
            expect(downloadAllButton.disabled).toBeTruthy();
            expect(clearCartButton.disabled).toBeTruthy();
        });

        it('enabled when store initially has at least one item', function() {
            store.add(myRecord);
            toolbar = new Portal.cart.DownloadToolbar();
            downloadAllButton = toolbar.items.get(0);

            expect(downloadAllButton.disabled).toBeFalsy();
            expect(clearCartButton.disabled).toBeFalsy();
        });

        it('enabled when store becomes non-empty', function() {
            expect(downloadAllButton.disabled).toBeTruthy();
            expect(clearCartButton.disabled).toBeTruthy();

            store.add(myRecord);
            expect(downloadAllButton.disabled).toBeFalsy();
            expect(clearCartButton.disabled).toBeFalsy();
        });
    });
});
