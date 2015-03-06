/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.data.UrlUpdater", function() {

    var updater;
    var uuids = [];

    beforeEach(function() {
        updater = new Portal.data.UrlUpdater();
        spyOn(Portal.data.ActiveGeoNetworkRecordStore.instance(), 'getUuids').andCallFake(function() {
            return uuids;
        });
    });

    describe('geonetwork record store events', function() {
        beforeEach(function() {
            spyOn(updater, '_updateUrl');
        });

        it('updates URL on record added', function() {
            Ext.MsgBus.publish(PORTAL_EVENTS.ACTIVE_GEONETWORK_RECORD_ADDED);
            expect(updater._updateUrl).toHaveBeenCalled();
        });

        it('updates URL on record removed', function() {
            Ext.MsgBus.publish(PORTAL_EVENTS.ACTIVE_GEONETWORK_RECORD_REMOVED);
            expect(updater._updateUrl).toHaveBeenCalled();
        });
    });

    describe('URL updates', function() {
        it('gets collection IDs', function() {
            updater._updateUrl();
            expect(Portal.data.ActiveGeoNetworkRecordStore.instance().getUuids).toHaveBeenCalled();
        });

        it('updates UUID params', function() {
            var baseUrl = document.URL;

            uuids = ['1234'];
            updater._updateUrl();
            expect(window.history.pushState).toHaveBeenCalledWith(null, '', Ext.urlAppend(baseUrl, 'uuid=1234'));

            uuids = [];
            updater._updateUrl();
            expect(window.history.pushState).toHaveBeenCalledWith(null, '', baseUrl);
        });
    });
});
