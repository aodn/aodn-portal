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
                getLabel: function() { return 'testLabel' },
                setValue: noOp
            },
            layer: {
                name: 'test layer',
                getDownloadCql: function() { return ""; }
            }
        });

        spyOn(window, 'trackUsage');
    });

    it('tracking on booleanFilter click', function() {
        booleanFilter._buttonChecked();
        expect(window.trackUsage).toHaveBeenCalledWith("Filters", "Boolean", "testLabel=false", "test layer");
    });
});
