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
        map = new OpenLayers.SpatialConstraintMap();
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
            expect(subsetPanel.ncwmsPanel).toBeInstanceOf(Portal.details.NcWmsPanel);
            expect(subsetPanel.ncwmsPanel.map).toBe(map);
            expect(subsetPanel.items.itemAt(0)).toBe(subsetPanel.ncwmsPanel);
            expect(subsetPanel.ncwmsPanel.title).toBeUndefined();
       });
    });

    describe('handleLayer', function() {

        beforeEach(function() {
            spyOn(subsetPanel.layout, 'setActiveItem');
            spyOn(subsetPanel.ncwmsPanel, 'handleLayer');
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

            expect(subsetPanel.layout.setActiveItem).toHaveBeenCalledWith(subsetPanel.ncwmsPanel.id);
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

            expect(subsetPanel.ncwmsPanel.handleLayer).toHaveBeenCalled();
            expect(subsetPanel.filterGroupPanel.handleLayer).not.toHaveBeenCalled();
        });
    });
});
