/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.filter.ComboFilter", function() {

    var numberFilter;

    // Test set-up
    beforeEach(function() {
        numberFilter = new Portal.filter.NumberFilter({});
    });

    it('constructor should set CQL to ""', function() {
        expect(numberFilter.CQL).toEqual("");
    });
    
});
