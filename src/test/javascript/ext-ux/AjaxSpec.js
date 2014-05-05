/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Ext.ux.Ajax", function() {
    describe('proxyRequest', function() {
        it('forwards proxied and encoded URL to Ext.Ajax.request', function() {
            spyOn(Ext.Ajax, 'request');
            var url = 'http://someotherurl';

            Ext.ux.Ajax.proxyRequest({
                url: url
            });

            expect(Ext.Ajax.request).toHaveBeenCalledWith({
                url: Ext.ux.Ajax.proxyUrl + 'http%3A%2F%2Fsomeotherurl'
            });
        });
    });
});
