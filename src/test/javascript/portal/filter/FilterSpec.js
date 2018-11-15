describe("Portal.filter.Filter", function() {
    var filter;

    beforeEach(function() {
        filter = new Portal.filter.Filter();
    });

    describe('classFor', function() {

        it('returns expected types for simple examples (not exhaustive)', function() {

            checkClassFor('integer', Portal.filter.NumberFilter);
            checkClassFor('string', Portal.filter.MultiStringFilter);
            checkClassFor('geometrypropertytype', Portal.filter.GeometryFilter);
            checkClassFor('boolean', Portal.filter.BooleanFilter);
            checkClassFor('date', Portal.filter.DateFilter);
            checkClassFor('depthstring', Portal.filter.StringDepthFilter);
            checkClassFor('unknown', null);
        });

        var checkClassFor = function(filterType, expectedResult) {

            var filterConfig = {
                type: filterType
            };

            expect(Portal.filter.Filter.classFor(filterConfig)).toEqual(expectedResult);
        };
    });

    describe('setValue()', function() {
        beforeEach(function() {
            spyOn(filter, 'fireEvent');

            filter.setValue('new value');
        });

        it('sets the value', function() {
            expect(filter.getValue()).toBe('new value');
        });

        it('fires VALUE_CHANGED event', function() {
            expect(filter.fireEvent).toHaveBeenCalledWith(Portal.filter.Filter.EVENTS.VALUE_CHANGED);
        });
    });

    describe('clearValue()', function() {
        beforeEach(function() {
            spyOn(filter, 'setValue');
        });

        it('calls setValue()', function() {
            filter.clearValue();

            expect(filter.setValue).toHaveBeenCalledWith(null);
        });
    });
});
