/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.cart.DownloadConfirmationWindow", function() {

    var confirmationWindow;
    var downloadUrl = 'the download url';

    beforeEach(function() {

        confirmationWindow = new Portal.cart.DownloadConfirmationWindow();

        spyOn(confirmationWindow, 'show');
        spyOn(confirmationWindow, 'hide');
        spyOn(confirmationWindow, '_setWindowLocation');
    });

    describe('showIfNeeded', function() {

        beforeEach(function() {

            confirmationWindow.showIfNeeded(downloadUrl);
        });

        it('shows window if not shown', function() {

            expect(confirmationWindow.show).toHaveBeenCalled();
        });

        it('shows window if not accepted', function() {

            confirmationWindow.onCancel();

            confirmationWindow.showIfNeeded(downloadUrl);

            expect(confirmationWindow.show).toHaveBeenCalled();
        });

        it('does not show if it has been accepted', function() {

            confirmationWindow.show.reset();

            confirmationWindow.onAccept();

            spyOn(confirmationWindow, 'onAccept');

            confirmationWindow.showIfNeeded(downloadUrl);

            expect(confirmationWindow.onAccept).toHaveBeenCalled();
            expect(confirmationWindow.show).not.toHaveBeenCalled();
        });

        afterEach(function() {

            confirmationWindow.show.reset();
        });
    });

    describe('onAccept', function() {

        beforeEach(function() {

            confirmationWindow.downloadUrl = downloadUrl;
            confirmationWindow.onAccept();
        });

        it('starts download', function() {

            expect(confirmationWindow._setWindowLocation).toHaveBeenCalledWith(downloadUrl);
        });

        it('hides window', function() {

            expect(confirmationWindow.hide).toHaveBeenCalled();
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
});
