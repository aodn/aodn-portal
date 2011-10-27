

function initMenusPanel(menu) {

    // CONTRIBUTER TREE TO BE REMOVED
    demonstrationContributorTree = new Ext.tree.TreePanel({
        id: 'demonstrationContributorTree', 
        region: "west",
        title: "Contributors",
        root: new GeoExt.tree.LayerContainer()
    });
    
    
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
        collapseMode: "mini",
        split: true,
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


    // tabbed menu of available layers to add to map
    // rendered in 'viewport' border layout
    leftTabMenuPanel = new Ext.TabPanel({
        defaults: { // defaults are applied to items, not the container
            padding: 5,
            autoScroll: true
        },
        title: 'Layers Tab Panel',
        id: 'leftTabMenuPanel',
        region: 'center',
        minHeight: 150,
        border: false,
        enableTabScroll : true,
        activeTab: 1,
        items: [
        demonstrationContributorTree,
        defaultMenuTree,
        userDefinedWMSPanel
        ]
    });

    
    // Listens to layer changes in the mapPanel and updates
    var layerList = new GeoExt.tree.OverlayLayerContainer({        
        //text: 'All Active Layers',
        layerStore: mapPanel.layers, 
        leaf: false,
        expanded: true
    });


    // set up active map layers panel
    activePanel = new Ext.tree.TreePanel({
        autoScroll: true,
        region: 'center',        
        header: false,
        title: 'Map Layers',
        id: 'activeTreePanel',
        collapseMode : 'mini',
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


    activePanel.on("contextmenu",function(node,event){
        activePanel.getSelectionModel().select(node);
        layerMenu.show(node.ui.getAnchor());
    });
    

    // should get all layers 
    var baselayerMenuPanel = new GeoExt.ux.BaseLayerComboBox({
        map: mapPanel.map,           
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
        text: 'Reset Layers',
        tooltip:  'This will load the default set of map overlay layers',   
        cls: "floatLeft buttonPad",
        listeners:{
            click: function(button, event)
            {
                removeAllLayers();
                loadDefaultLayers();
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
    })
    var zoomToLayerChooser = new Ext.form.Checkbox({
        boxLabel  : 'Auto zoom on layer select',
        inputType : 'checkbox',
        //checked: Portal.app.config.autoZoom,
        listeners: {
            check: function(thisCheckbox, newValue)  {                
                Portal.app.config.autoZoom = newValue;
            }
        }
    })

    var mapOptionsButtonPanel = new Ext.Panel({        
        border: false,      
        items:[
        removeAll,
        resetLayers
        ]
    });
    
    
    var mapOptionsPanel = new Ext.Panel({
        //title: 'Map Options',
        //padding: 10,
        id : 'mapOptions',
        collapseMode : 'mini',
        height: 115,
        region: 'south',        
        items:[
            hideLayerOptions,
            zoomToLayerChooser,
            mapOptionsButtonPanel,
            baselayerMenuPanel
        ]
    });
        
    // rendered in 'viewport' border layout
    topMenuPanel = new Ext.Panel({
        id: 'topMenuPanel',
        layout: 'border',
        split: true,
        padding: 10,
        autoScroll: true,
        region: 'north',
        height: Portal.app.config.activeLayersHeight, 
        minHeight: 170,
        items:[
            activePanel  ,mapOptionsPanel
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
            handler: removeActivePanelLayer
        },
        {
            text: 'Zoom to layer',
            handler: zoomToLayer(mapPanel.map, selectedLayer)
        },
        {
            text: 'Toggle Visibility',
            handler: visibilityActivePanelLayer
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
    
    // called when activePanel tree nodes are opened
    Ext.each(activePanel.getRootNode().childNodes, function(node)  {
        setDefaultMenuTreeNodeStatus(node.attributes.layer.grailsLayerId, false);
    });

    
}


function removeActivePanelLayer() {
    
    // Remove layer from active layers and make matching default menu item active
    // check if grailsLayerId exists. layer may have been added by user defined discovery
    var layerId = activePanel.getSelectionModel().getSelectedNode().layer.grailsLayerId;
    
    if (layerId != undefined) { 
        
        // see if this grailslayerid is only in the active layers the once
        var layerCount = 0;
        Ext.each(activePanel.getRootNode().childNodes, function(node)  {              
            if(node.attributes.layer.grailsLayerId == layerId) {
                layerCount ++;
            }                  
        });
        if (layerCount == 1) {            
            setDefaultMenuTreeNodeStatus(layerId, true);
        }        
        
    }
    mapPanel.map.removeLayer(activePanel.getSelectionModel().getSelectedNode().layer);
    
}


function visibilityActivePanelLayer() {
    
    var node =activePanel.getSelectionModel().getSelectedNode();
    if (node.getUI().checkbox.checked) {
        node.getUI().checkbox.checked = false;
    }
    else {
        node.getUI().checkbox.checked = true;
    }
}


function populateDemoContributorMenu() {



    // demonstrationContributorTree Servers list
    // THIS WILL BE REMOVED. WE DONT WANT TO DO DISCOVERIES THIS WAY
    Ext.Ajax.request({
        url: 'server/list?type=JSON',
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
                                        if(node.attributes.layer.params.VERSION == "1.3.0")
                                            node.attributes.layer.yx = true;
                                    }
                                    mapPanel.map.addLayer(node.attributes.layer);
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