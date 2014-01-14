/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.details.DetailsPanelTab", function() {

    var detailsPanelTab;

    beforeEach(function() {
        detailsPanelTab = new Portal.details.DetailsPanelTab({
            map: new OpenLayers.Map()
        });

        spyOn(detailsPanelTab.infoPanel, 'handleLayer');
        spyOn(detailsPanelTab.stylePanel, 'handleLayer');
        spyOn(detailsPanelTab.subsetPanel, 'handleLayer');
    });

    describe('initialisation', function() {
        it('is tab panel', function() {
            expect(detailsPanelTab).toBeInstanceOf(Ext.TabPanel);
        });

        it('initialises subsetPanel', function() {
            expect(detailsPanelTab.subsetPanel).toBeInstanceOf(Portal.details.SubsetPanel);
            expect(detailsPanelTab.items.itemAt(0)).toBe(detailsPanelTab.subsetPanel);
        });
    });

    describe('handleLayer', function() {
        it('ensures rendered', function() {
            spyOn(detailsPanelTab, '_ensurePanelsRendered');
            detailsPanelTab.handleLayer();
            expect(detailsPanelTab._ensurePanelsRendered).toHaveBeenCalled();
        });

        // TODO: possibly better to have the children listening for the layer changed event directly - then
        // this coupling between DetailsPanelTab and its children can be avoided.
        it('calls handleLayer of children', function() {
            detailsPanelTab.handleLayer();
            expect(detailsPanelTab.subsetPanel.handleLayer).toHaveBeenCalled();
            expect(detailsPanelTab.infoPanel.handleLayer).toHaveBeenCalled();
            expect(detailsPanelTab.stylePanel.handleLayer).toHaveBeenCalled();
        });

        it('calls show', function() {
            spyOn(detailsPanelTab, 'show');
            detailsPanelTab.handleLayer();
            expect(detailsPanelTab.show).toHaveBeenCalled();
        });
    });

    describe('_ensurePanelsRendered', function() {

        var orderCalled;
        var panel1 = {
            show: jasmine.createSpy('panel 1 show()').andCallFake(
                function() { orderCalled.push(this) }
            )
        };
        var panel2 = {
            show: jasmine.createSpy('panel 2 show()').andCallFake(
                function() { orderCalled.push(this) }
            )
        };

        beforeEach(function() {

            detailsPanelTab.items = {
                items: [panel1, panel2]
            };
            orderCalled = [];

            detailsPanelTab._ensurePanelsRendered();
        });

        it('calls all the show() methods', function() {

            expect(panel1.show).toHaveBeenCalled();
            expect(panel2.show).toHaveBeenCalled();
        });

        it('calls the show methods in reverse order', function() {

            // Panel 1 shown after panel 2
            expect(orderCalled).toEqual([panel2, panel1]);
        });
    });
});
