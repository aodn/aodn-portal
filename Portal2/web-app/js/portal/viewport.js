

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
var baseLayerList; // array of baselayers used in map and baselayer picker
var topMenuPanel;

// COOKIE CAUSES PROBLEMS
// set for individual components?
// Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

Ext.BLANK_IMAGE_URL = 'img/blank.gif';
Ext.QuickTips.init();

//--------------------------------------------------------------------------------------------
Ext.ns('Portal');

Portal.app = {
    init: function() {
   	 //Set open layers proxyhost
       OpenLayers.ProxyHost = proxyURL;

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
	
                    

	                    
                // CAREFULL HERE WITH THE ORDERING!!!
                initDetailsPanel();
                setBaseLayers(this.config); // build baselayers into baseLayerList before map creation
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
};

//GeoExt stuff
Ext.onReady(Portal.app.init, Portal.app);




// sets the tab from the external links in the header
function setViewPortTab(tabIndex){ 
    Ext.getCmp('centerTabPanel').setActiveTab(tabIndex);
}

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
            width: Portal.app.config.westWidth,
            listeners: {
                // show the little expand button on map right.
                beforeexpand: function(){                    
                    var ls = mapPanel.map.getControlsByClass('OpenLayers.Control.LayerSwitcher')[0];
                    ls.destroy();
                },                
                beforecollapse: function(){                    
                    mapPanel.map.addControl(new OpenLayers.Control.LayerSwitcher({
                        roundedCornerColor: '#34546E' // bloody openlayers!!
                    }));
                }
            }
        },{
            region:'center',
            id: 'mainMapCentrePanel',
            layout:'border',
            items: [
            mapPanel
            ]
        },
        {
            xtype: 'panel',
            id: 'rightDetailsPanel',
            region: 'east',
            hideMode: 'offsets',
            hidden: true,
            collapsible: false,
            //html: 'ActiveLayers Details panel here',
            split: true,
            width: 350,
            minWidth: 250,
            closeAction: 'hide',
            autoDestroy: false,
            tools:[
            {
                id:'unpin',
                qtip: 'Make these options appear in a popup again',
                // hidden:true,
                handler: function(event, toolEl, panel){

                    toggleDetailsLocation();
                }
            },
            {
                id:'close',
                qtip: 'Note: select "Hide layer options" to keep this panel closed',
                // hidden:true,
                handler: function(event, toolEl, panel){

                    closeNHideDetailsPanel();
                }
            }
                
            ]
        }],
        listeners: {
            // a user might expand after having changed the selectedActivelayer
            beforeexpand: function(panel, animate){

                if (detailsPanelItems.ownerCt.id == "detailsPanel") {
                        
                    // there must be a selectedLayer to be in this situation right?
                    if (selectedLayer != undefined) {
                        updateDetailsPanel(selectedLayer);
                    }
                    else {
                        console.log("Error: There was no selectedLayer for the panel to show!!");                       
                        closeNHideDetailsPanel();
                    }
                }                

            },
            hide: function(panel) {
                if (panel.title == 'Map') {                        
                    closeNHideDetailsPanel();
                }
            }
        }
    
    }); 
    mapMainPanel.doLayout();
   
    
    viewport = new Ext.Viewport({
        layout: 'border',
        boxMinWidth: 900,
        items: [{
            //
            unstyled: true,
            region: 'north',
            height: Portal.app.config.headerHeight//,
            //border: false,
            //items: [{
            //   html: "this is some text"     
            //}]
        },
        {
            region: 'center',
            id: 'centerTabPanel',
            xtype: 'tabpanel', // TabPanel itself has no title        
            autoDestroy: false, // wont destroy tab contents when switching        
            activeTab: 0,
            unstyled: true,
            // method to hide the usual tab panel header with css
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
                            addMainMapLayer(layerDef);
                            Ext.Msg.alert(OpenLayers.i18n('layerAddedTitle'),layerDef.name + OpenLayers.i18n('layerAddedMsg'));
                        }
                    }
                }
            }
            ]
        },
        {
            region: 'south',
            html: 'Footer goes here',
            cls: 'footer',
            unstyled: true,
            height: Portal.app.config.footerHeight
        }]
    });

    viewport.show();
    


    //mapMainPanel.doLayout();

    // now that components are rendered. fill them
    populateDemoContributorMenu();
    addRamadda();
    Ext.getCmp('leftMenus').doLayout();
}


//
// Fix for closing animation time period window after selection
// http://www.sencha.com/forum/archive/index.php/t-98338.html
// Bug in Ext.form.MessageTargets in connection with using compositeFields
//The problem is, that composite fields doesn't have the "dom" node and that is why the clear functions of Ext.form.MessageTargets.qtip 
//and Ext.form.MessageTargets.side are saying "field.el.dom" is undefined.
Ext.onReady(function() {

    Ext.apply(Ext.form.MessageTargets.qtip, {
        clear: function(field){
            field.el.removeClass(field.invalidClass);
            // fix

            if(field.el.dom) {
                field.el.dom.qtip = '';
            }
        }
    });


    Ext.apply(Ext.form.MessageTargets.side, {
        clear: function(field){
            field.el.removeClass(field.invalidClass);
            // fix

            if(field.errorIcon && field.errorIcon.dom){
                field.errorIcon.dom.qtip = '';
                field.errorIcon.hide();
            }else{
                // fix

                if(field.el.dom) {
                    field.el.dom.title = '';
                }
            }
        }
    });
});
