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
        };

        numberFilter = new Portal.filter.NumberFilterPanel({
            filter: {
                name: 'test'
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
        it('sends tracking data to google analytics', function() {
            spyOn(window, 'trackUsage');
            numberFilter._getCQLHumanValue = function() {
                return "value";
            };
            numberFilter._updateFilter();

            expect(window.trackUsage).toHaveBeenCalledWith("Filters", "Number", "value", "test layer");
        });
    });
});
