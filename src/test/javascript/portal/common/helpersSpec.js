/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.common.helpers", function() {

    describe('sanistiseForFilename', function() {

        it('swaps out invalid filname characters (and spaces)', function() {

            var source = 'imos:argo harvest\\/';
            var sourceSanitised = 'imos#argo_harvest__';

            // Duplicate the source before sanitising to ensure global replace (as opposed to first occurrance)
            var sanitiserInput = source + source;
            var expectedOutput = sourceSanitised + sourceSanitised;

            expect(sanitiseForFilename(sanitiserInput)).toBe(expectedOutput);
        });
    });

    describe('landingPage', function() {
        it('/aodn-portal', function() {
            expect(isLandingPage("/aodn-portal")).toBe(true);
        });

        it('/aodn-portal/', function() {
            expect(isLandingPage("/aodn-portal/")).toBe(true);
        });

        it('/aodn-portal///', function() {
            expect(isLandingPage("/aodn-portal///")).toBe(true);
        });

        it('/cakes/', function() {
            expect(isLandingPage("/aodn-portal/")).toBe(true);
        });

        it('/aodn-portal/cakes', function() {
            expect(isLandingPage("/aodn-portal/cakes")).toBe(false);
        });

        it('/aodn-portal/cakes/are/awesome', function() {
            expect(isLandingPage("/aodn-portal/cakes/are/awesome")).toBe(false);
        });

        it('/aodn-portal/cakes/are/awesome/', function() {
            expect(isLandingPage("/aodn-portal/cakes/are/awesome/")).toBe(false);
        });

        it('/aodn-portal/cakes/are/awesome///', function() {
            expect(isLandingPage("/aodn-portal/cakes/are/awesome/")).toBe(false);
        });

    });
});
