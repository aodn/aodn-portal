/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.cart.DownloadEmailPanel", function() {

    var panel;

    beforeEach(function() {
        panel = new Portal.cart.DownloadEmailPanel();
    });

    it('gets email address from email field', function() {
        spyOn(panel.emailField, 'getValue');
        panel.getEmailValue();
        expect(panel.emailField.getValue).toHaveBeenCalled();
    });

    it('clears field', function() {
        spyOn(panel.emailField, 'setValue');
        panel.clearEmailValue();
        expect(panel.emailField.setValue).toHaveBeenCalledWith('');
    });
});
