

var MAX_WIDTH = 1024;
var MAX_HEIGHT = 1024;

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

var toolbarpointer;
//--------------------------------------------------------------------------------------------

var nodeSelected;
var mapPanel;
 
// menuPanel.js
var leftTabPanel;
var activeLayers;
var contributorTree;
 




//
Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
//GeoExt stuff
Ext.onReady(function() {

     initMap();
     initMenusPanel();

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
            id: "leftMenus",
            collapsible: true,
            split: true,
            width: 290
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
        
    // now that components are rendered. fill them
    populateMenus();
    addRamadda();
Ext.getCmp('leftMenus').doLayout();

    modMapListeners(); // mainMapPanel.js






 });


