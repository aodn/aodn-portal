
describe("Portal.details.DataCollectionDetailsPanel", function() {
    var panel;
    var layer;
    var layerAdapter;
    var layerSelectionModel;

    var dataCollection;

    beforeEach(function() {
        spyOn(Portal.details.DataCollectionDetailsPanel.prototype, '_initSubsetItemsTabPanel').andReturn(new Ext.Panel());

        layer = new OpenLayers.Layer.WMS();
        layerAdapter = new Ext.util.Observable();
        layerAdapter.isLoading = returns(false);

        layerSelectionModel = {selectedLayer: layer};

        dataCollection = {
            getTitle: returns('amazetion'),
            getLayerAdapter: returns(layerAdapter),
            layerSelectionModel: layerSelectionModel
        };

        panel = new Portal.details.DataCollectionDetailsPanel({
            dataCollection: dataCollection,
            tools: {
                showLayerToolItem: {
                    toggle: returns()
                },
                hideLayerToolItem: {
                    toggle: returns()
                },
                spinnerToolItem: {
                    show: returns(),
                    hide: returns()
                },
                errorToolItem: {
                    show: returns(),
                    hide: returns()
                }
            }
        });
    });

    describe('layer event listeners', function() {

        beforeEach(function() {
            spyOn(panel, '_onLayerLoadStart');
            spyOn(panel, '_onLayerLoadEnd');
            spyOn(panel, '_onLayerLoadError');
            panel.addListeners(dataCollection.getLayerAdapter());
        });

        afterEach(function() {
            panel.removeListeners(dataCollection.getLayerAdapter());
        });

        it('responds to loadstart', function() {
            layerAdapter.fireEvent('loadstart');
            expect(panel._onLayerLoadStart).toHaveBeenCalled();
        });

        it('responds to loadend', function() {
            layerAdapter.fireEvent('loadend');
            expect(panel._onLayerLoadEnd).toHaveBeenCalled();
        });

        it('responds to tileerror', function() {
            layerAdapter.fireEvent('tileerror');
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


    describe('visibility checkbox', function() {
        beforeEach(function() {
            spyOn(window, 'trackLayerControlUsage');
        });

        it('sends google analytics tracking when clicked', function() {
            panel._showHideLayer();

            expect(window.trackLayerControlUsage).toHaveBeenCalledWith(
                'layerControlTrackingActionVisibility',
                'on',
                'amazetion'
            );
        });

    });

    it('fires "DATA_COLLECTION_SELECTED" event on expand', function() {
        spyOn(Ext.MsgBus, 'publish');
        panel._onExpand();
        expect(Ext.MsgBus.publish).toHaveBeenCalledWith(PORTAL_EVENTS.DATA_COLLECTION_SELECTED, dataCollection);
    });
});
