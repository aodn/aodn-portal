/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.cart.DownloadConfirmationWindow", function() {

    var confirmationWindow;

    beforeEach(function() {

        Portal.app = {
            config: {
                downloadCartConfirmationWindowContent:  'why am i doing this stuff\n'
            }
        };
        confirmationWindow = new Portal.cart.DownloadConfirmationWindow(
            {downloadUrl: 'download_url'}
        );

        spyOn(confirmationWindow, 'close');
        spyOn(confirmationWindow, '_setWindowLocation');
    });

    describe('on accept', function() {

        beforeEach(function() {

            confirmationWindow.onAccept();
        });

        it('starts download', function() {

            expect(confirmationWindow._setWindowLocation).toHaveBeenCalledWith('download_url');
        });

        it('closes window', function() {

            expect(confirmationWindow.close).toHaveBeenCalled();
        });
    });

    describe('on cancel', function() {

        beforeEach(function() {

            confirmationWindow.onCancel();
        });

        it('closes window', function() {

            expect(confirmationWindow.close).toHaveBeenCalled();
        });
    });
});
