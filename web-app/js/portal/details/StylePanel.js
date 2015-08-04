/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.StylePanel = Ext.extend(Ext.Container, {
    constructor: function(cfg) {
        this.layer = cfg.layer;

        Portal.details.StylePanel.superclass.constructor.call(this, cfg);

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

        this.ncwmsColourScalePanel = new Portal.details.NCWMSColourScalePanel();
        this.ncwmsColourScalePanel.on('colourScaleUpdated', this.refreshLegend, this);

        this.styleCombo = this.makeCombo();

        this.items = [
            this.styleCombo,
            this.ncwmsColourScalePanel,
            {
                xtype: "panel",
                autoWidth: true,
                items: [this.legendImage]
            }
        ];

        Portal.details.StylePanel.superclass.initComponent.call(this);

        this._initWithLayer();
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
    }
});
