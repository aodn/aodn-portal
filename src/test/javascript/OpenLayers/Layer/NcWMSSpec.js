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

    var searchForDate = function(date, datesArray) {
        for (var i = 0; i < datesArray.length; ++i) {
            if (datesArray[i].isSame(date)) {
                return i;
            }
        }
        return -1;
    };

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

    describe("getURL", function() {

        var time = moment('2011-07-08T03:32:45Z').utc();
        var bounds = new OpenLayers.Bounds({
            left: 0,
            right: 10,
            top: 0,
            bottom: 10
        });

        beforeEach(function() {
            cachedLayer.temporalExtent.parse([
                '2011-07-02T01:32:45Z',
                '2011-07-08T01:32:45Z',
                '2011-07-08T03:22:45Z',
                '2011-07-08T03:32:45Z'
            ]);
        });

        it('time specified', function() {
            cachedLayer.toTime(time);
            expect(cachedLayer.params['TIME']).toBe(time.utc().format('YYYY-MM-DDTHH:mm:ss.SSS'));
        });
    });

    describe("_getTimeSeriesUrl", function() {
        it("returns correct url", function() {
            cachedLayer.url = "urlprefix";
            expect(cachedLayer._getTimeSeriesUrl(moment.utc('2011-07-02T01:32:45Z'))).toBe('urlprefix?layerName=undefined&REQUEST=GetMetadata&item=timesteps&day=2011-07-02T00:00:00.000Z');
        });
    });

    describe("getTimeSeriesForDay", function() {
        it("when already loaded", function() {
            cachedLayer.temporalExtent.parse(['2001-07-02T00:00:00']);
            expect(cachedLayer.getTimeSeriesForDay(moment.utc('2001-07-02T01:32:45Z')).length).toEqual(1);
        });

        it("when not loaded", function() {
            expect(cachedLayer.getTimeSeriesForDay(moment.utc('2001-07-02T00:00:00Z'))).toEqual(null);
        });
    });

    describe("loadTimeSeriesForDay", function() {
        it("when already loaded", function() {
            spyOn(cachedLayer, '_timeSeriesLoadedForDate').andCallFake(function() {});
            cachedLayer.temporalExtent.parse(['2001-07-02T00:00:00']);

            cachedLayer.loadTimeSeriesForDay(moment.utc('2001-07-02T00:00:00Z'));
            expect(cachedLayer._timeSeriesLoadedForDate).toHaveBeenCalled();
        });

        it("when not loaded", function() {
            spyOn(cachedLayer, '_fetchTimeSeriesForDay').andCallFake(function() {});

            cachedLayer.loadTimeSeriesForDay(moment.utc('2001-07-02T00:00:00Z'));
            expect(cachedLayer._fetchTimeSeriesForDay).toHaveBeenCalled();
        });

        it("calls user defined callback", function() {
            cachedLayer.callbackMock = function() {};
            spyOn(cachedLayer, 'callbackMock');
            cachedLayer.temporalExtent.parse(['2001-07-02T00:00:00']);

            cachedLayer.loadTimeSeriesForDay(moment.utc('2001-07-02T00:00:00Z'), cachedLayer.callbackMock);
            expect(cachedLayer.callbackMock).toHaveBeenCalled();
        });
    });

    describe("_timeSeriesLoadedForDate", function() {
        beforeEach(function() {
            spyOn(cachedLayer.events, 'triggerEvent');
        });

        it("triggers temporalextentloaded when no pending requests", function() {
            cachedLayer._timeSeriesLoadedForDate();
            expect(cachedLayer.events.triggerEvent).toHaveBeenCalledWith('temporalextentloaded', cachedLayer);
        });

        it("does not trigger temporalextentloaded when pending requests exist", function() {
            cachedLayer.pendingRequests.add("pending request");
            cachedLayer._timeSeriesLoadedForDate();
            expect(cachedLayer.events.triggerEvent).not.toHaveBeenCalled();
        });

        it("triggers temporalextentloaded when requests are cleared", function() {
            cachedLayer.pendingRequests.add("pending request");
            cachedLayer._timeSeriesLoadedForDate();
            expect(cachedLayer.events.triggerEvent).not.toHaveBeenCalled();

            cachedLayer.pendingRequests.remove("pending request");
            cachedLayer._timeSeriesLoadedForDate();
            expect(cachedLayer.events.triggerEvent).toHaveBeenCalledWith('temporalextentloaded', cachedLayer);
        });
    });

    describe("_parseTimesForDay", function() {
        it("parses JSON and assembles dates", function() {
            var date = moment.utc('2001-07-02T00:00:00Z');
            var sampleJson = '{"timesteps":["00:30:00.000Z","01:30:00.000Z","02:30:00.000Z","03:30:00.000Z","04:30:00.000Z","05:30:00.000Z","06:30:00.000Z","07:30:00.000Z","08:30:00.000Z","09:30:00.000Z","10:30:00.000Z","11:30:00.000Z","12:30:00.000Z","13:30:00.000Z","14:30:00.000Z","15:30:00.000Z","16:30:00.000Z","17:30:00.000Z","18:30:00.000Z","19:30:00.000Z","20:30:00.000Z","21:30:00.000Z","22:30:00.000Z","23:30:00.000Z"]}'

            var timeSeriesArray = cachedLayer._parseTimesForDay(date, sampleJson);
            expect(timeSeriesArray.length).toEqual(24);

            // Statistically check for a few elements in the array
            expect(searchForDate(moment.utc('2001-07-02T00:30:00.000Z'), timeSeriesArray)).toBeGreaterThan(-1);
            expect(searchForDate(moment.utc('2001-07-02T01:30:00.000Z'), timeSeriesArray)).toBeGreaterThan(-1);
            expect(searchForDate(moment.utc('2001-07-02T20:30:00.000Z'), timeSeriesArray)).toBeGreaterThan(-1);
            expect(searchForDate(moment.utc('2001-07-02T23:30:00.000Z'), timeSeriesArray)).toBeGreaterThan(-1);

            // Control tests to make sure some things don't exist
            expect(searchForDate(moment.utc('2200-07-02T23:30:00.000Z'), timeSeriesArray)).toEqual(-1);
            expect(searchForDate(moment.utc('2001-07-02T23:31:00.000Z'), timeSeriesArray)).toEqual(-1);
        });
    });

    describe('_metadataLoaded', function() {
        var sampleJson = '{ test: 1 }';

        beforeEach(function() {
            spyOn(cachedLayer, '_parseDatesWithData').andCallFake(function() {});
            spyOn(cachedLayer.temporalExtent, 'getFirstDay').andCallFake(function() {});
            spyOn(cachedLayer.temporalExtent, 'getLastDay').andCallFake(function() {});
            spyOn(cachedLayer, 'loadTimeSeriesForDay').andCallFake(function() {});
        });

        it('calls _parseDatesWithData', function() {
            cachedLayer._metadataLoaded(sampleJson);
            expect(cachedLayer._parseDatesWithData).toHaveBeenCalled();
        });

        it('calls addDays', function() {
            spyOn(cachedLayer.temporalExtent, 'addDays');
            cachedLayer._metadataLoaded(sampleJson);
            expect(cachedLayer.temporalExtent.addDays).toHaveBeenCalled();
        });

        it('loads first day', function() {
            cachedLayer._metadataLoaded(sampleJson);
            expect(cachedLayer.temporalExtent.getFirstDay).toHaveBeenCalled();
            expect(cachedLayer.loadTimeSeriesForDay).toHaveBeenCalled();
        });

        it('loads last day', function() {
            cachedLayer._metadataLoaded(sampleJson);
            expect(cachedLayer.temporalExtent.getLastDay).toHaveBeenCalled();
            expect(cachedLayer.loadTimeSeriesForDay).toHaveBeenCalled();
        });
    });

    it('parses dates from NcWMS GetMetadata JSON', function() {
        var ncwmsMetadataLayerDetailsJson = '{ "units": "m s-1", "bbox": ["150.781701", "-24.195812", "153.55338", "-21.92031"], "scaleRange": ["-1.0", "1.0"], "numColorBands": 253, "supportedStyles": ["boxfill"], "datesWithData": { "2007": { "9": [15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31], "10": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30], "11": [1,2,3,5,6,7,8,9,10,11,12,13,14,15,16,17,20,21,22,23,24,25,26,27,28,29,30,31] }, "2008": { "0": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31], "1": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29], "2": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29], "3": [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30] } } }';
        var ncwmsMetadataLayerDetails = Ext.util.JSON.decode(ncwmsMetadataLayerDetailsJson);

        var datesWithData = cachedLayer._parseDatesWithData(ncwmsMetadataLayerDetails);

        expect(datesWithData.length).toEqual(192);

        // Statistically check for a few dates that were parsed
        // Notice that when month is parsed, it's zero based (0-11)
        expect(searchForDate(moment.utc('2007-10-15'), datesWithData)).toBeGreaterThan(-1);
        expect(searchForDate(moment.utc('2007-10-18'), datesWithData)).toBeGreaterThan(-1);
        expect(searchForDate(moment.utc('2007-12-31'), datesWithData)).toBeGreaterThan(-1);
        expect(searchForDate(moment.utc('2008-03-02'), datesWithData)).toBeGreaterThan(-1);

        expect(searchForDate(moment.utc('2200-02-02'), datesWithData)).toEqual(-1);
    });

    describe('get next time', function() {
        beforeEach(function() {
            cachedLayer.temporalExtent.parse(['2001-01-01T00:00:00', '2001-01-02T00:00:00', '2001-01-03T00:00:00']);
        });

        it('next item returned', function() {
            cachedLayer.toTime(cachedLayer.temporalExtent.min());
            var res = cachedLayer.goToNextTimeSlice();
            expect(cachedLayer.time).toBeSame(moment.utc('2001-01-02T00:00:00'));
        });

        it('no more items', function() {
            cachedLayer.toTime(cachedLayer.temporalExtent.max());
            var res = cachedLayer.goToNextTimeSlice();
            expect(cachedLayer.time).toBeSame(moment.utc('2001-01-03T00:00:00'));
        });
    });

    describe('choose nearest available time', function() {

        describe('repeating interval', function() {
            beforeEach(function() {
                cachedLayer.temporalExtent.parse(['2000-01-01T00:00:00.000/2000-01-01T01:00:00.000/PT30M']);
            });

            it('around first date/time', function() {
                cachedLayer.toTime(moment.utc('2000-01-01T00:00:00.000'));
                cachedLayer.goToNextTimeSlice();
                expect(cachedLayer.time).toBeSame(moment.utc('2000-01-01T00:30:00.000'));

                cachedLayer.toTime(moment.utc('2000-01-01T00:00:01.000'));
                cachedLayer.goToNextTimeSlice();
                expect(cachedLayer.time).toBeSame(moment.utc('2000-01-01T00:30:00.000'));
            });

            it('around half way between two possible values', function() {
                cachedLayer.toTime(moment.utc('2000-01-01T00:15:00.000'));
                cachedLayer.goToNextTimeSlice();
                expect(cachedLayer.time).toBeSame(moment.utc('2000-01-01T00:30:00.000'));

                cachedLayer.toTime(moment.utc('2000-01-01T00:15:01.000'));
                cachedLayer.goToNextTimeSlice();
                expect(cachedLayer.time).toBeSame(moment.utc('2000-01-01T00:30:00.000'));
            });

            it('around last date/time', function() {
                cachedLayer.toTime(moment.utc('2000-01-01T01:00:00.000'));
                cachedLayer.goToNextTimeSlice();
                expect(cachedLayer.time.valueOf()).toEqual(moment.utc('2000-01-01T01:00:00.000').valueOf());

                cachedLayer.toTime(moment.utc('2000-01-01T00:59:59.000'));
                cachedLayer.goToNextTimeSlice();
                expect(cachedLayer.time.valueOf()).toEqual(moment.utc('2000-01-01T01:00:00.000').valueOf());

                cachedLayer.toTime(moment.utc('2000-01-01T01:00:01.000'));
                cachedLayer.goToNextTimeSlice();
                expect(cachedLayer.time.valueOf()).toEqual(moment.utc('2000-01-01T01:00:01.000').valueOf());
            });
        });

        describe('time set specified', function() {
            beforeEach(function() {
                cachedLayer.temporalExtent.parse(['2000-01-01T00:00:00.000', '2000-01-02T00:00:00.000', '2000-01-03T00:00:00.000']);
            });

            it('around first date/time', function() {
                cachedLayer.toTime(moment.utc('2000-01-01T00:00:00.000'));
                cachedLayer.goToNextTimeSlice();
                expect(cachedLayer.time).toBeSame(moment.utc('2000-01-02T00:00:00.000'));

                cachedLayer.toTime(moment.utc('2000-01-01T00:00:01.000'));
                cachedLayer.goToNextTimeSlice();
                expect(cachedLayer.time).toBeSame(moment.utc('2000-01-02T00:00:00.000'));
            });

            it('around half way between two possible values', function() {
                cachedLayer.toTime(moment.utc('2000-01-01T11:59:59.000'));
                cachedLayer.goToNextTimeSlice();
                expect(cachedLayer.time).toBeSame(moment.utc('2000-01-02T00:00:00.000'));

                cachedLayer.toTime(moment.utc('2000-01-01T12:00:00.000'));
                cachedLayer.goToNextTimeSlice();
                expect(cachedLayer.time).toBeSame(moment.utc('2000-01-02T00:00:00.000'));

                cachedLayer.toTime(moment.utc('2000-01-01T12:00:01.000'));
                cachedLayer.goToNextTimeSlice();
                expect(cachedLayer.time).toBeSame(moment.utc('2000-01-02T00:00:00.000'));
            });

            it('around last date/time', function() {
                cachedLayer.toTime(moment.utc('2000-01-02T23:59:59.000'));
                cachedLayer.goToNextTimeSlice();
                expect(cachedLayer.time).toBeSame(moment.utc('2000-01-03T00:00:00.000'));

                cachedLayer.toTime(moment.utc('2000-01-03T00:00:00.000'));
                cachedLayer.goToNextTimeSlice();
                expect(cachedLayer.time.valueOf()).toEqual(moment.utc('2000-01-03T00:00:00.000').valueOf());

                cachedLayer.toTime(moment.utc('2000-01-03T00:00:01.000'));
                cachedLayer.goToNextTimeSlice();
                expect(cachedLayer.time.valueOf()).toEqual(moment.utc('2000-01-03T00:00:01.000').valueOf());
            });

        });
    });

    describe('getExtent min/max, and beyond...', function() {
        beforeEach(function() {
            var extent = [
                '2000-01-01T00:00',
                '2001-02-03T00:00',
                '2001-02-05T00:00'
            ];

            cachedLayer = new OpenLayers.Layer.NcWMS(
                null,
                null,
                params,
                null,
                { extent: extent }
            );

            cachedLayer.temporalExtent.parse(extent);
        });

        it('getTemporalExtentMin value', function() {
            expect(cachedLayer.getTemporalExtentMin()).toBeSame(moment.utc('2000-01-01T00:00'));
        });

        it('getTemporalExtentMax value', function() {
            expect(cachedLayer.getTemporalExtentMax()).toBeSame(moment.utc('2001-02-05T00:00'));
        });

        it('date is not available in extent', function() {
            cachedLayer.toTime(moment.utc('1900-12-31T23:59:59.000'));
            cachedLayer.goToNextTimeSlice();
            expect(cachedLayer.time.startOf('day').toISOString()).toEqual('2000-01-01T00:00:00.000Z');

            cachedLayer.toTime(moment.utc('1999-12-31T23:59:59.000'));
            cachedLayer.goToNextTimeSlice();
            expect(cachedLayer.time.startOf('day').toISOString()).toEqual('2001-02-03T00:00:00.000Z');

            cachedLayer.toTime(moment.utc('2030-01-03T00:00:00.000'));
            cachedLayer.goToNextTimeSlice();
            expect(cachedLayer.time.startOf('day').toISOString()).toEqual('2001-02-05T00:00:00.000Z');
        });
    });

    describe('subset extent', function() {
        beforeEach(function() {
            cachedLayer.temporalExtent.parse([
                '2000-01-01T00:00:00.000',
                '2000-01-02T00:00:00.000',
                '2000-01-03T00:00:00.000'
            ]);
            cachedLayer._initSubsetExtent();
        });

        it('sets the subset extent minimum', function() {
            expect(cachedLayer.getSubsetExtentMin()).toEqual(moment.utc('2000-01-01T00:00:00.000'));
        });

        it('sets the subset extent maximum', function() {
            expect(cachedLayer.getSubsetExtentMax()).toEqual(moment.utc('2000-01-03T00:00:00.000'));
        });
    });
});
