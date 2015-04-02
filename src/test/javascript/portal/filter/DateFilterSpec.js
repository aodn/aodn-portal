/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.filter.DateFilter", function() {

    var newDate = function(s) {

        return moment(s, "DD/MM/YYYY HH:mm").toDate();
    };

    var filter;

    beforeEach(function() {

        filter = new Portal.filter.DateFilter({
            name: 'column_name'
        });
    });

    describe('only start date', function() {

        beforeEach(function() {

            filter.setValue({
                fromDate: newDate('01/01/1999 12:00')
            });
        });

        it('gives map layer CQL', function() {

            expect(filter.getCql()).toBe("column_name >= '1999-01-01T00:00:00Z'");
        });

        it('gives data layer CQL', function() {

            expect(filter.getDateDataCql()).toBe("column_name >= '1999-01-01T00:00:00Z'");
        });

        it('gives human readble form', function() {

            expect(filter.getHumanReadableForm()).toBe("End Date >= 1999/Jan/01-11:00-UTC");
        });
    });

    describe('only end date', function() {

        beforeEach(function() {

            filter.setValue({
                toDate: newDate('06/06/2006 12:00')
            });
        });

        it('gives map layer CQL', function() {

            expect(filter.getCql()).toBe("column_name <= '2006-06-06T01:00:00Z'");
        });

        it('gives data layer CQL', function() {

            expect(filter.getDateDataCql()).toBe("column_name <= '2006-06-06T01:00:00Z'");
        });

        it('gives human readble form', function() {

            expect(filter.getHumanReadableForm()).toBe("Start Date <= 2006/Jun/06-11:00-UTC");
        });
    });

    describe('multiple dates', function() {

        beforeEach(function() {

            filter.setValue({
                fromDate: newDate('01/01/1999 12:00'),
                toDate: newDate('06/06/2006 12:00')
            });
        });

        it('gives map layer CQL', function() {

            expect(filter.getCql()).toBe("column_name >= '1999-01-01T00:00:00Z' AND column_name <= '2006-06-06T01:00:00Z'");
        });

        it('gives data layer CQL', function() {

            expect(filter.getDateDataCql()).toBe("column_name >= '1999-01-01T00:00:00Z' AND column_name <= '2006-06-06T01:00:00Z'");
        });

        it('gives human readble form', function() {

            expect(filter.getHumanReadableForm()).toBe("End Date >= 1999/Jan/01-11:00-UTC and Start Date <= 2006/Jun/06-11:00-UTC");
        });
    });

    describe('date range columns set', function() {

        beforeEach(function() {

            filter.wmsStartDateName = 'range_start_column_name';
            filter.wmsEndDateName = 'range_end_column_name';

            filter.setValue({
                fromDate: newDate('01/01/1999 12:00'),
                toDate: newDate('06/06/2006 12:00')
            });
        });

        it('gives map layer CQL', function() {

            // Note: To capture any data that falls within the range the end date is compared to the start of the range, and the start date is compared to the end of the range
            expect(filter.getCql()).toBe("range_end_column_name >= '1999-01-01T00:00:00Z' AND range_start_column_name <= '2006-06-06T01:00:00Z'");
        });

        it('gives data layer CQL', function() {

            expect(filter.getDateDataCql()).toBe("column_name >= '1999-01-01T00:00:00Z' AND column_name <= '2006-06-06T01:00:00Z'");
        });

        it('gives human readble form', function() {

            expect(filter.getHumanReadableForm()).toBe("End Date >= 1999/Jan/01-11:00-UTC and Start Date <= 2006/Jun/06-11:00-UTC");
        });
    });
});
