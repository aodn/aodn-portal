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
            downloadPanelBody: new Portal.cart.DownloadPanelBody()
        });

        spyOn(downloadPanel.downloadPanelBody, 'generateContent');
    });

    afterEach(function() {
        downloadPanel.destroy();
    });

    describe('initComponent()', function() {
        it('listens for beforeshow event', function() {
            downloadPanel.fireEvent('beforeshow');

            expect(downloadPanel.downloadPanelBody.generateContent).toHaveBeenCalled();
        });

        it('listens for ACTIVE_GEONETWORK_RECORD_ADDED event', function() {
            Ext.MsgBus.publish(PORTAL_EVENTS.ACTIVE_GEONETWORK_RECORD_ADDED);

            expect(downloadPanel.downloadPanelBody.generateContent).toHaveBeenCalled();
        });
    });

    describe('step title', function() {
        it('is correct', function() {
            var expectedTitle = OpenLayers.i18n('stepHeader', { stepNumber: 3, stepDescription: OpenLayers.i18n('step3Description') });
            expect(downloadPanel.title).toEqual(expectedTitle);
        });
    });
});
