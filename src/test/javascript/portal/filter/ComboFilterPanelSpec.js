/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.filter.ComboFilterPanel", function() {

    var filterPanel;

    // Test set-up
    beforeEach(function() {

        Portal.filter.ComboFilterPanel.prototype._createField = function() {
            this.combo = {
                setValue: jasmine.createSpy()
            };
        };

        filterPanel = new Portal.filter.ComboFilterPanel({
            filter: {
                name: 'test',
                label: 'testLabel'
            },
            layer: {
                name: 'test layer',
                getDownloadFilter: function() { return ""; }
            }
        });
    });

    it('_escapeSingleQuotes should replace single quotes with two single quotes', function() {
        var result = filterPanel._escapeSingleQuotes("L'Astrolabe");

        expect(result).toEqual("L''Astrolabe");
    });

    it('_escapeSingleQuotes should handle multiple single quotes', function() {
        var result = filterPanel._escapeSingleQuotes("L''Astro'labe");

        expect(result).toEqual("L''''Astro''labe");
    });

    describe('getCQL', function() {
        it('should create the cql filter replacing single quotes in the filter value with two single quotes', function() {
            filterPanel.filter = { name: "vessel_name" };

            filterPanel.combo = {};
            filterPanel.combo.getValue = function() { return "L'Astrolabe"; };

            expect(filterPanel.getCQL()).toEqual("vessel_name LIKE 'L''Astrolabe'");
        });
    });

    it('_setExistingFilters should set value to matching CQL parameter (only)', function() {
        filterPanel.layer.getDownloadFilter = function() {
            return "filter1 LIKE 'somevalue' AND test LIKE 'testvalue' AND filter3 LIKE 'anothervalue'";
        };

        filterPanel._setExistingFilters();

        expect(filterPanel.combo.setValue).toHaveBeenCalledWith('testvalue');
    });

    describe('validateValue function', function() {

        beforeEach(function() {
            filterPanel.combo = {};
            filterPanel.getRawValue = function() { return "L'Astrolabe"; };
            filterPanel.markInvalid = function() {noOp};
        });
        it('should return true when in the store', function() {

            filterPanel.findRecord = function() { return true; };
            expect(filterPanel.validateValue()).toEqual(true);
        });
        it('should mark combo invalid when not in the store', function() {

            spyOn(filterPanel, 'markInvalid');
            filterPanel.findRecord = function() { return undefined; };
            filterPanel.validateValue("anything");
            expect(filterPanel.markInvalid).toHaveBeenCalled();
            expect(filterPanel.validateValue()).toEqual(false);
        });
    });

    describe('onSelected', function() {
        it('tracks usage using google analytics', function() {
            spyOn(window, 'trackUsage');
            filterPanel.combo.getValue = function() {
                return "value";
            }
            filterPanel._onSelected();

            expect(window.trackUsage).toHaveBeenCalledWith("Filters", "Combo", "testLabel=value", "test layer");
        });
    });
});
