/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.filter.ui.BooleanFilterPanel", function() {

    var booleanFilter;

    beforeEach(function() {
        var MockButton = function() {
            this.getValue = function() { return false; };
            this.setValue = jasmine.createSpy();
        };

        Portal.filter.ui.BooleanFilterPanel.prototype._createControls = function() {
            this.checkbox = new MockButton();
        };

        booleanFilter = new Portal.filter.ui.BooleanFilterPanel({
            filter: {
                getName: function() { return 'test' },
                getLabel: function() { return 'testLabel' }
            },
            layer: {
                name: 'test layer',
                getDownloadFilter: function() { return ""; }
            }
        });

        spyOn(window, 'trackUsage');
    });

    describe('getCQL', function() {
        it('should initially return ""', function() {
            expect(booleanFilter.getCQL()).toEqual(undefined);
        });

        it('should return true values if checkbox selected', function() {
            booleanFilter.checkbox.getValue = function() { return true; };
            expect(booleanFilter.getCQL()).toEqual("test = true");
        });

        it('should return false values if checkbox not selected', function() {
            booleanFilter.checkbox.getValue = function() { return false; };
            expect(booleanFilter.getCQL()).toEqual(undefined);
        });

        it('human readable cql', function() {
            booleanFilter.checkbox.getValue = function() { return true; };
            expect(booleanFilter._getCQLHumanValue()).toEqual("testLabel = true");
        });
    });

    it('tracking on booleanFilter click', function() {
        booleanFilter._buttonChecked();
        expect(window.trackUsage).toHaveBeenCalledWith("Filters", "Boolean", "testLabel=false", "test layer");
    });
});
