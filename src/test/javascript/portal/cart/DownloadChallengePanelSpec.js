describe("Portal.cart.DownloadChallengePanel", function() {

    var panel;
    var resp;

    beforeEach(function() {
        panel = new Portal.cart.DownloadChallengePanel({});
        resp = { responseText: "not an empty string" }
    });

    describe('display', function() {
        it('shows challenge', function() {
            spyOn(panel, '_showChallenge');
            panel._configureChallengeHtmlElements(resp);
            expect(panel._showChallenge).toHaveBeenCalled();
        });

        it('hides challenge', function() {
            spyOn(panel, '_hideChallenge');
            resp = { responseText: "" };
            panel._configureChallengeHtmlElements(resp);
            expect(panel._hideChallenge).toHaveBeenCalled();
        });
    });

    describe('sets isChallenged', function() {
        it('initially', function() {
            expect(panel.isChallenged()).toBe(false);
        });

        it('when shown', function() {
            panel._showChallenge(resp);
            expect(panel.isChallenged()).toBe(true);
        });

        it('when hidden', function() {
            panel._hideChallenge();
            expect(panel.isChallenged()).toBe(false);
        });

    });

});
