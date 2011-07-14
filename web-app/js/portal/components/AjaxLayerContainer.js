    var layerStore = new GeoExt.data.LayerStore();
    
    layersContainer = new GeoExt.tree.LayerContainer({
        nodeType: 'gx_layercontainer',
        text: 'AODN Map Layers',
        leaf: false,
        expanded: false,
		enableDD: true,
        layerStore: layerStore,
        listeners: {
            expand: function(node, event){
                if(node.done == undefined)
                {
                    Ext.Ajax.request({
                       url: 'layersJSON2.txt',
                       success: function(resp){
                             //alert(resp.responseText);
                             my_JSON_object= Ext.util.JSON.decode(resp.responseText);
                       }
                    });
                    
                    var jsonData=my_JSON_object;
                    if(jsonData.length > 0)
                    {
                        for(var i = 0; i < jsonData.length; i++)
                        {
                            for(var j = 0; j < jsonData[i]["children"].length; j++)
                            {
                                var child = jsonData[i]["children"][j];
                                var childLayer = new OpenLayers.Layer.WMS(
                                child["text"],
                                child["attr"]["server"],
                                {layers: child["attr"]["layer"], transparent: true},
                                {wrapDateLine: true, isBaseLayer: false, visibility: false}
                                );

                                var layerNode = new GeoExt.tree.LayerNode({
                                    checked: false,
                                    layer: childLayer,
                                    listeners: {
                                        click: function(node, event){
                                            mapPanel.map.addLayer(node.layer);
                                            //alert(map.layers.length);
                                        },
                                        load: function(node, event){
                                            node.layer;
                                            //alert(map.layers.length);
                                        }

                                    }
                                });

                                var layerFolder = new Ext.tree.TreeNode({
                                    text: "it is a folder"
                                });

                                layerFolder.appendChild(layerNode);
                                //alert(layerFolder.childNodes.length);
                                node.appendChild(layerFolder);

                            }
                        }
                    }
                    node.done = true;
                }
            }
        }
    });