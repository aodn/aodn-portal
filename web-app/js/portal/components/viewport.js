

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
var activePanel;

var toolbarpointer;
//--------------------------------------------------------------------------------------------

var nodeSelected;
 
// components in menuPanel.js
var leftTabMenuPanel;
var activeLayers;
var defaultMenuTree; 
var defaultLayers; // from the config
var defaultMenu; // from the config
var demonstrationContributorTree;
var baseLayerList;
var topMenuPanel, centreMenuPanel;

//
//Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
Ext.BLANK_IMAGE_URL = 'img/blank.gif'
Ext.QuickTips.init();


//GeoExt stuff
Ext.onReady(function() {

    Ext.Ajax.request({
        url: 'config/list?type=JSON',
        success: function(resp){        
            
            var config = Ext.util.JSON.decode(resp.responseText);
            
            var defaultLayersId = new Array();

            if(config.length == 0)
            {
                Ext.MessageBox.alert('Error!', 'Your portal has no configuration.  Abort!');
            }
            else
            {
                
                if(config.enableMOTD)  {

                    var nav = new Ext.Panel({
                        labelWidth:100,
                        frame:false,                      
                        title: "<h2>"+ config.motd.motdTitle + "</h2>", 
                        html: config.motd.motd,
                        padding: 20,
                        unstyled: true,
                        width:300
                    });

                    var dlgPopup = new Ext.Window({  
                        modal:true,
                        layout:'fit',
                        x: 190,
                        y:60,
                        unstyled: true, 
                        cls: "motd",
                        closable:true,
                        resizable:false,
                        plain:true,
                        items:[nav]
                    });

                    dlgPopup.show();

                }
            }

            Ext.Ajax.request({
                url: 'layer/listBaseLayersAsJson',
                success: function(resp){
                    
                    var bl = Ext.util.JSON.decode(resp.responseText);
                    baseLayerList = new Array();

                    for(var i = 0; i < bl.length; i++){
                        var l = new OpenLayers.Layer.WMS(
                            bl[i].name,
                            bl[i].server.uri,
                            {
                                layers: bl[i].layers
                            },
                            {
                                wrapDateLine: true,
                                transitionEffect: 'resize',
                                isBaseLayer: true
                            });
                        baseLayerList.push(l);
                    }

                    initMap(config);
                    defaultMenu = config.defaultMenu; // into global space so it can be modified later if required
                    //loadDefaultMenu(defaultMenu);
                    initMenusPanel(defaultMenu);
                    initDetailsPanel();
                    doViewPort();
                    defaultLayers = config.defaultLayers; // into global space so it can be modified
                    loadDefaultLayers();
                    zoomToDefaultZoom(mapPanel.map); // layout done so zoom to default extent
                }
            });

        }
    });

});

function doViewPort()
{
    
     var mapMainPanel = new Ext.Panel({
        layout: 'border',
        title: 'Map',
        stateful: true,
        items: [
        {
            title: "Active layers",
            layout: 'border',
            items: [
                topMenuPanel,leftTabMenuPanel
            ],
            region: 'west',
            id: "leftMenus",
            cls: 'leftMenus',
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
    mapMainPanel.doLayout();
   
        
    var viewport = new Ext.Viewport({
        layout: 'border',
        stateful: true,
        items: [{
            region: 'north',
            html: '<h1 >test title in extjs land</h1>',
            height: 50,
            border: false,
        margins: '0 0 5 380'
    }, {
        region: 'south',
        collapsible: true,
        html: 'Footer goes here',
        split: true,
        height: 100,
        minHeight: 100
    }, {
        region: 'center',
        xtype: 'tabpanel', // TabPanel itself has no title        
        autoDestroy: false, // wont destroy tab contents when switching        
        activeTab: 0,
        items: [            
            mapMainPanel,
            {
                xtype: 'portal.search.searchtabpanel'
            }
        ]
    }]
    });

    viewport.show();
    


    //mapMainPanel.doLayout();

    // now that components are rendered. fill them
    populateDemoContributorMenu();
    addRamadda();
    Ext.getCmp('leftMenus').doLayout();
}


