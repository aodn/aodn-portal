/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.cart.DownloadGridView", function() {
    describe('initialisation', function() {
        var gridView;

        beforeEach(function() {
            gridView = new Portal.cart.DownloadGridView();
        });

        it('configures empty text', function() {
            expect(gridView.deferEmptyText).toBeFalsy();
            expect(gridView.emptyText).toBe(OpenLayers.i18n('emptyCartText'));
        });

        it('configures auto fill to be true', function() {
            expect(gridView.autoFill).toBeTruthy();
        });
    });
});
