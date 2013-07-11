
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.seaarch.SearchResultBounds", function() {

    var bbox;

    beforeEach(function() {
        bbox = {
            west: -100,
            south: -80,
            east: 170,
            north: 30
        };
    });

    describe('bounding box calculations', function() {

        it('gets the difference between east and west', function() {
            var bounds = new Portal.search.SearchResultsBounds({ bbox: bbox });
            expect(bounds._longitudeDiff()).toEqual(270);
        });

        it('gets the difference between east and west in the eastern hemisphere', function() {
            bbox.west = -100;
            bbox.east = -1;
            var bounds = new Portal.search.SearchResultsBounds({ bbox: bbox });
            expect(bounds._longitudeDiff()).toEqual(99);
        });

        it('gets the difference between east and west in the western hemisphere', function() {
            bbox.west = 1;
            bbox.east = 100;
            var bounds = new Portal.search.SearchResultsBounds({ bbox: bbox });
            expect(bounds._longitudeDiff()).toEqual(99);
        });

        it('gets the difference between north and south', function() {
            var bounds = new Portal.search.SearchResultsBounds({ bbox: bbox });
            expect(bounds._latitudeDiff()).toEqual(110);
        });

        it('gets the difference between north and south in the northern hemisphere', function() {
            bbox.south = 10;
            bbox.north = 60;
            var bounds = new Portal.search.SearchResultsBounds({ bbox: bbox });
            expect(bounds._latitudeDiff()).toEqual(50);
        });

        it('gets the difference between north and south in the southern hemisphere', function() {
            bbox.south = -80;
            bbox.north = -30;
            var bounds = new Portal.search.SearchResultsBounds({ bbox: bbox });
            expect(bounds._latitudeDiff()).toEqual(50);
        });

    });

    describe('bounding box calculations across the anti meridian', function() {
        it('gets the difference between east and west', function() {
            bbox.east = -170;
            bbox.west = 100;

            var bounds = new Portal.search.SearchResultsBounds({ bbox: bbox });
            expect(bounds._longitudeDiff()).toEqual(90);
        });

        it('gets the difference between east and west when west is the prime meridian', function() {
            bbox.east = -170;
            bbox.west = 0;

            var bounds = new Portal.search.SearchResultsBounds({ bbox: bbox });
            expect(bounds._longitudeDiff()).toEqual(190);
        });

        it('gets the difference between east and west when east is the prime meridian', function() {
            bbox.east = 0;
            bbox.west = -100;

            var bounds = new Portal.search.SearchResultsBounds({ bbox: bbox });
            expect(bounds._longitudeDiff()).toEqual(100);
        });

    });

    describe('bounding box calculations across the prime meridian', function() {
        it('gets the difference between east and west', function() {
            bbox.east = 170;
            bbox.west = -100;

            var bounds = new Portal.search.SearchResultsBounds({ bbox: bbox });
            expect(bounds._longitudeDiff()).toEqual(270);
        });

        it('gets the difference between east and west when west is the anti meridian', function() {
            bbox.east = -170;
            bbox.west = 180;

            var bounds = new Portal.search.SearchResultsBounds({ bbox: bbox });
            expect(bounds._longitudeDiff()).toEqual(10);
        });

        it('gets the difference between east and west when east is the anti meridian', function() {
            bbox.east = 180;
            bbox.west = 100;

            var bounds = new Portal.search.SearchResultsBounds({ bbox: bbox });
            expect(bounds._longitudeDiff()).toEqual(80);
        });

        it('gets the difference between east and west when east is the anti meridian and west is negative', function() {
            bbox.east = 180;
            bbox.west = -100;

            var bounds = new Portal.search.SearchResultsBounds({ bbox: bbox });
            expect(bounds._longitudeDiff()).toEqual(280);
        });

    });

    describe('bounding box calculations across the equator', function() {
        it('gets the difference between north and south', function() {
            bbox.south = -30;
            bbox.north = 30;

            var bounds = new Portal.search.SearchResultsBounds({ bbox: bbox });
            expect(bounds._latitudeDiff()).toEqual(60);
        });

        it('gets the difference between north and south when north is the equator', function() {
            bbox.south = -30;
            bbox.north = 0;

            var bounds = new Portal.search.SearchResultsBounds({ bbox: bbox });
            expect(bounds._latitudeDiff()).toEqual(30);
        });

        it('gets the difference between north and south when south is the equator', function() {
            bbox.south = 0;
            bbox.north = 30;

            var bounds = new Portal.search.SearchResultsBounds({ bbox: bbox });
            expect(bounds._latitudeDiff()).toEqual(30);
        });

        it('gets the difference between north and south when in southern hemisphere', function() {
            bbox.south = -80;
            bbox.north = -30;

            var bounds = new Portal.search.SearchResultsBounds({ bbox: bbox });
            expect(bounds._latitudeDiff()).toEqual(50);
        });

        it('gets the difference between north and south when in northern hemisphere', function() {
            bbox.south = 30;
            bbox.north = 80;

            var bounds = new Portal.search.SearchResultsBounds({ bbox: bbox });
            expect(bounds._latitudeDiff()).toEqual(50);
        });
    });

    describe('calculating the east bound', function() {
        it('sets east to be the anti meridian if the extended bounds extends past there', function() {
            bbox.east = -170;
            bbox.west = 100;
            var bounds = new Portal.search.SearchResultsBounds({ bbox: bbox, bboxPerc: 10 });
            expect(bounds._eastBound()).toEqual(180);
        });

        it('sets east bound', function() {
            bbox.east = 100;
            bbox.west = 95;
            var bounds = new Portal.search.SearchResultsBounds({ bbox: bbox, bboxPerc: 10 });
            expect(bounds._eastBound()).toEqual(150);
        });

        it('sets east bound when in western hemisphere', function() {
            bbox.east = -100;
            bbox.west = -105;
            var bounds = new Portal.search.SearchResultsBounds({ bbox: bbox, bboxPerc: 10 });
            expect(bounds._eastBound()).toEqual(-150);
        });
    });

    // Exceed the max bounds and ensure max is used

});
