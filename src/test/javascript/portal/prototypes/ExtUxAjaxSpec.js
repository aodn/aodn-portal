/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Ext4.ux.Ajax", function() {
    describe('proxyRequest', function() {
        it('forwards proxied and encoded URL to Ext4.Ajax.request', function() {
            spyOn(Ext4.Ajax, 'request');
            var url = 'http://someotherurl';

            Ext4.ux.Ajax.proxyRequest({
                url: url
            });

            expect(Ext4.Ajax.request).toHaveBeenCalledWith({
                url: Ext4.ux.Ajax.proxyUrl + 'http%3A%2F%2Fsomeotherurl'
            });
        });
    });

    describe('setContentType', function() {
        describe('adds content type', function() {
            it('empty headers', function() {
                var expectedParams = {
                    headers: {
                        'Content-Type': 'content-type'
                    }
                };
                expect(Ext4.ux.Ajax.setContentType({}, 'content-type')).toEqual(expectedParams);
            });

            it('existing headers', function() {
                var params = {
                    headers: {
                        'test': 'test'
                    }
                };

                var expectedParams = {
                    headers: {
                        'test': 'test',
                        'Content-Type': 'content-type'
                    }
                };
                expect(Ext4.ux.Ajax.setContentType(params, 'content-type')).toEqual(expectedParams);
            });
        });
    });

    describe('proxyRequestXML', function() {
        it('adds Content-Type application/xml', function() {
            spyOn(Ext4.ux.Ajax, 'setContentType');
            spyOn(Ext4.ux.Ajax, 'proxyRequest').andCallFake(function() {});

            Ext4.ux.Ajax.proxyRequestXML({});

            expect(Ext4.ux.Ajax.setContentType).toHaveBeenCalledWith({}, 'application/xml');
            expect(Ext4.ux.Ajax.proxyRequest).toHaveBeenCalled();
        });
    });

    describe('proxyRequestJSON', function() {
        it('adds Content-Type application/json', function() {
            spyOn(Ext4.ux.Ajax, 'setContentType');
            spyOn(Ext4.ux.Ajax, 'proxyRequest').andCallFake(function() {});

            Ext4.ux.Ajax.proxyRequestJSON({});

            expect(Ext4.ux.Ajax.setContentType).toHaveBeenCalledWith({}, 'application/json');
            expect(Ext4.ux.Ajax.proxyRequest).toHaveBeenCalled();
        });
    });
});
