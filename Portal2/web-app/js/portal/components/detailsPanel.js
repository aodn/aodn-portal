var styleCombo;
var detailsPanel;
var opacitySlider;
var detailsPanelLayer;
var legendImage;
var dimension;
var dimensionPanel;
var ncWMSColourScalePanel;
var colourScaleMin;
var colourScaleMax;


function initDetailsPanel()
{
    legendImage = new GeoExt.LegendImage();
    ncWMSColourScalePanel = new Ext.Panel();
    colourScaleMin = new Ext.form.TextField({
        fieldLabel: "min",
        enableKeyEvents: true,
        listeners: {
            keydown: function(textfield, event){
                updateScale(textfield, event);
            }
        }
    });

    colourScaleMax = new Ext.form.TextField({
        fieldLabel: "max",
        enableKeyEvents: true,
        listeners: {
            keydown: function(textfield, event){
                updateScale(textfield, event);
            }
        }
    });

    ncWMSColourScalePanel.add(colourScaleMin, colourScaleMax);

// create a separate slider bound to the map but displayed elsewhere
    opacitySlider = new GeoExt.LayerOpacitySlider({
        id: "opacitySlider",
        layer: layer,
        width: 200,
        inverse: false,
        fieldLabel: "opacity",
        plugins: new GeoExt.LayerOpacitySliderTip({template: '<div>Opacity: {opacity}%</div>'})
    });


    // create the styleCombo instance
    styleCombo = makeCombo("styles");
    

    detailsPanel = new Ext.Panel({
        title: 'Layer Options'
        ,region: 'south'
        ,border: false
        ,split: true
        ,height: 100
        ,autoScroll: true
        ,collapsible: true
        ,items: [
               opacitySlider, styleCombo, legendImage
         ]
    });
}

function updateStyles(node)
{
    var styles = node.layer.metadata.styles;

    detailsPanelLayer = node.layer;
    var styleList = styleCombo.store;
    var data = new Array();
    styleList.removeAll();
    styleCombo.clearValue();

    for(var i = 0;i < styles.length; i++)
    {
        data.push([i, styles[i].legend.href, styles[i].name]);
    }

    styleList.loadData(data);

    if(detailsPanelLayer.params.STYLES != '')
    {
        for(var j = 0; j < styles.length; j++)
        {
            if(styles[j].name == detailsPanelLayer.params.STYLES)
            {
                legendImage.setUrl(styles[j].legend.href);
                styleCombo.select(j);
            }
        }
    }
    else
    {
        //use some default thingy
        legendImage.setUrl(styles[0].legend.href);
    }
}

function updateDimensions(node)
{
    var dims = node.layer.metadata.dimensions;
    if(dims != undefined)
    {
        for(var d in dims)
        {
            if(dims[d].values != undefined)
            {
                var valList = dims[d].values;
                var dimStore, dimData;

                dimData = new Array();

                dimCombo = makeCombo(d);
                dimStore = dimCombo.store;
                dimStore.removeAll();

                for(var j = 0; j < valList.length; j++)
                {
                    //trimming function thanks to
                    //http://developer.loftdigital.com/blog/trim-a-string-in-javascript
                    var trimmed = valList[j].replace(/^\s+|\s+$/g, '') ;
                    dimData.push([j, trimmed, trimmed]);
                }

                dimStore.loadData(dimData);
                detailsPanel.add(dimCombo);
                detailsPanel.add(ncWMSColourScalePanel);
                detailsPanel.doLayout();
            }
            
        }
    }
}

function updateDetailsPanel(node)
{
    updateStyles(node);
    updateDimensions(node);
    detailsPanel.text = detailsPanelLayer.name;
    detailsPanel.setTitle("Layer Options: " + detailsPanelLayer.name);
    opacitySlider.setLayer(detailsPanelLayer);

    if(detailsPanelLayer.params.SERVERTYPE == "NCWMS")
    {
        makeNcWMSColourScale();
    }
}

