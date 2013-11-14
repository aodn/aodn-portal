
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.details.BoundingBox", function() {
    
    var bbox;
    
    beforeEach(function() {
        bbox = new Portal.details.BoundingBox();

        bbox.setBounds({bottom: -17, top: -19, left: -51, right: -13});
    });
    
    it("setBounds should set bounds of bounding box", function() {
        bbox.setBounds({bottom: -25, top: -22, left: -55, right: -20});
            
        expect(bbox.southBL.value).toBe('-25');
        expect(bbox.northBL.value).toBe('-22');
        expect(bbox.eastBL.value).toBe('-20');
        expect(bbox.westBL.value).toBe('-55');
    });

    it("getNorthBL should return north bounding latitude", function() {
        expect(bbox.getNorthBL()).toBe(-19);
    });

    it("getEastBL should return east bounding longitude", function() {
        expect(bbox.getEastBL()).toBe(-13);
    });

    it("getSouthBL should return south bounding latitude", function() {
        expect(bbox.getSouthBL()).toBe(-17);
    });

    it("getWestBL should return west bounding longitude", function() {
        expect(bbox.getWestBL()).toBe(-51);
    });

});
