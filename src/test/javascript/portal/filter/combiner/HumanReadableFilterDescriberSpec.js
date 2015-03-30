/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.filter.combiner.HumanReadableFilterDescriber", function() {

    var layer;
    var describer;

    beforeEach(function() {

        layer = {
            filters: [
                {
                    constructor: Portal.filter.GeometryFilter, // Is Geometry filter
                    isVisualised: function() { return true },
                    hasValue: function() { return true },
                    getHumanReadableForm: function() { return 'one' }
                },
                {
                    isVisualised: function() { return false }, // Not visualised
                    hasValue: function() { return true },
                    getHumanReadableForm: function() { return 'two' }
                },
                {
                    isVisualised: function() { return true },
                    hasValue: function() { return false }, // No value
                    getHumanReadableForm: function() { return 'three' }
                },
                {
                    isVisualised: function() { return true },
                    hasValue: function() { return true },
                    getHumanReadableForm: function() { return 'four' }
                }
            ]
        };

        describer = new Portal.filter.combiner.HumanReadableFilterDescriber({
            layer: layer
        });
    });

    describe('buildDescription', function() {

        it('returns description', function() {

            expect(describer.buildDescription('<br />')).toBe('one<br />two<br />four');
        });
    });
});
