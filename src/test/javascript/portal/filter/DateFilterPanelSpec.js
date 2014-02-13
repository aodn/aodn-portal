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
                name: 'some_column'
            },
            layer: {
                getDownloadFilter: function() {
                    return '';
                }
            },
            operators: {
                getValue: noOp
            },
            fromField: {
                setVisible: noOp,
                getValue: noOp
            },
            toField: {
                setVisible: noOp,
                getValue: noOp
            },
            setLayerAndFilter: noOp
        });
    });

    describe('handleRemoveFilter', function() {
        beforeEach(function() {
            filterPanel.operators.clearValue = jasmine.createSpy('operators clearValue');

            filterPanel.toField.reset = jasmine.createSpy('toField reset');
            filterPanel.toField.setVisible = jasmine.createSpy('toField setVisible');
            filterPanel.toField.setMinValue = jasmine.createSpy('toField setMinValue');

            filterPanel.fromField.reset = jasmine.createSpy('fromField reset');
            filterPanel.fromField.setVisible = jasmine.createSpy('fromField setVisible');

            spyOn(filterPanel, '_updateDateFieldsVisibility');
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

        it('updates the visibilty of the date fields', function() {
            filterPanel.handleRemoveFilter();
            expect(filterPanel._updateDateFieldsVisibility).toHaveBeenCalled();
        });
    });

    describe('_all behaviour', function() {

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
    });

    describe('checking fields for values', function() {

        beforeEach(function() {
            spyOn(filterPanel, '_all');
            spyOn(filterPanel.operators, 'getValue').andReturn('op');
            spyOn(filterPanel.fromField, 'getValue').andReturn('from');
            spyOn(filterPanel.toField, 'getValue').andReturn('to');
        });

        it('includes operator value', function() {

            spyOn(filterPanel, '_isFromFieldUsed').andReturn(false);
            spyOn(filterPanel, '_isToFieldUsed').andReturn(false);

            filterPanel._requiredFieldsSet();

            expect(filterPanel._all).toHaveBeenCalledWith(['op']);
        });

        it('includes from value', function() {

            spyOn(filterPanel, '_isFromFieldUsed').andReturn(true);
            spyOn(filterPanel, '_isToFieldUsed').andReturn(false);

            filterPanel._requiredFieldsSet();

            expect(filterPanel._all).toHaveBeenCalledWith(['op', 'from']);
        });

        it('includes to value', function() {

            spyOn(filterPanel, '_isFromFieldUsed').andReturn(false);
            spyOn(filterPanel, '_isToFieldUsed').andReturn(true);

            filterPanel._requiredFieldsSet();

            expect(filterPanel._all).toHaveBeenCalledWith(['op', 'to']);
        });

        it('includes all values', function() {

            spyOn(filterPanel, '_isFromFieldUsed').andReturn(true);
            spyOn(filterPanel, '_isToFieldUsed').andReturn(true);

            filterPanel._requiredFieldsSet();

            expect(filterPanel._all).toHaveBeenCalledWith(['op', 'from', 'to']);
        });
    });

    describe('apply date filter', function() {

        beforeEach(function() {
            _mockFilterFields(filterPanel);
            spyOn(filterPanel, '_fireAddEvent');
        });

        it('does not fire event when required fields are not set', function() {
            spyOn(filterPanel, '_requiredFieldsSet').andReturn(false);

            filterPanel._applyDateFilterPanel();

            expect(filterPanel._fireAddEvent).not.toHaveBeenCalled();
        });

        it('fires event when required fields are set', function() {
            spyOn(filterPanel, '_requiredFieldsSet').andReturn(true);

            filterPanel._applyDateFilterPanel();

            expect(filterPanel._fireAddEvent).toHaveBeenCalled();
        });
    });

    describe('CQL', function() {

        beforeEach(function() {
            spyOn(filterPanel, '_getDateString').andCallFake(function(combo) { return combo.getValue() });

            filterPanel.fromField = {
                getValue: function() { return '2012' }
            };

            filterPanel.toField = {
                getValue: function() { return '2014' }
            }
        });

        it('after', function() {
            spyOn(filterPanel.operators, 'getValue').andReturn('after');

            expectAllCQLFunctionsToEqual(filterPanel, 'some_column >= 2012');
        });

        it('before', function() {
            spyOn(filterPanel.operators, 'getValue').andReturn('before');

            expectAllCQLFunctionsToEqual(filterPanel, 'some_column <= 2014');
        });

        it('between', function() {
            spyOn(filterPanel.operators, 'getValue').andReturn('between');

            expectAllCQLFunctionsToEqual(filterPanel, 'some_column >= 2012 AND some_column <= 2014');
        });

        var expectAllCQLFunctionsToEqual = function(filterPanel, expectedCQL) {
            expect(filterPanel.getCQL()).toEqual(expectedCQL);
            expect(filterPanel.getVisualisationCQL()).toEqual(expectedCQL);
            expect(filterPanel.getDownloadCQL()).toEqual(expectedCQL);
        };
    });

    describe('_setExistingFilters', function() {
        it('sets from and to fields from cql parameter', function() {
            spyOn(filterPanel, '_updateDateFieldsVisibility');

            filterPanel.layer = {};
            filterPanel.layer.getDownloadFilter = function() {
                return "some_column >= 2013-10-07T13:00:00Z AND some_column <= 2013-10-08T13:00:00Z";
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
            expect(filterPanel._updateDateFieldsVisibility).toHaveBeenCalled();
        });
    });

    function _mockFilterFields(filterPanel) {
        Ext.each(['operators', 'fromField', 'toField'], function(property, index, all) {
            this[property] = {
                getValue: noOp
            }
        }, filterPanel);
    }
});
