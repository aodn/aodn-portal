var mapPanel; 
var layer;
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
// lsteners modified here after layout
function modMapListeners() {

    var el = Ext.get('mapLinks');
    // stops the click bubbling to a getFeatureInfo request on the map
    el.on('click', function(ev, target){
        ev.stopPropagation(); // Cancels bubbling of the event
    });
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
            href: 'auth/login',
            cn: 'Log in',
            target: "_top",
            cls: "mainlinks",
            id: "login_link"
        }
    });
    
    toolbarItems.push({
        xtype: 'box',
        autoEl: {
            tag: 'a',
            href: 'auth/signOut',
            cn: 'Log out',
            target: "_top",
            cls: "mainlinks",
            id: "logout_link"
        }
    });
    
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

function loadDefaultLayers()
{
    
    for(var i = 0; i < defaultLayers.length; i++)
    {
                
        Ext.Ajax.request({
            
                    url: 'layer/showLayerByItsId?layerId=' + defaultLayers[i].id,
                    success: function(resp){
                        var dl = Ext.util.JSON.decode(resp.responseText);
                        var l = new OpenLayers.Layer.WMS(
                            dl.name,
                            dl.server.uri,
                            {
                                layers: dl.layers,
                                transparent: true,
                                isBaseLayer: dl.isBaseLayer,
                                queryable: dl.queryable
                            },
                            {
                                wrapDateLine: true,
                                transitionEffect: 'resize'
                            });
                        mapPanel.map.addLayer(l);
                    }
        });
    }
}


function removeAllLayers()
{
    var d = new Array();
    for(var i = 0; i < map.layers.length; i++)
    {
        if(!map.layers[i].isBaseLayer)
        {
            d.push(i);
        }
    }

    //reversing the order, so then the index is always valid on map.layers
    for(var i = d.length; i > 0; i--)
    {
        map.layers[i].destroy();
    }
}