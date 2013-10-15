/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.filter.ComboFilter", function() {

    var comboFilter;

    // Test set-up
    beforeEach(function() {
        comboFilter = new Portal.filter.ComboFilter({});

        comboFilter.filter = { name: 'test' };

        comboFilter.combo = {};
        comboFilter.combo.setValue = jasmine.createSpy();
        
        comboFilter.layer = {};
        comboFilter.layer.getDownloadFilter = function() { return ""; };
    });

    it('_escapeSingleQuotes should replace single quotes with two single quotes', function() {
        var result = comboFilter._escapeSingleQuotes("L'Astrolabe");
        
        expect(result).toEqual("L''Astrolabe");
    });

    it('_escapeSingleQuotes should handle mutliple single quotes', function() {
        var result = comboFilter._escapeSingleQuotes("L''Astro'labe");
        
        expect(result).toEqual("L''''Astro''labe");
    });
    
    it('_createCQL should create the cql filter replacing single quotes in the filter value with two single quotes', function() {
        comboFilter.filter = { name: "vessel_name" };
        
        comboFilter.combo = {};
        comboFilter.combo.getValue = function() { return "L'Astrolabe"; };
        
        comboFilter._createCQL();
        
        expect(comboFilter.CQL).toEqual("vessel_name LIKE 'L''Astrolabe'");
    });
    
    it('_setExistingFilters should set value to matching CQL parameter (only)', function() {
        comboFilter.layer.getDownloadFilter = function() {
            return "filter1 LIKE 'somevalue' AND test LIKE 'testvalue' AND filter3 LIKE 'anothervalue'";
        };
        
        spyOn(comboFilter, "_createCQL");
        
        comboFilter._setExistingFilters();
        
        expect(comboFilter.combo.setValue).toHaveBeenCalledWith('testvalue');
        expect(comboFilter._createCQL).toHaveBeenCalled();
    });
    
});
