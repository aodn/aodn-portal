/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.LayerDetailsPanel = Ext.extend(Ext.Container, {

    constructor: function(cfg) {
        this.layer = cfg.layer;

        var config = Ext.apply({
            title: OpenLayers.i18n('layerDetailsPanelTitle')
        }, cfg);

        Portal.details.LayerDetailsPanel.superclass.constructor.call(this, config);
    },

    initComponent: function() {

        //create an opacity slider
        //usability bug #624 where the opacity slider thumb sits at the minimum slider value instead of the maximum one
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

        //create a container for the opacity slider, and add the opacity slider object to the container
        this.opacitySliderContainer = new Ext.Panel({
            layout: 'form',
            items: [this.opacitySlider]
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

        //add the opacity slider container, style combo picker and colour scale panel to the Styles panel
        this.items = [
            this._makeSpacer(),
            this.opacitySliderContainer,
            this.layerVisibilityCheckbox,
            this.zoomToLayer,
            this._makeSpacer(),
            new Portal.details.StylePanel({
                layer: this.layer
            })
        ];

        Portal.details.LayerDetailsPanel.superclass.initComponent.call(this);

        this._initWithLayer();
    },

    _makeSpacer: function() {
        return new Ext.Spacer({
            height: 10
        });
    },

    _initWithLayer: function() {
        this.opacitySliderContainer.hide();
        this.opacitySliderContainer.doLayout();
        this.opacitySliderContainer.show();
        //according to bug #1582, must set the layer for the opacity slider after the container has been shown
        this.opacitySlider.setLayer(this.layer);

        // #2165 - need to "doLayout", since showing/hiding components above (or else, the opacity
        // slider won't be rendered properly, for example).
        this.doLayout();
    },

    _visibilityButtonChecked: function(obj, val) {
        var layer = this.map.getLayersBy("id", this.layer.id)[0];
        layer.setVisibility(val);
    },

    _zoomToLayer: function() {
        this.map.mapPanel.zoomToLayer(this.layer);
    }
});
