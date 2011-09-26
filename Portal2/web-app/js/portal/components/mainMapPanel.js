var mapPanel; 
var mapLayers = []; // Array of OpenLayers Layers. This allows us to access/mod layers after creation
var navigationHistoryCtrl;
var automaticZoom=false;

function initMap(config)  {


    // Stop the pink tiles appearing on error
    OpenLayers.Util.onImageLoadError = function(e) {
        this.style.display = "";
        this.src="img/blank.gif";
    }


    navigationHistoryCtrl = new OpenLayers.Control.NavigationHistory();

    
    var controls= [];

    controls.push(
        new OpenLayers.Control.Navigation(),
        new OpenLayers.Control.Attribution(),
        new OpenLayers.Control.PanPanel(),
        navigationHistoryCtrl
        //new OpenLayers.Control.ZoomPanel()
    );
    var options = {
         controls: controls,
         displayProjection: new OpenLayers.Projection("EPSG:4326"),
         prettyStateKeys: true, // for pretty permalinks,
         resolutions : [  0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 0.0006866455078125, 0.00034332275390625,  0.000171661376953125]
     };


    //make the map
    var map = new OpenLayers.Map(options);

    map.restrictedExtent = new OpenLayers.Bounds.fromString("-360,-90,360,90");
    //map.resolutions = [  0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 0.0006866455078125, 0.00034332275390625,  0.000171661376953125];

    
     //grab all of the base layers from the database!
     for(var i = 0; i < baseLayerList.length; i++)
     {
        map.addLayer(baseLayerList[i]);
     }
    
     var scaleLine = new OpenLayers.Control.ScaleLine({});

     var mousePos = new OpenLayers.Control.MousePosition();


     map.addControl(scaleLine);
     map.addControl(mousePos);

    //creating the map panel in the center
    mapPanel = new GeoExt.MapPanel({
            id: "map",
            border: false,
            map: map,
            region: "center",
            split: true,
            // tbar: setToolbarItems(),
            header: false,
            //title: 'Map panel',
            items: [{
                xtype: "gx_zoomslider",
                aggressive: false,
                vertical: true,
                height: 100,
                x: 12,
                y: 120,
                plugins: new GeoExt.ZoomSliderTip()
            }]
       });
       
           
       
     // mapPanel.removeListener('click', this.onClick, this);
    var mapToolbar=  new Ext.Toolbar({
                // shadow: false,
                id: 'maptools',
                height: 28,
                width:'100%',
                // ,floating: true,
                cls:'semiTransparent noborder',
                overCls: "fullTransparency",
                unstyled: true,  
                items: setToolbarItems()
        
   
               
            });


     // put the toobar in a panel as the toolbar wont float
    var mapLinks=  new Ext.Panel({
               id: "mapLinks"
               ,shadow: false
               ,width:'100%'
               ,closeAction: 'hide'
               ,floating: true
               ,unstyled: true
               ,closeable: true
               //,listeners: NOT WORKING HERE
               ,items: mapToolbar
            });
     // stops the click bubbling to a getFeatureInfo request on the map
     mapLinks.on('click', function(ev, target){
        ev.stopPropagation(); // Cancels bubbling of the event
    });

     var onClick2 = function(ev, target){
        alert(target);
        ev.preventDefault(); // Prevents the browsers default handling of the event
        ev.stopPropagation(); // Cancels bubbling of the event
        ev.stopEvent() // preventDefault + stopPropagation

        var target = ev.getTarget() // Gets the target of the event (same as the argument)

        var relTarget = ev.getRelatedTarget(); // Gets the related target
    };
    
    setMapDefaultZoom(mapPanel.map,config); // adds default bbox values to map instance
    mapPanel.map.zoomToMaxExtent(); // get the map going. will zoom to bbox from the config latter

    mapPanel.add(mapLinks);
    mapLinks.setPosition(1,0);


    // Controll to get feature info or pop up
    var clickControl = new OpenLayers.Control.Click2({

        trigger: function(evt) {
            var loc = mapPanel.map.getLonLatFromViewPortPx(evt.xy);
            addToPopup(loc,mapPanel,evt);
        }
        
    });

    mapPanel.map.addControl(clickControl);

    
    clickControl.activate();  

}





