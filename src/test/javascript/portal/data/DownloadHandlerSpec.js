/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

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

    describe('static methods', function() {
        describe('handlesForDataCollection', function() {
            var handlersReturned;

            beforeEach(function() {
                spyOn(Portal.cart.DownloadHandler, '_handlersForLink').andReturn([{}, {}]);

                handlersReturned = Portal.cart.DownloadHandler.handlersForDataCollection({
                    getAllLinks: returns([{}, {}, {}])
                });
            });

            it('calls _handlersForLink many times', function() {
                expect(Portal.cart.DownloadHandler._handlersForLink.callCount).toBe(3);
            });

            it('returns a flat array of handlers (i.e. not an array of arrays)', function() {
                expect(handlersReturned).toEqual([{}, {}, {}, {}, {}, {}]);
            });
        });

        describe('_handlersForLink', function() {
            var singleHandler;
            var doubleHandlerOne;
            var doubleHandlerTwo;

            beforeEach(function() {
                singleHandler = jasmine.createSpy('singleHandler');
                doubleHandlerOne = jasmine.createSpy('doubleHandlerOne');
                doubleHandlerTwo = jasmine.createSpy('doubleHandlerTwo');

                Portal.cart.DownloadHandler._downloadHandlerConstructorForProtocol = function(protocol) {
                    return {
                        'protocolWithOneHandler': singleHandler,
                        'protocolWithMultipleHandlers': [
                            doubleHandlerOne,
                            doubleHandlerTwo
                        ]
                    }[protocol] || [];
                };
            });

            it('calls constructor if one is found', function() {
                Portal.cart.DownloadHandler._handlersForLink({
                    protocol: 'protocolWithOneHandler'
                });

                expect(singleHandler).toHaveBeenCalled();
                expect(doubleHandlerOne).not.toHaveBeenCalled();
                expect(doubleHandlerTwo).not.toHaveBeenCalled();
            });

            it('calls all constructors if many are found', function() {
                Portal.cart.DownloadHandler._handlersForLink({
                    protocol: 'protocolWithMultipleHandlers'
                });

                expect(singleHandler).not.toHaveBeenCalled();
                expect(doubleHandlerOne).toHaveBeenCalled();
                expect(doubleHandlerTwo).toHaveBeenCalled();
            });

            it('returns an empty array if no constructors are found', function() {
                Portal.cart.DownloadHandler._handlersForLink({
                    protocol: 'protocolWithNoHandlers'
                });

                expect(singleHandler).not.toHaveBeenCalled();
                expect(doubleHandlerOne).not.toHaveBeenCalled();
                expect(doubleHandlerTwo).not.toHaveBeenCalled();
            });
        });
    });
});
