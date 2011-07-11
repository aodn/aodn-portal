
var layer;
var map;
var MAX_WIDTH = 1024;
var MAX_HEIGHT = 1024;
var activeLayers;
var contributorTree;

//--------------------------------------------------------------------------------------------
//Some JSON stuff
var ready = false;
var my_JSON_object = {};
var http_request = new XMLHttpRequest();
var detailsPanel;
var layersTree;


var checkNode;

function reallyReady()
{
     //making the map
        map = new OpenLayers.Map();
        map.restrictedExtent = new OpenLayers.Bounds.fromString("-10000,-90,10000,90");
        map.resolutions = [  0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 0.0006866455078125, 0.00034332275390625,  0.000171661376953125];

        OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;

        layer = new OpenLayers.Layer.WMS(
            "IMOS Base Layer",
            "http://imos2.ersa.edu.au/cgi-bin/tilecache.cgi",
            {layers: "HiRes_aus-group"},
            {wrapDateLine: true},
            {isBaseLayer: true}
        );
        map.addLayer(layer);
        map.setCenter(new OpenLayers.LonLat(141, -32), 1);


      //creating the map panel in the center
        var mapPanel = new GeoExt.MapPanel({
                height: 800,
                width: 800,
                border: true,
                map: map,
                region: "center",
                split: true,
                zoom: 1,
                title: 'A Simple GeoExt Map',
                items: [{
                    xtype: "gx_zoomslider",
                    aggressive: false,
                    vertical: true,
                    height: 100,
                    x: 15,
                    y: 140,
                    plugins: new GeoExt.ZoomSliderTip()
                }]
               });


        var layerStore = new GeoExt.data.LayerStore();

        function makeNode(parentNode, data)
        {
            var nodeId = data["id"];
            var label = data["text"];
            var childrenData = data["children"];

            var newNode;
            var isLeaf;

            if(!data["isLeaf"])
            {
               //create a folder
                newNode = new Ext.tree.TreeNode({
                    text: label,
                    id: nodeId

                });

                if(childrenData != undefined)
                {
                    for(var i = 0; i < childrenData.length; i++)
                    {
                        makeNode(newNode, childrenData[i]);
                    }
                }
            }
            else
            {
                //this is a layer node
                var nodeLayer = new OpenLayers.Layer.WMS(
                    data["text"],
                    data["attr"]["server"],
                    {layers: data["attr"]["layer"], transparent: true},
                    {wrapDateLine: true, isBaseLayer: false, visibility: true}
                );

                newNode = new GeoExt.tree.LayerNode({
                    checked: false,
                    layer: nodeLayer,
                    id: nodeId,
                    listeners: {
                        click: function(node, event){
                            map.addLayer(node.layer);
                        }
                    }
                });

            }

            parentNode.appendChild(newNode);
        }

        var layersContainer = new GeoExt.tree.LayerContainer({
            text: 'AODN Map Layers',
            leaf: false,
            expanded: false,
            layerStore: layerStore,
            listeners: {
                expand: function(node, event){
                    if(node.done == undefined)
                    {
                        //var jsonData = Ext.util.JSON.decode(http_request.responseText);
                        //makeNode(node, jsonData);
                        //node.done = true;
                    }
                }
            }
        });

        //creating the menu tree on the left
        contributorTree = new Ext.tree.TreePanel({
            layout: "fit",
            region: "west",
            title: "Contributors",
            width: 170,
            height: 500,
            autoscroll: true,
            collapsible: false,
            collapseMode: "mini",
            split: true,
            root: layersContainer
       });

        var leftTabPanel = new Ext.TabPanel({
            title: 'Layers Tab Panel',
            region: 'center',
            autoscroll: true,
            split: true,
            width: 250,
            activeTab: 0,
            items: [
                contributorTree /*, regionTree, variableTree*/
            ]
        });

       detailsPanel = new Ext.Panel({
            title: 'Layer Details',
            region: 'south',
            html: '<div id="slider" style="clear:both"></div>',
            //items: [opacitySlider],
            border: false,
            split: true,
            autoScroll: true,
            collapsible: true
        });

        var layerList = new GeoExt.tree.OverlayLayerContainer({
            text: 'All Layers',
            layerStore: mapPanel.layers,
            leaf: false,
            expanded: true
        });

       var activePanel = new Ext.tree.TreePanel({
            autoScroll: true,
            split: true,
            region: 'north',
            root: layerList,
            rootVisible: false
        });
    //
    // create a separate slider bound to the map but displayed elsewhere
        var opacitySlider = new GeoExt.LayerOpacitySlider({
            layer: layer,
            aggressive: true,
            width: 200,
            isFormField: true,
            inverse: false,
            fieldLabel: "opacity",
            plugins: new GeoExt.LayerOpacitySliderTip({template: '<div>Opacity: {opacity}%</div>'})
        });


    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [{
            region: 'north',
            html: '<h1>Page Title</h1>',
            autoHeight: true,
            border: false,
            margins: '0 0 5 0'
        },
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
        },
        detailsPanel,mapPanel]
    });

    viewport.show();
};

//-----------------------------------------------------------------------------------------
//GeoExt stuff
Ext.onReady(function() {
    reallyReady();
});
