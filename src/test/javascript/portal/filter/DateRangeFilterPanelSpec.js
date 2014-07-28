/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.filter.DateRangeFilterPanelSpec", function() {

    describe('CQL', function() {
        var filterPanel;

        beforeEach(function() {
            filterPanel = new Portal.filter.DateRangeFilterPanel({
                filter: {
                    name: 'wfs_column',
                    wmsStartDateName: 'wms_start_column',
                    wmsEndDateName: 'wms_end_column'
                },
                layer: {
                    getDownloadFilter: function() {}
                },
                setLayerAndFilter: noOp
            });

            var mockDate = function() {
                return {
                    getValue: function() {
                        return '';
                    },
                    hasValue: function() {
                        return false;
                    }
                }
            };

            filterPanel.fromDate = mockDate();
            filterPanel.toDate = mockDate();

            spyOn(filterPanel, '_getDateString').andCallFake(function(combo) {
                return combo.getValue()
            });
        });

        it('after', function() {
            setTestValue(filterPanel.fromDate, '2000');
            expect(filterPanel._getCQL('wfs_column')).toEqual('wfs_column >= 2000');
        });

        it('before', function() {
            setTestValue(filterPanel.toDate, '2013');
            expect(filterPanel._getCQL('wfs_column')).toEqual('wfs_column <= 2013');
        });

        it('between', function() {
            setTestValue(filterPanel.fromDate, '2000');
            setTestValue(filterPanel.toDate, '2013');

            expect(filterPanel._getCQL()).toEqual(
                'wms_end_column >= 2000 AND wms_start_column <= 2013' // To capture any data that falls within the range the end date is compared to the start of the range, and the start date is compared to the end of the range
            );
        });

        var setTestValue = function(resettableDate, value) {
            spyOn(resettableDate, 'getValue').andReturn(value);
            spyOn(resettableDate, 'hasValue').andReturn(true);
        }
    });
});
