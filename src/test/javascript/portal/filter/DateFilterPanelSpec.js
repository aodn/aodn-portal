/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.filter.DateFilterPanel", function() {

    var dateFilter;

    beforeEach(function() {
        Portal.filter.DateFilterPanel.prototype._createField = function() {
        };

        Portal.filter.DateFilterPanel.prototype._getDateString = function() {
        };

        dateFilter = new Portal.filter.DateFilterPanel({
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
            dateFilter.operators = {};
            dateFilter.operators.clearValue = function() {};
            spyOn(dateFilter.operators, 'clearValue');

            dateFilter.toField = {};
            dateFilter.toField.reset = function() {};
            spyOn(dateFilter.toField, 'reset');
            dateFilter.toField.isVisible = function() {};
            spyOn(dateFilter.toField, 'isVisible');
            dateFilter.toField.setMinValue = function() {};
            spyOn(dateFilter.toField, 'setMinValue');

            dateFilter.fromField = {};
            dateFilter.fromField.reset = function() {};
            spyOn(dateFilter.fromField, 'reset');
        });

        it('clears operators', function() {
            dateFilter.handleRemoveFilter();
            expect(dateFilter.operators.clearValue).toHaveBeenCalled();
        });

        it('resets toField', function() {
            dateFilter.handleRemoveFilter();
            expect(dateFilter.toField.reset).toHaveBeenCalled();
        });

        it('checks if toField is visible', function() {
            dateFilter.handleRemoveFilter();
            expect(dateFilter.toField.isVisible).toHaveBeenCalled();
        });

        it('sets min value of toField', function() {
            dateFilter.handleRemoveFilter();
            if (dateFilter.toField.isVisible()) {
                expect(dateFilter.toField.setMinValue).toHaveBeenCalled();
            }
        });

        it('resets fromField', function() {
            dateFilter.handleRemoveFilter();
            expect(dateFilter.toField.reset).toHaveBeenCalled();
        });
    });

    describe('checking fields for values', function() {
        it('returns false if a value in an array is undefined', function() {
            expect(dateFilter._all(['a', undefined, 'c'])).toBe(false);
        });

        it('returns false if a value in an array is null', function() {
            expect(dateFilter._all(['a', null, 'c'])).toBe(false);
        });

        it('returns false if a value in an array is the empty string', function() {
            expect(dateFilter._all(['a', '', 'c'])).toBe(false);
        });

        it('returns true if all values in a string array are not empty', function() {
            expect(dateFilter._all(['a', 'b', 'c'])).toBe(true);
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
            _mockFilterFields(dateFilter);
            spyOn(dateFilter.operators, 'getValue').andReturn('between');
            spyOn(dateFilter.fromField, 'getValue').andReturn(new Date());
            spyOn(dateFilter.toField, 'getValue').andReturn(new Date());
            expect(dateFilter._requiredFieldsSet()).toBe(true);
        });

        function requiredFieldsFalseExpectationForOperator(operator, emptyDateField) {
            _mockFilterFields(dateFilter);

            var fromFieldValue = '2012-10-09';
            var toFieldValue = '2013-10-09';
            var _emptyDateField = emptyDateField || 'fromField';

            if ('fromField' == _emptyDateField) {
                fromFieldValue = '';
            }
            else {
                toFieldValue = '';
            }

            spyOn(dateFilter.operators, 'getValue').andReturn(operator);
            spyOn(dateFilter.fromField, 'getValue').andReturn(fromFieldValue);
            spyOn(dateFilter.toField, 'getValue').andReturn(toFieldValue);
            expect(dateFilter._requiredFieldsSet()).toBe(false);
        };

        function requiredFieldsTrueExpectationForOperator(operator) {
            _mockFilterFields(dateFilter);
            spyOn(dateFilter.operators, 'getValue').andReturn(operator);
            spyOn(dateFilter.fromField, 'getValue').andReturn(new Date());
            expect(dateFilter._requiredFieldsSet()).toBe(true);
        };
    });

    describe('apply date filter', function() {
        describe('require fields', function() {

            beforeEach(function () {
                _mockFilterFields(dateFilter);
                spyOn(dateFilter, '_fireAddEvent');
            });

            it('does not fire add event when all fields are not set', function() {
                dateFilter._applyDateFilterPanel();
                expect(dateFilter._fireAddEvent).not.toHaveBeenCalled();
                expect(dateFilter.getCQL()).toBeFalsy();
            });

            describe('from field not set', function() {
                beforeEach(function () {
                    spyOn(dateFilter.toField, 'getValue').andReturn(new Date());
                });

                it('does not fire add event for operator after when from field is not set', function() {
                    spyOn(dateFilter.operators, 'getValue').andReturn('after');

                    dateFilter._applyDateFilterPanel();
                    expect(dateFilter._fireAddEvent).not.toHaveBeenCalled();
                    expect(dateFilter.getCQL()).toBeFalsy();
                });

                it('does not fire add event for operator before when from field is not set', function() {
                    spyOn(dateFilter.operators, 'getValue').andReturn('before');

                    dateFilter._applyDateFilterPanel();
                    expect(dateFilter._fireAddEvent).not.toHaveBeenCalled();
                    expect(dateFilter.getCQL()).toBeFalsy();
                });

                it('does not fire add event for operator between when from field is not set', function() {
                    spyOn(dateFilter.operators, 'getValue').andReturn('between');

                    dateFilter._applyDateFilterPanel();
                    expect(dateFilter._fireAddEvent).not.toHaveBeenCalled();
                    expect(dateFilter.getCQL()).toBeFalsy();
                });

                it('does fire add event for operator between when from and to fields are set', function() {
                    spyOn(dateFilter.operators, 'getValue').andReturn('between');
                    spyOn(dateFilter.fromField, 'getValue').andReturn(new Date());
                    spyOn(dateFilter, '_getDateString').andReturn(new Date());
                    dateFilter.filter = { name: 'mockedDateFilterPanel' };

                    dateFilter._applyDateFilterPanel();
                    expect(dateFilter._fireAddEvent).toHaveBeenCalled();
                    expect(dateFilter.getCQL()).toBeTruthy();
                    expect(dateFilter.getCQL().indexOf('after')).toBeGreaterThan(0);
                    expect(dateFilter.getCQL().indexOf('before')).toBeGreaterThan(0);
                });
            });

            describe('to field not set', function() {
                it('does not fire add event for operator between when to field is not set', function() {
                    spyOn(dateFilter.operators, 'getValue').andReturn('between');
                    spyOn(dateFilter.fromField, 'getValue').andReturn('2012-10-09');

                    dateFilter._applyDateFilterPanel();
                    expect(dateFilter._fireAddEvent).not.toHaveBeenCalled();
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
                expectAllCQLFunctionsToEqual(filterPanel, 'some_column after 2013');
            });

            it('before', function() {
                operator = 'before';
                expectAllCQLFunctionsToEqual(filterPanel, 'some_column before 2013');
            });

            it('between', function() {
                operator = 'between';
                expectAllCQLFunctionsToEqual(filterPanel, 'some_column after 2013 AND some_column before 2013');
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
            dateFilter.filter = { name: 'test' };

            dateFilter.layer = {};
            dateFilter.layer.getDownloadFilter = function() {
                return "test after 2013-10-07T13:00:00Z AND test before 2013-10-08T13:00:00Z";
            };

            var MockField = function() {
                this.setValue = jasmine.createSpy();
                this.setVisible = jasmine.createSpy();
            };

            dateFilter.operators = new MockField();
            dateFilter.fromField = new MockField();
            dateFilter.toField = new MockField();

            dateFilter._setExistingFilters();

            expect(dateFilter.operators.setValue).toHaveBeenCalledWith("between");
            expect(dateFilter.fromField.setValue).toHaveBeenCalledWith(new Date("Tue Oct 08 2013 00:00:00 GMT+1100 (EST)"));
            expect(dateFilter.toField.setValue).toHaveBeenCalledWith(new Date("Wed Oct 09 2013 00:00:00 GMT+1100 (EST)"));
            expect(dateFilter.toField.setVisible).toHaveBeenCalledWith(true);
        });
    });

    function _mockFilterFields(dateFilter) {
        Ext.each(['operators', 'fromField', 'toField'], function (property, index, all) {
            this[property] = {
                getValue: noOp
            }
        }, dateFilter);
    }

});
