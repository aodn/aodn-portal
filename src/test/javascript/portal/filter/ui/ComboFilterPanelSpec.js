/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.filter.ui.ComboFilterPanel", function() {

    var filterPanel;

    // Test set-up
    beforeEach(function() {

        Portal.filter.ui.ComboFilterPanel.prototype._createControls = function() {
            this.combo = {
                setValue: jasmine.createSpy()
            };
        };

        filterPanel = new Portal.filter.ui.ComboFilterPanel({
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
    });

    describe('validateValue function', function() {

        beforeEach(function() {
            filterPanel.combo = {};
            filterPanel.getRawValue = function() { return "L'Astrolabe"; };
            filterPanel.markInvalid = noOp;
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

    describe('onChange', function() {

        beforeEach(function() {
            spyOn(window, 'trackUsage');
            filterPanel.filter.setValue = jasmine.createSpy('setValue');
            filterPanel.combo = {
                getValue: function() { return "value" },
                disabled: false
            };
        });

        it('tracks usage using google analytics', function() {

            filterPanel._onChange();

            expect(window.trackUsage).toHaveBeenCalledWith("Filters", "Combo", "testLabel=value", "test layer");
        });
    });
});
