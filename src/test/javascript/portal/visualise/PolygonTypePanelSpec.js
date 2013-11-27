/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.visualise.PolygonTypePanel', function() {

    var polygonTypePanel;

    beforeEach(function() {
        spyOn(Ext.MsgBus, 'subscribe');
        spyOn(Ext.MsgBus, 'publish');
        polygonTypePanel = new Portal.visualise.PolygonTypePanel();
    });

    describe('intialisation', function() {
        it('has a polygon type combobox', function() {
            expect(polygonTypePanel.polygonTypeCombo).toBeTruthy();
        });

        it('the polygon type combobox is a PolygonTypeComboBox', function() {
            expect(polygonTypePanel.polygonTypeCombo instanceof Portal.form.PolygonTypeComboBox).toBeTruthy();
        });
    });

    describe('getting values', function() {
        it('gets the underlying combobox value', function() {
            console.log(polygonTypePanel.getValue());
            console.log(polygonTypePanel.getValue().style);
            expect(['bounding box', 'polygon', 'none'].indexOf(polygonTypePanel.getValue())).toBeGreaterThan(-1);
        });
    });

    describe('setting values', function() {
        it('sets the value', function() {
            polygonTypePanel.setValue('none');
            expect(polygonTypePanel.getValue()).toEqual('none');
        });
    });
});
