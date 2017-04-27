describe("Portal.cart.DownloadEmailPanel", function() {

    var panel;
    var onValidSpy;
    var onInvalidSpy;

    beforeEach(function() {
        onValidSpy = jasmine.createSpy('onValid');
        onInvalidSpy = jasmine.createSpy('onInvalid');
        panel = new Portal.cart.DownloadEmailPanel({
            listeners: {
                'valid': onValidSpy,
                'invalid': onInvalidSpy
            }
        });
    });

    var mockCollection = {
        getMetadataRecord: returns({ data: '' })
    };


    it('gets email address from email field', function() {
        spyOn(panel.emailField, 'getValue');
        panel.getEmailValue();
        expect(panel.emailField.getValue).toHaveBeenCalled();
    });


    describe('validation', function() {
        it('has email address validator configured in text field', function() {
            expect(panel.emailField.validator).toBe(panel._validateEmailAddress);
        });

        describe('listeners', function() {
            it('calls onValid', function() {
                panel.emailField.fireEvent('valid', panel.emailField);
                expect(onValidSpy).toHaveBeenCalled();
            });

            it('calls onInvalid', function() {
                panel.emailField.fireEvent('invalid', panel.emailField);
                expect(onInvalidSpy).toHaveBeenCalled();
            });
        });

        describe('_validateEmailAddress', function () {

            it('returns false for an empty address', function () {
                var returnVal = panel._validateEmailAddress('');
                expect(returnVal).toBe(false);
            });

            it('returns false for an invalid address', function () {
                var returnVal = panel._validateEmailAddress('notAnEmailAddress');
                expect(returnVal).toBe(false);
            });

            it('returns true for a valid address', function () {
                var returnVal = panel._validateEmailAddress('user@domain.com');
                expect(returnVal).toBe(true);
            });
        });

    });

    describe('resets challenge address panel', function() {

        it('resets when required', function() {
            spyOn(panel.downloadChallengePanel, '_doReset');
            panel.show({collectEmailAddress: true, collection: mockCollection});

            expect(panel.downloadChallengePanel._doReset).toHaveBeenCalled();
        });

    });
});
