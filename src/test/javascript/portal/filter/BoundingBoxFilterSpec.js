
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.filter.BoundingBoxFilter", function() {

    describe("isDownloadOnly()", function() {

        it("Should return true", function() {
            var boundingBoxFilter = new Portal.filter.BoundingBoxFilter();
            
            expect(boundingBoxFilter.isDownloadOnly()).toBe(true);
        });
        
    });

});
