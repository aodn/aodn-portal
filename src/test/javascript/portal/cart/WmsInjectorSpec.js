describe('Portal.cart.WmsInjector', function() {

    var injector;
    var collectionWithFilters = {
        getFilters: returns([
            fakeFilter('Human'),
            fakeFilter('readable'),
            fakeFilter('description')
        ])
    };
    var collectionWithNoFilters = {
        getFilters: returns([])
    };

    beforeEach(function() {

        injector = new Portal.cart.WmsInjector();
    });

    describe('_getDataFilterEntry', function() {

        it('returns filters text', function() {

            var entry = injector._getDataFilterEntry(collectionWithFilters);

            expect(entry).toBe("Human<br />readable<br />description");
        });

        it('empty string returned when NoFilters', function() {

            var entry = injector._getDataFilterEntry(collectionWithNoFilters);

            expect(entry).toContain('');
        });
    });

    function fakeFilter(s) {

        return {
            getHumanReadableForm: returns(s),
            hasValue: returns(true)
        };
    }
});
