/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.details.SubsettingPanel", function() {

    var subsettingPanel;

    beforeEach(function() {
        subsettingPanel = new Portal.details.SubsettingPanel({
            map: new OpenLayers.SpatialConstraintMap(),
            layer: new OpenLayers.Layer.WMS()
        });
    });

    afterEach(function() {
        subsettingPanel.destroy();
    });

    describe('selected collection changed', function() {
        describe('selected collection', function() {
            var layer;

            beforeEach(function() {
                layer = {};

                spyOn(subsettingPanel, '_addItemForLayer');
                spyOn(subsettingPanel, '_activateItemForLayer');
            });

            it('activates existing SubsetPanelAccordion for previously selected layer', function() {
                spyOn(subsettingPanel, '_itemExistsForLayer').andReturn(true);

                Ext4.MsgBus.publish(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, layer);

                expect(subsettingPanel._addItemForLayer).not.toHaveBeenCalled();
            });

            it('creates new SubsetPanelAccordion and activates for new layer', function() {
                spyOn(subsettingPanel, '_itemExistsForLayer').andReturn(false);

                Ext4.MsgBus.publish(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, layer);

                expect(subsettingPanel._addItemForLayer).toHaveBeenCalledWith(layer);
                expect(subsettingPanel._activateItemForLayer).toHaveBeenCalledWith(layer);
            });

            it('removes SubsetPanelAccordion for removed layer', function() {
                spyOn(subsettingPanel, '_itemExistsForLayer').andReturn(true);
                spyOn(subsettingPanel, '_removeFolderForLayer');

                Ext4.MsgBus.publish(PORTAL_EVENTS.LAYER_REMOVED, layer);

                expect(subsettingPanel._removeFolderForLayer).toHaveBeenCalledWith(layer);
            });

            it('sets empty text', function() {
                spyOn(subsettingPanel, '_itemExistsForLayer').andReturn(true);
                spyOn(subsettingPanel, 'checkState');

                Ext4.MsgBus.publish(PORTAL_EVENTS.LAYER_REMOVED, layer);

                expect(subsettingPanel.checkState).toHaveBeenCalled();
            });
        });

        describe('no selected layer', function() {
            beforeEach(function() {
                Ext4.MsgBus.publish('selectedLayerChanged');
            });

            it("set title to 'no selected layer'", function() {
                subsettingPanel.title = 'something';
                expect(subsettingPanel.title).toBe('something');
                Ext4.MsgBus.publish(PORTAL_EVENTS.SELECTED_LAYER_CHANGED);
                expect(subsettingPanel.title).toBe('something');
            });
        });
    });

    describe('step title', function() {
        it('is correct', function() {

            var expectedTitle = OpenLayers.i18n('stepHeader', { stepNumber: 2, stepDescription: OpenLayers.i18n('step2Description') });
            expect(subsettingPanel.title).toEqual(expectedTitle);
        });
    });
});
