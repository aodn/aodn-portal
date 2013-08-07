/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.cart.DownloadGridView", function() {
    describe('initialisation', function() {
        it('empty text', function() {
            var gridView = new Portal.cart.DownloadGridView();
            expect(gridView.emptyText).toBe('No downloads selected');
        });

        it('auto fill', function() {
            var gridView = new Portal.cart.DownloadGridView();
            expect(gridView.autoFill).toBeTruthy();
        });
    });
});
