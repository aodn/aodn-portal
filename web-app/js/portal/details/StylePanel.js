/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.StylePanel = Ext.extend(Ext.Container, {

    initComponent: function() {

        this.legendImage = new GeoExt.LegendImage({
            ctCls: 'legendImage'
        });

        this.ncwmsScaleRangeControls = new Portal.details.NcwmsScaleRangeControls({
            dataCollection: this.dataCollection
        });
        this.ncwmsScaleRangeControls.on('colourScaleUpdated', this.refreshLegend, this);

        var layer = this.dataCollection.getSelectedLayer();

        this.styleCombo = this.makeCombo(layer);

        this.items = [
            this.styleCombo,
            this.ncwmsScaleRangeControls,
            {
                xtype: "panel",
                autoWidth: true,
                items: [this.legendImage]
            }
        ];

        Portal.details.StylePanel.superclass.initComponent.call(this);

        this._initWithLayer(layer);
        this._attachEvents(layer);
    },

    makeCombo: function(layer) {
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
                select: function(cbbox, record) {
                    this.setChosenStyle(layer, record);
                }
            }
        });
    },

    _initWithLayer: function(layer) {

        this.styleCombo.hide();

        if (layer.isNcwms()) {
            this.ncwmsScaleRangeControls.loadScaleFromLayer();
        }
        else {
            this.ncwmsScaleRangeControls.hide();
        }

        this.refreshLegend(layer);
    },

    _attachEvents: function(layer) {

        layer.events.on({
            'stylesloaded': this._stylesLoaded,
            scope: this
        });
    },

    _stylesLoaded: function(layer) {

        var styleData = this._processStyleData(layer);

        if (styleData.length > 1) {
            this.styleCombo.store.loadData(styleData);
            this.styleCombo.setValue(layer.defaultStyle);
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

    setChosenStyle: function(layer, record) {

        var styleName = record.get('styleName');

        layer.mergeNewParams({
            styles: styleName
        });

        // Params should already have been changed, but legend doesn't update if we don't do this...
        layer.params.STYLES = styleName;
        this.refreshLegend(layer);
    },

    refreshLegend: function() {

        // get openlayers style as string
        var layer = this.dataCollection.getSelectedLayer();
        var styleName = layer.params.STYLES;
        var palette = this._getPalette(layer, styleName);
        var url = this.buildGetLegend(layer, styleName, palette, false);

        this.legendImage.setUrl(url);
        this.legendImage.show();
        // dont worry if the form is visible here
        this.styleCombo.setValue(styleName);
    },

    // builds a getLegend image request for the combobox form and the selected palette
    buildGetLegend: function(layer, style, palette, colorBarOnly) {

        var url = layer.url;
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
