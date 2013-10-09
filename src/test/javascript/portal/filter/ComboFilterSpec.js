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
        var testData = {
            data: {
                text: "L'Astrolabe"
            }
        }
        
        comboFilter.filter = {
            name: "vessel_name"
        }
        
        var result = comboFilter._createCQL(comboFilter, testData);
        
        expect(comboFilter.CQL).toEqual("vessel_name LIKE 'L''Astrolabe'");
    });
    
});
