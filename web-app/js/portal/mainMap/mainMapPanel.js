var mapPanel; 
var activeLayers = []; // Array of OpenLayers Layers. This allows us to access/mod layers after creation
var navigationHistoryCtrl;
var automaticZoom=false;

function initMap()  {


    // Stop the pink tiles appearing on error
    OpenLayers.Util.onImageLoadError = function(e) {
        this.style.display = "";
        this.src="img/layer_error.gif";
    }


    

    
    var controls= [];
    
    /*
        new OpenLayers.Control.PanZoomBar({
            div: document.getElementById('controlPanZoom')
            }),
        ,

    //new OpenLayers.Control.KeyboardDefaults(),
    new OpenLayers.Control.Attribution(),
        new OpenLayers.Control.MousePosition({
            div: document.getElementById('mapcoords'),
            prefix: '<b>Lon:</b> ',
            separator: ' <BR><b>Lat:</b> '
        })
     */

    controls.push(
        new OpenLayers.Control.Navigation(),
        new OpenLayers.Control.Attribution(),
        new OpenLayers.Control.PanPanel(),
        new OpenLayers.Control.MousePosition(),
        new OpenLayers.Control.ScaleLine(),
        new OpenLayers.Control.NavigationHistory(),
        //new OpenLayers.Control.LayerSwitcher(),
        new OpenLayers.Control.OverviewMap({
            autoPan: true,
            minRectSize: 30,
            mapOptions:{
                resolutions: [  0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625
                , 0.00274658203125, 0.001373291015625, 0.0006866455078125, 0.00034332275390625,  0.000171661376953125
                ]
                }
            })
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
                unstyled: true//,  
                //items: setToolbarItems()
        
   
               
            });
     // stops the click bubbling to a getFeatureInfo request on the map
     mapToolbar.on('click', function(ev, target){
        ev.stopPropagation(); // Cancels bubbling of the event
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

    /* var onClick2 = function(ev, target){
        alert(target);
        ev.preventDefault(); // Prevents the browsers default handling of the event
        ev.stopPropagation(); // Cancels bubbling of the event
        ev.stopEvent() // preventDefault + stopPropagation

        var target = ev.getTarget() // Gets the target of the event (same as the argument)

        var relTarget = ev.getRelatedTarget(); // Gets the related target
    };
     */
    
    setMapDefaultZoom(mapPanel.map); // adds default bbox values to map instance
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
    
    // keep the animated image crisp
    // limit to changes in zoom. moveend is too onerous
    mapPanel.map.events.register("moveend" , map, function (e) {        
        redrawAnimatedLayers();
    });

    mapPanel.map.addControl(clickControl);
    
    

    
    clickControl.activate();  

}

function setToolbarItems() {

    var action, actions = {};
    var toolbarItems = [];
    
    toolbarItems.push("->");
    
    // Navigation history - and Home  "button" controls
    action = new Ext.Button({
        text:'Home',
        enableToggle: true,
        handler: zoomToDefaultZoom(mapPanel.map), //map.js
        ctCls: "noBackgroundImage",
        overCls: "bold"
        
    });

    actions["home"] = action;
    //toolbarItems.push(action);

    action = new GeoExt.Action({
        text: "previous",
        control: navigationHistoryCtrl.previous,
        disabled: true,
        tooltip: "Previous",        
        ctCls: "noBackgroundImage",
        overCls: "bold"
    });
    actions["previous"] = action;
    //toolbarItems.push(action);

    action = new GeoExt.Action({
        text: "next",
        control: navigationHistoryCtrl.next,
        disabled: true,
        tooltip: "Forward",        
        ctCls: "noBackgroundImage",
        overCls: "bold"
    });
    actions["next"] = action;
    //toolbarItems.push(action);

    action = new GeoExt.Action({
        text:'Search Repository',
        handler: ramaddaSearchWindow,        
        ctCls: "noBackgroundImage",
        overCls: "bold"
    });
    actions["search"] = action;
    //toolbarItems.push(action);
    
    //toolbarItems.push("->");

    // Reuse the GeoExt.Action objects created above
    // as menu items
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
    

    
    

  return toolbarItems;

  


}

/*
 * 
 * This is the add layer method for all layers apart form those added
 * by user defined WMS server discoveries.
 * 
 * 
 */
function addGrailsLayer(grailsLayerId) {   
    
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
               
               /*
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
                
                
                // store the OpenLayers layer so we can retreive it latter
                activeLayers[getUniqueLayerId(layer)] = layer;
                
                mapPanel.map.addLayer(layer);
                
                // get the extras
                if(layer.server.type.search("NCWMS") > -1) {
                    // get ncWMS Json metadata info for animation and style switching
                    getLayerMetadata(layer);
                } 
                else {
                    //getLayerBbox();
                }
                
                */

                addMainMapLayer( dl );
            }
        });
        
        
}

function getVersionString(layer) {
        var versionStr;
        if (layer.server.type.indexOf("1.3.0") != -1) {
                versionStr = "VERSION=1.3.0&CRS=EPSG%3A4326";
        } else {
                versionStr = "VERSION=1.1.1&SRS=EPSG%3A4326";
        }
        return versionStr;
                
}

