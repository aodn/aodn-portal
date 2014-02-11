/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.filter.DateFilterPanel", function() {

    var filterPanel;

    beforeEach(function() {
        Portal.filter.DateFilterPanel.prototype._createField = function() {};

        Portal.filter.DateFilterPanel.prototype._getDateString = function() {};

        filterPanel = new Portal.filter.DateFilterPanel({
            filter: {
                name: 'test'
            },
            layer: {
                getDownloadFilter: function() {
                    return '';
                }
            }
        });
    });

    describe('handleRemoveFilter', function() {
        beforeEach(function() {
            filterPanel.operators = {};
            filterPanel.operators.clearValue = function() {};
            spyOn(filterPanel.operators, 'clearValue');

            filterPanel.toField = {};
            filterPanel.toField.reset = function() {};
            spyOn(filterPanel.toField, 'reset');
            filterPanel.toField.setVisible = jasmine.createSpy('toField setVisible');
            filterPanel.toField.setMinValue = function() {};
            spyOn(filterPanel.toField, 'setMinValue');

            filterPanel.fromField = {};
            filterPanel.fromField.reset = function() {};
            spyOn(filterPanel.fromField, 'reset');
            filterPanel.fromField.setVisible = jasmine.createSpy('fromField setVisible');
        });

        it('clears operators', function() {
            filterPanel.handleRemoveFilter();
            expect(filterPanel.operators.clearValue).toHaveBeenCalled();
        });

        it('resets toField', function() {
            filterPanel.handleRemoveFilter();
            expect(filterPanel.toField.reset).toHaveBeenCalled();
        });

        it('sets min value of toField', function() {
            filterPanel.handleRemoveFilter();
            expect(filterPanel.toField.setMinValue).toHaveBeenCalled();
        });

        it('resets fromField', function() {
            filterPanel.handleRemoveFilter();
            expect(filterPanel.toField.reset).toHaveBeenCalled();
        });
    });

    describe('checking fields for values', function() {
        it('returns false if a value in an array is undefined', function() {
            expect(filterPanel._all(['a', undefined, 'c'])).toBe(false);
        });

        it('returns false if a value in an array is null', function() {
            expect(filterPanel._all(['a', null, 'c'])).toBe(false);
        });

        it('returns false if a value in an array is the empty string', function() {
            expect(filterPanel._all(['a', '', 'c'])).toBe(false);
        });

        it('returns true if all values in a string array are not empty', function() {
            expect(filterPanel._all(['a', 'b', 'c'])).toBe(true);
        });

        it('returns false if to date is not set for operator between', function() {
            requiredFieldsFalseExpectationForOperator('between', 'toField');
        });

        it('returns false if from date is not set for operator between', function() {
            requiredFieldsFalseExpectationForOperator('between');
        });

        it('returns false if from date is not set for operator before', function() {
            requiredFieldsFalseExpectationForOperator('before');
        });

        it('returns false if from date is not set for operator after', function() {
            requiredFieldsFalseExpectationForOperator('after');
        });

        it('returns true if from date is set for operator after', function() {
            requiredFieldsTrueExpectationForOperator('after');
        });

        it('returns true if from date is set for operator before', function() {
            requiredFieldsTrueExpectationForOperator('before');
        });

        it('returns true if from and to dates set for operator between', function() {
            _mockFilterFields(filterPanel);
            spyOn(filterPanel.operators, 'getValue').andReturn('between');
            spyOn(filterPanel.fromField, 'getValue').andReturn(new Date());
            spyOn(filterPanel.toField, 'getValue').andReturn(new Date());
            expect(filterPanel._requiredFieldsSet()).toBe(true);
        });

        function requiredFieldsFalseExpectationForOperator(operator, emptyDateField) {
            _mockFilterFields(filterPanel);

            var fromFieldValue = '2012-10-09';
            var toFieldValue = '2013-10-09';
            var _emptyDateField = emptyDateField || 'fromField';

            if ('fromField' == _emptyDateField) {
                fromFieldValue = '';
            }
            else {
                toFieldValue = '';
            }

            spyOn(filterPanel.operators, 'getValue').andReturn(operator);
            spyOn(filterPanel.fromField, 'getValue').andReturn(fromFieldValue);
            spyOn(filterPanel.toField, 'getValue').andReturn(toFieldValue);
            expect(filterPanel._requiredFieldsSet()).toBe(false);
        }

        function requiredFieldsTrueExpectationForOperator(operator) {
            _mockFilterFields(filterPanel);
            spyOn(filterPanel.operators, 'getValue').andReturn(operator);
            spyOn(filterPanel.fromField, 'getValue').andReturn(new Date());
            expect(filterPanel._requiredFieldsSet()).toBe(true);
        }
    });

    describe('apply date filter', function() {
        describe('require fields', function() {

            beforeEach(function() {
                _mockFilterFields(filterPanel);
                spyOn(filterPanel, '_fireAddEvent');
            });

            it('does not fire add event when all fields are not set', function() {
                filterPanel._applyDateFilterPanel();
                expect(filterPanel._fireAddEvent).not.toHaveBeenCalled();
                expect(filterPanel.getCQL()).toBeFalsy();
            });

            describe('from field not set', function() {
                beforeEach(function() {
                    spyOn(filterPanel.toField, 'getValue').andReturn(new Date());
                });

                it('does not fire add event for operator after when from field is not set', function() {
                    spyOn(filterPanel.operators, 'getValue').andReturn('after');

                    filterPanel._applyDateFilterPanel();
                    expect(filterPanel._fireAddEvent).not.toHaveBeenCalled();
                    expect(filterPanel.getCQL()).toBeFalsy();
                });

                it('does not fire add event for operator before when from field is not set', function() {
                    spyOn(filterPanel.operators, 'getValue').andReturn('before');

                    filterPanel._applyDateFilterPanel();
                    expect(filterPanel._fireAddEvent).not.toHaveBeenCalled();
                    expect(filterPanel.getCQL()).toBeFalsy();
                });

                it('does not fire add event for operator between when from field is not set', function() {
                    spyOn(filterPanel.operators, 'getValue').andReturn('between');

                    filterPanel._applyDateFilterPanel();
                    expect(filterPanel._fireAddEvent).not.toHaveBeenCalled();
                    expect(filterPanel.getCQL()).toBeFalsy();
                });

                it('does fire add event for operator between when from and to fields are set', function() {
                    spyOn(filterPanel.operators, 'getValue').andReturn('between');
                    spyOn(filterPanel.fromField, 'getValue').andReturn(new Date());
                    spyOn(filterPanel, '_getDateString').andReturn(new Date());
                    filterPanel.filter = { name: 'mockedDateFilterPanel' };

                    filterPanel._applyDateFilterPanel();
                    expect(filterPanel._fireAddEvent).toHaveBeenCalled();
                    expect(filterPanel.getCQL()).toBeTruthy();
                    expect(filterPanel.getCQL().indexOf('>=')).toBeGreaterThan(0);
                    expect(filterPanel.getCQL().indexOf('<=')).toBeGreaterThan(0);
                });
            });

            describe('to field not set', function() {
                it('does not fire add event for operator between when to field is not set', function() {
                    spyOn(filterPanel.operators, 'getValue').andReturn('between');
                    spyOn(filterPanel.fromField, 'getValue').andReturn('2012-10-09');

                    filterPanel._applyDateFilterPanel();
                    expect(filterPanel._fireAddEvent).not.toHaveBeenCalled();
                });
            });
        });

        describe('CQL', function() {
            var filterPanel;
            var operator;

            beforeEach(function() {
                filterPanel = new Portal.filter.DateFilterPanel({
                    filter: {
                        name: 'some_column'
                    },
                    layer: {
                        getDownloadFilter: function() {
                        }
                    }
                });

                var dateAsString = '2013';

                spyOn(filterPanel, '_getDateString').andReturn(dateAsString);

                filterPanel.operators = {
                    getValue: function() { return operator; }
                };

                filterPanel.fromField = {
                    getValue: function() { return dateAsString; }
                };
            });

            it('after', function() {
                operator = 'after';
                expectAllCQLFunctionsToEqual(filterPanel, 'some_column >= 2013');
            });

            it('before', function() {
                operator = 'before';
                expectAllCQLFunctionsToEqual(filterPanel, 'some_column <= 2013');
            });

            it('between', function() {
                operator = 'between';
                expectAllCQLFunctionsToEqual(filterPanel, 'some_column >= 2013 AND some_column <= 2013');
            });

            var expectAllCQLFunctionsToEqual = function(filterPanel, expectedCQL) {
                expect(filterPanel.getCQL()).toEqual(expectedCQL);
                expect(filterPanel.getVisualisationCQL()).toEqual(expectedCQL);
                expect(filterPanel.getDownloadCQL()).toEqual(expectedCQL);
            };
        });
    });

    describe('_setExistingFilters', function() {
        it('sets from and to fields from cql parameter', function() {
            filterPanel.filter = { name: 'test' };

            filterPanel.layer = {};
            filterPanel.layer.getDownloadFilter = function() {
                return "test after 2013-10-07T13:00:00Z AND test before 2013-10-08T13:00:00Z";
            };

            var MockField = function() {
                this.setValue = jasmine.createSpy();
                this.setVisible = jasmine.createSpy();
            };

            filterPanel.operators = new MockField();
            filterPanel.fromField = new MockField();
            filterPanel.toField = new MockField();

            filterPanel._setExistingFilters();

            expect(filterPanel.operators.setValue).toHaveBeenCalledWith("between");
            expect(filterPanel.fromField.setValue).toHaveBeenCalledWith(new Date("Tue Oct 08 2013 00:00:00 GMT+1100 (EST)"));
            expect(filterPanel.toField.setValue).toHaveBeenCalledWith(new Date("Wed Oct 09 2013 00:00:00 GMT+1100 (EST)"));
            expect(filterPanel.toField.setVisible).toHaveBeenCalledWith(true);
        });
    });

    function _mockFilterFields(dateFilter) {
        Ext.each(['operators', 'fromField', 'toField'], function(property, index, all) {
            this[property] = {
                getValue: noOp
            }
        }, dateFilter);
    }
});
