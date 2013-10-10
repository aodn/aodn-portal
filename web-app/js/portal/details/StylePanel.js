/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.StylePanel = Ext.extend(Ext.Panel, {

    constructor: function (cfg) {
        var config = Ext.apply({
            id: 'stylePanel',
            title: 'Styles',
            autoScroll: true,
            style: { margin:5 }
        }, cfg);

        Portal.details.StylePanel.superclass.constructor.call(this, config);
    },

    initComponent:function (cfg) {
        this.legendImage = new GeoExt.LegendImage({
            id: 'legendImage',
            imgCls: 'legendImage',
            flex: 1
        });

        this.ncwmsColourScalePanel = new Portal.details.NCWMSColourScalePanel();
        this.styleCombo = this.makeCombo();

        this.items = [
            this.styleCombo,
            this.ncwmsColourScalePanel,
            {
                xtype: 'panel',
                align: 'stretch',
                items: [
                    {
                        xtype: 'panel',
                        margin: 10,
                        items: [this.legendImage]
                    }
                ]
            }
        ];

        Portal.details.StylePanel.superclass.initComponent.call(this);
    },

    makeCombo:function () {
        var tpl = '<tpl for="."><div class="x-combo-list-item"><p>{displayText}</p><img src="{displayImage}" /></div></tpl>';
        var fields;

        fields = [
            { name: 'myId' },
            { name: 'displayText' },
            { name: 'displayImage' }
        ];

        var valueStore = new Ext.data.ArrayStore({
            autoDestroy: true,
            itemId: 'style',
            name: 'style',
            fields: fields
        });

        return new Ext.form.ComboBox({
            id: 'styleCombo',
            width: 200,
            fieldLabel: 'style',
            triggerAction: 'all',
            editable: false,
            lazyRender: true,
            mode: 'local',
            store: valueStore,
            emptyText: OpenLayers.i18n('pickAStyle'),
            valueField: 'myId',
            displayField: 'displayText',
            tpl: tpl,
            listeners: {
                scope: this,
                select: function (cbbox, record, index) {
                    this.setChosenStyle(record);
                }
            }
        });
    },

    setChosenStyle:function (record) {
        this.selectedLayer.mergeNewParams({
            styles: record.get('myId')
        });
        // Params should already have been changed, but legend doesn't update if we don't do this...
        this.selectedLayer.params.STYLES = record.get('myId');
        this.refreshLegend(this.selectedLayer);
    },

    update:function (layer, show, hide, target) {
        this.selectedLayer = layer;

        show.call(target, this);

        this.styleCombo.hide();

        if (layer.isNcwms()) {
            this.ncwmsColourScalePanel.makeNcWMSColourScale(layer);
        }
        else {
            this.ncwmsColourScalePanel.hide();
        }

        var data = this._styleData(layer);

        if (data.length > 0) {
            // populate the stylecombo picker
            this.styleCombo.store.loadData(data);
            // change the displayed data in the style picker
            this.styleCombo.collapse();
            this.styleCombo.show();
        }

        this.refreshLegend(layer);
    },

    _styleData: function (layer) {
        var data = [];
        var allStyles = layer.allStyles;

        if (allStyles != undefined && allStyles.length > 1) {

            for (var j = 0; j < allStyles.length; j++) {

                var title = allStyles[j].title;
                var name = allStyles[j].name;

                var label = (title != "") ? title : name;
                var palette = this._getPalette(layer, title);
                var imageUrl = this.buildGetLegend(layer, name, palette, true);

                data.push([name, label, imageUrl]);
            }
        }

        return data;
    },

    // full legend shown in layer option. The current legend
    refreshLegend: function (layer) {
        // get openlayers style as string
        var styleName = layer.params.STYLES;
        var palette = this._getPalette(layer, styleName);
        var url = this.buildGetLegend(layer, styleName, palette, false);

        this.legendImage.setUrl(url);
        this.legendImage.show();
        // dont worry if the form is visible here
        this.styleCombo.setValue(styleName);
    },

    // builds a getLegend image request for the combobox form and the selected palette
    buildGetLegend: function (layer, style, palette, colorBarOnly) {

        var url = "";
        var useProxy = false;

        if (layer.cache === true) {
            url = layer.server.uri;
            useProxy = true;
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

        if (useProxy) {
            // FORMAT here is for the proxy, so that it knows its a binary image required
            url = proxyCachedURL + encodeURIComponent(url) + "&";
        }
        else {
            // see if this url already has some parameters on it
            if (url.contains("?")) {
                url += "&";
            }
            else {
                url += "?";
            }
        }

        opts += "&REQUEST=GetLegendGraphic"
             +  "&LAYER=" + layer.params.LAYERS
             +  "&FORMAT=" + layer.params.FORMAT;

        if (layer && layer.server && layer.server.type) {
            var version = layer.server.type.split('-')[1];
            opts += "&VERSION=" + version;
        }

        // strip off leading '&'
        opts = opts.replace(/^[&]+/g, "");
        url += opts;

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
