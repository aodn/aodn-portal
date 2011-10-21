

var viewport;
var mapMainPanel;

//--------------------------------------------------------------------------------------------
//Some JSON stuff
var ready = false;
var my_JSON_object = {};

var layersTree;
var proxyURL = "proxy?url=";
var activePanel;

var toolbarpointer;
 
// components in menuPanel.js
var leftTabMenuPanel;
var defaultMenuTree; 
var defaultLayers; // from the config
var defaultMenu; // from the config
var demonstrationContributorTree;
var baseLayerList;
var topMenuPanel;

//
Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
Ext.BLANK_IMAGE_URL = 'img/blank.gif';
Ext.QuickTips.init();

//--------------------------------------------------------------------------------------------
Ext.ns('Portal');

Portal.app = {
	init: function() {
	    Ext.Ajax.request({
	        url: 'config/list?type=JSON',
	        scope: this,
	        success: function(resp) {        
	            
	            this.config = Ext.util.JSON.decode(resp.responseText);
	            
	            if(this.config.length == 0)
	            {
	                Ext.MessageBox.alert('Error!', 'Your portal has no configuration.  Abort!');
	            }
	            else
	            {
	                
	                if(this.config.enableMOTD)  {
	
	                    var nav = new Ext.Panel({
	                        labelWidth:100,
	                        frame:false,                      
	                        title: "<h2>"+ this.config.motd.motdTitle + "</h2>", 
	                        html: this.config.motd.motd,
	                        padding: 20,
	                        unstyled: true,
	                        width:300
	                    });
	
	                    var dlgPopup = new Ext.Window({  
	                        modal:true,
	                        layout:'fit',
	                        unstyled: true, 
	                        cls: "motd",
	                        closable:true,
	                        resizable:false,
	                        plain:true,
	                        items:[nav]
	                    });
	
	                    dlgPopup.show();
	
	                };
	            };
	
	            Ext.Ajax.request({
	                url: 'layer/listBaseLayersAsJson',
	                scope: this,
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
	                    
	                    // CAREFULL HERE WITH THE ORDERING!!!
	                    initDetailsPanel();
	                    initMap();
	                    defaultMenu = this.config.defaultMenu; // into global space so it can be modified later if required
	                    //loadDefaultMenu(defaultMenu);
	                    initMenusPanel(defaultMenu);
	                    doViewPort();
	                    defaultLayers = this.config.defaultLayers; // into global space so it can be modified
	                    loadDefaultLayers();
	                    zoomToDefaultZoom(mapPanel.map); // layout done so zoom to default extent
	                }
	            });
	
	        }
	    });
	}
};

//GeoExt stuff
Ext.onReady(Portal.app.init, Portal.app);

function doViewPort()
{
    
      mapMainPanel = new Ext.Panel({
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
            width: Portal.app.config.westWidth
        },{
            region:'center',
            layout:'border',
            items: [
            mapPanel
            ]
        },
        {
            id: 'rightDetailsPanel',
            region: 'east',
            hideMode: 'offsets',
            hidden: true,
            collapsible: true,
            collapsed: true,
            //html: 'ActiveLayers Details panel here',
            split: true,
            width: 350,
            minWidth: 200,
            closeAction: 'hide',
            autoDestroy: false,
            tools:[{
                id:'unpin',
                qtip: 'Make these options appear in a popup again',
                // hidden:true,
                handler: function(event, toolEl, panel){
                    toggleDetailsLocation();
                }
            }],
            listeners: {
                // a user might expand while the popup is open
                beforeexpand: function(panel, animate){

                    if (detailsPanelItems.ownerCt.id == "detailsPanel") {
                         toggleDetailsLocation();
                    }                

                }
            }
        }],
        listeners: {
                hide: function(panel) {
                    if (panel.title == 'Map') {                        
                        detailsPanel.hide();
                    }
                }
        }
    
    }); 
    mapMainPanel.doLayout();
   
        
    viewport = new Ext.Viewport({
        layout: 'border',
        boxMinWidth: 900,
        items: [{
            id: 'viewportHeader',
            unstyled: true,
            region: 'north',
            height: Portal.app.config.headerHeight,
            border: false
    }, {
        region: 'south',
        html: 'Footer goes here',
        cls: 'footer',
        unstyled: true,
        height: Portal.app.config.footerHeight
    },{
        region: 'center',
        xtype: 'tabpanel', // TabPanel itself has no title        
        autoDestroy: false, // wont destroy tab contents when switching        
        activeTab: 0,
        unstyled: true,
        // severe method to hide the usual tab panel header with css
        headerCfg: {
            cls: 'mainTabPanelHeader'  // Default class not applied if Custom element specified
        },
        items: [            
            mapMainPanel,
            {
                xtype: 'portal.search.searchtabpanel',
                listeners: {
               	 addLayer: {
               		 fn: function(layerDef) {
               			 addLayer(layerDef);
               	       Ext.Msg.alert(OpenLayers.i18n('layerAddedTitle'),layerDef.name + OpenLayers.i18n('layerAddedMsg'));
               		 }
               	 }
                }
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


