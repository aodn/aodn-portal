/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.filter.validation.SpatialConstraintValidator", function() {

    var validator;

    beforeEach(function() {
        validator = new Portal.filter.validation.SpatialConstraintValidator();
    });

    describe('getPercentOfViewportArea', function() {
        beforeEach(function() {
            validator._getMapArea = function() { return 113 };
        });

        it('returns the correct percentage of viewport area', function() {
            var viewportArea = 8;
            var expectedSolution = 7.079646017699115;

            expect(validator._getPercentOfViewportArea(viewportArea)).toBe(expectedSolution);
        });

        it('returns a number', function() {
            var viewportArea = 8;

            expect(typeof validator._getPercentOfViewportArea(viewportArea)).toEqual("number");
        });
    });
});
