/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.filter.combiner.MapCqlBuilder", function() {

    var layer;
    var builder;

    beforeEach(function() {

        layer = {
            filters: [
                {
                    constructor: Portal.filter.GeometryFilter, // Is Geometry filter
                    isVisualised: returns(true),
                    hasValue: returns(true),
                    getCql: returns('cql1')
                },
                {
                    isVisualised: returns(false), // Not visualised
                    hasValue: returns(true),
                    getCql: returns('cql2')
                },
                {
                    isVisualised: returns(true),
                    hasValue: returns(false), // No value
                    getCql: returns('cql3')
                },
                {
                    isVisualised: returns(true),
                    hasValue: returns(true),
                    getCql: returns('cql4')
                },
                {
                    isVisualised: returns(true),
                    hasValue: returns(true),
                    getCql: returns('cql5')
                }
            ]
        };

        builder = new Portal.filter.combiner.MapCqlBuilder({
            layer: layer
        });
    });

    describe('buildCql', function() {

        it('returns correct CQL', function() {

            expect(builder.buildCql()).toBe('cql4 AND cql5');
        });
    });
});
