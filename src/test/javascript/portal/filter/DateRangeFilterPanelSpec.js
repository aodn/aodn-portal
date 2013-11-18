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
                    wmsEndDateName: 'wms_end_column',
                },
                layer: {
                    getDownloadFilter: function() {
                    }
                }
            });

            var dateAsString = '2013';

            spyOn(filterPanel, '_getDateString').andReturn(dateAsString);

            filterPanel.operators = {
                getValue: function() {
                    return operator;
                }
            };

            filterPanel.fromField = {
                getValue: function() {
                    return dateAsString;
                }
            };

        });

        it('after', function() {
            operator = 'after';
            expectAllCQLFunctionsToEqual(filterPanel, 'wms_start_column after 2013', 'wfs_column after 2013');
        });

        it('before', function() {
            operator = 'before';
            expectAllCQLFunctionsToEqual(filterPanel, 'wms_end_column before 2013', 'wfs_column before 2013');
        });

        it('between', function() {
            operator = 'between';
            expectAllCQLFunctionsToEqual(
                filterPanel,
                'wms_start_column after 2013 AND wms_end_column before 2013',
                'wfs_column after 2013 AND wfs_column before 2013'
            );
        });

        var expectAllCQLFunctionsToEqual = function(filterPanel, visualisationCQL, downloadCQL) {
            expect(filterPanel.getVisualisationCQL()).toEqual(visualisationCQL);
            expect(filterPanel.getDownloadCQL()).toEqual(downloadCQL);
        }
    });
});
