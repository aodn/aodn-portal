describe("Portal.filter.ui.AlaFilterGroupPanel", function() {

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

        filterGroupPanel = new Portal.filter.ui.AlaFilterGroupPanel({
            dataCollection: dataCollection,
            map: {
                events: {
                    on: noOp
                }
            }
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
            spyOn(filterGroupPanel, '_addFilterPanels').andReturn(filterPanel);

            filterGroupPanel._filtersLoaded(filters);
        });

        it('sorts filter panels', function() {
            expect(filterGroupPanel._sortFilters).toHaveBeenCalled();
        });

        it('adds filter panels', function() {
            expect(filterGroupPanel._addFilterPanels).toHaveBeenCalled();
        });

        it('calls _updateAndShow', function() {
            expect(filterGroupPanel._updateAndShow).toHaveBeenCalled();
        });
    });

    describe('_addFilterPanels', function() {
        beforeEach(function() {
            filters = [
                {
                    constructor: Portal.filter.AlaSpeciesStringArrayFilter,
                    isVisualised: returns(true),
                    hasValue: returns(true),
                    getLabel: returns("Occurances"),
                    type: 'alastringarray',
                    getHumanReadableForm: returns('one')
                },
                {
                    constructor: Portal.filter.DateFilter,
                    isVisualised: returns(false),
                    hasValue: returns(true),
                    getLabel: returns("Temporal Filter"),
                    getHumanReadableForm: returns('two'),
                    type: 'datetime',
                    isPrimary: noOp
                }
            ];
            spyOn(filterGroupPanel, '_organiseFilterPanels');
        });

        it('adds ALA and temporal filters in the correct order', function() {
            filterGroupPanel._addFilterPanels(filters);
            expect(filterGroupPanel.filterPanels[0]).toBeInstanceOf(Portal.filter.ui.AlaSpeciesFilterPanel);
            expect(filterGroupPanel.filterPanels[1]).toBeInstanceOf(Portal.filter.ui.DateFilterPanel);
            expect(filterGroupPanel._organiseFilterPanels).toHaveBeenCalled();
        });
    });
});