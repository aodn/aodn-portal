/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.filter.NumberFilterPanel", function() {

    var numberFilter;

    beforeEach(function() {

        Portal.filter.NumberFilterPanel.prototype._createField = function() {
            this.firstField = {
                getValue: function() {
                    return false;
                },
                validate: function() {
                    return true;
                }
            };
            this.secondField = {
                getValue: function() {
                    return false;
                },
                validate: function() {
                    return true;
                }
            };
            this.operators = {
                getValue: function() {
                    return 'BETWEEN';
                }
            };
        };

        numberFilter = new Portal.filter.NumberFilterPanel({
            filter: {
                name: 'test',
                label: 'testLabel'
            },
            layer: {
                name: 'test layer',
                getDownloadFilter: function() {
                    return '';
                }
            }
        });
    });

    describe('constructor', function() {
        it('should set CQL to ""', function() {
            expect(numberFilter.getCQL()).toEqual(undefined);
        });
    });

    describe('_updateFilter', function() {
        beforeEach(function() {
            numberFilter._createField();
            numberFilter.firstField.getValue = function() { return 5 };
        });

        it('sends correct tracking data  when operator is not between', function() {
            spyOn(window, 'trackUsage');

            numberFilter._operatorIsBetween = function() {return false};
            numberFilter.operators.lastSelectionText = 'less than';
            numberFilter._updateFilter();

            expect(window.trackUsage).toHaveBeenCalledWith("Filters", "Number", "testLabel less than 5", "test layer");
        });

        it('sends correct tracking data when operator is between', function() {
            spyOn(window, 'trackUsage');

            numberFilter._operatorIsBetween = function() {return true};
            numberFilter.operators.lastSelectionText = 'between';
            numberFilter.secondField.getValue = function() { return 6 };
            numberFilter._updateFilter();

            expect(window.trackUsage).toHaveBeenCalledWith("Filters", "Number", "testLabel between 5 and 6", "test layer");
        })
    });
});
