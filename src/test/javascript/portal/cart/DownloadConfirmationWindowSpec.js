describe("Portal.cart.DownloadConfirmationWindow", function() {

    var confirmationWindow;
    var downloadUrl = 'the download url';
    var downloadFilename = "imos:argo profiles";
    var superclass;

    var mockCollection = {
        getMetadataRecord: returns({ data: '' })
    };

    beforeEach(function() {

        confirmationWindow = new Portal.cart.DownloadConfirmationWindow();
        superclass = Portal.cart.DownloadConfirmationWindow.superclass;

        // Mock UI-related methods invoked in show()
        confirmationWindow.contentPanel.update = function() {};
        confirmationWindow.syncShadow = undefined;

        spyOn(superclass, "show");
        spyOn(superclass, "hide");
    });

    describe('show', function() {

        beforeEach(function() {

            confirmationWindow.show({ collection: mockCollection });
        });

        it('shows window', function() {

            expect(superclass.show).toHaveBeenCalled();
        });

        describe('email & challenge address panel', function() {

            beforeEach(function() {
                spyOn(confirmationWindow.downloadEmailPanel, 'show');
                spyOn(confirmationWindow.downloadEmailPanel, 'hide');
            });

            it('shows when required', function() {
                confirmationWindow.show({ collectEmailAddress: true, collection: mockCollection });
                expect(confirmationWindow.downloadEmailPanel.show).toHaveBeenCalled();
                expect(confirmationWindow.downloadEmailPanel.hide).not.toHaveBeenCalled();
            });

            it('hides when required', function() {
                confirmationWindow.show({ collectEmailAddress: false, collection: mockCollection });
                expect(confirmationWindow.downloadEmailPanel.show).not.toHaveBeenCalled();
                expect(confirmationWindow.downloadEmailPanel.hide).toHaveBeenCalled();

            });

            describe('download button', function() {
                var downloadButton;

                beforeEach(function() {
                    downloadButton = confirmationWindow.downloadButton;
                    spyOn(downloadButton, 'disable');
                    spyOn(downloadButton, 'enable');
                });

                it('disables download button when email address is invalid', function() {
                    confirmationWindow.downloadEmailPanel.isVisible = returns(true);
                    confirmationWindow.downloadEmailPanel.fireEvent('invalid');
                    expect(downloadButton.disable).toHaveBeenCalled();
                });

                it('enables download button when email address is valid', function() {
                    confirmationWindow.downloadEmailPanel.isVisible = returns(true);
                    confirmationWindow.downloadEmailPanel.fireEvent('valid');
                    expect(downloadButton.enable).toHaveBeenCalled();
                });

                it('does nothing if email address panel is hidden', function() {
                    confirmationWindow.downloadEmailPanel.isVisible = returns(false);

                    Ext.each(['valid', 'invalid'], function(event) {
                        confirmationWindow.downloadEmailPanel.fireEvent(event);
                        expect(downloadButton.enable).not.toHaveBeenCalled();
                        expect(downloadButton.disable).not.toHaveBeenCalled();
                    });
                });
            });
        });

        afterEach(function() {

            confirmationWindow.close();
        });
    });

    describe('onAccept', function() {

        it('hides window', function() {

            confirmationWindow.onAccept();

            expect(superclass.hide).toHaveBeenCalled();
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

            expect(superclass.hide).toHaveBeenCalled();
        });
    });
});
