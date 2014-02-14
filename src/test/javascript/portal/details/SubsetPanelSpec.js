/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.details.SubsetPanel", function() {

    var map;
    var subsetPanel;

    beforeEach(function() {
        map = new OpenLayers.Map();
        subsetPanel = new Portal.details.SubsetPanel({
            map: map,
            _extJsLayoutHack: noOp
        });
    });

    describe('initialisation', function() {

        it('sets title', function() {
            expect(subsetPanel.title).toEqual(OpenLayers.i18n('subsetPanelTitle'));
        });

        it('has card layout', function() {
            expect(subsetPanel.layout).toBeInstanceOf(Ext.layout.CardLayout);
        });

        it('initialises aodaacPanel', function() {
            expect(subsetPanel.aodaacPanel).toBeInstanceOf(Portal.details.AodaacPanel);
            expect(subsetPanel.aodaacPanel.map).toBe(map);
            expect(subsetPanel.items.itemAt(0)).toBe(subsetPanel.aodaacPanel);
            expect(subsetPanel.aodaacPanel.title).toBeUndefined();
       });
    });

    describe('handleLayer', function() {

        beforeEach(function() {
            spyOn(subsetPanel.layout, 'setActiveItem');
            spyOn(subsetPanel.aodaacPanel, 'handleLayer');
        });

        it('activates filterGroupPanel for non-ncWMS layers', function() {
            subsetPanel.filterGroupPanel = {
                id: 'fgp1',
                handleLayer: noOp
            }
            subsetPanel.handleLayer({
                isNcwms: function() { return false; }
            });

            expect(subsetPanel.layout.setActiveItem).toHaveBeenCalledWith(subsetPanel.filterGroupPanel.id);
        });

        it('activates aodaacPanel for ncWMS layers', function() {
            subsetPanel.handleLayer({
                isNcwms: function() { return true; }
            });

            expect(subsetPanel.layout.setActiveItem).toHaveBeenCalledWith(subsetPanel.aodaacPanel.id);
        });

        it('calls handleLayer in children', function() {
            subsetPanel.filterGroupPanel = {
                id: 'fgp1',
                handleLayer: noOp
            }
            spyOn(subsetPanel.filterGroupPanel, 'handleLayer');

            subsetPanel.handleLayer({
                isNcwms: function() { return true; }
            });

            expect(subsetPanel.aodaacPanel.handleLayer).toHaveBeenCalled();
            expect(subsetPanel.filterGroupPanel.handleLayer).not.toHaveBeenCalled();
        });
    });
});
