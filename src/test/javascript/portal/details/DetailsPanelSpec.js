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

    it('checkLayerAvailability', function() {

        spyOn(Ext.Ajax, 'request');

        detailsPanel._checkLayerAvailability({
            grailsLayerId: 123,
            params: {
                QUERYABLE: true
            },
            getFeatureInfoFormat: function() { "someformat" },
            isNcwms: function() { return false; }
        });

        expect(Ext.Ajax.request).toHaveBeenCalled();
        expect(Ext.Ajax.request.mostRecentCall.args[0].url).toBe('checkLayerAvailability/show/123');
    });

    it('initialisation', function() {
        expect(detailsPanel.title).toBe(OpenLayers.i18n('noActiveLayersSelected'));
        expect(detailsPanel.hideDetailsPanelContents).toHaveBeenCalled();
    });

    describe('selected layer changed', function() {
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

                Ext.MsgBus.publish('selectedLayerChanged', openLayer);
            });

            it('set title to layer name', function() {
                expect(detailsPanel.title).toBe(openLayer.name);
            });

            it('show contents', function() {
            });
        });

        describe('no selected layer', function() {
            it("set title to 'no selected layer'", function() {
                detailsPanel.title = 'something';
                expect(detailsPanel.title).toBe('something');
                Ext.MsgBus.publish('selectedLayerChanged');
                expect(detailsPanel.title).toBe(OpenLayers.i18n('noActiveLayersSelected'));
            });

            it('hide contents', function() {
                Ext.MsgBus.publish('selectedLayerChanged');
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
