/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.filter.DateRangeFilterPanelSpec", function() {

    describe('CQL', function() {
        var filterPanel;
        var operator;

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
            filterPanel.fromField = {
                getValue: function() {
                    return '2000';
                }
            };
            filterPanel.toField = {
                getValue: function() {
                    return '2013';
                }
            };

            spyOn(filterPanel, '_getDateString').andCallFake(function(combo) {
                return combo.getValue()
            });

            filterPanel.operators = {
                getValue: function() {
                    return operator;
                }
            };
        });

        it('after', function() {
            operator = 'after';
            expect(filterPanel._getCQL()).toEqual('wfs_column >= 2000');
        });

        it('before', function() {
            operator = 'before';
            expect(filterPanel._getCQL()).toEqual('wfs_column <= 2013');
        });

        it('between', function() {
            operator = 'between';
            expect(filterPanel._getCQL()).toEqual(
                'wfs_column >= 2000 AND wfs_column <= 2013'
            );
        });

    });
});
