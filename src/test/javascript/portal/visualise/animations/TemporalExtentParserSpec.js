/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.visualise.animations.TemporalExtentParser", function() {

    var temporalExtentParser;

    beforeEach(function () {
        temporalExtentParser = new Portal.visualise.animations.TemporalExtentParser();
    });

    it('expandExtendedISO8601Dates Correct compressed Request', function() {

        var res = temporalExtentParser.expandExtendedISO8601Dates([
            '2001-01-11T22:36:00.000Z/2001-01-12T21:48:00.000Z/PT23H36M',
            '2002-12-29T01:00:00.000Z/2002-12-31T06:00:00.000Z/P1D']);

        var expectedDateStrings = [
            '2001-01-12T09:36:00+11:00',
            '2001-01-13T08:48:00+11:00',
            '2002-12-29T12:00:00+11:00',
            '2002-12-30T12:00:00+11:00',
            '2002-12-31T12:00:00+11:00',
            '2002-12-31T17:00:00+11:00'
        ];

        expect(res).toBeSame(expectedDateStrings);
    });

    it('expandExtendedISO8601Dates Correct Simple Request', function() {
        // uncompressed dates go through unaltered
        var res = temporalExtentParser.expandExtendedISO8601Dates(['2001-01-10T22:36:00.000Z']);
        expect(res[0]).toBeSame('2001-01-10T22:36:00.000Z');
    });

    it('end date is included', function() {
        expect(temporalExtentParser._expand3sectionExtendedISO8601Date('2000-01-01T00:00:00.000Z/2000-01-01T01:00:00.000Z/PT30M').length).toBe(3);
    });

    it('expandExtendedISO8601Dates Invalid Start date Request', function() {
        var res = temporalExtentParser.expandExtendedISO8601Dates(['2001-59-10T22:36:00.000Z/2001-01-12T21:48:00.000Z/PT23H36M']);
        expect(res.length).toBe(0);
    });

    it('expandExtendedISO8601Dates Invalid parameter Request', function() {
        // expecting an array not string
        var res = temporalExtentParser.expandExtendedISO8601Dates(['2001-59-10T22:36:00.000Z/2001-01-12T21:48:00.000Z/PT23H36M']);
        expect(res.length).toBe(0);
    });

    describe('A date string', function() {
        it('period has a length of three', function() {
            expect(temporalExtentParser._isPeriodLength(0)).toBeFalsy();
            expect(temporalExtentParser._isPeriodLength(1)).toBeFalsy();
            expect(temporalExtentParser._isPeriodLength(2)).toBeFalsy();
            expect(temporalExtentParser._isPeriodLength(3)).toBeTruthy();
        });

        it('is a period if it has three parts split by forward slashes', function() {
            expect(temporalExtentParser._isPeriod("")).toBeFalsy();
            expect(temporalExtentParser._isPeriod("/")).toBeFalsy();
            expect(temporalExtentParser._isPeriod("//")).toBeTruthy();
        });

        it('can have a length of one', function() {
            expect(temporalExtentParser._isValidUnit('2002-12-31T17:00:00+11:00')).toBeTruthy();
        });

        it('can have a length of three', function() {
            expect(temporalExtentParser._isValidUnit('2001-01-11T22:36:00.000Z/2001-01-12T21:48:00.000Z/PT23H36M')).toBeTruthy();
        });
    });

    describe('temporalExtent._getISO8601Period', function() {
        it('understands a yearly period', function() {
            var res = temporalExtentParser._getISO8601Period('P5Y');
            var expectedResult = _initPeriod({ "years": 5 });
            expect(res).toEqual(expectedResult);
        });

        it('understands a monthly period', function() {
            var res = temporalExtentParser._getISO8601Period('P5M');
            var expectedResult = _initPeriod({ "months": 5 });
            expect(res).toEqual(expectedResult);
        });

        it('understands a weekly period', function() {
            var res = temporalExtentParser._getISO8601Period('P5W');
            var expectedResult = _initPeriod({ "weeks": 5 });
            expect(res).toEqual(expectedResult);
        });

        it('understands a daily period', function() {
            var res = temporalExtentParser._getISO8601Period('P5D');
            var expectedResult = _initPeriod({ "days": 5 });
            expect(res).toEqual(expectedResult);
        });

        it('understands a hourly period', function() {
            var res = temporalExtentParser._getISO8601Period('PT5H');
            var expectedResult = _initPeriod({ "hours": 5 });
            expect(res).toEqual(expectedResult);
        });

        it('understands a period of minutes', function() {
            var res = temporalExtentParser._getISO8601Period('PT5M');
            var expectedResult = _initPeriod({ "minutes": 5 });
            expect(res).toEqual(expectedResult);
        });

        it('understands a period of seconds', function() {
            var res = temporalExtentParser._getISO8601Period('PT5S');
            var expectedResult = _initPeriod({ "seconds": 5 });
            expect(res).toEqual(expectedResult);
        });

        it('understands a mixed period of days hours minutes and seconds', function() {
            var res = temporalExtentParser._getISO8601Period('P5DT23H36M24S');
            var expectedResult = _initPeriod({ "seconds": 24, "minutes": 36, "hours": 23, "days": 5 });
            expect(res).toEqual(expectedResult);
        });

        it('understands a mixed period of months hours minutes and seconds', function() {
            var res = temporalExtentParser._getISO8601Period('P5MT23H36M24S');
            var expectedResult = _initPeriod({ "seconds": 24, "minutes": 36, "hours": 23, "months": 5 });
            expect(res).toEqual(expectedResult);
        });

        it('understands a mixed period of months  minutes and seconds', function() {
            var res = temporalExtentParser._getISO8601Period('P5MT36M24S');
            var expectedResult = _initPeriod({ "seconds": 24, "minutes": 36, "months": 5 });
            expect(res).toEqual(expectedResult);
        });

        it('understands a full period', function() {
            var res = temporalExtentParser._getISO8601Period('P2Y5M1W2DT6H36M24S');
            var expectedResult = { "seconds": 24, "minutes": 36, "hours": 6, "days": 2, "weeks": 1, "months": 5, "years": 2 };
            expect(res).toEqual(expectedResult);
        });
    });

    function _initPeriod(defaults) {
        return Ext.apply(_emptyPeriod(), defaults);
    }

    function _emptyPeriod() {
        return {
            "seconds": null,
            "minutes": null,
            "hours": null,
            "days": null,
            "weeks": null,
            "months": null,
            "years": null
        };
    }

});
