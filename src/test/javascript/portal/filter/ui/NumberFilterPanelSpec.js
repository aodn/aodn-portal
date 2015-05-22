/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.filter.ui.NumberFilterPanel", function() {

    var numberFilter;

    beforeEach(function() {

        Portal.filter.ui.NumberFilterPanel.prototype._createControls = function() {
            this.firstField = {
                getValue: function() {
                    return false;
                },
                validate: function() {
                    return true;
                }
            };
            this.operators = {
                getValue: noOp
            };
            this.secondField = {
                getValue: function() {
                    return false;
                },
                validate: function() {
                    return true;
                }
            };
        };

        numberFilter = new Portal.filter.ui.NumberFilterPanel({
            filter: {
                name: 'test',
                label: 'testLabel',
                setValue: noOp
            },
            layer: {
                name: 'test layer'
            }
        });
    });

    describe('_updateFilter', function() {
        beforeEach(function() {
            numberFilter._createControls();
            numberFilter.firstField.getValue = function() { return 5 };
            numberFilter.firstField.clearInvalid = function() {};
            numberFilter.secondField.clearInvalid = function() {};
            numberFilter.firstField.validateValue = function() {return true};
            numberFilter.secondField.validateValue = function() {return true};
            numberFilter.operators = {
                lastSelectionText: 'less than',
                getValue: noOp,
                markInvalid: noOp
            };

            spyOn(numberFilter, '_getSelectedOperatorObject');
        });

        it('sends correct tracking data  when operator is not between', function() {
            spyOn(window, 'trackUsage');

            numberFilter._operatorIsBetween = function() { return false };
            numberFilter._updateFilter();

            expect(window.trackUsage).toHaveBeenCalledWith("Filters", "Number", "testLabel less than 5", "test layer");
        });

        it('sends correct tracking data when operator is between', function() {
            spyOn(window, 'trackUsage');

            numberFilter._operatorIsBetween = function() { return true };
            numberFilter.operators.lastSelectionText = 'between';
            numberFilter.secondField.getValue = function() { return 6 };
            numberFilter._updateFilter();

            expect(window.trackUsage).toHaveBeenCalledWith("Filters", "Number", "testLabel between 5 and 6", "test layer");
        });

        it('no update when operator is not set', function() {
            spyOn(numberFilter.filter, 'setValue');

            numberFilter._operatorIsNotSet = function() { return true };
            numberFilter.operators.lastSelectionText = '';

            numberFilter._updateFilter();
            expect(numberFilter.filter.setValue).not.toHaveBeenCalled();

            numberFilter.firstField.getValue = function() { return 4 };
            numberFilter.secondField.getValue = function() { return 6 };
            numberFilter._updateFilter();
            expect(numberFilter.filter.setValue).not.toHaveBeenCalled();
        });

        it('no trackusage when firstField is not set on updateFilter', function() {
            spyOn(window, 'trackUsage');

            numberFilter._operatorIsNotSet = function() { return false };
            numberFilter._shouldUpdate = function() { return true };

            numberFilter.firstField.getValue = function() { return undefined };
            numberFilter._updateFilter();
            expect(window.trackUsage).not.toHaveBeenCalled();
        });

        it('trackusage is called when firstField is set on updateFilter', function() {
            spyOn(window, 'trackUsage');

            numberFilter._operatorIsNotSet = function() { return false };
            numberFilter._operatorIsBetween = function() { return false };
            numberFilter._shouldUpdate = function() { return true };

            numberFilter.firstField.getValue = function() { return "45" };
            numberFilter._updateFilter();
            expect(window.trackUsage).toHaveBeenCalledWith( 'Filters', 'Number', 'testLabel less than 45', 'test layer' );
        });

        it('no update when operator is between and some values are empty', function() {
            spyOn(numberFilter.filter, 'setValue');

            numberFilter._operatorIsBetween = function() { return true };
            numberFilter.operators.lastSelectionText = 'between';

            numberFilter.firstField.validateValue = function() {return false};

            numberFilter._updateFilter();
            expect(numberFilter.filter.setValue).not.toHaveBeenCalled();

            numberFilter.firstField.getValue = function() { return false };
            numberFilter.secondField.getValue = function() { return 6 };
            numberFilter._updateFilter();

            expect(numberFilter.filter.setValue).not.toHaveBeenCalled();
        });

        it('updates when operator is between and both values are valid', function() {
            spyOn(numberFilter.filter, 'setValue');

            numberFilter._operatorIsBetween = function() { return true };
            numberFilter.operators.lastSelectionText = 'between';

            numberFilter.firstField.getValue = function() { return 30000 }; // no sanity checking yet
            numberFilter.secondField.getValue = function() { return 6 };
            numberFilter._updateFilter();

            expect(numberFilter.filter.setValue).toHaveBeenCalled();
        });


        it('updates when operator is set to none / cleared ', function() {
            spyOn(numberFilter, '_fireAddEvent');

            numberFilter.operators.clearValue = function() { noOp };
            numberFilter.firstField.reset = function() { noOp };
            numberFilter.secondField.reset = function() { noOp };
            numberFilter.secondField.setVisible = function() { noOp };
            numberFilter.filter.clearValue = function() { noOp };

            numberFilter.handleRemoveFilter();
            expect(numberFilter._fireAddEvent).toHaveBeenCalled();
        });

    });
});
