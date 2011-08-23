var testing;

function initMenusPanel()
{

    var layersContainer = new GeoExt.tree.LayerContainer();
     //creating the menu tree on the left
    contributorTree = new Ext.tree.TreePanel({
        layout: "fit",
        region: "west",
        title: "Contributors",
        width: 170,
        collapsible: false,
        collapseMode: "mini",
        split: true,
        root: layersContainer
    });
    var defaultLayersContainer = new GeoExt.tree.LayerContainer();
     //creating the menu tree on the left
    defaultLayersTree = new Ext.tree.TreePanel({
        layout: "fit",
        title: "WMS Browser",
        width: 170,
        collapsible: false,
        collapseMode: "mini",
        split: true,
        root: defaultLayersContainer
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
    leftTabPanel = new Ext.TabPanel({
        defaults: {autoScroll: true}, // autoScroll for all items
        title: 'Layers Tab Panel',
        region: 'south',
        split: true,
        width: 250,
        height:200,
        activeTab: 1,
        items: [
            contributorTree ,
            { 	//region: 'west',
                title: "WMS Browser",
                id: "defaultMenu"
            },
            userDefinedWMSPanel
        ]
    });

    layerList = new GeoExt.tree.OverlayLayerContainer({
        
        text: 'All Active Layers',
        layerStore: mapPanel.layers,
        leaf: false,
        expanded: true

    });


    // set up active map layers panel
   activePanel = new Ext.tree.TreePanel({
       
       autoScroll: true,
       header: false,
       title: 'Map Layers',
       id: 'activeTreePanel',
       split: true,
       region: 'north',
       enableDD: true,
       height: 200,
       rootVisible: false,
       root: layerList,
        listeners: {
            append: function(node,event){
                node.on("click", function(node,event){
                    if(node.isSelected())
                    {
                        updateDetailsPanel(node);
                    }
                });

            }
        }
    });
    
    baseList = new GeoExt.tree.BaseLayerContainer({
        text: 'Base Layers',
        layerStore: mapPanel.layers,
        leaf: false,
        expanded: true
    });

    basePanel = new Ext.tree.TreePanel({
       nodeType: 'gx_baselayercontainer',
       autoScroll: true,
       header: true,
       border: false,
       title: 'Base Layers',
       split: true,
       region: 'north',
       enableDD: true,
       height: 100,
       rootVisible: false,
       root: baseList
    });

    
    removeAll = new Ext.Button({
        text: 'Remove All Layers',
        listeners:{
            click: function(button, event)
                {
                    removeAllLayers();
                }
        }
    });

    resetLayers = new Ext.Button({
        text: 'Reset  Layers',
        listeners:{
            click: function(button, event)
                {
                    removeAllLayers();
                    loadDefaultLayers();
                }
        }
    });

    buttonPanel = new Ext.Panel({
        region: 'center',
        border: false,
        split: true,
        height: 50,
        items:[
           removeAll,resetLayers
       ]
    });

    mapOptionPanel = new Ext.Panel({
        region: 'center',
        height: 50,
        border: false,
        split: true,
        items:[
            basePanel, buttonPanel
        ]
    });

    //Active layer Right Click menu
    layerMenu = new Ext.menu.Menu({

            items: [
                {
                    text: 'Remove layer',
                    handler: removeLayer
                },
                {
                    text: 'Zoom to layer',
                    handler: setExtentLayer
                },
                {
                    text: 'Visible',
                    checked: true,
                    handler: visibleLayer
                }, '-', {
                    text: 'More Options',
                    menu: {
                        items: [{
                            text: 'Geoext is great'
                        }, {
                            text: 'Ext is even better'
                        }, {
                            text: 'Matias add menu items!'
                        }]
                    }
                }
            ]
        });



}



function removeLayer() {
    // Remove layer. First unselect to remove from the tree of WMS Browse
    mapPanel.map.removeLayer(activePanel.getSelectionModel().getSelectedNode().layer);
}
function visibleLayer() {
    // If visible the undo checkchange
    activePanel.getSelectionModel().getSelectedNode().checked=!activePanel.getSelectionModel().getSelectedNode().checked;
}
 function setExtentLayer() {
    // Remove layer. First unselect to remove from the tree of WMS Browse
    var extent=activePanel.getSelectionModel().getSelectedNode().layer.metadata.llbbox;
    bounds = new OpenLayers.Bounds();
    bounds.extend(new OpenLayers.LonLat(extent[0],extent[1]));
    bounds.extend(new OpenLayers.LonLat(extent[2],extent[3]));

   // mapPanel.map.zoomToExtent(bounds);
}

function populateMenus() {

    activePanel.on("click",function(node,event){
                    activePanel.getSelectionModel().select(node);
                    layerMenu.show(node.ui.getAnchor());
    });

    activePanel.on("contextmenu",function(node,event){
                    activePanel.getSelectionModel().select(node);
                    layerMenu.show(node.ui.getAnchor());
    });

    // contributorTree Servers list
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

                contributorTree.add(
                    new Ext.tree.TreePanel({
                        root: new Ext.tree.AsyncTreeNode({
                                text: serverList[i].name,
                                loader: new GeoExt.tree.WMSCapabilitiesLoader({
                                        url: proxyURL+encodeURIComponent(serverList[i].uri+"?service=WMS&version="+version+"&request=GetCapabilities"),
                                        layerOptions: {buffer: 0, singleTile: false, ratio: 1},
                                        layerParams: {'TRANSPARENT': 'TRUE', 'VERSION' : version,'SERVERTYPE': type},

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
            contributorTree.doLayout();
        }
    });
    
}