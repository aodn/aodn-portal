describe('Portal.cart.DownloadHandler', function () {
    var handler;

    describe('OnlineResource with only name', function() {
        beforeEach(function() {
            handler = new Portal.cart.DownloadHandler({
                name: 'some_name'
            });
        });

        it('_resourceName returns value', function() {
            expect(handler._resourceName()).toBe('some_name');
        });

        it('_resourceHref returns undefined', function() {
            expect(handler._resourceHref()).toBeUndefined();
        });

        it('_resourceHrefNotEmpty returns false', function() {
            expect(handler._resourceHrefNotEmpty()).toBeFalsy();
        });
    });

    describe('OnlineResource with only href', function() {
        beforeEach(function() {
            handler = new Portal.cart.DownloadHandler({
                href: 'some_url'
            });
        });

        it('_resourceHref returns value', function() {
            expect(handler._resourceHref()).toBe('some_url');
        });

        it('_resourceName returns undefined', function() {
            expect(handler._resourceName()).toBeUndefined();
        });

        it('_resourceNameNotEmpty returns false', function() {
            expect(handler._resourceNameNotEmpty()).toBeFalsy();
        });
    });

    describe('OnlineResource with href and name', function() {
        beforeEach(function() {
            handler = new Portal.cart.DownloadHandler({
                href: 'some_url',
                name: 'some_name'
            });
        });

        it('_resourceHrefNotEmpty returns true', function() {
            expect(handler._resourceHrefNotEmpty()).toBeTruthy();
        });

        it('_resourceNameNotEmpty returns true', function() {
            expect(handler._resourceNameNotEmpty()).toBeTruthy();
        });
    });

    it('handlesForDataCollection', function() {
        Portal.cart.DownloadHandler._constructify = function(x) { return x; }
        Portal.cart.DownloadHandler._protocolHandlerMapping = returns([
            { handler: 'handler1', protocol: 'protocol1' },
            { handler: 'handler2', protocol: 'protocol2' },
            { handler: 'handler3', protocol: 'protocol3' }
        ]);

        var dataCollection = {
            getAllLinks: returns([
                { protocol: 'protocol3', url: 'url3' },
                { protocol: 'protocol1', url: 'url1' },
                { protocol: 'protocol2', url: 'url2' },
                { protocol: 'protocol2', url: 'url5' },
                { protocol: 'protocol4', url: 'url4' }
            ])
        };

        var expectedHandlers = [
            { handler: 'handler1', link: { protocol: 'protocol1', url: 'url1' } },
            { handler: 'handler2', link: { protocol: 'protocol2', url: 'url2' } },
            { handler: 'handler2', link: { protocol: 'protocol2', url: 'url5' } },
            { handler: 'handler3', link: { protocol: 'protocol3', url: 'url3' } }
        ];

        expect(expectedHandlers).toEqual(Portal.cart.DownloadHandler.handlersForDataCollection(dataCollection));
    });
});
