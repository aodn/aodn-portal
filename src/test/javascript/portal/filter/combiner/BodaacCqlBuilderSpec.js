/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.filter.combiner.BodaacCqlBuilder", function() {

    var layer;
    var builder;

    beforeEach(function() {

        layer = {
            filters: [
                {
                    constructor: Portal.filter.GeometryFilter, // Is Geometry filter
                    isVisualised: function() { return true },
                    hasValue: function() { return true },
                    getCql: function() { return 'cql1' }
                },
                {
                    isVisualised: function() { return false }, // Not visualised
                    hasValue: function() { return true },
                    getCql: function() { return 'cql2' }
                },
                {
                    isVisualised: function() { return true },
                    hasValue: function() { return false }, // No value
                    getCql: function() { return 'cql3' }
                },
                {
                    isVisualised: function() { return true },
                    hasValue: function() { return true },
                    getCql: function() { return 'cql4' }
                }
            ]
        };

        builder = new Portal.filter.combiner.BodaacCqlBuilder({
            layer: layer
        });
    });

    describe('buildCql', function() {

        it('returns correct CQL', function() {

            expect(builder.buildCql()).toBe('cql1 AND cql4');
        });
    });
});
