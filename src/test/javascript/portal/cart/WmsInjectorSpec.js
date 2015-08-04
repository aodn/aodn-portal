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

        it('includes placeholder when no text returned', function() {

            var entry = injector._getDataFilterEntry(collectionWithNoFilters);

            expect(entry).toContain(OpenLayers.i18n('emptyDownloadPlaceholder'));
        });
    });

    function fakeFilter(s) {

        return {
            getHumanReadableForm: returns(s),
            hasValue: returns(true)
        };
    }
});
