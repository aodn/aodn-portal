/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.filter.combiner.DataDownloadCqlBuilder", function() {

    var layer;
    var builder;

    beforeEach(function() {

        layer = {
            filters: [
                {
                    constructor: Portal.filter.GeometryFilter, // Is Geometry filter
                    isVisualised: function() { return true },
                    hasValue: function() { return true },
                    getDataLayerCql: function() { return 'data1' }
                },
                {
                    isVisualised: function() { return false }, // Not visualised
                    hasValue: function() { return true },
                    getDataLayerCql: function() { return 'data2' }
                },
                {
                    isVisualised: function() { return true },
                    hasValue: function() { return false }, // No value
                    getDataLayerCql: function() { return 'data3' }
                },
                {
                    isVisualised: function() { return true },
                    hasValue: function() { return true },
                    getDataLayerCql: function() { return 'data4' }
                }
            ]
        };

        builder = new Portal.filter.combiner.DataDownloadCqlBuilder({
            layer: layer
        });
    });

    describe('buildCql', function() {

        it('returns correct CQL', function() {

            expect(builder.buildCql()).toBe('data1 AND data2 AND data4');
        });
    });
});
