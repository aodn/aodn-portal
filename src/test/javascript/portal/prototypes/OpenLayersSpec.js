
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("OpenLayers.Layer.WMS", function() {
    
    var openLayer = new OpenLayers.Layer.WMS();
    
    it("no bounding box", function() {
        expect(openLayer.hasBoundingBox()).toBeFalsy();
    });
    
    it("no bounding box", function() {
        openLayer.bboxMinX = 10;
        expect(openLayer.hasBoundingBox()).toBeFalsy();
    });
    
    it("no bounding box", function() {
        openLayer.bboxMinY = 10;
        expect(openLayer.hasBoundingBox()).toBeFalsy();
    });
    
    it("no bounding box", function() {
        openLayer.bboxMaxX = 10;
        expect(openLayer.hasBoundingBox()).toBeFalsy();
    });
    
    it("has bounding box", function() {
        openLayer.bboxMaxY = 10;
        expect(openLayer.hasBoundingBox()).toBeTruthy();
    });
});
