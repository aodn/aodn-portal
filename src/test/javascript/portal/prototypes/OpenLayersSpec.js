
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("OpenLayers.Layer.WMS", function() {

    var openLayer;

    beforeEach(function() {
        openLayer = new OpenLayers.Layer.WMS();
    });

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
        openLayer.bboxMinX = 10;
        openLayer.bboxMinY = 10;
        openLayer.bboxMaxX = 10;
        openLayer.bboxMaxY = 10;
        expect(openLayer.hasBoundingBox()).toBeTruthy();
    });

    describe("_is130", function() {
        it("returns false for ncwms", function() {
            openLayer.isNcwms = function() { return true };
            openLayer.server= {type: "NCWMS 1.3.0"};
            expect(openLayer._is130()).toBeFalsy();
        });

        it("returns true for 1.3.0 when not NCWMS", function() {
            openLayer.server= {type: "WMS 1.3.0"};
            expect(openLayer._is130()).toBeTruthy();
        });
    });
});
