
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

        it("should create BoundingBoxFilterPanel", function() {
            expectNewFilterPanelForString('BoundingBoxFilterPanel', 'BoundingBox');
        });

        it("should create NumberFilterPanel", function() {
            expectNewFilterPanelForString('NumberFilterPanel', 'Number');
        });

        var expectNewFilterPanelForString = function(filterPanelType, filterTypeAsString) {
            filter.type = filterTypeAsString;
            var constructorSpy = spyOn(Portal.filter, filterPanelType);
            newFilterPanelFor({
                layer: {},
                filter: filter
            });
            expect(constructorSpy).toHaveBeenCalled();
        };
    });

    describe("isVisualised()", function() {
        var buildFilter = function(filterConfig) {
            var baseFilter = new Portal.filter.BaseFilterPanel({
                layer: {},
                filter: filterConfig
            });

            return baseFilter;
        }

        it("should return true when the filter is for downloads only", function() {
            var baseFilter = buildFilter({
                visualised: true
            });

            expect(baseFilter.isVisualised()).toBe(true);
        });

        it("should return false when the filter is not only for downloads", function() {
            var baseFilter = buildFilter({
                visualised: false
            });

            expect(baseFilter.isVisualised()).toBe(false);
        });
    });
});
