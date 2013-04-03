
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.config.PortalConfigLoader", function() {

    var loader;
    var successFn = jasmine.createSpy('success');
    var failureFn = jasmine.createSpy('failure');

    beforeEach(function() {

        loader = new Portal.config.PortalConfigLoader();
        loader.portal = {};
        loader.onSuccess = successFn;
        loader.onFailure = failureFn;
    });

    afterEach(function() {

        successFn.reset();
        failureFn.reset();
    });

    function expectSuccess() {

        expect(successFn).toHaveBeenCalled();
        expect(failureFn).not.toHaveBeenCalled();
    }

    function expectFailure() {

        expect(successFn).not.toHaveBeenCalled();
        expect(failureFn).toHaveBeenCalled();
    }

    describe('Async loading of viewport config and app config', function() {

        describe('Viewport config loads first', function() {

            it('Should complete initialisation', function() {

                loader.appConfigStoreLoadComplete(null, null, true);
                loader.viewportConfigLoadSuccess({responseText: '{"a":"b"}'});
                loader.waitForConfigsAndComplete();

                expectSuccess();
            });
        });

        describe('App config loads first', function() {

            it('Should complete initialisation', function() {

                loader.viewportConfigLoadSuccess({responseText: '{"a":"b"}'});
                loader.appConfigStoreLoadComplete(null, null, true);
                loader.waitForConfigsAndComplete();

                expectSuccess();
            });
        });

        describe('App config load fails', function() {

            it('Should not complete initialisation', function() {

                loader.appConfigStoreLoadComplete(null, null, false);
                loader.viewportConfigLoadSuccess({responseText: '{"a":"b"}'});
                loader.waitForConfigsAndComplete();

                expectFailure();
            });
        });

        describe('Viewport config load fails', function() {

            it('Should not complete initialisation', function() {

                loader.appConfigStoreLoadComplete(null, null, true);
                loader.viewportConfigLoadFailure({});
                loader.waitForConfigsAndComplete();

                expectFailure();
            });
        });

        describe('Viewport config invalid response', function() {

            it('Should not complete initialisation', function() {

                loader.appConfigStoreLoadComplete(null, null, true);
                loader.viewportConfigLoadSuccess({responseText: 'sadf (invalid json)'});
                loader.waitForConfigsAndComplete();

                expectFailure();
            });
        });
    });
});