function makeNcWMSColourScale()
{
    //http://ncwms.emii.org.au/ncWMS/wms?item=layerDetails&layerName=ACORN_raw_data_SAG%2FSPEED&time=2006-09-19T12%3A00%3A00.000Z&request=GetMetadata
    /*{"units":"m/sec","bbox":["146.80064392089844","-43.80047607421875","163.8016815185547","-10.000572204589844"],
     *"scaleRange":["-1.398761","1.249144"],"numColorBands":254,"supportedStyles":["boxfill"],"zaxis":{"units":"meters","positive":false,"values":[-5]},"datesWithData":{"2006":{"8":[1,2,3,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]}},"nearestTimeIso":"2006-09-19T12:00:00Z","timeAxisUnits":"julian","moreInfo":"","copyright":"&lt;div class=&#039;featurewhite&#039;&gt;   &lt;h4 class=&#039;getfeatureTitle&#039;&gt;Informd Storm Bay model output &lt;/h4&gt; &lt;p&gt;This project aims to provide near real-time hydrodynamic modelling of the south-east Tasmania, including the Huon and Derwent Estuaries, DEntrecasreaux Channel and Storm Bay. It is anticipated that input data provided by a sensor network deployed throughout the  region will be used by the hydrodynamic model in a data assimilating capacity. The sensors would provide sea-level, salinity and temperature data in near real-time, while the  hydrodynamic modelling system (SHOC) would then provide near real-time fields of currents, sea-level, water temperature and salinity. &lt;br&gt;For more information see the metadata links  &lt;/p&gt; &lt;p&gt;Contact: &lt;a href=&#039;mailto:Simon.Allen@csiro.au&#039;&gt;Simon.Allen@csiro.au&lt;/a&gt;&lt;br&gt; &lt;/p&gt;      &lt;a title=&#039;http://imosmest.emii.org.au/geonetwork/srv/en/metadata.show?uuid=9dfc847d-ce3b-436a-a15f-02b678829eed&#039; class=&#039;h3&#039; rel=&#039;external&#039; target=&#039;_blank&#039; href=&#039;http://imosmest.emii.org.au/geonetwork/srv/en/metadata.show?uuid=9dfc847d-ce3b-436a-a15f-02b678829eed&#039;&gt; Link to the IMOS metadata record&lt;/a&gt;&lt;br&gt;  &lt;a title=&#039;&#039; class=&#039;h3&#039; rel=&#039;external&#039; target=&#039;_blank&#039; href=&#039;http://ramadda.aodn.org.au/repository/entry/show/output:data.opendap/entryid:synth:6b43cb54-11b5-4af4-a7be-a7b5a76e8476:L3N0b3JtX2NmX25ydF90bXAubmM=/storm_cf_nrt_tmp.nc/dodsC/entry.html&#039;&gt;Data view and download on opendap&lt;/a&gt;&lt;br&gt; &lt;a title=&#039;&#039; class=&#039;h3&#039; rel=&#039;external&#039; target=&#039;_blank&#039; href=&#039;http://ramadda.aodn.org.au/repository/entry/show/Data+Repository/Model+Output/Storm+Bay?entryid=e55bd261-db1c-44ed-9282-06f8e625f4bf&#039;&gt;Data download and Info on ramada&lt;/a&gt;&lt;br&gt; &lt;a title=&#039;&#039; class=&#039;h3&#039; rel=&#039;external&#039; target=&#039;_blank&#039; href=&#039;http://ramadda.aodn.org.au/repository/entry/show/storm_cf_nrt_tmp.zip?entryid=synth%3A6b43cb54-11b5-4af4-a7be-a7b5a76e8476%3AL3N0b3JtX2NmX25ydF90bXAubmM%3D&amp;output=zip.zip&#039;&gt;Data download as netCDF&lt;/a&gt;&lt;br&gt; &lt;!--a href=&#039;http://ramadda.aodn.org.au/repository/entry/show/storm_cf_nrt_tmp.zip?entryid=synth%3A6b43cb54-11b5-4af4-a7be-a7b5a76e8476%3AL3N0b3JtX2NmX25ydF90bXAubmM%3D&amp;output=zip.zip&#039;  target=&#039;_blank&#039;  rel=&#039;external&#039; class=&#039;h3&#039; title=&#039;&#039;&gt;Data download as netCDF&lt;/a&gt;&lt;BR--&gt;    &lt;/div&gt;",
     *"palettes":["redblue","alg","ncview","greyscale","alg2","occam","rainbow","sst_36","ferret","occam_pastel-30"],"defaultPalette":"rainbow","logScaling":false}*/
     alert(detailsPanelLayer.url + "item=layerDetails&request=GetMetadata&layerName=" + detailsPanelLayer.params.LAYERS);

     if(detailsPanelLayer.params.colourScale != undefined)
     {
         alert("already defined!");
     }
     else
     {
         alert("grabbing it from the server!")
         Ext.Ajax.request({
            url: proxyURL+encodeURIComponent(detailsPanelLayer.url + "?item=layerDetails&request=GetMetadata&layerName=" + detailsPanelLayer.params.LAYERS),
            success: function(resp){
                var metadata = Ext.util.JSON.decode(resp.responseText);
                colourScaleMin.setValue(metadata.scaleRange[0]);
                colourScaleMax.setValue(metadata.scaleRange[1]);
            }
         });
     }

     
}

function makeCombo(type)
{
    var valueStore  = new Ext.data.ArrayStore({
        autoDestroy: true
        ,itemId: type
        ,name: type
        ,fields: [
                ,
                {name: 'myId'},
                {name: 'displayText'}
            ]
        });

    var combo = new Ext.form.ComboBox({
        fieldLabel: type
        ,triggerAction: 'all'
        ,lazyRender:true
        ,mode: 'local'
        ,store: valueStore
        ,valueField: 'myId'
        ,displayField: 'displayText'
        ,listeners:{
            select: function(cbbox, record, index){
                if(cbbox.fieldLabel == 'styles')
                {
                    detailsPanelLayer.mergeNewParams({
                        styles : record.get('displayText')
                    });
                }
                else if(cbbox.fieldLabel == 'time')
                {
                    detailsPanelLayer.mergeNewParams({
                        time : record.get('myId')
                    });
                }
                else if(cbbox.fieldLabel == 'elevation')
                {
                    detailsPanelLayer.mergeNewParams({
                        elevation : record.get('myId')
                    });
                }
            }
        }
    });
    
    return combo;
}

function updateScale(textfield, event)
{
    //return key
    if(event.getKey() == 13)
    {
        detailsPanelLayer.mergeNewParams({
            COLORSCALERANGE: colourScaleMin.getValue() + "," + colourScaleMax.getValue()
        });
        //COLORSCALERANGE=9.405%2C50&NUMCOLORBANDS=254
        //alert(colourScaleMin.getValue());
        //alert(colourScaleMax.getValue());
    }
}
