/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("OpenLayers.Layer.NcWMS", function() {
    var cachedLayer;
    var extent;
    var params;

    beforeEach(function() {
        OpenLayers.Layer.WMS.prototype.getURL = function(bounds) {
            return "http://someurl/page?param1=blaa";
        };

        params = {};

        cachedLayer = new OpenLayers.Layer.NcWMS(
            null,
            null,
            params,
            null,
            { extent: extent }
        );
    });

    describe('constructor', function() {
        it('extent given', function() {
            var extent = [
                '2001-02-01T00:00',
                '2001-02-03T00:00',
                '2001-02-05T00:00'];

            cachedLayer = new OpenLayers.Layer.NcWMS(
                null,
                null,
                params,
                null,
                { extent: extent }
            );
            cachedLayer.processTemporalExtent();

            waitsFor(function() {
                return cachedLayer.temporalExtent;
            }, "Temporal extent not processed", 1000);

            expect(cachedLayer.temporalExtent).not.toBeUndefined();
            expect(cachedLayer.temporalExtent.length()).toEqual(3);
        });
    });

    describe("getURL", function() {

        var time = moment('2011-07-08T03:32:45Z').utc();
        var bounds = new OpenLayers.Bounds({
            left: 0,
            right: 10,
            top: 0,
            bottom: 10
        });

        beforeEach(function() {
            cachedLayer.temporalExtent = null;
            cachedLayer.rawTemporalExtent = [
                '2011-07-02T01:32:45Z',
                '2011-07-08T01:32:45Z',
                '2011-07-08T03:22:45Z',
                '2011-07-08T03:32:45Z'
            ];
            cachedLayer.processTemporalExtent();
        });

        it('time specified', function() {
            cachedLayer.toTime(time);
            expect(cachedLayer.params['TIME']).toBe(time.utc().format('YYYY-MM-DDTHH:mm:ss.SSS'));
        });
    });

    describe('_metadataLoaded', function() {
        var sampleJson = '{ test: 1 }';
        beforeEach(function() {
            cachedLayer.temporalExtent = {};
            cachedLayer.temporalExtent.addDays = function() {};
        });

        it('calls _parseDatesWithData', function() {
            spyOn(cachedLayer, '_parseDatesWithData').andCallFake(function() {});
            cachedLayer._metadataLoaded(sampleJson);
            expect(cachedLayer._parseDatesWithData).toHaveBeenCalled();
        });

        it('calls addDays', function() {
            spyOn(cachedLayer.temporalExtent, 'addDays');
            cachedLayer._metadataLoaded(sampleJson);
            expect(cachedLayer.temporalExtent.addDays).toHaveBeenCalled();
        });
    });

    it('parses dates from NcWMS GetMetadata JSON', function() {
        var ncwmsMetadataLayerDetailsJson = '{ "units": "m s-1", "bbox": ["150.781701", "-24.195812", "153.55338", "-21.92031"], "scaleRange": ["-1.0", "1.0"], "numColorBands": 253, "supportedStyles": ["boxfill"], "datesWithData": { "2007": { "9": [15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31], "10": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30], "11": [1,2,3,5,6,7,8,9,10,11,12,13,14,15,16,17,20,21,22,23,24,25,26,27,28,29,30,31] }, "2008": { "0": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31], "1": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29], "2": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29], "3": [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30] } } }';
        var ncwmsMetadataLayerDetails = Ext.util.JSON.decode(ncwmsMetadataLayerDetailsJson);

        var datesWithData = cachedLayer._parseDatesWithData(ncwmsMetadataLayerDetails);

        var searchForDate = function(date, datesArray) {
            for (var i = 0; i < datesArray.length; ++i) {
                if (datesArray[i].isSame(date)) {
                    return i;
                }
            }
            return -1;
        };

        expect(datesWithData.length).toEqual(192);

        // Statistically check for a few dates that were parsed
        expect(searchForDate(moment.utc('2007-09-15'), datesWithData)).toBeGreaterThan(-1);
        expect(searchForDate(moment.utc('2007-09-18'), datesWithData)).toBeGreaterThan(-1);
        expect(searchForDate(moment.utc('2007-11-31'), datesWithData)).toBeGreaterThan(-1);
        expect(searchForDate(moment.utc('2008-02-02'), datesWithData)).toBeGreaterThan(-1);

        expect(searchForDate(moment.utc('2200-02-02'), datesWithData)).toEqual(-1);
    });

    it("extent as array of strings", function() {
        cachedLayer.temporalExtent = null;
        cachedLayer.rawTemporalExtent = [
            '2001-01-01T00:00:00',
            '2001-01-02T00:00:00',
            '2001-01-03T00:00:00'
        ];
        cachedLayer.processTemporalExtent();

        waitsFor(function() {
            return cachedLayer.temporalExtent;
        }, "Temporal extent not processed", 1000);

        expect(cachedLayer.temporalExtent.getDay('2001-01-01')[0].utc()).toBeSame(moment.utc('2001-01-01T00:00:00'));
        expect(cachedLayer.temporalExtent.getDay('2001-01-02')[0].utc()).toBeSame(moment.utc('2001-01-02T00:00:00'));
        expect(cachedLayer.temporalExtent.getDay('2001-01-03')[0].utc()).toBeSame(moment.utc('2001-01-03T00:00:00'));
    });

    it("extent as repeating interval", function() {
        // I *think* there can be a 'Rn' at the beginning, but doesn't look like helper.js handles
        // that.

        //  TODO: hangs browser :-)
        //cachedLayer.setTemporalExtent('2000-01-01T00:00:00.000/2000-01-03T00:00:00.000/PT1D');

        cachedLayer.temporalExtent = null;
        cachedLayer.rawTemporalExtent = ['2001-01-01T00:00:00/2001-01-03T00:00:00/PT24H'];
        cachedLayer.processTemporalExtent();
        waitsFor(function() {
            return cachedLayer.temporalExtent;
        }, "Temporal extent not processed", 1000);

        expect(cachedLayer.temporalExtent.getDay('2001-01-01')[0].utc()).toBeSame(moment.utc('2001-01-01T00:00:00'));
        expect(cachedLayer.temporalExtent.getDay('2001-01-02')[0].utc()).toBeSame(moment.utc('2001-01-02T00:00:00'));
        expect(cachedLayer.temporalExtent.getDay('2001-01-03')[0].utc()).toBeSame(moment.utc('2001-01-03T00:00:00'));
    });

    describe('get next time', function() {
        beforeEach(function() {
            cachedLayer.temporalExtent = null;
            cachedLayer.rawTemporalExtent = ['2001-01-01T00:00:00', '2001-01-02T00:00:00', '2001-01-03T00:00:00'];
            cachedLayer.processTemporalExtent();
            waitsFor(function() {
                return cachedLayer.temporalExtent;
            }, "Temporal extent not processed", 1000);
        });

        it('next item returned', function() {
            cachedLayer.toTime(cachedLayer.temporalExtent.min());
            var res = cachedLayer.nextTimeSlice();
            expect(res).toBeSame(moment.utc('2001-01-02T00:00:00'));
        });

        it('no more items', function() {
            cachedLayer.toTime(cachedLayer.temporalExtent.max());
            var res = cachedLayer.nextTimeSlice();
            expect(res).toBeSame(moment.utc('2001-01-03T00:00:00'));
        });
    });

    describe('choose nearest available time', function() {

        describe('repeating interval', function() {
            beforeEach(function() {
                cachedLayer.rawTemporalExtent = ['2000-01-01T00:00:00.000/2000-01-01T01:00:00.000/PT30M'];
                cachedLayer.temporalExtent = null;
                cachedLayer.processTemporalExtent();
                waitsFor(function() {
                    return cachedLayer.temporalExtent;
                }, "Temporal extent not processed", 1000);
            });

            it('around first date/time', function() {
                cachedLayer.toTime(moment.utc('2000-01-01T00:00:00.000'));
                expect(cachedLayer.nextTimeSlice()).toBeSame(moment.utc('2000-01-01T00:30:00.000'));
                cachedLayer.toTime(moment.utc('2000-01-01T00:00:01.000'));
                expect(cachedLayer.nextTimeSlice()).toBeSame(moment.utc('2000-01-01T00:30:00.000'));
            });

            it('around half way between two possible values', function() {
                cachedLayer.toTime(moment.utc('2000-01-01T00:15:00.000'));
                expect(cachedLayer.nextTimeSlice()).toBeSame(moment.utc('2000-01-01T00:30:00.000'));
                cachedLayer.toTime(moment.utc('2000-01-01T00:15:01.000'));
                expect(cachedLayer.nextTimeSlice()).toBeSame(moment.utc('2000-01-01T00:30:00.000'));
            });

            it('around last date/time', function() {
                cachedLayer.toTime(moment.utc('2000-01-01T01:00:00.000'));
                expect(cachedLayer.nextTimeSlice().valueOf()).toEqual(moment.utc('2000-01-01T01:00:00.000').valueOf());
                cachedLayer.toTime(moment.utc('2000-01-01T00:59:59.000'));
                expect(cachedLayer.nextTimeSlice().valueOf()).toEqual(moment.utc('2000-01-01T01:00:00.000').valueOf());
                cachedLayer.toTime(moment.utc('2000-01-01T01:00:01.000'));
                expect(cachedLayer.nextTimeSlice().valueOf()).toEqual(moment.utc('2000-01-01T01:00:01.000').valueOf());
            });
        });

        describe('time set specified', function() {
            beforeEach(function() {
                cachedLayer.rawTemporalExtent = [
                    '2000-01-01T00:00:00.000',
                    '2000-01-02T00:00:00.000',
                    '2000-01-03T00:00:00.000'
                ];
                cachedLayer.temporalExtent = null;
                cachedLayer.processTemporalExtent();
                waitsFor(function() {
                    return cachedLayer.temporalExtent;
                }, "Temporal extent not processed", 1000);
            });

            it('around first date/time', function() {
                cachedLayer.toTime(moment.utc('2000-01-01T00:00:00.000'));
                expect(cachedLayer.nextTimeSlice()).toBeSame(moment.utc('2000-01-02T00:00:00.000'));
                cachedLayer.toTime(moment.utc('2000-01-01T00:00:01.000'));
                expect(cachedLayer.nextTimeSlice()).toBeSame(moment.utc('2000-01-02T00:00:00.000'));
            });

            it('around half way between two possible values', function() {
                cachedLayer.toTime(moment.utc('2000-01-01T11:59:59.000'));
                expect(cachedLayer.nextTimeSlice()).toBeSame(moment.utc('2000-01-02T00:00:00.000'));
                cachedLayer.toTime(moment.utc('2000-01-01T12:00:00.000'));
                expect(cachedLayer.nextTimeSlice()).toBeSame(moment.utc('2000-01-02T00:00:00.000'));
                cachedLayer.toTime(moment.utc('2000-01-01T12:00:01.000'));
                expect(cachedLayer.nextTimeSlice()).toBeSame(moment.utc('2000-01-02T00:00:00.000'));
            });

            it('around last date/time', function() {
                cachedLayer.toTime(moment.utc('2000-01-02T23:59:59.000'));
                expect(cachedLayer.nextTimeSlice()).toBeSame(moment.utc('2000-01-03T00:00:00.000'));
                //cachedLayer.toTime(moment.utc('2000-01-03T00:00:00.000'));
                //expect(cachedLayer.nextTimeSlice().valueOf()).toEqual(moment.utc('2000-01-03T00:00:00.000').valueOf());
                //cachedLayer.toTime(moment.utc('2000-01-03T00:00:01.000'));
                //expect(cachedLayer.nextTimeSlice().valueOf()).toEqual(moment.utc('2000-01-03T00:00:01.000').valueOf());
            });

        });
    });

    describe('getExtent min/max, and beyond...', function() {
        var today;
        beforeEach(function() {
            var extent = [
                '2000-01-01T00:00',
                '2001-02-03T00:00',
                '2001-02-05T00:00'
            ];

            today = moment.utc().startOf('day').valueOf();

            cachedLayer = new OpenLayers.Layer.NcWMS(
                null,
                null,
                params,
                null,
                { extent: extent }
            );

            cachedLayer.temporalExtent = null;
            cachedLayer.processTemporalExtent();
            waitsFor(function() {
                return cachedLayer.temporalExtent;
            }, "Temporal extent not processed", 1000);

        });

        it('getTemporalExtentMin value', function() {
            expect(cachedLayer.getTemporalExtentMin()).toBeSame(moment.utc('2000-01-01T00:00'));
        });

        it('getTemporalExtentMax value', function() {
            expect(cachedLayer.getTemporalExtentMax()).toBeSame(moment.utc('2001-02-05T00:00'));
        });

        it('date is not available in extent', function() {
            cachedLayer.toTime(moment.utc('1900-12-31T23:59:59.000'));
            expect(cachedLayer.nextTimeSlice().startOf('day').valueOf()).toEqual(today);
            cachedLayer.toTime(moment.utc('1999-12-31T23:59:59.000'));
            expect(cachedLayer.nextTimeSlice().startOf('day').valueOf()).toEqual(today);
            cachedLayer.toTime(moment.utc('2030-01-03T00:00:00.000'));
            expect(cachedLayer.nextTimeSlice().startOf('day').valueOf()).toEqual(today);
        });
    });

    describe('subset extent', function() {
        beforeEach(function() {
            cachedLayer.rawTemporalExtent = [
                '2000-01-01T00:00:00.000',
                '2000-01-02T00:00:00.000',
                '2000-01-03T00:00:00.000'
            ];
            cachedLayer.temporalExtent = null;
            cachedLayer.processTemporalExtent();
            waitsFor(function() {
                return cachedLayer.temporalExtent;
            }, "Temporal extent not processed", 1000);
        });

        it('sets the subset extent minimum', function() {
            expect(cachedLayer.getSubsetExtentMin()).toEqual(moment.utc('2000-01-01T00:00:00.000'));
        });

        it('sets the subset extent maximum', function() {
            expect(cachedLayer.getSubsetExtentMax()).toEqual(moment.utc('2000-01-03T00:00:00.000'));
        });
    });
});
