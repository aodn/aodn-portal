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
    var legendURL = "";

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
                legendURL = styles[j].legend.href;
                styleCombo.select(j);
            }
        }
    }
    else
    {
        //use some default thingy
        legendURL = styles[0].legend.href;
    }

    refreshLegend(legendURL);
}


function refreshLegend(url)
{
    if(detailsPanelLayer.params.COLORSCALERANGE != undefined)
    {
        if(url.contains("COLORSCALERANGE"))
        {
            url = url.replace(/COLORSCALERANGE=([^\&]*)/, "COLORSCALERANGE=" + detailsPanelLayer.params.COLORSCALERANGE);
        }
        else
        {
            url += "&COLORSCALERANGE=" + detailsPanelLayer.params.COLORSCALERANGE;
        }
    }

    
    legendImage.setUrl(url);
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
    //Example: http://ncwms.emii.org.au/ncWMS/wms?item=layerDetails&layerName=ACORN_raw_data_SAG%2FSPEED&time=2006-09-19T12%3A00%3A00.000Z&request=GetMetadata
    
     if(detailsPanelLayer.params.colourScale == undefined)
     {
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

        refreshLegend(legendImage.url);
    }
}
