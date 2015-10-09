
Ext.namespace('Portal.data');

Portal.data.DataCollectionStore = Ext.extend(Ext.data.Store, {

    constructor: function(config) {

        Ext.apply(this, config);
        Portal.data.DataCollectionStore.superclass.constructor.call(this);

        this.on('add', this._onAdd, this);
        this.on('remove', this._onRemove, this);
        this.on('clear', this._onClear, this);
    },

    removeAll: function() {
        var beingRemoved = [];
        this.each(function(dataCollection) {
            beingRemoved.push(dataCollection);
        });

        Portal.data.DataCollectionStore.superclass.removeAll.call(this);

        Ext.each(beingRemoved, function(dataCollection) {
            Ext.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_REMOVED, dataCollection);
        });
        Ext.MsgBus.publish(PORTAL_EVENTS.RESET);
    },

    getByUuid: function(uuid) {
        return this.getAt(
            this.findBy(function(record) {
                return record.getUuid() == uuid;
            })
        );
    },

    getLoadedRecords: function() {
        var loadedRecords = [];
        this.each(function(record) {
            if (record.loaded) { loadedRecords.push(record); }
        });
        return loadedRecords;
    },

    _onAdd: function(store, dataCollections) {
        var _this = this;

        Ext.each(dataCollections, function(dataCollection) {
            var layerSelectionModel = dataCollection.getLayerSelectionModel();

            this.layerStore.addUsingOpenLayer(
                layerSelectionModel.getSelectedLayer(),
                function(layerRecord) {
                    _this._recordLoaded(dataCollection);
                }
            );

            layerSelectionModel.on('selectedlayerchanged', function(newLayer, oldLayer) {
                if (oldLayer) {
                    this.layerStore.removeUsingOpenLayer(oldLayer);
                }

                this.layerStore.addUsingOpenLayer(newLayer);

            }, this);

        }, this);
    },

    _onRemove: function(store, dataCollection) {
        this._removeFromLayerStore(dataCollection);
        Ext.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_REMOVED, dataCollection);
    },

    _onClear: function(store, dataCollections) {
        Ext.each(dataCollections, function(dataCollection) {
            store._removeFromLayerStore(dataCollection);
        });
    },

    _recordLoaded: function(dataCollection) {
        dataCollection.loaded = true;
        Ext.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_ADDED, dataCollection);
    },

    _removeFromLayerStore: function(dataCollection) {
        this.layerStore.removeUsingOpenLayer(dataCollection.getLayerSelectionModel().getSelectedLayer());
    }
});
