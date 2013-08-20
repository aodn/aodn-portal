/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.cart.DownloadCartConfirmationWindow", function() {
    describe('on accept', function() {

        var confirmationWindow;

        beforeEach(function() {
            spyOn(Portal.utils.FormUtil, 'createAndSubmit').andReturn(true);
            confirmationWindow = new Portal.cart.DownloadCartConfirmationWindow();
        });

        it('starts download', function() {
            spyOn(Portal.data.ActiveGeoNetworkRecordStore.instance(), 'initiateDownload');
            confirmationWindow.onAccept();
            expect(Portal.data.ActiveGeoNetworkRecordStore.instance().initiateDownload).toHaveBeenCalled();
        });

        it('closes window', function() {
            spyOn(confirmationWindow, 'close');
            confirmationWindow.onAccept();
            expect(confirmationWindow.close).toHaveBeenCalled();
        });
    });
});
