
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

    describe('Async loading of app config', function() {
        it('calls success callback', function() {
            loader._configLoadSuccess({responseText: '{"a":"b"}'});
            expectSuccess();
        });

        it('calls failure callback', function() {
            loader._configLoadFailure({responseText: '{"a":"b"}'});
            expectFailure();
        });

        it('invalid json results in failure', function() {
            loader._configLoadSuccess({responseText: 'sadf (invalid json)'});
            expectFailure();
        });
    });
});
