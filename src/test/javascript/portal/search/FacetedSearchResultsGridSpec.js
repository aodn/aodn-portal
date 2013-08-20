
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

    describe('_viewButtonOnClick', function() {
        it('add record to active geonetwork store when view is clicked', function() {
            fsrg.store.add(new Portal.data.GeoNetworkRecord());

            fsrg._viewButtonOnClick(null, testTarget, 0);
            expect(Portal.data.ActiveGeoNetworkRecordStore.instance().add).toHaveBeenCalled();
        });
    });
});
