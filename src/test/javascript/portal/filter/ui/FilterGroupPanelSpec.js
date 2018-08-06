describe("Portal.filter.ui.FilterGroupPanel", function() {

    var filterGroupPanel;
    var filterPanel;
    var filters;
    var dataCollection;

    beforeEach(function() {
        dataCollection = {
            getFilters: function() {
                return filters;
            },
            on: noOp
        };

        filterGroupPanel = new Portal.filter.ui.FilterGroupPanel({
            dataCollection:dataCollection
        });
    });

    afterEach(function() {
        filters = undefined;
    });

    describe('_filtersLoaded', function() {

        beforeEach(function() {
            filters = [{}];

            filterPanel = {
                needsFilterRange: returns(false)
            };

            spyOn(filterGroupPanel, '_updateAndShow');
            spyOn(filterGroupPanel, '_sortFilters');
            spyOn(filterGroupPanel, '_createFilterPanel').andReturn(filterPanel);

            filterGroupPanel._filtersLoaded(filters);
        });

        it('creates a filter panel', function() {

            expect(filterGroupPanel._createFilterPanel).toHaveBeenCalled();
        });

        it('sorts the filters according to sort order', function() {

            expect(filterGroupPanel._sortFilters).toHaveBeenCalled();
        });

        it('calls _updateAndShow', function() {

            expect(filterGroupPanel._updateAndShow).toHaveBeenCalled();
        });
    });

    describe('the _filtersLoaded function', function() {

        beforeEach(function() {
            filterPanel = {
                needsFilterRange: returns(false)
            };

            spyOn(filterGroupPanel, 'showErrorMessage');
            spyOn(filterGroupPanel, '_createFilterPanel').andReturn(filterPanel);
        });

        it('calls the _addErrorMessage function when filters set but has no filters configured', function() {

            filterGroupPanel._filtersLoaded([]);

            expect(filterGroupPanel.showErrorMessage).toHaveBeenCalled();
        });

        it('_addErrorMessage function not called when filters are configured', function() {

            spyOn(filterGroupPanel, '_sortFilters');

            filterGroupPanel._filtersLoaded(["Boolean", "Combo"]);

            expect(filterGroupPanel.showErrorMessage).not.toHaveBeenCalled();
        });
    });
});
