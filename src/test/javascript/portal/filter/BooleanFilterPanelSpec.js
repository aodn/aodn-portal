/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.filter.BooleanFilterPanel", function() {

    var booleanFilter;

    beforeEach(function() {
        var MockButton = function() {
            this.getValue = function() { return false; };
            this.setValue = jasmine.createSpy();
        }

        Portal.filter.BooleanFilterPanel.prototype._createField = function() {
            this.checkbox = new MockButton();
        };

        booleanFilter = new Portal.filter.BooleanFilterPanel({
            filter: {
                name: 'test'
            },
            layer: {
                getDownloadFilter: function() { return ""; }
            }
        });
    });

    describe('getCQL', function() {
        it('should initially return ""', function() {
            expect(booleanFilter.getCQL()).toEqual('');
        });

        it('should return true values if checkbox selected', function() {
            booleanFilter.checkbox.getValue = function() { return true; };
            expect(booleanFilter.getCQL()).toEqual("test = true");
        });

        it('should return false values if checkbox not selected', function() {
            booleanFilter.checkbox.getValue = function() { return false; };
            expect(booleanFilter.getCQL()).toEqual("");
        });
    });

    it('_setExistingFilters should not set checked for empty CQL filter', function() {
        booleanFilter._setExistingFilters();
        expect(booleanFilter.checkbox.setValue).not.toHaveBeenCalled();
    });
});
