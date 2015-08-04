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

        this._attachEvents();
    },

    _attachEvents: function() {

        this.layer.events.on({
            'stylesloaded': this._stylesLoaded,
            scope: this
        });
    },

    initComponent: function() {

        this.legendImage = new GeoExt.LegendImage({
            ctCls: 'legendImage'
        });

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

        this.ncwmsColourScalePanel = new Portal.details.NCWMSColourScalePanel();
        this.ncwmsColourScalePanel.on('colourScaleUpdated', this.refreshLegend, this);

        this.styleCombo = this.makeCombo();

        //add the opacity slider container, style combo picker and colour scale panel to the Styles panel
        this.items = [
            this._makeSpacer(),
            this.opacitySliderContainer,
            this.layerVisibilityCheckbox,
            this.zoomToLayer,
            this._makeSpacer(),
            this.styleCombo,
            this.ncwmsColourScalePanel,
            {
                xtype: "panel",
                autoWidth: true,
                items: [this.legendImage]
            }
        ];

        Portal.details.LayerDetailsPanel.superclass.initComponent.call(this);

        this._initWithLayer();
    },

    _makeSpacer: function() {
        return new Ext.Spacer({
            height: 10
        });
    },

    makeCombo: function() {
        var tpl = '<tpl for="."><div class="x-combo-list-item"><p>{styleName}</p><img src="{displayImage}" /></div></tpl>';
        var fields;

        fields = [
            { name: 'styleName' },
            { name: 'displayImage' }
        ];

        var valueStore = new Ext.data.ArrayStore({
            autoDestroy: true,
            itemId: 'style',
            name: 'style',
            fields: fields
        });

        return new Ext.form.ComboBox({
            width: 200,
            fieldLabel: 'style',
            triggerAction: 'all',
            editable: false,
            lazyRender: true,
            mode: 'local',
            store: valueStore,
            valueField: 'styleName',
            displayField: 'styleName',
            tpl: tpl,
            listeners: {
                scope: this,
                select: function(cbbox, record, index) {
                    this.setChosenStyle(record);
                }
            }
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

        this.styleCombo.hide();

        if (this.layer.isNcwms()) {
            this.ncwmsColourScalePanel.makeNcWMSColourScale(this.layer);
        }
        else {
            this.ncwmsColourScalePanel.hide();
        }

        this.refreshLegend();
    },

    _stylesLoaded: function() {

        var styleData = this._processStyleData(this.layer);

        if (styleData.length > 1) {
            this.styleCombo.store.loadData(styleData);
            this.styleCombo.setValue(this.layer.defaultStyle);
            this.styleCombo.collapse();
            this.styleCombo.show();
        }
    },

    _processStyleData: function(layer) {
        var data = [];

        Ext.each(layer.styles, function(style) {

            var palette = style.palette;
            var styleName = style.name + '/' + palette;
            var imageUrl = this.buildGetLegend(layer, styleName, palette, true);

            data.push([styleName, imageUrl]);
        }, this);

        return data;
    },

    setChosenStyle: function(record) {

        var styleName = record.get('styleName');

        this.layer.mergeNewParams({
            styles: styleName
        });

        // Params should already have been changed, but legend doesn't update if we don't do this...
        this.layer.params.STYLES = styleName;
        this.refreshLegend();
    },

    refreshLegend: function() {

        // get openlayers style as string
        var styleName = this.layer.params.STYLES;
        var palette = this._getPalette(this.layer, styleName);
        var url = this.buildGetLegend(this.layer, styleName, palette, false);

        this.legendImage.setUrl(url);
        this.legendImage.show();
        // dont worry if the form is visible here
        this.styleCombo.setValue(styleName);
    },

    // builds a getLegend image request for the combobox form and the selected palette
    buildGetLegend: function(layer, style, palette, colorBarOnly) {

        var url = "";

        if (layer.cache === true) {
            url = layer.server.uri;
        }
        else {
            url = layer.url;
        }

        var opts = "";

        // Palette used for once off. eg combobox picker
        if (palette && palette != "") {
            opts += "&PALETTE=" + palette;
        }

        if (style != "") {
            opts += "&STYLE=" + style;
        }

        if (colorBarOnly) {
            opts += "&LEGEND_OPTIONS=forceLabels:off";
            opts += "&COLORBARONLY=" + colorBarOnly;
        }
        else {

            opts += "&LEGEND_OPTIONS=forceLabels:on";
        }

        if (layer.params.COLORSCALERANGE != undefined) {
            if (url.contains("COLORSCALERANGE")) {
                url = url.replace(/COLORSCALERANGE=([^\&]*)/, "");
            }
            opts += "&COLORSCALERANGE=" + layer.params.COLORSCALERANGE;
        }

        // see if this url already has some parameters on it
        if (url.contains("?")) {
            url += "&";
        }
        else {
            url += "?";
        }

        opts += "&REQUEST=GetLegendGraphic"
             +  "&LAYER=" + layer.params.LAYERS
             +  "&FORMAT=" + layer.params.FORMAT;

        if (layer && layer.server && layer.server.wmsVersion) {
            opts += "&VERSION=" + layer.server.wmsVersion;
        }

        // strip off leading '&'
        opts = opts.replace(/^[&]+/g, "");
        url += opts;

        // Proxy request if needed
        url = Portal.utils.Proxy.proxy(url);

        return url;
    },

    _getPalette: function(layer, style) {
        if (layer.isNcwms()) {

            // Use palette if title is in the form [type]/[palette]
            var parts = style.split("/");
            if (parts.length > 1) {

                return parts[1];
            }
            else {

                return style;
            }
        }

        return undefined;
    },

    _visibilityButtonChecked: function(obj, val) {
        var layer = this.map.getLayersBy("id", this.layer.id)[0];
        layer.setVisibility(val);
    },

    _zoomToLayer: function() {
        this.map.mapPanel.zoomToLayer(this.layer);
    }
});