function removeLayer(uniqueLayerId) {
       
    if (activeLayers[uniqueLayerId] != undefined) {
        mapPanel.map.removeLayer(activeLayers[uniqueLayerId]);    
        activeLayers.pop(uniqueLayerId);        
    } 
    else {
        console.log("Error: trying to remove a layer that is undefined");
    }
}

function processBounds(openlayersBounds) {
    var size = openlayersBounds.getSize();
    // increase the size if tiny
    var w= size.w;
    var h= size.h;
    var min = 512;
    var multiplier = 1;
    
    var smaller = (w<h) ? w : h;
    if (smaller < min) {
        multiplier = min/smaller;
    }
    
    w = w * multiplier;    
    h = h * multiplier;    
    
    // the size variables must be integers
    return new OpenLayers.Size(parseInt(w),parseInt(h));
    
}
// Gets the current map extent, check for out-of-range values
function getMapExtent()  {
    var bounds = mapPanel.map.getExtent();
    var maxBounds = mapPanel.map.maxExtent;
    var top = Math.min(bounds.top, maxBounds.top);
    var bottom = Math.max(bounds.bottom, maxBounds.bottom);
    var left = Math.max(bounds.left, maxBounds.left);
    var right = Math.min(bounds.right, maxBounds.right);
    return new OpenLayers.Bounds(left, bottom, right, top);
}

function redrawAnimatedLayers() {
    
    var wmsLayers = mapPanel.map.getLayersByClass("OpenLayers.Layer.WMS");
    // interesting the animated images are not appearing to be of the class OpenLayers.Layer.Image
    //var imageLayers = mapPanel.map.getLayersByClass("OpenLayers.Layer.Image");
    //wmsLayers = wmsLayers.concat(imageLayers);
    
    for(var i = 0; i < wmsLayers.length; i++)   {   
        if (mapPanel.map.layers[i].id != undefined) {

            var layer = mapPanel.map.getLayer(mapPanel.map.layers[i].id);       
            if (layer.originalWMSLayer != undefined) {
                // redraw
                addNCWMSLayer(layer);
            }
        }
    }
    
}

// exchange OpenLayers.Layer.WMS with OpenLayers.Layer.Image 
// or reload OpenLayers.Layer.Image
// Reloading may be called from reloading a style or changing zoomlevel
function addNCWMSLayer(currentLayer) {
    
    var layer;
    var layerLevelIndex;
    var bbox = getMapExtent();//.getSize()
    
    layer = currentLayer;
    
    // if originalWMSLayer is set - then it is already an animated Image
    if (currentLayer.originalWMSLayer != undefined) {      
       
        layer = currentLayer.originalWMSLayer;
        layer.map = mapPanel.map;        
    }
    
    var newUrl = layer.getFullRequestString( {
        TIME: layer.chosenTimes,
        TRANSPARENT:true,
        STYLE: layer.params.STYLES, // use the style of the original WMS layer
        WIDTH: 1024,
        HEIGHT: 1024,
        BBOX: bbox.toArray(),
        FORMAT: "image/gif"
    });
         
    
    newUrl = newUrl + "&" + getVersionString(layer);
    
    
    // params.times = array times to animate
    // use maxExtent always
    var newNCWMS = new OpenLayers.Layer.Image(
        layer.name + " (Animated)",
        newUrl,
        //mapPanel.map.getExtent(),
        bbox,
        bbox.getSize(), 
        {
            format: 'image/gif', 
            opacity: layer.opacity,
            isBaseLayer : false,
            maxResolution: mapPanel.map.baseLayer.maxResolution,
            minResolution: mapPanel.map.baseLayer.minResolution,
            resolutions: mapPanel.map.baseLayer.resolutions
            // baseUri: 
            // timeSeriesPlotUri:
            // featureInfoResponseType
        });  

    /* no params for animated layers
    if (newNCWMS.params == undefined) {
        newNCWMS.params = new Object();
        newNCWMS.params.QUERYABLE=false;
        newNCWMS.params.ISBASELAYER=false;
    } 
    */
   
    /********************************************************
     * attach the old WMS layer to the new Image layer !!
     * if this is set we know its an animated layer
     * ******************************************************/
    newNCWMS.originalWMSLayer = layer;
    
    
    
    /*******************************************************
     * add to map is done here
     * swap in the new animating layer into openlayers 
     * keeping the layer position
     *******************************************************/
    layerSwap(newNCWMS,currentLayer);    

    
    
    // close the detailsPanel
    // UNLESS I FIND A WAY TO SELECT THIS NEW LAYER IN THE GeoExt MENU!!!
    closeNHideDetailsPanel();
    
    
}

function layerSwap(newLayer,oldLayer) { 
    
    // exchange new for old  
    var layerLevelIndex = mapPanel.map.getLayerIndex(oldLayer);
    
    removeLayer(getUniqueLayerId(oldLayer));
    // now that removeLayer has removed the old item in the activeLayers array, swap in the new layer
    activeLayers[getUniqueLayerId(newLayer)] = newLayer; 

    mapPanel.map.addLayer(newLayer);     
    mapPanel.map.setLayerIndex(newLayer,layerLevelIndex);
}

