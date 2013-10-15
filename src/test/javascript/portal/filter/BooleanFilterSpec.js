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

        booleanFilter.trueButton = new MockButton(); 
        booleanFilter.falseButton = new MockButton();
        
        booleanFilter.layer = {};
        booleanFilter.layer.getDownloadFilter = function() { return ""; };
    });

    it('constructor should set CQL to ""', function() {
        expect(booleanFilter.CQL).toEqual("");
    });

    it('_createCQL should set CQL to filter for true values if true radio button selected', function() {
        booleanFilter.trueButton.getValue = function() { return true; };
        
        booleanFilter._createCQL();
        
        expect(booleanFilter.CQL).toEqual("test = true");
    });
    
    it('_createCQL should set CQL to filter for false values if false radio button selected', function() {
        booleanFilter.falseButton.getValue = function() { return true; };
        
        booleanFilter._createCQL();
        
        expect(booleanFilter.CQL).toEqual("test = false");
    });
    
    it('_createCQL should set CQL to "" if no buttons selected', function() {
        booleanFilter._createCQL();
        
        expect(booleanFilter.CQL).toEqual("");
    });
    
    it('_setExistingFilters should check true button if CQL filter matches true values', function() {
        booleanFilter.layer.getDownloadFilter = function() { return "test = true"; };
        
        booleanFilter._setExistingFilters();
        
        expect(booleanFilter.trueButton.setValue).toHaveBeenCalled();
    });
    
    it('_setExistingFilters should not check true or false buttons for empty CQL filter', function() {
        booleanFilter._setExistingFilters();
        
        expect(booleanFilter.trueButton.setValue).not.toHaveBeenCalled();
        expect(booleanFilter.falseButton.setValue).not.toHaveBeenCalled();
    });
    
});
