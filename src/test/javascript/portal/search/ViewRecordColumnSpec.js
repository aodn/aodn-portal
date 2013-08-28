/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.search.ViewRecordColumn", function() {

    it('add record to active geonetwork store when view is clicked', function() {
        var viewRecordColumn = new Portal.search.ViewRecordColumn();

        spyOn(Portal.data.ActiveGeoNetworkRecordStore.instance(), 'add');
        var record = {};
        viewRecordColumn._viewButtonOnClick(record);
        expect(Portal.data.ActiveGeoNetworkRecordStore.instance().add).toHaveBeenCalledWith(record);
    });
});
