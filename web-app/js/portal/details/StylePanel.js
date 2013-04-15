/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.StylePanel = Ext.extend(Ext.Panel, {

    constructor:function (cfg) {
        var config = Ext.apply({
            id:'stylePanel',
            title:'Styles',
            style:{ margin:5 },
            autoHeight:250,
            autoScroll:true
        }, cfg);

        Portal.details.StylePanel.superclass.constructor.call(this, config);
    },

    initComponent:function (cfg) {
        this.legendImage = new GeoExt.LegendImage({
            id:'legendImage',
            imgCls:'legendImage',
            flex:1
        });

        this.ncwmsColourScalePanel = new Portal.details.NCWMSColourScalePanel();
        this.styleCombo = this.makeCombo();

        this.items = [
            this.styleCombo,
            this.ncwmsColourScalePanel,
            {
                xtype:'panel',
                //layout: 'hbox',
                autoScroll:true,
                align:'stretch',
                items:[
                    {
                        xtype:'panel',
                        margin:10,
                        items:[this.legendImage]
                    }
                ]
            }
        ];

        Portal.details.StylePanel.superclass.initComponent.call(this);
    },

    makeCombo:function () {
        var tpl = '<tpl for="."><div class="x-combo-list-item"><p>{displayText}</p><img  src="{displayImage}" /></div></tpl>';
        var fields;

        fields = [
            {
                name:'myId'
            },
            {
                name:'displayText'
            },
            {
                name:'displayImage'
            }
        ];

        var valueStore = new Ext.data.ArrayStore({
            autoDestroy:true,
            itemId:'style',
            name:'style',
            fields:fields
        });

        var combo = new Ext.form.ComboBox({
            id:'styleCombo',
            width:200,
            fieldLabel:'style',
            triggerAction:'all',
            editable:false,
            lazyRender:true,
            mode:'local',
            store:valueStore,
            emptyText:OpenLayers.i18n('pickAStyle'),
            valueField:'myId',
            displayField:'displayText',
            tpl:tpl,
            listeners:{
                scope:this,
                select:function (cbbox, record, index) {
                    this.setChosenStyle(record);
                }
            }
        });

        return combo;
    },

    setChosenStyle:function (record) {
        this.selectedLayer.mergeNewParams({
            styles:record.get('myId')
        });
        // Params should already have been changed, but legend doesn't update if we don't do this...
        this.selectedLayer.params.STYLES = record.get('myId');
        this.refreshLegend(this.selectedLayer);
    },

    update:function (layer, show, hide, target) {

        this.selectedLayer = layer;

        show.call(target, this);

        var data = new Array();
        this.styleCombo.hide();

        if (this.selectedLayer.isNcwms()) {
            this.ncwmsColourScalePanel.makeNcWMSColourScale(this.selectedLayer);
        }
        else {
            this.ncwmsColourScalePanel.hide();
        }

        //var supportedStyles = layer.metadata.supportedStyles;
        // for WMS layers that we have scanned
        if (this.selectedLayer.allStyles != undefined
            && this.selectedLayer.allStyles.length > 1) {

            // populate 'data' for the style options dropdown

            var allStyles = this.selectedLayer.allStyles;

            for (var j = 0; j < allStyles.length; j++) {
                var params = {
                    layer:this.selectedLayer,
                    colorbaronly:true
                };
                // its a ncwms layer
                if (this.selectedLayer.isNcwms()) {
                    var s = allStyles[j].title.split("/");
                    // if forward slash is found it is in the form  [type]/[palette]
                    // we only care about the palette part
                    s = (s.length > 1) ? s[1] : allStyles[j].title;
                    params.palette = s;
                }
                params.style = allStyles[j].name;


                var imageUrl = this.buildGetLegend(params);

                if (params.palette != undefined) {
                    allStyles[j].title = params.palette;
                }
                var label =  (allStyles[j].title != "") ? allStyles[j].title : allStyles[j].name;

                data.push([allStyles[j].name , label , imageUrl ]);
            }
        }

        if (data.length > 0) {
            // populate the stylecombo picker
            this.styleCombo.store.loadData(data);
            // change the displayed data in the style picker
            this.styleCombo.collapse();
            this.styleCombo.show();
        }
        this.refreshLegend(this.selectedLayer);
    },

    getStyleFromName : function (layer,name)   {

        // get matching Style from layer.allStyles
        var style = {};
        if (layer.allStyles != undefined && layer.allStyles.length > 1) {
            for (var j = 0; j < layer.allStyles.length; j++) {
                if  (layer.allStyles[j].name == name) {
                    style =  layer.allStyles[j];
                }
            }
        }
        return style;

    },

    // full legend shown in layer option. The current legend
    refreshLegend:function (layer) {

        // get openlayers style as string
        var styleName = layer.params.STYLES;
        var style =  this.getStyleFromName(layer,styleName);


        var params = {
            layer:layer,
            colorbaronly:false,
            style: styleName
        };

        // its a ncwms layer send 'palette'
        if (layer.isNcwms()) {
            var s = styleName.split("/");
            // if forward slash is found it is in the form  [type]/[palette]
            // we only care about the palette part
            s = (s.length > 1) ? s[1] : styleName;
            params.palette = s;
        }

        var url = this.buildGetLegend(params);

        var img = Ext.getCmp('legendImage');
        this.legendImage.setUrl(url);
        this.legendImage.show();
        // dont worry if the form is visible here
        this.styleCombo.setValue(styleName);

    },
    // builds a getLegend image request for the combobox form and the selected palette
    buildGetLegend:function (params) {

        var url = "";
        var useProxy = false;

        var layer = params.layer;
        var colorbaronly = params.colorbaronly;
        var palette = params.palette;


        if (layer.cache === true)  {
            url = layer.server.uri;
            useProxy = true;
        }
        else   {
            url = layer.url;
        }


        var opts = "";

        // thisPalette used for once off. eg combobox picker
        if (palette != undefined) {
            opts += "&PALETTE=" + palette;
        }

        if (params.style != "") {
            opts += "&STYLE=" + params.style;
        }

        if (colorbaronly) {
            opts += "&LEGEND_OPTIONS=forceLabels:off";
            opts += "&COLORBARONLY=" + colorbaronly;
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
            + "&LAYER=" + layer.params.LAYERS
            + "&FORMAT=" + layer.params.FORMAT;

        if (layer && layer.server && layer.server.type) {
            var version = layer.server.type.split('-')[1];
            opts += "&VERSION=" + version;
        }

        // strip off leading '&'
        opts = opts.replace(/^[&]+/g, "");
        url += opts;

        return url;
    }
});
