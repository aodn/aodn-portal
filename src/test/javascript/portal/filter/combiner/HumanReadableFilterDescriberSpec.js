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
                    constructor: Portal.filter.BooleanFilter,
                    isVisualised: function() { return true },
                    hasValue: function() { return true },
                    getLabel: function() { return "kappa" },
                    getHumanReadableForm: function() { return 'four' }
                },
                {
                    constructor: Portal.filter.BooleanFilter,
                    isVisualised: function() { return false }, // Not visualised
                    hasValue: function() { return true },
                    getLabel: function() { return "gamma" },
                    getHumanReadableForm: function() { return 'two' }
                },
                {
                    constructor: Portal.filter.StringFilter,
                    isVisualised: function() { return true },
                    hasValue: function() { return false }, // No value
                    getLabel: function() { return "beta" },
                    getHumanReadableForm: function() { return 'three' }
                },
                {
                    constructor: Portal.filter.StringFilter,
                    isVisualised: function() { return true },
                    hasValue: function() { return true },
                    getLabel: function() { return "omega" },
                    getHumanReadableForm: function() { return 'five' }
                },
                {
                    constructor: Portal.filter.GeometryFilter, // Is Geometry filter
                    isVisualised: function() { return true },
                    hasValue: function() { return true },
                    getLabel: function() { return "alpha" },
                    getHumanReadableForm: function() { return 'one' }
                }
            ]
        };

        describer = new Portal.filter.combiner.HumanReadableFilterDescriber({
            layer: layer
        });
    });

    describe('buildDescription', function() {

        it('returns description in the correct sorted order', function() {

            expect(describer.buildDescription('<br />')).toBe('one<br />two<br />four<br />five');
        });
    });
});
