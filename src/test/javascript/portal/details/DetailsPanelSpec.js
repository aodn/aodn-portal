/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.details.DetailsPanel", function() {

    var detailsPanel;

    beforeEach(function() {
        detailsPanel = new Portal.details.DetailsPanel({ map: _mockMap() });
        spyOn(detailsPanel, 'hideDetailsPanelContents');
        detailsPanel.initComponent();
    });

    it('initialisation', function() {
        expect(detailsPanel.title).toBe(OpenLayers.i18n('noActiveLayersSelected'));
        expect(detailsPanel.hideDetailsPanelContents).toHaveBeenCalled();
    describe('checkLayerAvailability', function() {

        beforeEach(function() {

            spyOn(Ext.Ajax, 'request');

            detailsPanel._checkLayerAvailability({
                grailsLayerId: 123,
                params: {
                    QUERYABLE: true
                },
                getFeatureInfoFormat: function() { "someformat" },
                isNcwms: function() { return false; }
            });
        });

        it('calls Ajax.request', function() {

            expect(Ext.Ajax.request).toHaveBeenCalled();
            expect(Ext.Ajax.request.mostRecentCall.args[0].url).toBe('checkLayerAvailability/show/123');
        });
    });

    describe('initialisation', function() {

        it('has correct status', function() {

            expect(detailsPanel.status.html).toBe(OpenLayers.i18n('noActiveLayersSelected'));
        });

        it('hides contents', function() {

            expect(detailsPanel.hideDetailsPanelContents).toHaveBeenCalled();
        });
    });

    describe('selected layer changed', function() {

        beforeEach(function() {

            spyOn(detailsPanel, 'setStatus').andCallFake(function(status) { });
        });

        describe('selected layer', function() {
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

            it('set status to layer name', function() {
                expect(detailsPanel.setStatus).toHaveBeenCalledWith(openLayer.name);
            });
        });

        describe('no selected layer', function() {
            it("set title to 'no selected layer'", function() {
                detailsPanel.title = 'something';
                expect(detailsPanel.title).toBe('something');
                Ext.MsgBus.publish(PORTAL_EVENTS.SELECTED_LAYER_CHANGED);
                expect(detailsPanel.title).toBe(OpenLayers.i18n('noActiveLayersSelected'));

            beforeEach(function() {

                Ext.MsgBus.publish('selectedLayerChanged');
            });

            it("set status to 'no selected layer'", function() {

                expect(detailsPanel.setStatus).toHaveBeenCalledWith(OpenLayers.i18n('noActiveLayersSelected'));
            });

            it('hide contents', function() {

                Ext.MsgBus.publish(PORTAL_EVENTS.SELECTED_LAYER_CHANGED);
                expect(detailsPanel.hideDetailsPanelContents).toHaveBeenCalled();
            });
        });
    });

    function _mockMap() {
        return {
            events: { register: function() {}}
        };
    }
});
