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
            map: map
        });
    });

    describe('initialisation', function() {

        it('has card layout', function() {
            expect(subsetPanel.layout).toBeInstanceOf(Ext.layout.CardLayout);
        });

        it('initialises filterGroupPanel', function() {
            expect(subsetPanel.filterGroupPanel).toBeInstanceOf(Portal.filter.FilterGroupPanel);
            expect(subsetPanel.items.itemAt(0)).toBe(subsetPanel.filterGroupPanel);
        });

        it('initialises aodaacPanel', function() {
            expect(subsetPanel.aodaacPanel).toBeInstanceOf(Portal.details.AodaacPanel);
            expect(subsetPanel.aodaacPanel.map).toBe(map);
            expect(subsetPanel.items.itemAt(1)).toBe(subsetPanel.aodaacPanel);
        });
    });

    describe('handleLayer', function() {

        beforeEach(function() {
            spyOn(subsetPanel.layout, 'setActiveItem');
            spyOn(subsetPanel.aodaacPanel, 'handleLayer');
            spyOn(subsetPanel.filterGroupPanel, 'handleLayer');
        });

        it('activates filterGroupPanel for non-ncWMS layers', function() {
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
            subsetPanel.handleLayer({
                isNcwms: function() { return true; }
            });

            expect(subsetPanel.aodaacPanel.handleLayer).toHaveBeenCalled();
            expect(subsetPanel.filterGroupPanel.handleLayer).toHaveBeenCalled();
        });
    });
});
