
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.data.ResultsStore", function() {

    describe('bounding box extraction', function() {

        it('adjusts an eastern bound for calculations over the anti meridian', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._adjustForAntiMeridian(-175)).toEqual(185);
        });

        it('adjusts an eastern bound that is 1 degree over the anti meridian', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._adjustForAntiMeridian(-179)).toEqual(181);
        });

        it('adjusts an eastern bound that is minutes over the anti meridian', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._adjustForAntiMeridian(-179.99)).toEqual(180.01);
        });

        it('unadjusts an eastern bound for calculations over the anti meridian', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._unAdjustForAntiMeridian(185)).toEqual(-175);
        });

        it('unadjusts an eastern bound that is 1 degree over the anti meridian', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._unAdjustForAntiMeridian(181)).toEqual(-179);
        });

        it('unadjusts an eastern bound that is minutes over the anti meridian', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._unAdjustForAntiMeridian(180.01)).toEqual(-179.99);
        });

        it('does not adjust an eastern bound that is between 0 and 180', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._unAdjustForAntiMeridian(170)).toEqual(170);
        });

        it('does not adjust an eastern bound that is 0', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._unAdjustForAntiMeridian(0)).toEqual(0);
        });

        it('does not adjust an eastern bound that is 180', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._unAdjustForAntiMeridian(180)).toEqual(180);
        });

        it('returns the greater of two values where first value is greater', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._greaterOf(1, 0)).toEqual(1);
        });

        it('returns the greater of two values where second value is greater', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._greaterOf(0, 1)).toEqual(1);
        });

        it('returns the greater of two values where they are equal', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._greaterOf(1, 1)).toEqual(1);
        });

        it('returns the greater of two values where the first value is undefined', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._greaterOf(undefined, 1)).toEqual(1);
        });

        it('returns the greater of two values where the first value is null', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._greaterOf(null, 1)).toEqual(1);
        });

        it('returns the greater of two values where the second value is undefined', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._greaterOf(1, undefined)).toEqual(1);
        });

        it('returns the greater of two values where the second value is null', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._greaterOf(1, null)).toEqual(1);
        });

        it('returns the lesser of two values where first value is lesser', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._lesserOf(0, 1)).toEqual(0);
        });

        it('returns the lesser of two values where second value is lesser', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._lesserOf(1, 0)).toEqual(0);
        });

        it('returns the lesser of two values where they are equal', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._lesserOf(1, 1)).toEqual(1);
        });

        it('returns the lesser of two values where the first value is undefined', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._lesserOf(undefined, 1)).toEqual(1);
        });

        it('returns the lesser of two values where the first value is null', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._lesserOf(null, 1)).toEqual(1);
        });

        it('returns the lesser of two values where the second value is undefined', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._lesserOf(1, undefined)).toEqual(1);
        });

        it('returns the lesser of two values where the second value is null', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._lesserOf(1, null)).toEqual(1);
        });
    });

    describe('northern point bounding box extraction', function() {

        it('returns the northern most point below the equator', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._northernMost(0, -90)).toEqual(0);
        });

        it('returns the northern most point below the equator params reversed', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._northernMost(-90, 0)).toEqual(0);
        });

        it('returns the northern most point above the equator', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._northernMost(0, 90)).toEqual(90);
        });

        it('returns the northern most point above the equator params reversed', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._northernMost(90, 0)).toEqual(90);
        });

        it('returns the northern most point passing over the equator', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._northernMost(-90, 90)).toEqual(90);
        });

        it('returns the northern most point passing over the equator params reversed', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._northernMost(90, -90)).toEqual(90);
        });

        it('returns the northern most point when params are equal', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._northernMost(0, 0)).toEqual(0);
        });
    });

    describe('southern point bounding box extraction', function() {

        it('returns the southern most point below the equator', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._southernMost(-90, 0)).toEqual(-90);
        });

        it('returns the southern most point below the equator params reversed', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._southernMost(0, -90)).toEqual(-90);
        });

        it('returns the southern most point above the equator', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._southernMost(0, 90)).toEqual(0);
        });

        it('returns the southern most point above the equator params reversed', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._southernMost(90, 0)).toEqual(0);
        });

        it('returns the southern most point passing over the equator', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._southernMost(-90, 90)).toEqual(-90);
        });

        it('returns the southern most point passing over the equator params reversed', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._southernMost(90, -90)).toEqual(-90);
        });

        it('returns the southern most point when params are equal', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._southernMost(0, 0)).toEqual(0);
        });
    });

    describe('western point bounding box extraction', function() {

        it('returns the western most between 0 and -180', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._westernMost(-180, 0)).toEqual(-180);
        });

        it('returns the western most point between 0 and -180 params reversed', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._westernMost(0, -180)).toEqual(-180);
        });

        it('returns the western most point between 0 and 180', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._westernMost(0, 180)).toEqual(0);
        });

        it('returns the western most point between 0 and 180 params reversed', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._westernMost(180, 0)).toEqual(0);
        });

        it('returns the western most point passing over the meridian', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._westernMost(-180, 180)).toEqual(-180);
        });

        it('returns the western most point passing over the meridian params reversed', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._westernMost(180, -180)).toEqual(-180);
        });

        it('returns the western most point when params are equal', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._westernMost(0, 0)).toEqual(0);
        });

    });

    describe('eastern point bounding box extraction', function() {

        it('returns the eastern most between 0 and -180', function() {
            var store = new Portal.data.ResultsStore();
            // 180 and -180 are equal longitudes our code currently will return 180
            expect(store._easternMost(-180, 0)).toEqual(180);
        });

        it('returns the eastern most point between 0 and -180 params reversed', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._easternMost(0, -180)).toEqual(180);
        });

        it('returns the eastern most point between 0 and 180', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._easternMost(0, 180)).toEqual(180);
        });

        it('returns the eastern most point between 0 and 180 params reversed', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._easternMost(180, 0)).toEqual(180);
        });

        it('returns the eastern most point passing over the anti meridian', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._easternMost(1, -175)).toEqual(-175);
        });

        it('returns the eastern most point passing over the anti meridian params reversed', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._easternMost(-175, 1)).toEqual(-175);
        });

        it('returns the eastern most point when params are equal', function() {
            var store = new Portal.data.ResultsStore();
            expect(store._easternMost(0, 0)).toEqual(0);
        });

    });

});
