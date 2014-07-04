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
});
