

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
 
// components in menuPanel.js
var leftTabPanel;
var activeLayers;
var contributorTree;
var basePanel;
var baseLayerList;



//
Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
//GeoExt stuff
Ext.onReady(function() {

     Ext.Ajax.request({
        url: 'config/list?type=JSON',
        success: function(resp){
            var bl = Ext.util.JSON.decode(resp.responseText);
            
            
            if(bl.length == 0)   {                
                Ext.MessageBox.alert('Error!', 'Your portal has no configuration.  Abort!');
            }
            else    {               
              
                if(bl[0].enableMOTD) {
                    Ext.MessageBox.alert( bl[0].motdTitle, bl[0].motd);
                }
            }

            Ext.Ajax.request({
                url: 'layer/listBaseLayers',
                success: function(resp){
                    var bl = Ext.util.JSON.decode(resp.responseText);
                    baseLayerList = new Array();

                    for(var i = 0; i < bl.length; i++){
                        var l = new OpenLayers.Layer.WMS(
                            bl[i].name,
                            bl[i].server.uri,
                            {layers: bl[i].layers},
                            {wrapDateLine: true,
                                transitionEffect: 'resize',
                                isBaseLayer: true}
                        );
                        baseLayerList.push(l);
                    }

                    initMap();
                    initMenusPanel();
                    initDetailsPanel();
                    doViewPort();
                }
            });

        }
     });

 });

 function doViewPort()
 {
     var viewport = new Ext.Viewport({
        layout: 'border',
        stateful: true,
        items: [
        {
            title: "Active layers",
            layout: 'border',
            items: [
                activePanel,basePanel,leftTabPanel
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
 }


