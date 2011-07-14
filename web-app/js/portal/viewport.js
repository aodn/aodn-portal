

var MAX_WIDTH = 1024;
var MAX_HEIGHT = 1024;
var activeLayers;

var testViewport;

//--------------------------------------------------------------------------------------------
//Some JSON stuff
var ready = false;
var my_JSON_object = {};
var detailsPanel;
var layersTree;
var currentNode;
var checkNode;
var proxyURL = "proxy?url=";
var activePanel, layerList, opacitySlider;
var toolbarItems = [];

var toolbarpointer;
//--------------------------------------------------------------------------------------------

 var nodeSelected;
 var mapPanel;
//
Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
//GeoExt stuff
Ext.onReady(function() {

     initMap();
     initLayerSelectionPanel();


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


    layerList = new GeoExt.tree.OverlayLayerContainer({
        text: 'All Layers',
        layerStore: mapPanel.layers,
        leaf: false,
        expanded: true
        
    });

var viewport = new Ext.Viewport({
    layout: 'border',
    stateful: true,
    items: [
    {
        title: "Active layers",
        layout: 'border',
        items: [
            activePanel,leftTabPanel
        ],
        region: 'west',
        autoscroll: true,
        collapsible: true,
        split: true,
        width: 250
    },{
        region:'center',
        layout:'border',
        items: [
            mapPanel,
            detailsPanel
        ]
    }]
});




viewport.show();

 });


