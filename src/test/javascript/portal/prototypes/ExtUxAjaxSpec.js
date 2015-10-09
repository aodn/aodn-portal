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

    describe('setContentType', function() {
        describe('adds content type', function() {
            it('empty headers', function() {
                var expectedParams = {
                    headers: {
                        'Content-Type': 'content-type'
                    }
                };
                expect(Ext.ux.Ajax.setContentType({}, 'content-type')).toEqual(expectedParams);
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
                expect(Ext.ux.Ajax.setContentType(params, 'content-type')).toEqual(expectedParams);
            });
        });
    });

    describe('proxyRequestXML', function() {
        it('adds Content-Type application/xml', function() {
            spyOn(Ext.ux.Ajax, 'setContentType');
            spyOn(Ext.ux.Ajax, 'proxyRequest');

            Ext.ux.Ajax.proxyRequestXML({});

            expect(Ext.ux.Ajax.setContentType).toHaveBeenCalledWith({}, 'application/xml');
            expect(Ext.ux.Ajax.proxyRequest).toHaveBeenCalled();
        });
    });

    describe('proxyRequestJSON', function() {
        it('adds Content-Type application/json', function() {
            spyOn(Ext.ux.Ajax, 'setContentType');
            spyOn(Ext.ux.Ajax, 'proxyRequest');

            Ext.ux.Ajax.proxyRequestJSON({});

            expect(Ext.ux.Ajax.setContentType).toHaveBeenCalledWith({}, 'application/json');
            expect(Ext.ux.Ajax.proxyRequest).toHaveBeenCalled();
        });
    });
});
