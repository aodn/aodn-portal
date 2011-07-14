

var MAX_WIDTH = 1024;
var MAX_HEIGHT = 1024;
var activeLayers;

var testViewport;

//--------------------------------------------------------------------------------------------
//Some JSON stuff
var ready = false;
var my_JSON_object = {};

var layersTree;
var currentNode;
var checkNode;
var proxyURL = "proxy?url=";
var activePanel, layerList;
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
     initDetailsPanel();


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


