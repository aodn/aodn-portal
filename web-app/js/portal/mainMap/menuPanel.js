


function initMenusPanel(menu) {

    /* CONTRIBUTER TREE TO BE REMOVED
    demonstrationContributorTree = new Ext.tree.TreePanel({
        id: 'demonstrationContributorTree', 
        region: "west",
        title: "Contributors",
        root: new GeoExt.tree.LayerContainer()
    });
    */
    
    
    var defaultMenuContainer = new Ext.tree.AsyncTreeNode({
        draggable:false,
        children: JSON.parse(menu.json) // supplied as a string
    });    
    

    defaultMenuTree = new Ext.tree.TreePanel( {
        title: 'WMS Layers',
        id: 'defaultMenuTree',
        loader: new Ext.tree.TreeLoader({
            preloadChildren:true
        }), 
        root: defaultMenuContainer,
        collapsible: false,
        autoHeight: true,
        rootVisible:false,
        listeners:{
            // add layers to map or expand discoveries
            click:{
                fn:function(node) {
                    if (node.attributes.grailsLayerId){
                        addGrailsLayer(node.attributes.grailsLayerId);                      
                        setDefaultMenuTreeNodeStatus(node.attributes.grailsLayerId, false);                        
                    }
                    else if (node.attributes.grailsServerId){
                        alert("a server (discovery)") ; 
                    // get all layers for this server TODO
                    }
                    else {                        
                        //this should be a folder
                        node.expand(); 
                    }
                            
                }
            },
            bodyresize: { 
                fn:function(panel) {
                    panel.doLayout();
                    leftTabMenuPanel.doLayout();
                }                
            },
            beforeexpandnode: {
                fn:function(node) {
                    //alert("it happened");
                    if(node != defaultMenuTree.getRootNode()) {
                        checkDefaultMenuTreeNodeStatus(node);
                    }
                }
            }
        }
    });


    var serverURLField = new Ext.form.TextField({
        emptyText: "Full GetCapabilities URL"
    });

    var addServerButton = new Ext.Button({
        text: 'Add',
        listeners:{
            click: function(button, event)
            {
                    
            }
        }
    })

    var userDefinedWMSPanel = new Ext.Panel({
        title: "Add Servers",
        items: [
        serverURLField,
        addServerButton
        ]
    });




    
    // Listens to layer changes in the mapPanel and updates
    var layerList = new GeoExt.tree.OverlayLayerContainer({        
        //text: 'All Active Layers',
        layerStore: mapPanel.layers, 
        leaf: false,
        expanded: true
    });



    // should get all layers 
    var baselayerMenuPanel = new GeoExt.ux.BaseLayerComboBox({
        map: mapPanel.map,           
        editable :false,
        padding: 20,
        emptyText: 'Choose a Base Layer'
    });

    
    var removeAll = new Ext.Button({
        text: 'Remove All Layers',
        cls: "floatLeft buttonPad",   
        tooltip: "Remove all overlay layers from the map",
        listeners:{
            click: function(button, event)
            {
                removeAllLayers();
            }
        }
    });

    var resetLayers = new Ext.Button({
        text: 'Reset Map',
        tooltip:  'This will load the default set of map overlay layers and reset the map location and zoom level',   
        cls: "floatLeft buttonPad",
        listeners:{
            click: function(button, event)
            {
                removeAllLayers();
                reloadDefaultLayers();
            }
        }
    });
    
    var hideLayerOptions = new Ext.form.Checkbox({
        boxLabel  : 'Hide layer options',
        inputType : 'checkbox',
        listeners: {
            check: function(thisCheckbox, newValue)  {
                Portal.app.config.hideLayerOptions = newValue;
                if (newValue == true) {
                    closeNHideDetailsPanel();
                }
            }
        }
    });
    
    var zoomToLayerChooser = new Ext.form.Checkbox({
        boxLabel  : 'Auto zoom on layer select',
        inputType : 'checkbox', 
        checked: (Portal.app.config.autoZoom) ? Portal.app.config.autoZoom : false,
        listeners: {
            check: function(thisCheckbox, newValue)  {                
                Portal.app.config.autoZoom = newValue;
            }
        }
    });

    var mapOptionsButtonPanel = new Ext.Panel({        
        border: true, 
        flex: 1,
        items:[
        removeAll,
        resetLayers
        ]
    });
    var mapSpinnerPanel = new Ext.BoxComponent({        
        border: true,
        id: 'mapSpinnerPanel',
        html: '<div class="extAjaxLoading">' +
                '<div class="loading-indicator"> Loading...</div>' +
               '</div>'

    });
    
    
    
    
    var mapOptionsPanel = new Ext.Panel({
        //title: 'Map Options',
        //padding: 10,
        collapseMode : 'mini',
        height: 120,
        region: 'north',        
        items:[
            {
                // place the map options into a panel so that margin can be placed on the inner mapOptions
                id : 'mapOptions',
                items: [
                    new Ext.Container({
                        layout: 'hbox',
                        items: [                
                            new Ext.Panel({
                                flex: 2,
                                items: [ 
                                    hideLayerOptions,
                                    zoomToLayerChooser 
                                ]
                            }),
                            mapSpinnerPanel
                        ]
                    }),
                    mapOptionsButtonPanel,
                    baselayerMenuPanel
                ]
            }
            
        ]
    });
    
     // set up active map layers panel
    activeLayerTreePanel = new Ext.tree.TreePanel({
        id: 'activeLayerTreePanel',
        enableDD: true,
        rootVisible: false,
        root: layerList,
        listeners: {
            append: function(tree,parent,node){                
                // run this once only
                // seems to run again when animated images are added
                if (!tree.root.hashadtheclickactionadded) {                    
                
                    //console.log(node.layer.id);
                    tree.on("click", function(node,event){
                        tree.show(node.ui.getAnchor());
                        if(node.isSelected())
                        {
                            updateDetailsPanel(node.layer);
                            node.ui.toggleCheck(true);
                        }
                    });
                    tree.root.hashadtheclickactionadded = true;
                }
            }
        }
    });


    activeLayerTreePanel.on("contextmenu",function(node,event){
        activeLayerTreePanel.getSelectionModel().select(node);
        layerMenu.show(node.ui.getAnchor());
    });
    
    var emptyActiveLayerTreePanelText = new Ext.Container({
        autoEl: 'div',  // This is the default
        cls: 'emptyActiveLayerTreePanelText',
        html: "<p>Choose a layer from the layer chooser above, or use the search feature.</p>"        
    });
    var activeLayerPanel = new Ext.Panel({
        title: "Active layers",
        id: 'activeLayersPanel',
        //region: 'center',
        
        //margins: {top:0, right:0, bottom:40, left:0},
        items : [
            emptyActiveLayerTreePanelText,
            activeLayerTreePanel
        ]
        
    });
    
    
        // tabbed menu of available layers to add to map
    // rendered in 'viewport' border layout
    leftTabMenuPanel = new Ext.TabPanel({
        defaults: { // defaults are applied to items, not the container
            padding: 5//,
            //autoScroll: true
        },
        id: 'leftTabMenuPanel',
        //flex: 2,
        //region: 'north',        
        //height: Portal.app.config.activeLayersHeight, 
        minHeight: 170,
        stateful: false,        
        split: true,
        collapseMode: 'mini',
        border: false,
        enableTabScroll : true,
        activeTab: 0,
        items: [
            //demonstrationContributorTree,
            defaultMenuTree,
            userDefinedWMSPanel
        ]
    });
    
        
    // rendered in 'viewport' border layout
    activeMenuPanel = new Ext.Panel({
        id: 'activeMenuPanel',
        flex: 1,
        //region: 'center',
        //layout: 'auto',
        padding: '0px 0px 20px 0px',
        minHeight: 100,
        items:[
            mapOptionsPanel,            
            activeLayerPanel
        ]
    }); 
    

    //Active layer Right Click menu
    layerMenu = new Ext.menu.Menu({
        plain: true,
        defaultOffsets: [60, 10],
        showSeparator: false,
        items: [
        {
            text: 'Remove layer',
            handler: removeActiveLayer
        },
        {
            text: 'Zoom to layer',
            handler: zoomToLayer(mapPanel.map, selectedLayer)
        },
        {
            text: 'Toggle Visibility',
            handler: visibilityActiveLayer
        }
        ]
    });



}

