/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.search.FacetedSearchResults", function() {

    var resultsGrid;
    var testTarget;
    var testLayerLink;

    beforeEach(function() {

        var store = new Portal.data.GeoNetworkRecordStore();
        resultsGrid = new Portal.search.FacetedSearchResults({
            store: store
        });

        spyOn(Portal.data.ActiveGeoNetworkRecordStore.instance(), 'add');
    });

    describe('initialisation', function() {
        it('sets column model to correct type', function() {
            expect(resultsGrid.colModel).toBeInstanceOf(Portal.search.FacetedSearchResultsColumnModel);
        });
    });

    describe('active geo network record store events', function() {
        it('refreshes view on record added', function() {
            spyOn(resultsGrid, '_refreshView');
            Ext.MsgBus.publish('activegeonetworkrecordadded');
            expect(resultsGrid._refreshView).toHaveBeenCalled();
        });
        it('refreshes view on record removed', function() {
            spyOn(resultsGrid, '_refreshView');
            Ext.MsgBus.publish('activegeonetworkrecordremoved');
            expect(resultsGrid._refreshView).toHaveBeenCalled();
        });
    });
});
