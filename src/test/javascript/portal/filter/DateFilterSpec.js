describe("Portal.filter.DateFilter", function() {

    var filter;
    var dateLabel = OpenLayers.i18n('temporalExtentHeading');
    var exampleFromDate = ['1999-01-01T00:00:00Z', '1999/Jan/01-11:00-UTC'];
    var exampleToDate = ['2006-06-06T01:00:00Z', '2006/Jun/06-11:00-UTC'];
    var errorCode = 'NOT SET';

    beforeEach(function() {

        filter = new Portal.filter.DateFilter({
            name: 'column_name',
            label: 'Nice name',
            primaryFilter: true
        });

        filter._getDateString = function(d) { return d ? d[0] : errorCode };
        filter._getDateHumanString = function(d) { return d ? d[1] : errorCode };
    });

    describe('no dates (but not-null value)', function() {

        beforeEach(function() {

            filter.setValue({});
        });

        describe('hasValue', function() {

            it('returns false', function() {

                expect(filter.hasValue()).not.toBeTruthy();
            });
        });
    });

    describe('only start date', function() {

        beforeEach(function() {

            filter.setValue({
                fromDate: exampleFromDate
            });
        });

        it('gives map layer CQL', function() {

            expect(filter.getCql()).toBe("column_name >= '1999-01-01T00:00:00Z'");
        });

        it('gives data layer CQL', function() {

            expect(filter.getDateDataCql()).toBe("column_name >= '1999-01-01T00:00:00Z'");
        });

        it('gives human readble form', function() {

            expect(filter.getHumanReadableForm()).toBe(dateLabel + ": after 1999/Jan/01-11:00-UTC");
        });
    });

    describe('only end date', function() {

        beforeEach(function() {

            filter.setValue({
                toDate: exampleToDate
            });
        });

        it('gives map layer CQL', function() {

            expect(filter.getCql()).toBe("column_name <= '2006-06-06T01:00:00Z'");
        });

        it('gives data layer CQL', function() {

            expect(filter.getDateDataCql()).toBe("column_name <= '2006-06-06T01:00:00Z'");
        });

        it('gives human readble form', function() {

            expect(filter.getHumanReadableForm()).toBe(dateLabel + ": before 2006/Jun/06-11:00-UTC");
        });
    });

    describe('multiple dates', function() {

        beforeEach(function() {

            filter.setValue({
                fromDate: exampleFromDate,
                toDate: exampleToDate
            });
        });

        it('gives map layer CQL', function() {

            expect(filter.getCql()).toBe("column_name >= '1999-01-01T00:00:00Z' AND column_name <= '2006-06-06T01:00:00Z'");
        });

        it('gives data layer CQL', function() {

            expect(filter.getDateDataCql()).toBe("column_name >= '1999-01-01T00:00:00Z' AND column_name <= '2006-06-06T01:00:00Z'");
        });

        it('gives human readble form', function() {

            expect(filter.getHumanReadableForm()).toBe(dateLabel + ": 1999/Jan/01-11:00-UTC to 2006/Jun/06-11:00-UTC");
        });
    });

    describe('date range columns set', function() {

        beforeEach(function() {

            filter.wmsStartDateName = 'range_start_column_name';
            filter.wmsEndDateName = 'range_end_column_name';
            filter.setValue({
                fromDate: exampleFromDate,
                toDate: exampleToDate
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

            expect(filter.getHumanReadableForm()).toBe(dateLabel + ": 1999/Jan/01-11:00-UTC to 2006/Jun/06-11:00-UTC");
        });
    });

    describe('non-primary time filter', function() {

        beforeEach(function() {

            filter.primaryFilter = false;
            filter.setValue({
                fromDate: exampleFromDate
            });
        });

        it('gives human readble form', function() {

            expect(filter.getHumanReadableForm()).toBe(dateLabel + " (Nice name): after 1999/Jan/01-11:00-UTC");
        });
    });
});
