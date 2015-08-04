describe("Portal.filter.ui.NumberFilterPanel", function() {

    var numberFilter;

    beforeEach(function() {

        Portal.filter.ui.NumberFilterPanel.prototype._createControls = function() {
            this.firstField = {
                getValue: returns(false),
                validate: returns(true)
            };
            this.operators = {
                getValue: noOp
            };
            this.secondField = {
                getValue: returns(false),
                validate: returns(true)
            };
        };

        numberFilter = new Portal.filter.ui.NumberFilterPanel({
            filter: {
                name: 'test',
                label: 'testLabel',
                setValue: noOp
            },
            dataCollection: {
                getTitle: returns('Collection title'),
                getLayerSelectionModel: returns({
                    getSelectedLayer: returns({
                        name: 'test layer'
                    })
                })
            }
        });
    });

    describe('_updateFilter', function() {
        beforeEach(function() {
            numberFilter._createControls();
            numberFilter.firstField.getValue = returns(5);
            numberFilter.firstField.clearInvalid = noOp;
            numberFilter.secondField.clearInvalid = noOp;
            numberFilter.firstField.validateValue = returns(true);
            numberFilter.secondField.validateValue = returns(true);
            numberFilter.operators = {
                lastSelectionText: 'less than',
                getValue: noOp,
                markInvalid: noOp
            };

            spyOn(numberFilter, '_getSelectedOperatorObject');
        });

        it('sends correct tracking data  when operator is not between', function() {
            spyOn(window, 'trackUsage');

            numberFilter._operatorIsBetween = returns(false);
            numberFilter._updateFilter();

            expect(window.trackUsage).toHaveBeenCalledWith("Filters", "Number", "testLabel less than 5", "Collection title");
        });

        it('sends correct tracking data when operator is between', function() {
            spyOn(window, 'trackUsage');

            numberFilter._operatorIsBetween = returns(true);
            numberFilter.operators.lastSelectionText = 'between';
            numberFilter.secondField.getValue = returns(6);
            numberFilter._updateFilter();

            expect(window.trackUsage).toHaveBeenCalledWith("Filters", "Number", "testLabel between 5 and 6", "Collection title");
        });

        it('no update when operator is not set', function() {
            spyOn(numberFilter.filter, 'setValue');

            numberFilter._operatorIsNotSet = returns(true);
            numberFilter.operators.lastSelectionText = '';

            numberFilter._updateFilter();
            expect(numberFilter.filter.setValue).not.toHaveBeenCalled();

            numberFilter.firstField.getValue = returns(4);
            numberFilter.secondField.getValue = returns(6);
            numberFilter._updateFilter();
            expect(numberFilter.filter.setValue).not.toHaveBeenCalled();
        });

        it('no trackusage when firstField is not set on updateFilter', function() {
            spyOn(window, 'trackUsage');

            numberFilter._operatorIsNotSet = returns(false);
            numberFilter._shouldUpdate = returns(true);

            numberFilter.firstField.getValue = returns(undefined);
            numberFilter._updateFilter();
            expect(window.trackUsage).not.toHaveBeenCalled();
        });

        it('trackusage is called when firstField is set on updateFilter', function() {
            spyOn(window, 'trackUsage');

            numberFilter._operatorIsNotSet = returns(false);
            numberFilter._operatorIsBetween = returns(false);
            numberFilter._shouldUpdate = returns(true);

            numberFilter.firstField.getValue = returns("45");
            numberFilter._updateFilter();
            expect(window.trackUsage).toHaveBeenCalledWith('Filters', 'Number', 'testLabel less than 45', 'Collection title');
        });

        it('no update when operator is between and some values are empty', function() {
            spyOn(numberFilter.filter, 'setValue');

            numberFilter._operatorIsBetween = returns(true);
            numberFilter.operators.lastSelectionText = 'between';

            numberFilter.firstField.validateValue = returns(false);

            numberFilter._updateFilter();
            expect(numberFilter.filter.setValue).not.toHaveBeenCalled();

            numberFilter.firstField.getValue = returns(false);
            numberFilter.secondField.getValue = returns(6);
            numberFilter._updateFilter();

            expect(numberFilter.filter.setValue).not.toHaveBeenCalled();
        });

        it('updates when operator is between and both values are valid', function() {
            spyOn(numberFilter.filter, 'setValue');

            numberFilter._operatorIsBetween = returns(true);
            numberFilter.operators.lastSelectionText = 'between';

            numberFilter.firstField.getValue = returns(30000); // no sanity checking yet
            numberFilter.secondField.getValue = returns(6);
            numberFilter._updateFilter();

            expect(numberFilter.filter.setValue).toHaveBeenCalled();
        });

        it('updates when operator is set to none / cleared ', function() {
            numberFilter.operators.clearValue = noOp;
            numberFilter.firstField.reset = noOp;
            numberFilter.secondField.reset = noOp;
            numberFilter.secondField.setVisible = noOp;
            numberFilter.filter.clearValue = noOp;

            numberFilter.handleRemoveFilter();
        });
    });
});
