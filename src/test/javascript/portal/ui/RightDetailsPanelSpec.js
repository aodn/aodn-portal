
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.ui.RightDetailsPanel", function() {

    describe('message bus tests', function() {
        
        it('update called on selectedLayerChanged event', function() {
            var rightDetailsPanel = _initDetailsPanelWithUpdateSpy();
            rightDetailsPanel.rendered = true;
            Ext.MsgBus.publish('selectedLayerChanged', _initLayer());
            
            expect(rightDetailsPanel.update).toHaveBeenCalled();
        });

        it('ensures that update is not called until the panel is rendered and layout is complete', function() {
            var rightDetailsPanel = _initDetailsPanelWithUpdateSpy();
            Ext.MsgBus.publish('selectedLayerChanged', _initLayer());

            expect(rightDetailsPanel.update).not.toHaveBeenCalled();
        });

        it('ensures that update is called when the panel is rendered and layout is complete', function() {
            var rightDetailsPanel = _initDetailsPanelWithUpdateSpy();
            Ext.MsgBus.publish('selectedLayerChanged', _initLayer());

            expect(rightDetailsPanel.update).not.toHaveBeenCalled();

            rightDetailsPanel.rendered = true;
            rightDetailsPanel.fireEvent('afterlayout');

            expect(rightDetailsPanel.update).toHaveBeenCalled();
        });
    });

    function _initLayer() {
        var layer = new OpenLayers.Layer.WMS(
            'My Open Layer',
            'Mock URI'
        );
        layer.map = {};
        return layer;
    }

    function _initDetailsPanelWithUpdateSpy() {
        return _initDetailsPanelWithSpies(['update']);
    }

    function _initDetailsPanelWithSpies(spies) {
        var panel = new Portal.ui.RightDetailsPanel();

        // Mock some drawing related aspects
        panel.el = {
            hasFxBlock: function () {
                return true;
            }
        };

        panel.detailsPanelItems = {
            updateDetailsPanel: function(openlayer) {}
        }

        Ext.each(spies, function(spy, index, all) {
            spyOn(panel, spy);
        });
        return panel;
    }

});
