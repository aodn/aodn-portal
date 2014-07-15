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

        describe('email & challenge address panel', function() {

            beforeEach(function() {
                spyOn(confirmationWindow.downloadEmailPanel, 'show');
                spyOn(confirmationWindow.downloadEmailPanel, 'hide');

                spyOn(confirmationWindow.downloadChallengePanel, 'show');
                spyOn(confirmationWindow.downloadChallengePanel, 'hide');
            });

            it('shows when required', function() {
                confirmationWindow.showIfNeeded({ collectEmailAddress: true });
                expect(confirmationWindow.downloadEmailPanel.show).toHaveBeenCalled();
                expect(confirmationWindow.downloadEmailPanel.hide).not.toHaveBeenCalled();

                expect(confirmationWindow.downloadChallengePanel.show).toHaveBeenCalled();
                expect(confirmationWindow.downloadChallengePanel.hide).not.toHaveBeenCalled();
            });

            it('hides when required', function() {
                confirmationWindow.showIfNeeded({ collectEmailAddress: false });
                expect(confirmationWindow.downloadEmailPanel.show).not.toHaveBeenCalled();
                expect(confirmationWindow.downloadEmailPanel.hide).toHaveBeenCalled();

                expect(confirmationWindow.downloadChallengePanel.show).not.toHaveBeenCalled();
                expect(confirmationWindow.downloadChallengePanel.hide).toHaveBeenCalled();
            });


            describe('download button', function() {
                var downloadButton;

                beforeEach(function() {
                    downloadButton = confirmationWindow.downloadButton;
                    spyOn(downloadButton, 'disable');
                    spyOn(downloadButton, 'enable');
                });

                it('disables download button when email address is invalid', function() {
                    confirmationWindow.downloadEmailPanel.isVisible = function() { return true };
                    confirmationWindow.downloadEmailPanel.fireEvent('invalid');
                    expect(downloadButton.disable).toHaveBeenCalled();
                });

                it('enables download button when email address is valid', function() {
                    confirmationWindow.downloadEmailPanel.isVisible = function() { return true };
                    confirmationWindow.downloadEmailPanel.fireEvent('valid');
                    expect(downloadButton.enable).toHaveBeenCalled();
                });

                it('does nothing if email address panel is hidden', function() {
                    confirmationWindow.downloadEmailPanel.isVisible = function() { return false };

                    Ext.each(['valid', 'invalid'], function(event) {
                        confirmationWindow.downloadEmailPanel.fireEvent(event);
                        expect(downloadButton.enable).not.toHaveBeenCalled();
                        expect(downloadButton.disable).not.toHaveBeenCalled();
                    });
                });
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
