/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.details.DetailsPanel", function() {

    var detailsPanel;

    beforeEach(function() {
        detailsPanel = new Portal.details.DetailsPanel({ map: new OpenLayers.Map() });
        spyOn(detailsPanel, 'hideDetailsPanelContents');
        detailsPanel.initComponent();
    });

    describe('initialisation', function() {

        it('has correct status', function() {
            expect(detailsPanel.status.html).toBe(OpenLayers.i18n('noActiveCollectionSelected'));
        });

        it('hides contents', function() {
            expect(detailsPanel.hideDetailsPanelContents).toHaveBeenCalled();
        });

        it('initialises stateful', function() {
            expect(detailsPanel.stateful).toBeTruthy();
        });
    });

    describe('selected collection changed', function() {

        beforeEach(function() {
            spyOn(detailsPanel, 'setStatus').andCallFake(function(status) { });
        });

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

            it('set status to collection name', function() {
                expect(detailsPanel.setStatus).toHaveBeenCalledWith(openLayer.name);
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

            it("set status to 'no selected layer'", function() {
                expect(detailsPanel.setStatus).toHaveBeenCalledWith(OpenLayers.i18n('noActiveCollectionSelected'));
            });

            it('hide contents', function() {
                Ext.MsgBus.publish(PORTAL_EVENTS.SELECTED_LAYER_CHANGED);
                expect(detailsPanel.hideDetailsPanelContents).toHaveBeenCalled();
            });
        });
    });
});
