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

    describe("url generation", function() {
        beforeEach(function() {
            cachedLayer.url = "encoded url prefix";
            cachedLayer.params.LAYERS = "test_layer";
        });

        it("_getFiltersUrl ", function() {
            expect(cachedLayer._getFiltersUrl()).toBe('layer/getFiltersAsJSON?serverType=ncwms&server=encoded%20url%20prefix&layer=test_layer');
        });

        it("_getStylesUrl ", function() {
            expect(cachedLayer._getStylesUrl()).toBe('layer/getStylesAsJSON?serverType=ncwms&server=encoded%20url%20prefix&layer=test_layer');
        });

        it("_getTimeSeriesUrl ", function() {
            expect(cachedLayer._getTimeSeriesUrl(moment.utc('2011-07-02T01:32:45Z'))).toBe('layer/getFilterValuesAsJSON?serverType=ncwms&server=encoded%20url%20prefix&layer=test_layer&filter=2011-07-02T00:00:00.000Z');
        });
    });

    describe("_getTimeSeriesUrl", function() {
        it("returns correct url", function() {
            cachedLayer.url = "encoded url prefix";
            cachedLayer.params.LAYERS = "test_layer";
            expect(cachedLayer._getTimeSeriesUrl(moment.utc('2011-07-02T01:32:45Z'))).toBe('layer/getFilterValuesAsJSON?serverType=ncwms&server=encoded%20url%20prefix&layer=test_layer&filter=2011-07-02T00:00:00.000Z');
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

    describe('_timeSeriesLoadedForDate', function() {
        var sampleJson = '{ test: 1, supportedStyles: [], palettes: [] }';

        beforeEach(function() {
            spyOn(cachedLayer, '_parseDatesWithData').andCallFake(function() {});
            spyOn(cachedLayer.temporalExtent, 'getFirstDay').andCallFake(function() {});
            spyOn(cachedLayer.temporalExtent, 'getLastDay').andCallFake(function() {});
            spyOn(cachedLayer, 'loadTimeSeriesForDay').andCallFake(function() {});
        });

        it('calls _parseDatesWithData', function() {
            cachedLayer._timeSeriesDatesLoaded(sampleJson);
            expect(cachedLayer._parseDatesWithData).toHaveBeenCalled();
        });

        it('calls addDays', function() {
            spyOn(cachedLayer.temporalExtent, 'addDays');
            cachedLayer._timeSeriesDatesLoaded(sampleJson);
            expect(cachedLayer.temporalExtent.addDays).toHaveBeenCalled();
        });

        it('loads first day', function() {
            cachedLayer._timeSeriesDatesLoaded(sampleJson);
            expect(cachedLayer.temporalExtent.getFirstDay).toHaveBeenCalled();
            expect(cachedLayer.loadTimeSeriesForDay).toHaveBeenCalled();
        });

        it('loads last day', function() {
            cachedLayer._timeSeriesDatesLoaded(sampleJson);
            expect(cachedLayer.temporalExtent.getLastDay).toHaveBeenCalled();
            expect(cachedLayer.loadTimeSeriesForDay).toHaveBeenCalled();
        });
    });

    describe('_loadStyles', function() {

        it('sets styles property from extra layer info', function() {

            var stylesResponse = {
                styles: ['styleA', 'styleC', 'styleB'],
                palettes: ['paletteB', 'paletteC', 'paletteA']
            };

            cachedLayer._stylesLoaded(stylesResponse);

            expect(cachedLayer.styles).toEqual(
                [
                    {name: 'styleA', palette: 'paletteA'},
                    {name: 'styleA', palette: 'paletteB'},
                    {name: 'styleA', palette: 'paletteC'},
                    {name: 'styleB', palette: 'paletteA'},
                    {name: 'styleB', palette: 'paletteB'},
                    {name: 'styleB', palette: 'paletteC'},
                    {name: 'styleC', palette: 'paletteA'},
                    {name: 'styleC', palette: 'paletteB'},
                    {name: 'styleC', palette: 'paletteC'}
                ]
            );
        });
    });

    it('parses dates from NcWMS GetMetadata JSON', function() {
        var ncwmsFiltersJson = '[{"label":"Time","type":"TimeSeries","name":"timesteps","possibleValues":["2010-02-23T00:00:00Z","2010-03-10T00:00:00Z","2010-03-11T00:00:00Z","2010-03-12T00:00:00Z","2010-03-13T00:00:00Z"]}]';
        var ncwmsFilters = Ext.util.JSON.decode(ncwmsFiltersJson);

        var datesWithData = cachedLayer._parseDatesWithData(ncwmsFilters);

        expect(datesWithData.length).toEqual(5);
        expect(searchForDate(moment.utc('2010-02-23'), datesWithData)).toBeGreaterThan(-1);
        expect(searchForDate(moment.utc('2010-03-10'), datesWithData)).toBeGreaterThan(-1);
        expect(searchForDate(moment.utc('2010-03-11'), datesWithData)).toBeGreaterThan(-1);
        expect(searchForDate(moment.utc('2010-03-12'), datesWithData)).toBeGreaterThan(-1);
        expect(searchForDate(moment.utc('2010-03-13'), datesWithData)).toBeGreaterThan(-1);

        // Search for something that shouldn't be there
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
