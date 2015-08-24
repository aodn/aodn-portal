/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.LayerControlPanel = Ext.extend(Ext.Container, {

    initComponent: function() {
        this.items = [];

        this.layer = this.dataCollection.getLayerAdapter();

        var layerSelector = this._newLayerSelectorComponent();
        if (layerSelector) {
            this.items.push(layerSelector, { xtype: 'spacer', height: 10 });
        }

        this.items.push(this._newOpacitySlider());
        this.items.push(this._newVisibilityCheckbox());
        this.items.push(this._newZoomToDataButton());

        Portal.details.LayerControlPanel.superclass.initComponent.call(this);
    },

    _newOpacitySlider: function() {
        // Put slider in container with form layout so that we see the label.
        return new Ext.Panel({
            layout: 'form',
            items: [
                new Portal.common.LayerOpacitySliderFixed({
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
                    })
                })
            ]
        });
    },

    _newVisibilityCheckbox: function() {
        return new Ext.form.Checkbox({
            value: true,
            boxLabel: OpenLayers.i18n('showMapLayer'),
            checked: true,
            listeners: {
                scope: this,
                check: this._visibilityButtonChecked
            }
        });
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
        if (this.dataCollection.getLayerState().getLayers().length <= 1) {
            return undefined;
        }

        var items = [];
        Ext.each(this.dataCollection.getLayerState().getLayers(), function(openLayer) {
            items.push({
                boxLabel: openLayer.wmsName,
                name: 'selectedLayer',
                checked: openLayer == this.dataCollection.getLayerState().getSelectedLayer(),
                layer: openLayer
            });
        }, this);

        return new Ext.form.RadioGroup({
            columns: 1,
            items: items,
            listeners: {
                'scope': this,
                'change': this._radioGroupChanged
            }
        });
    },

    _radioGroupChanged: function(radioGroup, checkedRadio) {
        this.dataCollection.getLayerState().setSelectedLayer(checkedRadio.layer);

         trackLayerControlUsage(
             'changeLayerTrackingAction',
             this.dataCollection.getTitle(),
             checkedRadio.layer.wmsName
         );
    },

    _visibilityButtonChecked: function(obj, val) {
        trackLayerControlUsage('layerControlTrackingActionVisibility', val ? "on" : "off", this.dataCollection.getTitle());
        this.layer.setVisibility(val);
    },

    _zoomToLayer: function() {
        this.map.mapPanel.zoomToLayer(this.layer);
    }
});
