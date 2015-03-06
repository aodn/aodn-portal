
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.filter.BaseFilterPanel", function() {

    describe("newFilterPanelFor()", function() {

        var newFilterPanelFor = Portal.filter.BaseFilterPanel.newFilterPanelFor;
        var filter;
        var panel;

        beforeEach(function() {

            filter = {};
        });

        it("should return undefined", function() {

            filter.getType = function() { return null };

            panel = newFilterPanelFor({
                layer: {},
                filter: filter
            });

            expect(panel).toBeUndefined();
        });

        it("should create ComboFilterPanel", function() {
            expectNewFilterPanelForString('ComboFilterPanel', 'String');
        });

        it("should create DateFilterPanel", function() {
            expectNewFilterPanelForString('DateFilterPanel', 'Date');
        });

        it("should create DateFilterPanel", function() {
            expectNewFilterPanelForString('DateFilterPanel', 'DateRange');
        });

        it("should create BooleanFilterPanel", function() {
            expectNewFilterPanelForString('BooleanFilterPanel', 'Boolean');
        });

        it("should create GeometryFilterPanel", function() {
            expectNewFilterPanelForString('GeometryFilterPanel', 'BoundingBox');
        });

        it("should create NumberFilterPanel", function() {
            expectNewFilterPanelForString('NumberFilterPanel', 'Number');
        });

        var expectNewFilterPanelForString = function(filterPanelType, filterTypeAsString) {

            filter.getType = function() { return filterTypeAsString };
            var constructorSpy = spyOn(Portal.filter, filterPanelType);

            newFilterPanelFor({
                layer: {},
                filter: filter
            });

            expect(constructorSpy).toHaveBeenCalled();
        };
    });

    describe("isVisualised()", function() {

        var buildFilterWithVisualised = function(isVisualised) {

            return new Portal.filter.BaseFilterPanel({
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
