describe("Portal.filter.FilterService", function() {

    var service = new Portal.filter.FilterService();
    var successCallback;
    var failureCallback;
    var callbackScope;
    var testDataCollection;

    beforeEach(function() {

        successCallback = jasmine.createSpy('successCallback');
        failureCallback = jasmine.createSpy('failureCallback');
        callbackScope = {};
        testDataCollection = {
            getLayerSelectionModel: returns({
                getSelectedLayer: returns({server: {type: ''}})
            }),
            getFiltersRequestParams: noOp
        };
    });

    describe('loadFilters', function() {

        it('calls success callback', function() {

            spyOnAjaxAndReturn('[]', 200);

            service.loadFilters(
                testDataCollection,
                successCallback,
                failureCallback,
                callbackScope
            );

            expect(successCallback).toHaveBeenCalledWith([]);
            expect(failureCallback).not.toHaveBeenCalled();
        });

        it('calls failure callback', function() {

            spyOnAjaxAndReturn(null, 500);

            service.loadFilters(
                testDataCollection,
                successCallback,
                failureCallback,
                callbackScope
            );

            expect(successCallback).not.toHaveBeenCalled();
            expect(failureCallback).toHaveBeenCalled();
        });
    });

    describe('loadFilterRange', function() {

        it('calls success callback', function() {

            spyOnAjaxAndReturn('[]', 200);

            service.loadFilterRange(
                'some_filter',
                testDataCollection,
                successCallback,
                failureCallback,
                callbackScope
            );

            expect(successCallback).toHaveBeenCalledWith([]);
            expect(failureCallback).not.toHaveBeenCalled();
        });

        it('calls failure callback', function() {

            spyOnAjaxAndReturn(null, 500);

            service.loadFilterRange(
                'some_filter',
                testDataCollection,
                successCallback,
                failureCallback,
                callbackScope
            );

            expect(successCallback).not.toHaveBeenCalled();
            expect(failureCallback).toHaveBeenCalled();
        });
    });

    describe('_determinePrimaryFilters', function() {

        it('marks single time filter as primary', function() {

            var testFilters = [
                new Portal.filter.NumberFilter(),
                new Portal.filter.DateFilter(),
                new Portal.filter.BooleanFilter()
            ];

            service._determinePrimaryFilters(testFilters);

            expect(testFilters[0].isPrimary()).not.toBeTruthy();
            expect(testFilters[1].isPrimary()).toBeTruthy();
            expect(testFilters[2].isPrimary()).not.toBeTruthy();
        });

        it('leaves multiple date filters unchanged', function() {

            var testFilters = [
                new Portal.filter.NumberFilter(),
                new Portal.filter.DateFilter(),
                new Portal.filter.BooleanFilter(),
                new Portal.filter.DateFilter()
            ];

            service._determinePrimaryFilters(testFilters);

            expect(testFilters[0].isPrimary()).not.toBeTruthy();
            expect(testFilters[1].isPrimary()).not.toBeTruthy();
            expect(testFilters[2].isPrimary()).not.toBeTruthy();
            expect(testFilters[3].isPrimary()).not.toBeTruthy();
        });
    });

    var spyOnAjaxAndReturn = function(responseText, status) {
        spyOn(Ext.Ajax, 'request').andCallFake(function(opts) {

            var response = {
                responseText: responseText,
                status: status
            };

            var callback = status == 200 ? opts.success : opts.failure;

            callback.call(opts.scope, response, opts)
        });
    };
});
