Ext.namespace('Portal.details');

Portal.details.StylePanel = Ext.extend(Ext.Container, {

    initComponent: function() {

        this._createControls();
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

        this._initWithLayer();

        this.dataCollection.getLayerSelectionModel().on('selectedlayerchanged', this._initWithLayer, this);
    },

    _createControls: function() {

        var tpl = '<tpl for="."><div class="x-combo-list-item"><p>{styleName}</p><img src="{displayImage}" /></div></tpl>';
        var styleStore = new Ext.data.ArrayStore({
            autoDestroy: true,
            itemId: 'style',
            name: 'style',
            fields: [
                { name: 'styleName' },
                { name: 'displayImage' }
            ]
        });

        this.styleCombo = new Ext.form.ComboBox({
            width: 250,
            fieldLabel: 'style',
            triggerAction: 'all',
            editable: false,
            lazyRender: true,
            hidden: true,
            disabled: true,
            emptyText: OpenLayers.i18n('defaultTextStylesPicker'),
            mode: 'local',
            store: styleStore,
            valueField: 'styleName',
            displayField: 'styleName',
            tpl: tpl,
            listeners: {
                'select': this.setChosenStyle,
                scope: this
            }
        });

        this.ncwmsScaleRangeControls = new Portal.details.NcWmsScaleRangeControls({
            dataCollection: this.dataCollection,
            listeners: {
                'colourScaleUpdated': this.refreshLegend,
                scope: this
            }
        });

        this.legendImage = new GeoExt.LegendImage({
            ctCls: 'legendImage',
            hidden: true
        });
    },

    _initWithLayer: function() {

        var layer = this.dataCollection.getLayerSelectionModel().getSelectedLayer();

        if (layer.isNcwms()) {
            this.ncwmsScaleRangeControls.loadScaleFromLayer();
        }
        else {
            this.ncwmsScaleRangeControls.hide();
        }

        layer.events.on({
            'stylesloaded': this._stylesLoaded,
            scope: this
        });

        this.refreshLegend();
    },

    _stylesLoaded: function(layer) {

        var styleData = this._processStyleData(layer);

        var picker = this.styleCombo;

        if (styleData.length > 1) {
            picker.store.loadData(styleData);
            picker.setValue(layer.defaultStyle);
            picker.collapse();
            picker.enable();
            picker.show();
        }
        else {
            picker.hide();
        }

        this.refreshLegend();
    },

    _processStyleData: function() {
        var data = [];
        var layer = this.dataCollection.getLayerSelectionModel().getSelectedLayer();

        Ext.each(layer.styles, function(style) {
            var palette = style.palette;
            var styleName = style.name + '/' + palette;
            var imageUrl = this.buildGetLegend(layer, styleName, palette, true);

            data.push([styleName, imageUrl]);
        }, this);

        return data;
    },

    setChosenStyle: function(styleCombo, record) {
        var styleName = record.get('styleName');
        this.dataCollection.getLayerAdapter().setStyle(styleName);
        this.refreshLegend();

        trackLayerControlUsage(OpenLayers.i18n('layerControlTrackingActionStyle'), styleName, this.dataCollection.getTitle());
    },

    refreshLegend: function() {

        var styleName = this.dataCollection.getLayerAdapter().getStyle() || '';
        var palette = this._getPalette(styleName);

        var layer = this.dataCollection.getLayerSelectionModel().getSelectedLayer();
        var url = this.buildGetLegend(layer, styleName, palette, false);

        this.legendImage.setUrl(url);
        this.legendImage.show();
        this.styleCombo.setValue(styleName);
    },

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

        if (layer.extraLayerInfo && layer.extraLayerInfo.numColorBands) {
            opts += "&NUMCOLORBANDS=" + layer.extraLayerInfo.numColorBands;
        }

        // see if this url already has some parameters on it
        if (url.contains("?")) {
            url += "&";
        }
        else {
            url += "?";
        }

        if (layer.isNcwms()) {
            opts += "&SERVICE=ncwms"
        } else {
            opts += "&SERVICE=WMS"
        }

        opts += "&REQUEST=GetLegendGraphic"
             +  "&LAYER=" + encodeURIComponent(layer.params.LAYERS)
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

    _getPalette: function(style) {

        // Use palette if title is in the form [type]/[palette]
        var parts = style.split("/");
        if (parts.length > 1) {
            return parts[1];
        }

        return style;
    }
});
