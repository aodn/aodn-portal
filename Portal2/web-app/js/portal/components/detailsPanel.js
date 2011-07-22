var combo;
var styleList;
var detailsPanel;
var opacitySlider;
var detailsPanelLayer;


function initDetailsPanel()
{
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
               opacitySlider, combo
         ]
    });
}

function updateDetailsPanel(node)
{
    detailsPanelLayer = node.layer;
    var styles = node.layer.metadata.styles;
    styleList.removeAll();
    combo.clearValue();
    var data = new Array();

    for(var i = 0;i < styles.length; i++)
    {
        data.push([i, styles[i].name, styles[i].name]);
    }
    styleList.loadData(data);
    detailsPanel.text = node.layer.name;
    detailsPanel.setTitle("Layer Options: " + node.layer.name);
    opacitySlider.setLayer(node.layer);

}

