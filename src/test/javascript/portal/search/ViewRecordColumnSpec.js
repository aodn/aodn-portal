/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.search.ViewRecordColumn", function() {

    var viewRecordColumn;
    var record;

    beforeEach(function() {
        viewRecordColumn = new Portal.search.ViewRecordColumn();
        record = {};

        spyOn(Portal.data.ActiveGeoNetworkRecordStore.instance(), 'isRecordActive').andCallFake(function(someRecord) {
            return someRecord == record;
        });
    });

    describe('view button click handler', function() {
        beforeEach(function() {
            spyOn(Portal.data.ActiveGeoNetworkRecordStore.instance(), 'add');
        });

        it('adds record to store when record is not already active', function() {
            var someOtherRecord = {};
            viewRecordColumn._viewButtonOnClick(someOtherRecord);
            expect(Portal.data.ActiveGeoNetworkRecordStore.instance().add).toHaveBeenCalledWith(someOtherRecord);
        });

        it('does not add record to store when record is already active', function() {
            viewRecordColumn._viewButtonOnClick(record);
            expect(Portal.data.ActiveGeoNetworkRecordStore.instance().add).not.toHaveBeenCalled();
        });

        it('fires viewrecord event', function() {
            var onViewRecord = jasmine.createSpy('onViewRecord');
            Ext.MsgBus.subscribe('viewgeonetworkrecord', onViewRecord);
            viewRecordColumn._viewButtonOnClick(record);
            expect(onViewRecord).toHaveBeenCalledWith('viewgeonetworkrecord', record);
        });
    });

    describe('view button text', function() {
        it("is set to 'view' when record is already active", function() {
            expect(viewRecordColumn._getViewButtonText(record)).toBe('View');
        });

        it("is set to 'add & view' when record is not already active", function() {
            var someOtherRecord = {};
            expect(viewRecordColumn._getViewButtonText(someOtherRecord)).toBe('Add & View');
        });
    });
});
