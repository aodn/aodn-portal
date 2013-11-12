
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.filter.BaseFilter", function() {

    describe("newFilterPanelFor()", function() {

        var newFilterPanelFor = Portal.filter.BaseFilter.newFilterPanelFor;
        var filter;
        var panel;

        beforeEach(function() {

            filter = {};
        });

        it("Should return undefined", function() {

            panel = newFilterPanelFor(filter);

            expect(panel).toBeUndefined();
        });

        it("Should create ComboFilter", function() {

            filter.type = "String";

            var constructorSpy = spyOn(Portal.filter, 'ComboFilter');

            newFilterPanelFor(filter);

            expect(constructorSpy).toHaveBeenCalled();
        });

        it("Should create DateFilter", function() {

            filter.type = "Date";

            var constructorSpy = spyOn(Portal.filter, 'DateFilter');

            newFilterPanelFor(filter);

            expect(constructorSpy).toHaveBeenCalled();
        });

        it("Should create BooleanFilter", function() {

            filter.type = "Boolean";

            var constructorSpy = spyOn(Portal.filter, 'BooleanFilter');

            newFilterPanelFor(filter);

            expect(constructorSpy).toHaveBeenCalled();
        });

        it("Should create BoundingBoxFilter", function() {

            filter.type = "BoundingBox";

            var constructorSpy = spyOn(Portal.filter, 'BoundingBoxFilter');

            newFilterPanelFor(filter);

            expect(constructorSpy).toHaveBeenCalled();
        });

        it("Should create NumberFilter", function() {

            filter.type = "Number";

            var constructorSpy = spyOn(Portal.filter, 'NumberFilter');

            newFilterPanelFor(filter);

            expect(constructorSpy).toHaveBeenCalled();
        });
    });

    describe("isDownloadOnly()", function() {
        var buildFilter = function(filterConfig) {
            var baseFilter = new Portal.filter.BaseFilter();

            baseFilter.setLayerAndFilter(null, filterConfig);

            return baseFilter;
        }

        it("Should return true when the filter is for downloads only", function() {
            var baseFilter = buildFilter({
                downloadOnly: true
            });

            expect(baseFilter.isDownloadOnly()).toBe(true);
        });

        it("Should return false when the filter is not only for downloads", function() {
            var baseFilter = buildFilter({
                downloadOnly: false
            });

            expect(baseFilter.isDownloadOnly()).toBe(false);
        });
    });

});
