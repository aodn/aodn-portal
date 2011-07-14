var detailsPanel;
var opacitySlider;

function initDetailsPanel()
{

// create a separate slider bound to the map but displayed elsewhere
    opacitySlider = new GeoExt.LayerOpacitySlider({
        id: "opacitySlider",
        layer: layer,
        width: 200,
        inverse: false,
        fieldLabel: "opacity",
        plugins: new GeoExt.LayerOpacitySliderTip({template: '<div>Opacity: {opacity}%</div>'})
    });

   detailsPanel = new Ext.Panel({
        title: 'Layer Options',
        region: 'south',
        border: false,
        split: true,
        height: 100,
        autoScroll: true,
        collapsible: true,
        items: [
               opacitySlider
        ]
    });


   function updateDetailsPanel(node)
   {
        detailsPanel.text = node.layer.name;
        detailsPanel.setTitle("Layer Options: " + node.layer.name);
        opacitySlider.setLayer(node.layer);
   }
}