
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.search.FacetedSearchResultsGrid", function() {

    var fsrg;
    var testTarget;
    var testLayerLink;

    beforeEach(function() {

        var store = new Portal.data.GeoNetworkRecordStore();
        fsrg = new Portal.search.FacetedSearchResultsGrid({
            store: store
        });

        spyOn(Portal.data.ActiveGeoNetworkRecordStore.instance(), 'add');
    });

    describe('initialisation', function() {
        it('sets column model to correct type', function() {
            expect(fsrg.colModel).toBeInstanceOf(Portal.search.FacetedSearchResultsColumnModel);
        });
    });
});