function setDefaultMenuTreeNodeStatus(grailsLayerId, bool) {
    // enable all menu items that correspond. 
    // There can be more than one in the menu
    function checkNode(node)  {          
        
        if(node.attributes.grailsLayerId == grailsLayerId) {          
            (!bool) ? node.disable():  node.enable()        
        }               
        Ext.each(node.childNodes, checkNode);
    }
    checkNode(defaultMenuTree.getRootNode());
    
}

function checkDefaultMenuTreeNodeStatus(node) {
    
    // called when activeTreePanel tree nodes are opened
    Ext.each(activeLayerTreePanel.getRootNode().childNodes, function(node)  {
        setDefaultMenuTreeNodeStatus(node.attributes.layer.grailsLayerId, false);
    });

    
}


function removeActiveLayer() {
    
    // Remove layer from activeLayers, and make matching default menu item active
    // check if grailsLayerId exists. layer may have been added by user defined discovery
    var layerId = activeLayerTreePanel.getSelectionModel().getSelectedNode().layer.grailsLayerId;
    
    if (layerId != undefined) { 
        
        // see if this grailslayerid is only in the active layers the once
        var layerCount = 0;
        Ext.each(activeLayerTreePanel.getRootNode().childNodes, function(node)  {              
            if(node.attributes.layer.grailsLayerId == layerId) {
                layerCount ++;
            }                  
        });
        if (layerCount == 1) {            
            setDefaultMenuTreeNodeStatus(layerId, true);
        }        
        
    }
    // remove from the activeLayers array
    activeLayers[getUniqueLayerId(activeLayerTreePanel.getSelectionModel().getSelectedNode().layer)].destroy();
    mapPanel.map.removeLayer(activeLayerTreePanel.getSelectionModel().getSelectedNode().layer);
    
}


