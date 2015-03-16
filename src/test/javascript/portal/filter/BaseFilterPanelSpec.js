
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.filter.ui.BaseFilterPanel", function() {

    describe("newFilterPanelFor()", function() {

        var newFilterPanelFor = Portal.filter.ui.BaseFilterPanel.newFilterPanelFor;

        it("should return EmptyFilterPanel", function() {
            expectNewFilterPanelForString('EmptyFilterPanel', '');
        });

        it("should create ComboFilterPanel", function() {
            expectNewFilterPanelForString('ComboFilterPanel', 'String');
        });

        it("should create DateFilterPanel", function() {
            expectNewFilterPanelForString('DateFilterPanel', 'Date');
        });

        it("should create BooleanFilterPanel", function() {
            expectNewFilterPanelForString('BooleanFilterPanel', 'Boolean');
        });

        it("should create GeometryFilterPanel", function() {
            expectNewFilterPanelForString('GeometryFilterPanel', 'geometrypropertytype');
        });

        it("should create NumberFilterPanel", function() {
            expectNewFilterPanelForString('NumberFilterPanel', 'decimal');
        });

        var expectNewFilterPanelForString = function(filterPanelType, filterTypeAsString) {

            var constructorSpy = spyOn(Portal.filter.ui, filterPanelType);

            newFilterPanelFor({
                layer: {},
                filter: {
                    getType: function() { return filterTypeAsString },
                    getName: function() { return 'filter name' }
                }
            });

            expect(constructorSpy).toHaveBeenCalled();
        };
    });

    describe("isVisualised()", function() {

        var buildFilterWithVisualised = function(isVisualised) {

            spyOn(Portal.filter.ui.BaseFilterPanel.prototype, '_createField');

            return new Portal.filter.ui.BaseFilterPanel({
                layer: {},
                filter: {
                    getVisualised: function() { return isVisualised }
                }
            });
        };

        it("should return true when the filter is for downloads only", function() {
            var baseFilter = buildFilterWithVisualised(true);

            expect(baseFilter.isVisualised()).toBe(true);
        });

        it("should return false when the filter is not only for downloads", function() {
            var baseFilter = buildFilterWithVisualised(false);

            expect(baseFilter.isVisualised()).toBe(false);
        });
    });
});
