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
                }
            };
        };

        numberFilter = new Portal.filter.NumberFilterPanel({
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

    describe('constructor', function() {
        it('should set CQL to ""', function() {
            expect(numberFilter.getCQL()).toEqual("");
        });
    });
});