function visibilityActiveLayer() {
    
    var node= activeLayerTreePanel.getSelectionModel().getSelectedNode();
    if (node.getUI().checkbox.checked) {
        node.getUI().checkbox.checked = false;
    }
    else {
        node.getUI().checkbox.checked = true;
    }
}

// UNUSED FOR DEMONSTRATION PURPOSES
function populateDemoContributorMenu() {



    // demonstrationContributorTree Servers list
    // THIS WILL BE REMOVED. WE DONT WANT TO DO DISCOVERIES THIS WAY
    Ext.Ajax.request({
        url: 'server/listAllowDiscoveriesAsJson',
        success: function(resp){

            //alert(resp.responseText);
            var serverList= Ext.util.JSON.decode(resp.responseText);
            for(var i = 0; i<serverList.length;i++){
                var type = "";
                var version = "";
                var splits = serverList[i].type.split("-");
                if(splits.length == 2)
                {
                    type = splits[0];
                    version = splits[1];
                }

                demonstrationContributorTree.add(
                    new Ext.tree.TreePanel({
                        root: new Ext.tree.AsyncTreeNode({
                            text: serverList[i].name,
                            loader: new GeoExt.tree.WMSCapabilitiesLoader({
                                url: proxyURL+encodeURIComponent(serverList[i].uri+"?service=WMS&version="+version+"&request=GetCapabilities"),
                                layerOptions: {
                                    buffer: 0, 
                                    singleTile: false, 
                                    ratio: 1, 
                                    wrapDateLine: true
                                },
                                layerParams: {
                                    'TRANSPARENT': 'TRUE', 
                                    'VERSION' : version,
                                    'SERVERTYPE': type
                                },

                                // customize the createNode method to add a checkbox to nodes
                                createNode: function(attr) {
                                    attr.checked = attr.leaf ? false : undefined;
                                    //attr.active=attr.leaf ? false : undefined;;
                                    attr.version = version;
                                    attr.serverType = type;
                                    return GeoExt.tree.WMSCapabilitiesLoader.prototype.createNode.apply(this, [attr]);
                                }

                            })
                        })
                        ,
                        //width: 250,
                        autoHeight: true,
                        border: false,
                        rootVisible: true,
                        listeners: {
                        
                            // Add layers to the map when ckecked, remove when unchecked.
                            // Note that this does not take care of maintaining the layer
                            // order on the map.                                  
                                    
                            'checkchange': function(node,checked) {
                                if (checked === true) {
                                    if (node.attributes.layer.params.SERVERTYPE=='NCWMS') {
                                        node.attributes.layer.yx = true;
                                        node.attributes.layer.isncWMS =true;
                                        if(node.attributes.layer.params.VERSION == "1.3.0") {
                                            node.attributes.layer.yx = true;
                                        }
                                    }
                                
                                    mapPanel.map.addLayer(node.attributes.layer);
                                    // store the OpenLayers layer so we can retreive it later
                                    activeLayers[getUniqueLayerId(node.attributes.layer)] = node.attributes.layer;
                                    
                                    
                                    if (node.attributes.layer.params.SERVERTYPE=='NCWMS') {
                                        // get ncWMS Json metadata info for animation and style switching
                                        getLayerMetadata(activeLayers[getUniqueLayerId(node.attributes.layer)]);                            
                                    }                                   
                                
                                }
                                else {
                                    mapPanel.map.removeLayer(node.attributes.layer);
                                }
 	
                                    
                            }
                        }
                
                    })
                    );                
            }  
            // matias: because we are not sure if the tree is rendered alredy
            // this is a
            demonstrationContributorTree.doLayout();
        }
    });
    
}