function setToolbarItems() {

    var action, actions = {};
    var toolbarItems = [];
    

    // Navigation history - and Home  "button" controls
    action = new Ext.Button({
        text:'Home',
        enableToggle: true,
        handler: zoomToDefaultZoom(mapPanel.map), //map.js
        ctCls: "noBackgroundImage",
        overCls: "bold"
        
    });

    actions["home"] = action;
    toolbarItems.push(action);

    action = new GeoExt.Action({
        text: "previous",
        control: navigationHistoryCtrl.previous,
        disabled: true,
        tooltip: "Previous",        
        ctCls: "noBackgroundImage",
        overCls: "bold"
    });
    actions["previous"] = action;
    toolbarItems.push(action);

    action = new GeoExt.Action({
        text: "next",
        control: navigationHistoryCtrl.next,
        disabled: true,
        tooltip: "Forward",        
        ctCls: "noBackgroundImage",
        overCls: "bold"
    });
    actions["next"] = action;
    toolbarItems.push(action);

    action = new GeoExt.Action({
        text:'Search Repository',
        handler: ramaddaSearchWindow,        
        ctCls: "noBackgroundImage",
        overCls: "bold"
    });
    actions["search"] = action;
    toolbarItems.push(action);
    
    //toolbarItems.push("->");

    // Reuse the GeoExt.Action objects created above
    /* as menu items
    toolbarItems.push({ 
        text: "History",
        menu: new Ext.menu.Menu({
            items: [
                // Nav
                //new Ext.menu.CheckItem(actions["previous"]),
                // Select control
                //new Ext.menu.CheckItem(actions["select"]),
                // Navigation history control
                actions["previous"],
                actions["next"]
            ]
        })
        
    });
    */

    toolbarItems.push("->");
        
    toolbarItems.push({
        xtype: 'box',
        autoEl: {
            tag: 'a',
            href: 'http://www.imos.org.au',
            cn: 'IMOS',
            target: "_blank",
            cls: "external mainlinks"
        }
    });

    toolbarItems.push({
        xtype: 'box',
        autoEl: {
            tag: 'a',
            href: 'http://www.imos.org.au/aodn.html',
            cn: 'AODN',
            target: "_blank",
            cls: "external mainlinks"
        }
    });

        toolbarItems.push({
        xtype: 'box',
        autoEl: {
            tag: 'a',
            href: 'http://www.imos.org.au/aodn.html',
            cn: 'Help',
            target: "_blank",
            cls: "external mainlinks"
        }
    });

  return toolbarItems;

  


}


/*
 * 
 * This is the add layer method for all layers apart form those added
 * by user defined WMS server discoveries.
 * 
 * 
 */
function addLayer(grailsLayerId) {    
    
    Ext.Ajax.request({

            url: 'layer/showLayerByItsId?layerId=' + grailsLayerId,
            success: function(resp){
                var dl = Ext.util.JSON.decode(resp.responseText);  
                
               /*
                * Buffer: tiles around the viewport. 1 is enough
                * Gutter: images wider and taller than the tile size by a value of 2 x gutter
                        NOT WORKING  over the date line. incorrect values sent to server or Geoserver not handling send values.
                        Keep as zero till fixed 
                */               
                var params = {
                    layers: dl.layers,
                    transparent: true,
                    format: dl.imageFormat,
                    queryable: dl.queryable,
                    buffer: 1, 
                    gutter: 0
                }
                // opacity was stored as a percent 0-100
                var opacity =  Math.round((dl.opacity / 100)*10)/10;
                
                
                if(dl.server.type == "NCWMS-1.3.0") {
                    params.yx = true; // fix for the wms standards war
                }
                if(dl.cql != "") {
                    params.CQL_FILTER = dl.cql;
                }  
                // may be null from database
                if(dl.styles == "") {
                    params.styles = "";
                }
                
                
                var layer = new OpenLayers.Layer.WMS(
                    dl.name,
                    dl.server.uri,
                    params,
                    {
                        isBaseLayer: dl.isBaseLayer,
                        wrapDateLine: true,   
                        opacity: opacity,
                        transitionEffect: 'resize'
                    });
                
                
                //
                // extra info to keep
                layer.grailsLayerId = grailsLayerId; 
                layer.server= dl.server;
                
                
                if(dl.server.type.search("NCWMS") > -1) {
                    // get ncWMS Json metadata info for animation and style switching
                    // update detailsPanel after Json request
                    getLayerMetadata(layer);
                } 
                else {
                    // update detailsPanel without Json request needed
                    updateDetailsPanel(layer);
                }
                // store the OpenLayers layer so we can retreive it latter
                mapLayers[getUniqueLayerId(layer)] = layer;
                
                mapPanel.map.addLayer(layer); 
                
                
                
                
                
                
            }
        });
        
        
}

