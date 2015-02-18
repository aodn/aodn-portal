/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.details.DetailsPanel", function() {

    var detailsPanel;

    beforeEach(function() {
        detailsPanel = new Portal.details.DetailsPanel({
            map: new OpenLayers.SpatialConstraintMap(),
            layer: new OpenLayers.Layer.WMS()
        });
    });

    afterEach(function() {
        detailsPanel.destroy();
    });

    describe('selected collection changed', function() {
        describe('selected collection', function() {
            var layer;

            beforeEach(function() {
                layer = {};

                spyOn(detailsPanel, '_addTabForLayer');
                spyOn(detailsPanel, '_activateTabForLayer');
            });

            it('activates existing SubsetPanelAccordion for previously selected layer', function() {
                spyOn(detailsPanel, '_tabExistsForLayer').andReturn(true);

                Ext.MsgBus.publish(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, layer);

                expect(detailsPanel._addTabForLayer).not.toHaveBeenCalled();
                expect(detailsPanel._activateTabForLayer).toHaveBeenCalledWith(layer);
            });

            it('creates new SubsetPanelAccordion and activates for new layer', function() {
                spyOn(detailsPanel, '_tabExistsForLayer').andReturn(false);

                Ext.MsgBus.publish(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, layer);

                expect(detailsPanel._addTabForLayer).toHaveBeenCalledWith(layer);
                expect(detailsPanel._activateTabForLayer).toHaveBeenCalledWith(layer);
            });

            it('removes SubsetPanelAccordion for removed layer', function() {
                spyOn(detailsPanel, '_tabExistsForLayer').andReturn(true);
                spyOn(detailsPanel, '_removeTabForLayer');

                Ext.MsgBus.publish(PORTAL_EVENTS.LAYER_REMOVED, layer);

                expect(detailsPanel._removeTabForLayer).toHaveBeenCalledWith(layer);
            });
        });

        describe('no selected layer', function() {
            beforeEach(function() {
                Ext.MsgBus.publish('selectedLayerChanged');
            });

            it("set title to 'no selected layer'", function() {
                detailsPanel.title = 'something';
                expect(detailsPanel.title).toBe('something');
                Ext.MsgBus.publish(PORTAL_EVENTS.SELECTED_LAYER_CHANGED);
                expect(detailsPanel.title).toBe('something');
            });
        });
    });

    describe('step title', function() {
        it('is correct', function() {

            var expectedTitle = OpenLayers.i18n('stepHeader', { stepNumber: 2, stepDescription: OpenLayers.i18n('step2Description') });
            expect(detailsPanel.title).toEqual(expectedTitle);
        });
    });
});
