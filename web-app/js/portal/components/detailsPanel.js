var combo;
var styleList;
var detailsPanel;
var opacitySlider;
var detailsPanelLayer;
var legendImage;

function initDetailsPanel()
{
    legendImage = new GeoExt.LegendImage();

    styleList = new Ext.data.ArrayStore({
        autoDestroy: true
        ,id: 0
        ,fields: [
            'blah',
            {name: 'myId'},
            {name: 'displayText'}
        ]
    });

// create a separate slider bound to the map but displayed elsewhere
    opacitySlider = new GeoExt.LayerOpacitySlider({
        id: "opacitySlider",
        layer: layer,
        width: 200,
        inverse: false,
        fieldLabel: "opacity",
        plugins: new GeoExt.LayerOpacitySliderTip({template: '<div>Opacity: {opacity}%</div>'})
    });


    // create the combo instance
    combo = new Ext.form.ComboBox({
        typeAhead: true
        ,triggerAction: 'all'
        ,lazyRender:true
        ,mode: 'local'
        ,store: styleList
        ,valueField: 'myId'
        ,displayField: 'displayText'
        ,listeners: {
            select: function(cbbox, record, index)
            {
                detailsPanelLayer.mergeNewParams({
                    styles: record.get('myId')
                });

                var stylesList = detailsPanelLayer.metadata.styles;

                for(var i = 0; i < stylesList.length; i++)
                {
                    if(stylesList[i].name == record.get('myId'))
                    {
                        legendImage.setUrl(stylesList[i].legend.href);
                    }
                }
            }
        }
    });

    detailsPanel = new Ext.Panel({
        title: 'Layer Options'
        ,region: 'south'
        ,border: false
        ,split: true
        ,height: 100
        ,autoScroll: true
        ,collapsible: true
        ,items: [
               opacitySlider, combo, legendImage
         ]
    });
}

function updateDetailsPanel(node)
{
    detailsPanelLayer = node.layer;
    var styles = detailsPanelLayer.metadata.styles;
    styleList.removeAll();
    combo.clearValue();
    var data = new Array();

    for(var i = 0;i < styles.length; i++)
    {
        data.push([i, styles[i].name, styles[i].name]);
    }
    styleList.loadData(data);
    detailsPanel.text = detailsPanelLayer.name;
    detailsPanel.setTitle("Layer Options: " + detailsPanelLayer.name);
    opacitySlider.setLayer(detailsPanelLayer);
}

