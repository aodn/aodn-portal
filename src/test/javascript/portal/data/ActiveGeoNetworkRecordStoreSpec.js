/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.data.ActiveGeoNetworkRecordStore", function() {

    /**
     *  A singleton instance of the store is used to store the 'active' geonetwork records.
     */
    describe('active geonetwork records store', function() {
        describe('activeRecordsInstance', function() {
            it('accessor function', function() {
                expect(Portal.data.ActiveGeoNetworkRecordStore.activeRecordsInstance()).toBeTruthy();
            });

            it('singleton', function() {
                var firstCall = Portal.data.ActiveGeoNetworkRecordStore.activeRecordsInstance();
                var secondCall = Portal.data.ActiveGeoNetworkRecordStore.activeRecordsInstance();
                expect(firstCall).toBe(secondCall);
            });
        });

        describe('adding records', function() {
            describe('as javascript object', function() {
                // TODO: worry about this if and when I need it.
            });
        });

        describe('interaction with MsgBus', function() {

            var activeRecordStore;
            var myRecord;

            beforeEach(function() {
                activeRecordStore = Portal.data.ActiveGeoNetworkRecordStore.activeRecordsInstance();
                spyOn(Ext.MsgBus, 'publish');
                myRecord = new Portal.data.GeoNetworkRecord({
                    title: 'my record'
                });
            });

            describe('when adding/removing records', function() {
                it('geonetwork added message is fired', function() {
                    activeRecordStore.add(myRecord);
                    expect(Ext.MsgBus.publish).toHaveBeenCalledWith('activegeonetworkrecordadded', [myRecord]);
                });

                it('geonetwork removed message is fired', function() {
                    activeRecordStore.add(myRecord);

                    activeRecordStore.remove(myRecord);
                    expect(Ext.MsgBus.publish).toHaveBeenCalledWith('activegeonetworkrecordremoved', myRecord);
                });
            });
        });
    });
});
