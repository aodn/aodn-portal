
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.cart.DownloadPanel", function() {

    beforeEach(function() {
        downloadPanel = new Portal.cart.DownloadPanel();
    });

    describe('ActiveGeoNetworkRecordStore interaction', function() {
        it('store is the ActiveGeoNetworkRecordStore singleton instance', function() {
            expect(downloadPanel.store).toBe(Portal.data.ActiveGeoNetworkRecordStore.instance());
        });
    });

    describe('initialisation', function() {
        it('has column model of type DownloadColumnModel', function() {
            expect(downloadPanel.colModel).toBeInstanceOf(Portal.cart.DownloadColumnModel);
        });

        it('has view of type DownloadGridView', function() {
            expect(downloadPanel.view).toBeInstanceOf(Portal.cart.DownloadGridView);
        });

        it('has bbar of type DownloadToolbar', function() {
            expect(downloadPanel.getBottomToolbar()).toBeInstanceOf(Portal.cart.DownloadToolbar);
        });

        it('listens for beforeshow event', function() {

            spyOn(downloadPanel, 'onBeforeShow');

            downloadPanel.fireEvent('beforeshow');

            expect(downloadPanel.onBeforeShow).toHaveBeenCalled();
        });
    });

    describe('onBeforeShow()', function() {

        it('calls refresh() on its view', function() {

            spyOn(downloadPanel.view, 'refresh');

            downloadPanel.onBeforeShow();

            expect(downloadPanel.view.refresh).toHaveBeenCalled();
        });
    });
});
