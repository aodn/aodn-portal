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
    });

    describe('shouldDownload', function() {
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

        it('does not show if it has been accepted and no email required', function() {

            confirmationWindow.show.reset();
            confirmationWindow.onAccept();

            spyOn(confirmationWindow, 'onAccept');

            confirmationWindow.showIfNeeded({ collectEmailAddress: false });

            expect(confirmationWindow.onAccept).toHaveBeenCalled();
            expect(confirmationWindow.show).not.toHaveBeenCalled();
        });

        it('does show if it has been accepted and email required', function() {

            confirmationWindow.show.reset();
            confirmationWindow.onAccept();

            spyOn(confirmationWindow, 'onAccept');

            confirmationWindow.showIfNeeded({ collectEmailAddress: true });

            expect(confirmationWindow.onAccept).not.toHaveBeenCalled();
            expect(confirmationWindow.show).toHaveBeenCalled();
        });

        describe('email address panel', function() {

            beforeEach(function() {
                spyOn(confirmationWindow.downloadEmailPanel, 'show');
                spyOn(confirmationWindow.downloadEmailPanel, 'hide');
                spyOn(confirmationWindow.downloadEmailPanel, 'clearEmailValue');
            });

            it('shows when required', function() {
                confirmationWindow.showIfNeeded({ collectEmailAddress: true });
                expect(confirmationWindow.downloadEmailPanel.show).toHaveBeenCalled();
                expect(confirmationWindow.downloadEmailPanel.hide).not.toHaveBeenCalled();
            });

            it('hides when required', function() {
                confirmationWindow.showIfNeeded({ collectEmailAddress: false });
                expect(confirmationWindow.downloadEmailPanel.show).not.toHaveBeenCalled();
                expect(confirmationWindow.downloadEmailPanel.hide).toHaveBeenCalled();
            });

            it('clears value', function() {
                confirmationWindow.showIfNeeded({});
                expect(confirmationWindow.downloadEmailPanel.clearEmailValue).toHaveBeenCalled();
            });
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

        it('calls back onAccept when accepted', function() {
            var onAcceptSpy = jasmine.createSpy('onAccept');
            confirmationWindow.onAcceptCallback = onAcceptSpy;
            var emailAddress = 'asdf@asdf.com';
            confirmationWindow.downloadEmailPanel.emailField.setValue(emailAddress);
            confirmationWindow.params = {};

            confirmationWindow.onAccept();

            expect(onAcceptSpy).toHaveBeenCalledWith({ emailAddress: emailAddress });
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
