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
});
