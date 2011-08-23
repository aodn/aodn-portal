var styleCombo;
var detailsPanel;
var opacitySlider;
var detailsPanelLayer;
var legendImage;
var dimension;
var dimensionPanel;
var ncWMSColourScalePanel;


function initDetailsPanel()
{
    legendImage = new GeoExt.LegendImage();
    ncWMSColourScalePanel = new Ext.Panel();

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
