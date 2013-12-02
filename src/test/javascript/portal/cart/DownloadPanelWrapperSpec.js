
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.cart.DownloadPanelWrapper", function() {



    beforeEach(function() {

        downloadPanelWrapper = new Portal.cart.DownloadPanelWrapper();
        downloadPanelWrapper.downloadPanel = new Portal.cart.DownloadPanel();
        downloadPanelWrapper.downloadPanel.generateContent = function() {};
    });

    describe('initComponent()', function() {

        it('listens for beforeshow event', function() {

            spyOn(downloadPanelWrapper.downloadPanel, 'generateContent');

            downloadPanelWrapper.fireEvent('beforeshow');

            expect(downloadPanelWrapper.downloadPanel.generateContent).toHaveBeenCalled();
        });
    });

    describe('onBeforeShow()', function() {

        it('calls refresh() on its view', function() {

            spyOn(downloadPanelWrapper.downloadPanel, 'generateContent');

            downloadPanelWrapper.onBeforeShow();

            expect(downloadPanelWrapper.downloadPanel.generateContent).toHaveBeenCalled();
        });
    });

});