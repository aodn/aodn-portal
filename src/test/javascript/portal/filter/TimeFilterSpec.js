/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.filter.TimeFilter", function() {

    var timeFilter;

    beforeEach(function() {
        timeFilter = new Portal.filter.TimeFilter({});
    });

    describe('handleRemoveFilter', function() {
        beforeEach(function() {
            timeFilter.operators = {};
            timeFilter.operators.clearValue = function() {};
            spyOn(timeFilter.operators, 'clearValue');

            timeFilter.toField = {};
            timeFilter.toField.reset = function() {};
            spyOn(timeFilter.toField, 'reset');

            timeFilter.fromField = {};
            timeFilter.fromField.reset = function() {};
            spyOn(timeFilter.fromField, 'reset');
        });

        it('clears operators', function() {
            timeFilter.handleRemoveFilter();
            expect(timeFilter.operators.clearValue).toHaveBeenCalled();
        });

        it('resets toField', function() {
            timeFilter.handleRemoveFilter();
            expect(timeFilter.toField.reset).toHaveBeenCalled();
        });

        it('resets fromField', function() {
            timeFilter.handleRemoveFilter();
            expect(timeFilter.toField.reset).toHaveBeenCalled();
        });

        it('clears CQL', function() {
            timeFilter.CQL = "not an empty string";
            timeFilter.handleRemoveFilter();
            expect(timeFilter.CQL).toEqual("");
        });

    });

    describe('checking fields for values', function() {
        it('returns false if a value in an array is undefined', function() {
            expect(timeFilter._all(['a', undefined, 'c'])).toBe(false);
        });

        it('returns false if a value in an array is null', function() {
            expect(timeFilter._all(['a', null, 'c'])).toBe(false);
        });

        it('returns false if a value in an array is the empty string', function() {
            expect(timeFilter._all(['a', '', 'c'])).toBe(false);
        });

        it('returns true if all values in a string array are not empty', function() {
            expect(timeFilter._all(['a', 'b', 'c'])).toBe(true);
        });

        //this.operators.getValue(), this.fromField.getValue(), this.toField.getValue()

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
            _mockFilterFields(timeFilter);
            spyOn(timeFilter.operators, 'getValue').andReturn('between');
            spyOn(timeFilter.fromField, 'getValue').andReturn(new Date());
            spyOn(timeFilter.toField, 'getValue').andReturn(new Date());
            expect(timeFilter._requiredFieldsSet()).toBe(true);
        });

        function requiredFieldsFalseExpectationForOperator(operator, emptyDateField) {
            _mockFilterFields(timeFilter);

            var fromFieldValue = '2012-10-09';
            var toFieldValue = '2013-10-09';
            var _emptyDateField = emptyDateField || 'fromField';

            if ('fromField' == _emptyDateField) {
                fromFieldValue = '';
            }
            else {
                toFieldValue = '';
            }

            spyOn(timeFilter.operators, 'getValue').andReturn(operator);
            spyOn(timeFilter.fromField, 'getValue').andReturn(fromFieldValue);
            spyOn(timeFilter.toField, 'getValue').andReturn(toFieldValue);
            expect(timeFilter._requiredFieldsSet()).toBe(false);
        };

        function requiredFieldsTrueExpectationForOperator(operator) {
            _mockFilterFields(timeFilter);
            spyOn(timeFilter.operators, 'getValue').andReturn(operator);
            spyOn(timeFilter.fromField, 'getValue').andReturn(new Date());
            expect(timeFilter._requiredFieldsSet()).toBe(true);
        };
    });

    describe('apply time filter', function() {
        describe('require fields', function() {

            beforeEach(function () {
                _mockFilterFields(timeFilter);
                spyOn(timeFilter, '_fireAddEvent');
            });

            it('does not fire add event when all fields are not set', function() {
                timeFilter._applyTimeFilter();
                expect(timeFilter._fireAddEvent).not.toHaveBeenCalled();
                expect(timeFilter.CQL).toBeFalsy();
            });

            describe('from field not set', function() {
                beforeEach(function () {
                    spyOn(timeFilter.toField, 'getValue').andReturn(new Date());
                });

                it('does not fire add event for operator after when from field is not set', function() {
                    spyOn(timeFilter.operators, 'getValue').andReturn('after');

                    timeFilter._applyTimeFilter();
                    expect(timeFilter._fireAddEvent).not.toHaveBeenCalled();
                    expect(timeFilter.CQL).toBeFalsy();
                });

                it('does not fire add event for operator before when from field is not set', function() {
                    spyOn(timeFilter.operators, 'getValue').andReturn('before');

                    timeFilter._applyTimeFilter();
                    expect(timeFilter._fireAddEvent).not.toHaveBeenCalled();
                    expect(timeFilter.CQL).toBeFalsy();
                });

                it('does not fire add event for operator between when from field is not set', function() {
                    spyOn(timeFilter.operators, 'getValue').andReturn('between');

                    timeFilter._applyTimeFilter();
                    expect(timeFilter._fireAddEvent).not.toHaveBeenCalled();
                    expect(timeFilter.CQL).toBeFalsy();
                });

                it('does fire add event for operator between when from and to fields are set', function() {
                    spyOn(timeFilter.operators, 'getValue').andReturn('between');
                    spyOn(timeFilter.fromField, 'getValue').andReturn(new Date());
                    spyOn(timeFilter, '_getDateString').andReturn(new Date());
                    timeFilter.filter = { name: 'mockedTimeFilter' };

                    timeFilter._applyTimeFilter();
                    expect(timeFilter._fireAddEvent).toHaveBeenCalled();
                    expect(timeFilter.CQL).toBeTruthy();
                    expect(timeFilter.CQL.indexOf('after')).toBeGreaterThan(0);
                    expect(timeFilter.CQL.indexOf('before')).toBeGreaterThan(0);
                });
            });

            describe('to field not set', function() {
                it('does not fire add event for operator between when to field is not set', function() {
                    spyOn(timeFilter.operators, 'getValue').andReturn('between');
                    spyOn(timeFilter.fromField, 'getValue').andReturn('2012-10-09');

                    timeFilter._applyTimeFilter();
                    expect(timeFilter._fireAddEvent).not.toHaveBeenCalled();
                    expect(timeFilter.CQL).toBeFalsy();
                });
            });

        });
    });

    function _mockFilterFields(timeFilter) {
        Ext.each(['operators', 'fromField', 'toField'], function (property, index, all) {
            this[property] = {
                getValue: noOp
            }
        }, timeFilter);
    }

});
