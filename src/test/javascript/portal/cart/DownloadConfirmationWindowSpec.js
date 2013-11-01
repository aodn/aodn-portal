/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.cart.DownloadConfirmationWindow", function() {

    var confirmationWindow;
    var downloadUrl = 'the download url';
    var downloadFilename = "imos:argo profiles";

    beforeEach(function() {

        confirmationWindow = new Portal.cart.DownloadConfirmationWindow();

        spyOn(confirmationWindow, 'show');
        spyOn(confirmationWindow, 'hide');
        spyOn(confirmationWindow, '_openDownload');
    });

    describe('showIfNeeded', function() {

        beforeEach(function() {

            confirmationWindow.showIfNeeded(downloadUrl, downloadFilename);
        });

        it('shows window if not shown', function() {

            expect(confirmationWindow.show).toHaveBeenCalled();
        });

        it('shows window if not accepted', function() {

            confirmationWindow.onCancel();

            confirmationWindow.showIfNeeded(downloadUrl, downloadFilename);

            expect(confirmationWindow.show).toHaveBeenCalled();
        });

        it('does not show if it has been accepted', function() {

            confirmationWindow.show.reset();

            confirmationWindow.onAccept();

            spyOn(confirmationWindow, 'onAccept');

            confirmationWindow.showIfNeeded(downloadUrl, downloadFilename);

            expect(confirmationWindow.onAccept).toHaveBeenCalled();
            expect(confirmationWindow.show).not.toHaveBeenCalled();
        });

        afterEach(function() {

            confirmationWindow.show.reset();
        });
    });

    describe('onAccept', function() {

        it('hides window', function() {

            confirmationWindow.onAccept();

            expect(confirmationWindow.hide).toHaveBeenCalled();
        });

        it('does nothing when no url', function() {

            spyOn(confirmationWindow, '_portalDownloadUrl').andReturn(null);

            confirmationWindow.onAccept();

            expect(confirmationWindow._openDownload).not.toHaveBeenCalled();
        });

        it('starts download', function() {

            spyOn(confirmationWindow, '_portalDownloadUrl').andReturn(downloadUrl);

            confirmationWindow.onAccept();

            expect(confirmationWindow._openDownload).toHaveBeenCalledWith(downloadUrl);
        });
    });

    describe('onCancel', function() {

        beforeEach(function() {

            confirmationWindow.onCancel();
        });

        it('hides window', function() {

            expect(confirmationWindow.hide).toHaveBeenCalled();
        });
    });

    describe('_portalDownloadUrl', function() {

        it('returns null when it does not have everything it needs', function() {

            expect(confirmationWindow._portalDownloadUrl()).toBeNull();
        });

        it('returns URL-endcoded proxy URL', function() {

            spyOn(window, 'sanitiseForFilename').andReturn("file name");

            var expectedProxyUrl = "/proxy?url=the%20download%20url&downloadFilename=file%20name";
            confirmationWindow.downloadUrl = downloadUrl;
            confirmationWindow.downloadFilename = "file name";

            expect(confirmationWindow._portalDownloadUrl()).toBe(expectedProxyUrl);
            expect(sanitiseForFilename).toHaveBeenCalledWith("file name");
        });
    });
});
