/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.filter.ComboFilterPanel", function() {

    var comboFilter;

    // Test set-up
    beforeEach(function() {

        Portal.filter.ComboFilterPanel.prototype._createField = function() {
            this.combo = {
                setValue: jasmine.createSpy()
            };
        };

        comboFilter = new Portal.filter.ComboFilterPanel({
            filter: {
                name: 'test'
            },
            layer: {
                getDownloadFilter: function() { return ""; }
            }
        });
    });

    it('_escapeSingleQuotes should replace single quotes with two single quotes', function() {
        var result = comboFilter._escapeSingleQuotes("L'Astrolabe");

        expect(result).toEqual("L''Astrolabe");
    });

    it('_escapeSingleQuotes should handle multiple single quotes', function() {
        var result = comboFilter._escapeSingleQuotes("L''Astro'labe");

        expect(result).toEqual("L''''Astro''labe");
    });

    describe('getCQL', function() {
        it('should create the cql filter replacing single quotes in the filter value with two single quotes', function() {
            comboFilter.filter = { name: "vessel_name" };

            comboFilter.combo = {};
            comboFilter.combo.getValue = function() { return "L'Astrolabe"; };

            expect(comboFilter.getCQL()).toEqual("vessel_name LIKE 'L''Astrolabe'");
        });
    });

    it('_setExistingFilters should set value to matching CQL parameter (only)', function() {
        comboFilter.layer.getDownloadFilter = function() {
            return "filter1 LIKE 'somevalue' AND test LIKE 'testvalue' AND filter3 LIKE 'anothervalue'";
        };

        comboFilter._setExistingFilters();

        expect(comboFilter.combo.setValue).toHaveBeenCalledWith('testvalue');
    });
});
