var map;
var layer;
var testing;

function initMap()
{


    // Stop the pink tiles appearing on error
    OpenLayers.Util.onImageLoadError = function(e) {
        this.style.display = "";
        this.src="img/blank.png";

        testing = e;
    }


    var controls= [];
    controls.push(
        new OpenLayers.Control.Navigation(),
        new OpenLayers.Control.Attribution(),
        new OpenLayers.Control.PanPanel()//,
        //new OpenLayers.Control.ZoomPanel()
    );
    var options = {
         controls: controls,
         displayProjection: new OpenLayers.Projection("EPSG:4326"),
         units: "m",
         prettyStateKeys: true // for pretty permalinks
     };


    //make the map
    map = new OpenLayers.Map(options);
    map.restrictedExtent = new OpenLayers.Bounds.fromString("-10000,-90,10000,90");
    map.resolutions = [  0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 0.0006866455078125, 0.00034332275390625,  0.000171661376953125];

    OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;

    layer = new OpenLayers.Layer.WMS(
        "IMOS Base Layer",
        "http://imos2.ersa.edu.au/cgi-bin/tilecache.cgi",
        {layers: "HiRes_aus-group"},
        {wrapDateLine: true,
            transitionEffect: 'resize',
            isBaseLayer: true}
    );

    map.addLayer(layer);

    setToolbarItems(); // set 'toolbarItems' array
}

function setToolbarItems() {

    var ctrl, action, actions = {};
    // Navigation history - two "button" controls
    ctrl = new OpenLayers.Control.NavigationHistory();
    map.addControl(ctrl);

    action = new GeoExt.Action({
        text: "previous",
        control: ctrl.previous,
        disabled: true,
        tooltip: "previous in history"
    });
    actions["previous"] = action;
    toolbarItems.push(action);

    action = new GeoExt.Action({
        text: "next",
        control: ctrl.next,
        disabled: true,
        tooltip: "next in history"
    });
    actions["next"] = action;
    toolbarItems.push(action);
    toolbarItems.push("->");

    // Reuse the GeoExt.Action objects created above
    // as menu items
    toolbarItems.push({
        text: "menu",
        menu: new Ext.menu.Menu({
            items: [
                // Nav
                new Ext.menu.CheckItem(actions["nav"]),
                // Select control
                new Ext.menu.CheckItem(actions["select"]),
                // Navigation history control
                actions["previous"],
                actions["next"]
            ]
        })
    });
}