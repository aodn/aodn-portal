Ext.namespace('Portal.details');

Portal.details.LayerControlPanel = Ext.extend(Ext.Container, {

    initComponent: function() {
        this.items = [];

        this.layer = this.dataCollection.getLayerAdapter();

        var layerSelector = this._newLayerSelectorComponent();
        if (layerSelector) {
            this.items.push(layerSelector, { xtype: 'spacer', height: 10 });
        }

        this.items.push(this._newOpacitySliderContainer());

        if (this._getCollectionBounds()) {
            this.items.push(this._newZoomToDataButton());
        }

        Portal.details.LayerControlPanel.superclass.initComponent.call(this);
    },

    _newOpacitySliderContainer: function() {

        this.opacitySlider = new Portal.common.LayerOpacitySliderFixed({
            layer: this.layer,
            keyIncrement: 10,
            increment: 5,
            minValue: 20,
            maxValue: 100,
            aggressive: true,
            width: 175,
            isFormField: true,
            inverse: false,
            fieldLabel: OpenLayers.i18n('Opacity'),
            plugins: new GeoExt.LayerOpacitySliderTip({
                template: '<div class="opacitySlider" >Opacity: {opacity}%</div>'
            }),
            listeners: {
                'changecomplete': this.doTracking,
                scope: this
            }
        });

        // Put slider in container with form layout so that we see the label.
        return new Ext.Panel({
            layout: 'form',
            items: [
                this.opacitySlider
            ]
        });
    },

    doTracking: function(slider, value) {
        trackLayerControlUsage(
            OpenLayers.i18n('changeLayerTrackingActionOpacity'),
            value,
            this.dataCollection.getTitle()
        );
    },

    _newZoomToDataButton: function() {
        return new Ext.ux.Hyperlink({
            text: OpenLayers.i18n('zoomToDataCollection'),
            listeners: {
                scope: this,
                click: this._zoomToLayer
            }
        });
    },

    _newLayerSelectorComponent: function() {
        if (this.dataCollection.getLayerSelectionModel().getLayers().length <= 1) {
            return undefined;
        }

        var items = [];
        Ext.each(this.dataCollection.getLayerSelectionModel().getLayers(), function(openLayer) {
            items.push({
                boxLabel: openLayer.wmsName,
                name: String.format("{0}-selectedLayer", this.dataCollection.getUuid()),
                checked: openLayer == this.dataCollection.getLayerSelectionModel().getSelectedLayer(),
                layer: openLayer
            });
        }, this);

        return new Ext.form.RadioGroup({
            columns: 1,
            items: items,
            listeners: {
                'scope': this,
                'change': this._onSelectedLayerChange
            }
        });
    },

    _onSelectedLayerChange: function(radioGroup, checkedRadio) {
        this._setSelectedLayer(checkedRadio.layer);
    },

    _setSelectedLayer: function(layer) {
        this.dataCollection.getLayerSelectionModel().setSelectedLayer(layer);

        trackLayerControlUsage(
            'changeLayerTrackingAction',
            this.dataCollection.getTitle(),
            layer.wmsName
        );
    },

    _zoomToLayer: function() {
        this.map.zoomToExtent(this._getCollectionBounds());
    },

    _getCollectionBounds: function() {
        return this.dataCollection.getMetadataRecord().data.bbox.getBounds();
    }
});