function stopgetTimePeriod(layer) {
    var wmslayer;
    
    // if originalWMSLayer is set then it is an animated Openlayers.Image
    if (layer.originalWMSLayer != undefined) {  
        wmslayer = layer.originalWMSLayer;
        // get back the plain wms layer
        layerSwap(wmslayer,layer);
        // close the detailsPanel
        // UNLESS I FIND A WAY TO SELECT THIS NEW LAYER IN THE GeoExt MENU!!!
        closeNHideDetailsPanel();
        
    }
    else {
        console.log("Error: Stop animation button was pressed while a non animating layer was selected");
    }
}

/*
 * 
 * This is the internal add layer method used to add all layers
 * 
 */
function addMainMapLayer(dl) {    

     /*
      * Buffer: tiles around the viewport. 1 is enough
      * Gutter: images wider and taller than the tile size by a value of 2 x gutter
              NOT WORKING  over the date line. incorrect values sent to server or Geoserver not handling send values.
              Keep as zero till fixed 
      */               
      var params = {
          layers: dl.layers,
          transparent: true,
          buffer: 1, 
          gutter: 0
      };
      
      if (dl.imageFormat) {
      	params.format = dl.imageFormat;
      }

      if (dl.queryable) {
      	params.queryable = dl.queryable;
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
      
      var options =           {
            wrapDateLine: true,   
            opacity: opacity,
            transitionEffect: 'resize'
      };

      if (dl.isBaselayer) {
      	options.isBaseLayer = dl.isBaseLayer;
      }

      var layer = new OpenLayers.Layer.WMS(
          dl.name,
          dl.server.uri,
          params,
          options
      );

      
      //
      // extra info to keep
      layer.grailsLayerId = dl.grailsLayerId; 
      layer.server= dl.server;
      layer.cql = dl.cql;
      
    
      // don't add layer twice 
      if (layerAlreadyAdded(layer)) {
      	Ext.Msg.alert(OpenLayers.i18n('layerExistsTitle'),OpenLayers.i18n('layerExistsMsg'));
      }
      else {
          
          registerLayer( layer );
          
          mapPanel.map.addLayer(layer);
          
          if(dl.server.type.search("NCWMS") > -1) {
              
              // get ncWMS Json metadata info for animation and style switching
              // update detailsPanel after Json request
              getLayerMetadata(layer);
          }
          // store the OpenLayers layer so we can retreive it later
          activeLayers[getUniqueLayerId(layer)] = layer;
      }
      
};

// used as a unique id for the activeLayers array of openlayers layers
function getUniqueLayerId(layer){
    
    var cql = "";
    if (layer.cql != undefined) {
        cql = "::" + layer.cql
    }
    if (layer.server == undefined){
        layer.server = layer.originalWMSLayer.server;
    }   
    // return whitespaced cleared string
    return ((layer.server.uri + "::" + layer.name + cql).replace(/ +?/g, '_'));
}

// return whether the layer has already been added to the map
function layerAlreadyAdded(layer){
	var previousLayer = activeLayers[getUniqueLayerId(layer)];
	
	if (previousLayer == undefined) return false;
	
   return mapPanel.map.getLayer(previousLayer.id) !== null;
}

function getLayerMetadata(layer) {
        
    Ext.Ajax.request({
        
            url: proxyURL+ encodeURIComponent(layer.url + "?item=layerDetails&layerName=" + layer.params.LAYERS + "&request=GetMetadata"),
            success: function(resp){
                layer.metadata = Ext.util.JSON.decode(resp.responseText);
                
                // if this layer has been user selected before loading the metadata
                // reload,  as the date picker details/ form  will be wrong at the very least!
                if (selectedLayer != undefined) {   
                   if (selectedLayer.id == layer.id) {
                      updateDetailsPanel(layer); 
                   }
                }
                
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
 * Zoom to the layer bounds selected in active layers or 
 
function setExtentLayer() {
    
    var bounds = new OpenLayers.Bounds();
    var extent=activePanel.getSelectionModel().getSelectedNode().layer.metadata.bbox;
    if (extent != undefined) {
        bounds.extend(new OpenLayers.LonLat(extent[0],extent[1]));
        bounds.extend(new OpenLayers.LonLat(extent[2],extent[3]));        
    }
    else {
        
    }
    mapPanel.map.zoomToExtent(bounds);
}
*/

function loadDefaultLayers() {  

        for(var i = 0; i < defaultLayers.length; i++)   {
        addGrailsLayer(defaultLayers[i].id);   
        setDefaultMenuTreeNodeStatus(defaultLayers[i].id,false);        
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
    // remove
    for(var j = 0; j < allLayers.length; j++)
    {
        //var theLayer = activeLayers[allLayers[j]];
        setDefaultMenuTreeNodeStatus(activeLayers[allLayers[j]].grailsLayerId,true);        
        activeLayers[allLayers[j]].destroy(); 
        
    }
    // no layers- no details needed
    closeNHideDetailsPanel();
    // cleanup activeLayers?? or just start again?
    activeLayers = [];
    
    
    
}