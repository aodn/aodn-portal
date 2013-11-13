
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.filter.BoundingBoxFilterPanel", function() {

    describe("isDownloadOnly()", function() {

        it("Should return true", function() {

            spyOn(Portal.filter.BoundingBoxFilterPanel.prototype, 'setLayerAndFilter');

            var boundingBoxFilter = new Portal.filter.BoundingBoxFilterPanel({});

            expect(boundingBoxFilter.isDownloadOnly()).toBe(true);
        });
    });
});
