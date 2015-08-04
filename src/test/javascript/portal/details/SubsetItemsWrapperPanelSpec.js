/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe("Portal.details.SubsetItemsWrapperPanel", function() {
    var panel;
    var layer;
    var dataCollection;

    beforeEach(function() {
        spyOn(Portal.details.SubsetItemsWrapperPanel.prototype, '_initSubsetItemsTabPanel').andReturn(new Ext.Panel());

        layer = new OpenLayers.Layer.WMS();
        dataCollection = {
            getSelectedLayer: returns(layer)
        };

        panel = new Portal.details.SubsetItemsWrapperPanel({
            dataCollection: dataCollection
        });
    });

    describe('layer event listeners', function() {
        beforeEach(function() {
            spyOn(panel, '_onLayerLoadStart');
            spyOn(panel, '_onLayerLoadEnd');
            spyOn(panel, '_onLayerLoadError');
        });

        it('responds to loadstart', function() {
            layer.events.triggerEvent('loadstart');
            expect(panel._onLayerLoadStart).toHaveBeenCalled();
        });

        it('responds to loadend', function() {
            layer.events.triggerEvent('loadend');
            expect(panel._onLayerLoadEnd).toHaveBeenCalled();
        });

        it('responds to tileerror', function() {
            layer.events.triggerEvent('tileerror');
            expect(panel._onLayerLoadError).toHaveBeenCalled();
        });
    });

    describe('layer event handlers', function() {
        beforeEach(function() {
            spyOn(panel, '_indicateLayerError');
            spyOn(panel, '_indicateLayerLoading');

        });

        it('handles loadstart', function() {
            panel._onLayerLoadStart();

            expect(panel._indicateLayerLoading).toHaveBeenCalledWith(true);
            expect(panel._indicateLayerError).toHaveBeenCalledWith(false);
        });

        it('handles loadend', function() {
            panel._onLayerLoadEnd();

            expect(panel._indicateLayerLoading).toHaveBeenCalledWith(false);
            expect(panel._indicateLayerError).not.toHaveBeenCalled();
        });

        it('handles loaderror', function() {
            panel._onLayerLoadError();

            expect(panel._indicateLayerLoading).toHaveBeenCalledWith(false);
            expect(panel._indicateLayerError).toHaveBeenCalledWith(true);
        });
    });
});
