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
        detailsPanel = new Portal.details.DetailsPanel({ map: new OpenLayers.SpatialConstraintMap() });
        spyOn(detailsPanel, 'hideDetailsPanelContents');
        detailsPanel.initComponent();
    });

    describe('initialisation', function() {
        it('hides contents', function() {
            expect(detailsPanel.hideDetailsPanelContents).toHaveBeenCalled();
        });
    });

    describe('selected collection changed', function() {
        describe('selected collection', function() {
            var openLayer;

            beforeEach(function() {
                openLayer = new OpenLayers.Layer.WMS(
                    "the title",
                    "http: //tilecache.emii.org.au/cgi-bin/tilecache.cgi",
                    {},
                    { isBaseLayer: false }
                );
                openLayer.server = {
                    type: 'some type'
                };

                Ext.MsgBus.publish(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, openLayer);
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
