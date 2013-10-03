/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.search.FacetedSearchResultsPanel", function() {

    var resultsView;
    var testTarget;
    var testLayerLink;

    beforeEach(function() {
        Portal.search.FacetedSearchResultsPanel.prototype._refreshView = function() {}

        var store = new Portal.data.GeoNetworkRecordStore();
        resultsView = new Portal.search.FacetedSearchResultsPanel({
            store: store
        });

        spyOn(Portal.data.ActiveGeoNetworkRecordStore.instance(), 'add');
    });


    describe('active geo network record store events', function() {
        it('refreshes view on record added', function() {
            spyOn(resultsView, '_refreshView');
            Ext.MsgBus.publish(PORTAL_EVENTS.ACTIVE_GEONETWORK_RECORD_ADDED);
            expect(resultsView._refreshView).toHaveBeenCalled();
        });
        it('refreshes view on record removed', function() {
            spyOn(resultsView, '_refreshView');
            Ext.MsgBus.publish(PORTAL_EVENTS.ACTIVE_GEONETWORK_RECORD_REMOVED);
            expect(resultsView._refreshView).toHaveBeenCalled();
        });
    });
});
