
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.filter.ui.BaseFilterPanel", function() {

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
