/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.common.helpers", function() {


    it('expandExtendedISO8601Dates Correct compressed Request', function() {

        var res = expandExtendedISO8601Dates('2001-01-10T22:36:00.000Z/2001-01-12T21:48:00.000Z/PT23H36M');
        expect(res).toBe("2001-01-11T09:36:00+11:00,2001-01-12T09:12:00+11:00,2001-01-13T08:48:00+11:00,2001-01-13T08:48:00+11:00");
    });

    it('expandExtendedISO8601Dates Correct Simple Request', function() {
        // uncompressed dates go through unaltered
        var res = expandExtendedISO8601Dates('2001-01-10T22:36:00.000Z');
        expect(res).toBe("2001-01-10T22:36:00.000Z");
    });


    it('expandExtendedISO8601Dates Invalid Start date Request', function() {
        var res = expandExtendedISO8601Dates('2001-59-10T22:36:00.000Z/2001-01-12T21:48:00.000Z/PT23H36M');
        expect(res).toBe('');
    });

    it('expandExtendedISO8601Dates Invalid parameter Request', function() {
        // expecting an array not string
        var res = expandExtendedISO8601Dates('2001-59-10T22:36:00.000Z/2001-01-12T21:48:00.000Z/PT23H36M');
        expect(res).toBe('');
    });

    it('_getISO8601Period Create a timedate object', function() {
        var res = _getISO8601Period('P5DT23H36M24S');
        var expectedResult = JSON.stringify({"seconds":24,"minutes":36,"hours":23,"days":5,"weeks":null,"months":null,"years":null});
        expect(JSON.stringify(res)).toBe(expectedResult);
    });



    


});
