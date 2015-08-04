/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.LayerControlPanel = Ext.extend(Ext.Container, {

    initComponent: function() {
        this.opacitySlider = new Portal.common.LayerOpacitySliderFixed({
            layer: new OpenLayers.Layer("Dummy Layer"),
            keyIncrement: 10,
            increment: 5,
            minValue: 20, // minimum visibility for the current layer is 20%
            maxValue: 100,
            aggressive: true,
            width: 175,
            isFormField: true,
            inverse: false,
            fieldLabel: OpenLayers.i18n('Opacity'),
            plugins: new GeoExt.LayerOpacitySliderTip({
                template: '<div class="opacitySlider" >Opacity: {opacity}%</div>'
            })
        });

        // Put in container so that we see the label.
        this.opacitySliderContainer = new Ext.Panel({
            layout: 'form',
            items: [ this.opacitySlider ]
        });

        this.layerVisibilityCheckbox = new Ext.form.Checkbox({
            value: true,
            boxLabel: OpenLayers.i18n('showMapLayer'),
            checked: true,
            listeners: {
                scope: this,
                check: this._visibilityButtonChecked
            }
        });

        this.zoomToLayer = new Ext.ux.Hyperlink({
            text: OpenLayers.i18n('zoomToDataCollection'),
            listeners: {
                scope: this,
                click: this._zoomToLayer
            }
        });

        this.items = [
            this.opacitySliderContainer,
            this.layerVisibilityCheckbox,
            this.zoomToLayer,
        ];

        Portal.details.LayerDetailsPanel.superclass.initComponent.call(this);

        this._initWithLayer();
    },

    _initWithLayer: function() {
        //according to bug #1582, must set the layer for the opacity slider after the container has been shown
        this.opacitySlider.setLayer(this.layer);
    },

    _visibilityButtonChecked: function(obj, val) {
        var layer = this.map.getLayersBy("id", this.layer.id)[0];
        layer.setVisibility(val);
    },

    _zoomToLayer: function() {
        this.map.mapPanel.zoomToLayer(this.layer);
    }
});
