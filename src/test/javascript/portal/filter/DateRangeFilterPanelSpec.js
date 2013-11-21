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
        var fromField;
        var toField;

        beforeEach(function() {
            fromField = {
                getValue: function() {
                    return dateAsString;
                }
            };
            toField = {};

            filterPanel = new Portal.filter.DateRangeFilterPanel({
                filter: {
                    name: 'wfs_column',
                    wmsStartDateName: 'wms_start_column',
                    wmsEndDateName: 'wms_end_column',
                },
                layer: {
                    getDownloadFilter: function() {
                    }
                }
            });
            filterPanel.fromField = fromField;
            filterPanel.toField = toField;

            var dateAsString = '2013';

            spyOn(filterPanel, '_getDateString').andCallFake(function(combo) {
                if (combo == fromField) {
                    return '2000';
                }
                else {
                    return '2013';
                }
            });

            filterPanel.operators = {
                getValue: function() {
                    return operator;
                }
            };
        });

        it('after', function() {
            operator = 'after';
            expectAllCQLFunctionsToEqual(filterPanel, 'wms_end_column after 2000', 'wfs_column after 2000');
        });

        it('before', function() {
            operator = 'before';
            expectAllCQLFunctionsToEqual(filterPanel, 'wms_start_column before 2000', 'wfs_column before 2000');
        });

        it('between', function() {
            operator = 'between';
            expectAllCQLFunctionsToEqual(
                filterPanel,
                'wms_end_column after 2000 AND wms_start_column before 2013',
                'wfs_column after 2000 AND wfs_column before 2013'
            );
        });

        var expectAllCQLFunctionsToEqual = function(filterPanel, visualisationCQL, downloadCQL) {
            expect(filterPanel.getVisualisationCQL()).toEqual(visualisationCQL);
            expect(filterPanel.getDownloadCQL()).toEqual(downloadCQL);
        }
    });
});
