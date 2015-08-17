/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.data.DataCollection", function() {

    var dataCollection;

    beforeEach(function() {
        dataCollection = new Portal.data.DataCollection();
        spyOn(dataCollection, 'getWmsLayerLinks').andReturn([]);
    });

    describe('updateNcwmsParams', function() {

        it('updated start date', function() {

            var testStartDate = moment();

            dataCollection.updateNcwmsParams(testStartDate, moment('invalid date'), null);

            expect(dataCollection.ncwmsParams).toEqual({
                dateRangeStart: testStartDate
            });
        });

        it('updated end date', function() {

            var testEndDate = moment();

            dataCollection.updateNcwmsParams(moment('invalid date'), testEndDate, null);

            expect(dataCollection.ncwmsParams).toEqual({
                dateRangeEnd: testEndDate
            });
        });

        it('update geometry', function() {

            dataCollection.updateNcwmsParams(null, null, {
                getBounds: returns({
                    bottom: 4,
                    left: 3,
                    right: 2,
                    top: 1
                })
            });

            expect(dataCollection.ncwmsParams).toEqual({
                longitudeRangeStart: 3,
                longitudeRangeEnd: 2,
                latitudeRangeStart: 4,
                latitudeRangeEnd: 1
            });
        });
    });

    describe('layerstate', function() {
        it('lazily initialises layer state', function() {
            var layerState = dataCollection.getLayerState();
            expect(layerState).toBeInstanceOf(Portal.data.DataCollectionLayers);

            // Make sure we're reusing the same object.
            expect(dataCollection.getLayerState()).toBe(layerState);
        });

        it('returns correct WMS type', function() {
            spyOn(dataCollection.getLayerState(), 'isNcwms').andReturn(true);
            expect(dataCollection.isNcwms()).toBe(true);
        });
    });
});
