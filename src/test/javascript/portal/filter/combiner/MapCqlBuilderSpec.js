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
                    isVisualised: function() { return true },
                    hasValue: function() { return true },
                    getMapLayerCql: function() { return 'map1' }
                },
                {
                    isVisualised: function() { return false }, // Not visualised
                    hasValue: function() { return true },
                    getMapLayerCql: function() { return 'map2' }
                },
                {
                    isVisualised: function() { return true },
                    hasValue: function() { return false }, // No value
                    getMapLayerCql: function() { return 'map3' }
                },
                {
                    isVisualised: function() { return true },
                    hasValue: function() { return true },
                    getMapLayerCql: function() { return 'map4' }
                },
                {
                    isVisualised: function() { return true },
                    hasValue: function() { return true },
                    getMapLayerCql: function() { return 'map5' }
                }
            ]
        };

        builder = new Portal.filter.combiner.MapCqlBuilder({
            layer: layer
        });
    });

    describe('buildCql', function() {

        it('returns correct CQL', function() {

            expect(builder.buildCql()).toBe('map4 AND map5');
        });
    });
});
