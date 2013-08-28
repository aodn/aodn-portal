/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.search.FacetedSearchResultsColumnModel", function() {

    var colModel;

    beforeEach(function() {
        colModel = new Portal.search.FacetedSearchResultsColumnModel();
    });

    describe('initialisation', function() {
        it('configures menu disabled', function() {
            expect(colModel.defaults.menuDisabled).toBeTruthy();
        });

        describe('columns', function() {
            it('configures mini map column', function() {
                expect(colModel.columns[0].xtype).toBe('minimapcolumn');
            });

            it('configures view column', function() {
                expect(colModel.columns[2].xtype).toBe('viewrecordcolumn');
            });
        });
    });
});
