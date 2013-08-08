/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.cart.DownloadToolbar", function() {

    var toolbar;

    beforeEach(function() {
        toolbar = new Portal.cart.DownloadToolbar();
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
    });
});
