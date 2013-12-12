
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.cart.DownloadPanel", function() {



    beforeEach(function() {

        downloadPanel = new Portal.cart.DownloadPanel();
        downloadPanel.downloadPanelBody = new Portal.cart.DownloadPanelBody();
        downloadPanel.downloadPanelBody.generateContent = function() {};
    });

    describe('initComponent()', function() {

        it('listens for beforeshow event', function() {

            spyOn(downloadPanel.downloadPanelBody, 'generateContent');

            downloadPanel.fireEvent('beforeshow');

            expect(downloadPanel.downloadPanelBody.generateContent).toHaveBeenCalled();
        });
    });

    describe('onBeforeShow()', function() {

        it('calls refresh() on its view', function() {

            spyOn(downloadPanel.downloadPanelBody, 'generateContent');

            downloadPanel.onBeforeShow();

            expect(downloadPanel.downloadPanelBody.generateContent).toHaveBeenCalled();
        });
    });

});