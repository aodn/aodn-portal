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

        var activeRecordStore;

        beforeEach(function() {
            activeRecordStore = Portal.data.ActiveGeoNetworkRecordStore.instance();
        });

        describe('activeRecordsInstance', function() {
            it('accessor function', function() {
                expect(Portal.data.ActiveGeoNetworkRecordStore.instance()).toBeTruthy();
            });

            it('singleton', function() {
                var firstCall = Portal.data.ActiveGeoNetworkRecordStore.instance();
                var secondCall = Portal.data.ActiveGeoNetworkRecordStore.instance();
                expect(firstCall).toBe(secondCall);
            });
        });

        describe('interaction with MsgBus', function() {

            var myRecord;

            beforeEach(function() {
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

        describe('interaction with LayerStore', function() {

            var layer = new OpenLayers.Layer.WMS(
                'the tile',
                'http://some/wms/url',
                {},
                { isBaseLayer: false });

            afterEach(function() {
                Portal.data.LayerStore.THE_INSTANCE = undefined;
            });

            describe('record with layer', function() {
                var myRecord = new Portal.data.GeoNetworkRecord({
                    title: 'a really interesting record',
                    wmsLayer: layer
                });

                it('layer added to LayerStore', function() {
                    activeRecordStore.add(myRecord);
                    expect(Portal.data.LayerStore.instance().getAt(0).get('layer')).toBe(layer);
                });

                it('layer removed from LayerStore', function() {
                    activeRecordStore.add(myRecord);
                    expect(Portal.data.LayerStore.instance().getCount()).toBe(1);

                    activeRecordStore.remove(myRecord);
                    expect(Portal.data.LayerStore.instance().getCount()).toBe(0);
                });
            });

            describe('record without layer', function() {
                var myRecord = new Portal.data.GeoNetworkRecord({
                    title: 'a really interesting record'
                });

                it('when geonetwork record without wmsLayer is added', function() {
                    activeRecordStore.add(myRecord);
                    expect(Portal.data.LayerStore.instance().getCount()).toBe(0);
                });

                it('when geonetwork record without wmsLayer is added', function() {
                    activeRecordStore.add(myRecord);
                    activeRecordStore.remove(myRecord);
                    expect(Portal.data.LayerStore.instance().getCount()).toBe(0);
                });
            });
        });
    });
});
