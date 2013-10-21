/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.filter.BooleanFilter", function() {

    var booleanFilter;

    // Test set-up
    beforeEach(function() {
        booleanFilter = new Portal.filter.BooleanFilter({});
        
        booleanFilter.filter = { name: 'test' };
        
        var MockButton = function() {
            this.getValue = function() { return false; };
            this.setValue = jasmine.createSpy();
        }

        booleanFilter.checkbox = new MockButton();
        
        booleanFilter.layer = {};
        booleanFilter.layer.getDownloadFilter = function() { return ""; };
    });

    it('constructor should set CQL to ""', function() {
        expect(booleanFilter.CQL).toEqual("");
    });

    it('_createCQL should set CQL to filter for true values if true radio button selected', function() {
        booleanFilter.checkbox.getValue = function() { return true; };
        
        booleanFilter._createCQL();
        
        expect(booleanFilter.CQL).toEqual("test = true");
    });
    
    it('_createCQL should set empty CQL for false values if checkbox not selected', function() {
        booleanFilter.checkbox.getValue = function() { return false; };
        
        booleanFilter._createCQL();
        
        expect(booleanFilter.CQL).toEqual("");
    });


    
    it('_setExistingFilters should not set checked for empty CQL filter', function() {
        booleanFilter._setExistingFilters();
        
        expect(booleanFilter.checkbox.setValue).not.toHaveBeenCalled();
    });
    
});
