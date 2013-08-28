
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

            expect(panel).toBe(undefined);
        });

        it("Should create ComboFilter", function() {

            filter.type = "String";

            var constructorSpy = spyOn(Portal.filter, 'ComboFilter');

            newFilterPanelFor(filter);

            expect(constructorSpy).toHaveBeenCalled();
        });

        it("Should create TimeFilter", function() {

            filter.type = "Date";

            var constructorSpy = spyOn(Portal.filter, 'TimeFilter');

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
});
