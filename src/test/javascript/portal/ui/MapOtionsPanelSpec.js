/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.ui.MapOptionsPanel", function() {

    var mapOptionsPanel;

    beforeEach(function() {
        mapOptionsPanel = new Portal.ui.MapOptionsPanel({
            map: new OpenLayers.Map()
        });
    });

    describe('initialisation', function() {
        describe('button panel', function() {

            it('should have one button', function() {
                expect(mapOptionsPanel.buttonPanel.items.getCount()).toBe(1);
            });

            it('should initialise clear all button', function() {
                var clearAllButton = mapOptionsPanel.buttonPanel.items.first();
                expect(clearAllButton).toBeTruthy();
                expect(clearAllButton.text).toBe(OpenLayers.i18n('clearAllButtonLabel'));
                expect(clearAllButton.cls).toBe('floatLeft buttonPad');
                expect(clearAllButton.handler).toBe(mapOptionsPanel._clearAll);
            });
        });
    });

    describe('clear all', function() {
        it('calls to active geo network record store remove all', function() {
            spyOn(Portal.data.ActiveGeoNetworkRecordStore.instance(), 'removeAll');
            mapOptionsPanel._clearAll();
            expect(Portal.data.ActiveGeoNetworkRecordStore.instance().removeAll).toHaveBeenCalled();
        });
    });
});
