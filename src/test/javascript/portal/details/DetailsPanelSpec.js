/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.details.DetailsPanel", function() {

    var detailsPanel;

    beforeEach(function() {
        spyOn(Portal.details.SubsetPanel.prototype, 'handleLayer');
        spyOn(Portal.details.DetailsPanel.prototype, 'hideDetailsPanelContents');

        detailsPanel = new Portal.details.DetailsPanel({ map: new OpenLayers.SpatialConstraintMap() });
    });

    afterEach(function() {
        detailsPanel.destroy();
    });

    describe('initialisation', function() {
        it('hides contents', function() {
            expect(detailsPanel.hideDetailsPanelContents).toHaveBeenCalled();
        });
    });

    describe('selected collection changed', function() {
        describe('selected collection', function() {
            var layer;

            beforeEach(function() {
                layer = {};

                spyOn(detailsPanel, '_addCardForLayer');
                spyOn(detailsPanel, '_activateCardForLayer');
            });

            it('activates existing DetailsPanelTab for previously selected layer', function() {
                spyOn(detailsPanel, '_cardExistsForLayer').andReturn(true);

                Ext.MsgBus.publish(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, layer);

                expect(detailsPanel._addCardForLayer).not.toHaveBeenCalled();
                expect(detailsPanel._activateCardForLayer).toHaveBeenCalledWith(layer);
            });

            it('creates new DetailsPanelTab and activates for new layer', function() {
                spyOn(detailsPanel, '_cardExistsForLayer').andReturn(false);

                Ext.MsgBus.publish(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, layer);

                expect(detailsPanel._addCardForLayer).toHaveBeenCalledWith(layer);
                expect(detailsPanel._activateCardForLayer).toHaveBeenCalledWith(layer);
            });

            it('removes DetailsPanelTab for removed layer', function() {
                spyOn(detailsPanel, '_cardExistsForLayer').andReturn(true);
                spyOn(detailsPanel, '_removeCardForLayer');

                Ext.MsgBus.publish(PORTAL_EVENTS.LAYER_REMOVED, layer);

                expect(detailsPanel._removeCardForLayer).toHaveBeenCalledWith(layer);
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

            it('hide contents', function() {
                Ext.MsgBus.publish(PORTAL_EVENTS.SELECTED_LAYER_CHANGED);
                expect(detailsPanel.hideDetailsPanelContents).toHaveBeenCalled();
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
