/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.filter.TimeFilter", function() {

    var timeFilter;

    beforeEach(function() {
        timeFilter = new Portal.filter.TimeFilter({});
    });

    describe('handleRemoveFilter', function() {
        beforeEach(function() {
            timeFilter.operators = {};
            timeFilter.operators.clearValue = function() {};
            spyOn(timeFilter.operators, 'clearValue');

            timeFilter.toField = {};
            timeFilter.toField.reset = function() {};
            spyOn(timeFilter.toField, 'reset');

            timeFilter.fromField = {};
            timeFilter.fromField.reset = function() {};
            spyOn(timeFilter.fromField, 'reset');
        });

        it('clears operators', function() {
            timeFilter.handleRemoveFilter();
            expect(timeFilter.operators.clearValue).toHaveBeenCalled();
        });

        it('resets toField', function() {
            timeFilter.handleRemoveFilter();
            expect(timeFilter.toField.reset).toHaveBeenCalled();
        });

        it('resets fromField', function() {
            timeFilter.handleRemoveFilter();
            expect(timeFilter.toField.reset).toHaveBeenCalled();
        });

        it('clears CQL', function() {
            timeFilter.CQL = "not an empty string";
            timeFilter.handleRemoveFilter();
            expect(timeFilter.CQL).toEqual("");
        });

    });
});
