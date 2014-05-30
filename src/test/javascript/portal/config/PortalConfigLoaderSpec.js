
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.config.PortalConfigLoader", function() {

    var loader;
    var successFn;
    var failureFn;

    beforeEach(function() {

        successFn = jasmine.createSpy('success');
        failureFn = jasmine.createSpy('failure');

        loader = new Portal.config.PortalConfigLoader();
        loader.portal = {};
        loader.onSuccess = successFn;
        loader.onFailure = failureFn;
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

                loader.appConfigLoadSuccess({responseText: '{"a":"b"}'});
                loader.viewportConfigLoadSuccess({responseText: '{"a":"b"}'});
                loader.waitForConfigsAndComplete();

                expectSuccess();
            });
        });

        describe('App config loads first', function() {

            it('Should complete initialisation', function() {

                loader.viewportConfigLoadSuccess({responseText: '{"a":"b"}'});
                loader.appConfigLoadSuccess({responseText: '{"a":"b"}'});
                loader.waitForConfigsAndComplete();

                expectSuccess();
            });
        });

        describe('App config load fails', function() {

            it('Should not complete initialisation', function() {

                loader.appConfigLoadFailure({});
                loader.viewportConfigLoadSuccess({responseText: '{"a":"b"}'});
                loader.waitForConfigsAndComplete();

                expectFailure();
            });
        });

        describe('Viewport config load fails', function() {

            it('Should not complete initialisation', function() {

                loader.appConfigLoadSuccess({responseText: '{"a":"b"}'});
                loader.viewportConfigLoadFailure({});
                loader.waitForConfigsAndComplete();

                expectFailure();
            });
        });

        describe('Viewport config invalid response', function() {

            it('Should not complete initialisation', function() {

                loader.appConfigLoadSuccess({responseText: '{"a":"b"}'});
                loader.viewportConfigLoadSuccess({responseText: 'sadf (invalid json)'});
                loader.waitForConfigsAndComplete();

                expectFailure();
            });
        });
    });
});
