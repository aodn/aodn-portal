var leftTabPanel;
var activeLayers;
var contributorTree;


function initLayerSelectionPanel()
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


    leftTabPanel = new Ext.TabPanel({
        defaults: {autoScroll: true}, // autoScroll for all items
        title: 'Layers Tab Panel',
        region: 'center',
        split: true,
        width: 250,
        activeTab: 1,
        items: [
            contributorTree ,
            { 	region: 'west',
                    title: "WMS Browser",
                    id : 'contributorTree'
            }
        ]
    });

    Ext.Ajax.request({
        url: 'server/list?type=JSON',
        success: function(resp){
                 //alert(resp.responseText);
                var serverList= Ext.util.JSON.decode(resp.responseText);
                for(var i = 0; i<serverList.length;i++){

                    Ext.getCmp('contributorTree').add(
                        new Ext.tree.TreePanel({
                            root: new Ext.tree.AsyncTreeNode({
                                    text: serverList[i].name,
                                    loader: new GeoExt.tree.WMSCapabilitiesLoader({
                                            url: proxyURL+encodeURIComponent(serverList[i].uri+"?service=WMS&version="+serverList[i].wmsVersion+"&request=GetCapabilities"),
                                            layerOptions: {buffer: 0,  ratio: 1},
                                            layerParams: {'TRANSPARENT': 'TRUE', 'VERSION' : serverList[i].wmsVersion,
                                                           'serverType':serverList[i].type},

                                            // customize the createNode method to add a checkbox to nodes
                                            createNode: function(attr) {
                                                    attr.checked = attr.leaf ? false : undefined;
                                                    //attr.active=attr.leaf ? false : undefined;;
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
                                            if (node.attributes.layer.serverType='NCWMS'){
                                                    node.attributes.layer.yx = true;
                                                    node.attributes.layer.isncWMS =true;
                                            }
                                            mapPanel.map.addLayer(node.attributes.layer);
                                    } else {
                                            mapPanel.map.removeLayer(node.attributes.layer);
                                }
                            }
                        }
                    })
                );
                Ext.getCmp('contributorTree').doLayout();
            }
        }
    });

    layerList = new GeoExt.tree.OverlayLayerContainer({
        
        text: 'All Active Layers',
        layerStore: mapPanel.layers,
        leaf: false,
        expanded: true

    });



   activePanel = new Ext.tree.TreePanel({

       autoScroll: true,
       header: false,
       title: 'Map Layers',
       id: 'activePanelTree',
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

        mapPanel.map.zoomToExtent(bounds);
    }

    activePanel.on("contextmenu",function(node,event){
                    activePanel.getSelectionModel().select(node);
                    layerMenu.show(node.ui.getAnchor());
    });
}