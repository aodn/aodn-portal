/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.search.FacetedSearchResults", function() {

    var resultsView;
    var testTarget;
    var testLayerLink;

    beforeEach(function() {

        var store = new Portal.data.GeoNetworkRecordStore();
        resultsView = new Portal.search.FacetedSearchResults({
            store: store
        });

        spyOn(Portal.data.ActiveGeoNetworkRecordStore.instance(), 'add');
    });


    describe('active geo network record store events', function() {
        it('refreshes view on record added', function() {
            spyOn(resultsView, '_refreshView');
            Ext.MsgBus.publish('activegeonetworkrecordadded');
            expect(resultsView._refreshView).toHaveBeenCalled();
        });
        it('refreshes view on record removed', function() {
            spyOn(resultsView, '_refreshView');
            Ext.MsgBus.publish('activegeonetworkrecordremoved');
            expect(resultsView._refreshView).toHaveBeenCalled();
        });
    });
});
