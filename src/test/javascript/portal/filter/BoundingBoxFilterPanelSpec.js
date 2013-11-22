
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.filter.BoundingBoxFilterPanel", function() {

    var boundingBoxFilter;

    beforeEach(function() {
        spyOn(Portal.filter.BoundingBoxFilterPanel.prototype, 'setLayerAndFilter');
        boundingBoxFilter = new Portal.filter.BoundingBoxFilterPanel({});
    });

    it('colspan should be 2', function() {
        expect(boundingBoxFilter.colspan).toBe(2);
    });

    it('filter name should be undefined', function() {
        boundingBoxFilter.filter = {
            name: 'this name should be ignored'
        };

        expect(boundingBoxFilter.getFilterName()).toEqual(undefined);
    });

    it("isDownloadOnly() should return true", function() {
        expect(boundingBoxFilter.isDownloadOnly()).toBe(true);
    });
});