// used in getters and setters
function getUniqueLayerId(layer){
    
    return (layer.name + "::" + layer.grailsLayerId).replace(/\s/g, "");
}

function getLayerMetadata(layer) {
        
    Ext.Ajax.request({
        
            url: proxyURL+ encodeURIComponent(layer.url + "?item=layerDetails&time=&layerName=" + layer.params.LAYERS + "&request=GetMetadata"),
            success: function(resp){
                layer.metadata = Ext.util.JSON.decode(resp.responseText);
                updateDetailsPanel(layer);
            } 
    });
    
    
     // TIMESTEPS URI
    //http://obsidian:8080/ncWMS/wms?item=timesteps&layerName=67%2Fu&day=2006-09-19T00%3A00%3A00Z&request=GetMetadata
    // this is  timestrings we can use in the uri to control animation
    // based on timestepss
    //http://obsidian:8080/ncWMS/wms?item=animationTimesteps&layerName=67%2FTemperature_layer_between_two_pressure_difference_from_ground&start=2002-12-02T22%3A00%3A00.000Z&end=2002-12-03T01%3A00%3A00.000Z&request=GetMetadata
    /**
     * Support for parsing JSON animation parameters from NCWMS JSON responses
     *
     * Example JSON response string:
     * {
     * 	"units":"m/sec",
     * 	"bbox":[146.80064392089844,-43.80047607421875,163.8016815185547,-10.000572204589844],
     * 	"scaleRange":[-0.99646884,1.2169001],
     * 	"supportedStyles":["BOXFILL"],
     * 	"zaxis":{
     * 		"units":"meters",
     * 		"positive":false,
     * 		"values":[-5]
     * 	},
     * 	"datesWithData":{
     * 		"2006":{
     * 			"8":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]
     * 		}
     * 	},
     * 	"nearestTimeIso":"2006-09-01T12:00:00.000Z",
     * 	"moreInfo":"",
     * 	"copyright":"",
     * 	"palettes":["redblue","alg","ncview","greyscale","alg2","occam","rainbow","sst_36","ferret","occam_pastel-30"],
     * 	"defaultPalette":"rainbow",
     * 	"logScaling":false
     * }
     */
    
    return false;
    
    
}

/*
 * Zoom to the layer bounds selected in active layers
 */
function setExtentLayer() {
    
    var extent=activePanel.getSelectionModel().getSelectedNode().layer.metadata.bbox;
    bounds = new OpenLayers.Bounds();
    bounds.extend(new OpenLayers.LonLat(extent[0],extent[1]));
    bounds.extend(new OpenLayers.LonLat(extent[2],extent[3]));
    mapPanel.map.zoomToExtent(bounds);
}

function loadDefaultLayers()
{    
    for(var i = 0; i < defaultLayers.length; i++)   {
        addLayer(defaultLayers[i].id);   
        setDefaultMenuTreeNodeActive(defaultLayers[i].id,false);
    }
}


function removeAllLayers()   {  
    
    var allLayers = [];
    for(var i = 0; i < mapPanel.map.layers.length; i++)
    {
        if(!mapPanel.map.layers[i].isBaseLayer)
        {
            allLayers.push(getUniqueLayerId(mapPanel.map.layers[i]));            
        }
    }

    for(var j = 0; j < allLayers.length; j++)
    {
        console.log("item "  + allLayers[j] + " removed") 
        var theLayer = mapLayers[allLayers[j]];
        setDefaultMenuTreeNodeActive(theLayer.grailsLayerId,true);        
        theLayer.destroy(); 
        
    }
    // no layers- no details needed
    detailsPanel.hide();
    // cleanup mapLayers?? or just start again?
    mapLayers = [];
    
    
    
}