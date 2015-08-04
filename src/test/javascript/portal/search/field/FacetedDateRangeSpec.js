

describe("Portal.search.field.FacetedDateRange", function()
{

    describe("isValid", function() {
        it("valid if both dates are valid and non-empty", function() {
            var dateRange = new Portal.search.field.FacetedDateRange();

            dateRange.setFilterValue({fromDate:Date.parseDate("2012-10-20","Y-m-d"),toDate:Date.parseDate("2012-10-27","Y-m-d")});
            
            expect(dateRange.isValid()).toEqual(true);
        });

        it("invalid if from date is empty", function() {
            var dateRange = new Portal.search.field.FacetedDateRange();

            dateRange.setFilterValue({fromDate:Date.parseDate("2012-10-20","Y-m-d"),toDate:Date.parseDate("2012-10-27","Y-m-d")});
            dateRange.fromDate.setValue("");
            
            expect(dateRange.isValid()).toEqual(false);
        });

        it("invalid if to date is empty", function() {
            var dateRange = new Portal.search.field.FacetedDateRange();

            dateRange.setFilterValue({fromDate:Date.parseDate("2012-10-20","Y-m-d"),toDate:Date.parseDate("2012-10-27","Y-m-d")});
            dateRange.toDate.setValue("");
            
            expect(dateRange.isValid()).toEqual(false);
        });

        it("invalid if from date is invalid", function() {
            var dateRange = new Portal.search.field.FacetedDateRange();

            dateRange.setFilterValue({fromDate:Date.parseDate("2012-10-20","Y-m-d"),toDate:Date.parseDate("2012-10-27","Y-m-d")});
            dateRange.fromDate.setValue("xxxx-10-20");
            
            expect(dateRange.isValid()).toEqual(false);
        });
        
        it("invalid if to date is invalid", function() {
            var dateRange = new Portal.search.field.FacetedDateRange();

            dateRange.setFilterValue({fromDate:Date.parseDate("2012-10-20","Y-m-d"),toDate:Date.parseDate("2012-10-27","Y-m-d")});
            dateRange.toDate.setValue("xxxx-10-20");
            
            expect(dateRange.isValid()).toEqual(false);
        });
    });

    describe("_onUpdate", function() {
        it("valid event if date range is valid", function() {
            var dateRange = new Portal.search.field.FacetedDateRange();
            spyOn(dateRange, "fireEvent");

            dateRange.setFilterValue({fromDate:Date.parseDate("2012-10-20","Y-m-d"),toDate:Date.parseDate("2012-10-27","Y-m-d")});
            dateRange._onUpdate();
            
            expect(dateRange.fireEvent).toHaveBeenCalledWith("valid");
        });

        it("invalid event if date range is invalid", function() {
            var dateRange = new Portal.search.field.FacetedDateRange();
            spyOn(dateRange, "fireEvent");

            dateRange.setFilterValue({fromDate:Date.parseDate("2012-10-20","Y-m-d"),toDate:Date.parseDate("2012-10-27","Y-m-d")});
            dateRange.toDate.setValue("xxxx-10-20");
            dateRange._onUpdate();
            
            expect(dateRange.fireEvent).toHaveBeenCalledWith("invalid");
        });

        it("updates min/max date", function() {
            var dateRange = new Portal.search.field.FacetedDateRange();
            var from = Date.parseDate("2012-10-20","Y-m-d");
            var to = Date.parseDate("2012-10-27","Y-m-d");
            
            dateRange.fromDate.setValue(from);
            dateRange.toDate.setValue(to);
            
            dateRange._onUpdate();

            expect(dateRange.fromDate.maxValue).toEqual(to);
            expect(dateRange.toDate.minValue).toEqual(from);
        });
    });
});
