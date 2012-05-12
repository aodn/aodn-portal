Ext.namespace('Portal.details');

Portal.details.StylePanel = Ext.extend(Ext.Panel, {
    id: 'stylePanel',
    title: 'Styles',
    style: {margin: 5},
    autoHeight: 250,
    autoScroll: true,

    initComponent: function(cfg){
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
                //layout: 'hbox',
                autoScroll:true,
                align: 'stretch',
                items: [{
                    xtype: 'panel',
                    margin: 10,
                    items: [this.legendImage]
                }
                ]
            }
        ];

        Portal.details.StylePanel.superclass.initComponent.call(this);
    },

    makeCombo: function() {
        var tpl = '<tpl for="."><div class="x-combo-list-item"><p>{displayText}</p></div></tpl>';
        var fields;

        tpl = '<tpl for="."><div class="x-combo-list-item"><p>{displayText}</p><img  src="{displayImage}" /></div></tpl>';
        fields = [{
            name: 'myId'
        },{
            name: 'displayText'
        },{
            name: 'displayImage'
        }];

        var valueStore  = new Ext.data.ArrayStore({
            autoDestroy: true,
            itemId: 'style',
            name: 'style',
            fields: fields
        });

        var combo = new Ext.form.ComboBox({
            id: 'styleCombo',
            width: 200,
            fieldLabel: 'style',
            triggerAction: 'all',
            editable : false,
            lazyRender:true,
            mode: 'local',
            store: valueStore,
            emptyText: OpenLayers.i18n('pickAStyle'),
            valueField: 'myId',
            displayField: 'displayText',
            tpl: tpl,
            listeners:{
                scope: this,
                select: function(cbbox, record, index){
                    this.setChosenStyle(record);
                }
            }
        });

        return combo;
    },

    setChosenStyle: function(record) {
        if (this.selectedLayer.originalWMSLayer == undefined) {
            // its a standard WMS layer
            this.selectedLayer.mergeNewParams({
                styles : record.get('displayText')
            });

            // store the default style
            this.selectedLayer.params.STYLES = record.get('myId');
            this.refreshLegend(this.selectedLayer);
        }
        else {
            // its an animated openlayers image
            // set the style on the original layer. the style will 'stick' to both
            this.selectedLayer.originalWMSLayer.params.STYLES = record.get('displayText');
            addNCWMSLayer(this.selectedLayer);
        }
    },

    setSelectedLayer: function(layer){
        this.selectedLayer = layer;
    },

    updateStyles: function() {

        var data = new Array();
        this.styleCombo.hide();

        if(this.selectedLayer.server.type.search("NCWMS") > -1)  {
            this.ncwmsColourScalePanel.makeNcWMSColourScale(this.selectedLayer);
        }
        else{
            this.ncwmsColourScalePanel.hide();
        }

        //var supportedStyles = layer.metadata.supportedStyles;
         // for WMS layers that we have scanned
        if(this.selectedLayer.allStyles != undefined) {

            // populate 'data' for the style options dropdown
            var styles = this.selectedLayer.allStyles.split(",");
            // do something if the user has more than one option
            if (styles.length > 1) {

                for(var j = 0; j < styles.length; j++)  {
                    var params = {
                        layer: this.selectedLayer,
                        colorbaronly: true
                    };
                    // its a ncwms layer
                    if(this.selectedLayer.server.type.search("NCWMS") > -1)  {
                        var s = styles[j].split("/");
                        // if forward slash is found it is in the form  [type]/[palette]
                        // we only care about the palette part
                        s = (s.length > 1) ? s[1] : styles[j];
                        params.palette = s;
                    }
                    else {
                        params.style = styles[j];
                    }

                    var imageUrl = this.buildGetLegend(params);
                    data.push([styles[j] , styles[j], imageUrl ]);
                }
            }
        }


        if (data.length > 0) {
            // populate the stylecombo picker
            this.styleCombo.store.loadData(data);
            // change the displayed data in the style picker
            this.styleCombo.show();
        }
        this.refreshLegend(this.selectedLayer);

    },
    // full legend shown in layer option. The current legend
    refreshLegend: function(layer) {
         var style = layer.params.STYLES;

         var params = {
             layer: layer,
             colorbaronly: false
         };

         // its a ncwms layer send 'palette'
         if(layer.server.type.search("NCWMS") > -1)  {
             var s = style.split("/");
             // if forward slash is found it is in the form  [type]/[palette]
             // we only care about the palette part
             s = (s.length > 1) ? s[1] : style;
             params.palette = s;
         }
         else {
             params.style = style;
         }
         var url = this.buildGetLegend(params) ;

         var img = Ext.getCmp('legendImage');
         this.legendImage.setUrl(url);
         this.legendImage.show();
         // dont worry if the form is visible here
         this.styleCombo.setValue(style);
    },
    // builds a getLegend image request for the combobox form and the selected palette
    buildGetLegend: function(params)   {

         var url = "";
         var useProxy = false;

         var layer = params.layer;
         var colorbaronly= params.colorbaronly;
         var palette = params.palette;
         var style = params.style;

         // if this is an animated image then use the originals details
         // the params object is not set for animating images
         // the layer.url is for the whole animated gif
         if (layer.originalWMSLayer != undefined) {
             layer.params = layer.originalWMSLayer.params;
             if (layer.originalWMSLayer.cache === true) {
                  url = layer.originalWMSLayer.server.uri;
                  useProxy = true;
             }
             else {
                 url = layer.originalWMSLayer.url;
             }

         }
         else {
             if (layer.cache === true) {
                  url = layer.server.uri;
                  useProxy = true;
             }
             else {
                 url = layer.url;
             }
         }

         var opts = "";

         // thisPalette used for once off. eg combobox picker
         if (palette != undefined) {
             opts += "&PALETTE=" + palette;
          }

         if (style != undefined) {
             opts += "&STYLE=" + style;
         }

         if (colorbaronly) {
             opts += "&LEGEND_OPTIONS=forceLabels:off";
             opts += "&COLORBARONLY=" + colorbaronly;
         }
         else {

             opts += "&LEGEND_OPTIONS=forceLabels:on";
         }


         if(layer.params.COLORSCALERANGE != undefined)
         {
             if(url.contains("COLORSCALERANGE"))  {
                 url = url.replace(/COLORSCALERANGE=([^\&]*)/, "");
             }
             opts += "&COLORSCALERANGE=" + layer.params.COLORSCALERANGE;

         }

         if (useProxy) {
             // FORMAT here is for the proxy, so that it knows its a binary image required
             url = proxyCachedURL+ encodeURIComponent(url) +  "&";
         }
         else {
             // see if this url already has some parameters on it
             if(url.contains("?"))  {
                 url +=  "&" ;
             }
             else {
                 url +=  "?" ;
             }
         }

         opts += "&REQUEST=GetLegendGraphic"
             + "&LAYER=" + layer.params.LAYERS
             + "&FORMAT=" + layer.params.FORMAT;

         // strip off leading '&'
         opts = opts.replace(/^[&]+/g,"");
         url += opts;

         return url;
     }
});