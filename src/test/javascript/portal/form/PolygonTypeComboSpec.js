/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.form.PolygonTypeCombo', function() {

    var polygonTypeCombo;

    beforeEach(function() {
        polygonTypeCombo = new Portal.form.PolygonTypeComboBox();
    });

    describe('items', function() {
        it('has a bounding box item', function() {
            expect(polygonTypeCombo.store.find('style', polygonTypeCombo.BOUNDING_BOX.style)).toBeGreaterThan(-1);
        });

        it('has a polygon item', function() {
            expect(polygonTypeCombo.store.find('style', polygonTypeCombo.POLYGON.style)).toBeGreaterThan(-1);
        });

        it('has a none item', function() {
            expect(polygonTypeCombo.store.find('style', polygonTypeCombo.NONE.style)).toBeGreaterThan(-1);
        });
    });

    describe('subscribing to other polygon type combo events', function() {
        it('subscribes to a value changed event', function() {
            spyOn(Ext.MsgBus, 'subscribe');
            var combo = new Portal.form.PolygonTypeComboBox();
            expect(Ext.MsgBus.subscribe).toHaveBeenCalledWith(combo.VALUE_CHANGED_EVENT, combo._updateValue, combo);
        });
    });

    describe('publishing a value changed message', function() {
        it('publishes a message when the value is set', function() {
            spyOn(Ext.MsgBus, 'subscribe');
            spyOn(Ext.MsgBus, 'publish');
            polygonTypeCombo.setValue('none');
            expect(Ext.MsgBus.publish).toHaveBeenCalledWith(polygonTypeCombo.VALUE_CHANGED_EVENT, { sender: polygonTypeCombo, value: 'none' });
        });

        it('updates from a published value', function() {
            var sender = new Portal.form.PolygonTypeComboBox();

            var receivers = [];
            for (var i = 0; i < 5; i++) {
                receivers.push(new Portal.form.PolygonTypeComboBox());
            }

            sender.setValue('none');
            for (var i = 0; i < receivers.length; i++) {
                expect(receivers[i].getValue()).toEqual('none');
            }
        });
    });
});
