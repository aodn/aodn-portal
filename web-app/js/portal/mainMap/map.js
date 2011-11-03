 /*
 * Copyright 2009, 2010, 2011 Integrated Marine Observing System (IMOS)
 * Copyright 2010, 2011 Australian Ocean Data Network (AODN)

 *  This file is part of aodn_ocean_portal

 *  aodn_ocean_portal is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.

 *  aodn_ocean_portal is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.

 *  You should have received a copy of the GNU General Public License
 *  along with aodn_ocean_portal  If not, see <http://www.gnu.org/licenses/>.
 */

var proxyURL = "proxy?url=";
//var tmp_response;

var argos = null; // array of existing argo platform_numbers

var popupWidth = 435; //pixels
var popupHeight = 325; //pixels

var requestCount = 0; // getFeatureInfo request count
var queries = new Object(); // current getFeatureInfo requests
var queries_valid_content = false;
var timestamp; // timestamp for getFeatureInfo requests
var X,Y; // getfeatureInfo Click point
var clickEventHandler; // single click handler

// Get feature info dialog
var numFeatureTabsToLoad;
var numFeatureTabsLoaded;

// Pop up things
var popup;

function setMapDefaultZoom(map) {
    
    /* ---------------
     * left	{Number} The left bounds of the box.  Note that for width calculations, this is assumed to be less than the right value.
     * bottom	{Number} The bottom bounds of the box.  Note that for height calculations, this is assumed to be more than the top value.
     * right	{Number} The right bounds.
     * top	{Number} The top bounds.
    */
    if (Portal.app.config.initialBbox != "") {
        var bbox = Portal.app.config.initialBbox.split(",");
        map.minx = parseInt(bbox[0]);
        map.maxx = parseInt(bbox[2]);
        map.miny = parseInt(bbox[1]);
        map.maxy = parseInt(bbox[3]);
        if (!((map.minx >= -180 && map.minx <= 180)
                && (map.maxx > -180 && map.maxx <= 180)
                && (map.miny >= -90 && map.miny <= 90)
                && (map.maxy >= -90 && map.maxy <= 90)
                && map.minx < map.maxx
                && map.miny < map.maxy)) {
            alert("ERROR: wrong value in bbox ! \n\n" + 
                map.minx + 
                ":West = "+(map.minx >= -180 && map.minx <= 180)+"\n" + 
                map.miny +
                ":South = "+(map.miny >= -90 && map.miny <= 90) +"\n" + 
                map.maxx + 
                ":East = "+ (map.maxx > -180 && map.maxx <= 180)+"\n" + 
                map.maxy + 
                ":North = "+(map.maxy >= -90 && map.maxy <= 90) +
                "\n West > East = " + (map.minx < map.maxx) + 
                "\n South < North = " +(map.miny < map.maxy) 
            );
        }
        else {
            //zoomToDefaultZoom(map); // no point calling here as layout not done
        } 
    }
    else {
        alert("ERROR: Bounding box is not set in the config");
    }
}

function zoomToDefaultZoom(map) {
    map.zoomToExtent(new OpenLayers.Bounds(map.minx,map.miny,map.maxx,map.maxy),true);    
}

function zoomToLayer(map, layer){
    
    var extent;
    if (layer != undefined) {
        extent = layer.getDataExtent();
    }
    
    if (extent && !isNaN(extent.left)) {
        var width = extent.getWidth() / 2;
        var height = extent.getHeight() / 2;
        extent.left -= width;
        extent.right += width;
        extent.bottom -= height;
        extent.top += height;
        map.zoomToExtent(extent);
    } else {
        map.zoomToMaxExtent();
    }
}

function addToPopup(loc, mapPanel, e) {
	
        var map = mapPanel.map;
        var wmsLayers = map.getLayersByClass("OpenLayers.Layer.WMS");
        var imageLayers = map.getLayersByClass("OpenLayers.Layer.Image");

        wmsLayers = wmsLayers.concat(imageLayers);
        
        numFeatureTabsToLoad = 0; // Reset count
        numFeatureTabsLoaded = 0;

        // create the popup if it doesn't exist
        if ( !popup ) {
            popup = new GeoExt.Popup({
                title: "Features at your click point",
                width: 450,
                height: 380,
                maximizable: true,
               // collapsible: true,
                map: mapPanel.map,
                anchored: true,
                border: false,
                margins: 10,
                constrainHeader: true,
                panIn: true,
                autoScroll: true,
                listeners: {
                    close: function() {
                        // closing a popup destroys it, but our reference is truthy
                        popup = null;
                    }
                }
            });

            // Add tab panel (empty for now)
            popup.add( new Ext.TabPanel({
                    enableTabScroll : true,
                    deferredRender: false
                })
            );
        }
        else {
            
            tabsFromPopup( popup ).removeAll();
        }

        // reset the popup's location
        popup.location = loc;
        popup.doLayout();
        popup.show(); // since the popup is anchored, calling show will move popup to this location

        // For each layer...
        for (var i = 0; i < wmsLayers.length; i++ ) {

            var layer = wmsLayers[i];
            url = "none";

            if ((!layer.params.ISBASELAYER) && layer.params.QUERYABLE) { // What about isVisible ??

            //To do add a check box on the interface to get the profile and the time series from ncWMS.
            /*if (layer.showTimeSeriesNcWMS) {
                   if (layer.tile.bounds.containsLonLat(lonlat)) {
                                url = layer.baseUri +
                                "&EXCEPTIONS=application/vnd.ogc.se_xml" +
                                "&BBOX=" + layer.getExtent().toBBOX() +
                                "&I=" + e.xy.x +
                                "&J=" + e.xy.y +
                                "&INFO_FORMAT=text/xml" +
                                "&CRS=EPSG:4326" +
                                "&WIDTH=" + mapPanel.map.size.w +
                                "&HEIGHT=" +  mapPanel.map.size.h +
                                "&BBOX=" + mapPanel.map.getExtent().toBBOX();


                                timeSeriesPlotUri =
                                layer.timeSeriesPlotUri +
                                "&I=" + e.xy.x +
                                "&J=" + e.xy.y +
                                "&WIDTH=" + layer.mapPanel.map.size.w +
                                "&HEIGHT=" +  layer.mapPanel.map.size.h +
                                "&BBOX=" + mapPanel.map.getExtent().toBBOX();
                        }
                }
                else*/
                
                if (layer.params.VERSION == "1.1.1") {
                    url = layer.getFullRequestString({
                        REQUEST: "GetFeatureInfo",
                        EXCEPTIONS: "application/vnd.ogc.se_xml",
                        BBOX: layer.getExtent().toBBOX(),
                        X: e.xy.x,
                        Y: e.xy.y,
                        INFO_FORMAT: 'text/html',
                        QUERY_LAYERS: layer.params.LAYERS,
                        FEATURE_COUNT: 100,
                        BUFFER: layer.getFeatureInfoBuffer,
                        SRS: 'EPSG:4326',
                        WIDTH: layer.map.size.w,
                        HEIGHT: layer.map.size.h
                    });
                }
                else if (layer.params.VERSION == "1.3.0") {
                    url = layer.getFullRequestString({

                        REQUEST: "GetFeatureInfo",
                        EXCEPTIONS: "application/vnd.ogc.se_xml",
                        BBOX: layer.getExtent().toBBOX(),
                        I: e.xy.x,
                        J: e.xy.y,
                        INFO_FORMAT: 'text/xml',
                        QUERY_LAYERS: layer.params.LAYERS,
                        //Styles: '',
                        CRS: 'EPSG:4326',
                        BUFFER: layer.getFeatureInfoBuffer,
                        WIDTH: layer.map.size.w,
                        HEIGHT: layer.map.size.h
                    });
                }
        }

        if ( url != "none" ) {
            format = layer.isncWMS ? "xml"
                                   : "html";

            numFeatureTabsToLoad++; // Record layer requested

            addTab( popup, {
                xtype: "box",
                id: layer.id,
                title: layer.name,
                padding: 30,
                autoHeight: true,
                cls: "featureinfocontent",
                autoEl: {
                    html: '<img src="images/spinner.gif" alt="Loading..." style="vertical-align: middle;" />&nbsp;Loading from remote server...'
                }
            } );

            // reset the popup's location
            popup.location = loc;
            popup.doLayout();
            popup.show(); // since the popup is anchored, calling show will move popup to this location

            Ext.Ajax.request({
                url: proxyURL + encodeURIComponent( url ) + "&format=" + format,
                params: {name: layer.name, id: layer.id},
                success: function(resp, options){

                    if ( popup ) { // Popup may have been closed since request was sent
                        
                        // Replace content of tab
                        var tab = getTab( popup, options.params.id );

                        tab.update( formatGetFeatureInfo( resp, options ) );
                    }                    
                },

                failure: function(resp, options) { // Popup may have been closed since request was sent

                    if ( popup ) {

                        var tab = getTab( popup, options.params.id );

                        tab.update( '<span class="error">An error occurred retrieving this feature info</span><br />' );
                    }
                }
            });
        }
    }
    
    if ( numFeatureTabsToLoad == 0 ) {
        
        addTab( popup, {
            xtype: "box",
            title: 'Nothing to load',
            padding: 30,
            cls: "featureinfocontent",
            autoEl: {
                html: '<span class="error">None of the selected layers have features that can be retrieved.</span><br />'
            }
        } );
    }
    
    // Make first tab active
    tabsFromPopup( popup ).setActiveTab( 0 );
}

// Add tab to featureInfo popup
function addTab(popup, newTab) {
    
    tabsFromPopup( popup ).add( newTab );
}

// Get tab from featureInfo popup
function getTab(popup, tabId) {
    
    return tabsFromPopup( popup ).getItem( tabId );
}

// Get tabs from featureInfo popup
function tabsFromPopup(popup) {
    
    return popup.getComponent( 0 );
}

OpenLayers.Control.Click2 =  OpenLayers.Class(OpenLayers.Control, {

    defaultHandlerOptions: {
        single: true,
        'double': false, // this isnt working
        pixelTolerance: 0,
        stopSingle: true
    },

    initialize: function(options) {

        this.handlerOptions = OpenLayers.Util.extend(
            options && options.handlerOptions || {}, 
            this.defaultHandlerOptions
        );
        OpenLayers.Control.prototype.initialize.apply(
            this, arguments
        ); 
        this.handler = new OpenLayers.Handler.Click(
            this, 
            {
                click: this.trigger
            }, 
            this.handlerOptions
        );
    },
    
    CLASS_NAME: "OpenLayers.Control.Click"
});
  
// if its XML then ncWMS is assumed. TODO
function formatGetFeatureInfo(response, options) {
            
    if(response.responseXML == null) {
        // strip out all unwanted HTML
         if ( response.responseText.match(/<\/body>/m)) {
            var html_content  =  response.responseText.match(/(.|\s)*?<body[^>]*>((.|\s)*?)<\/body>(.|\s)*?/m);
            if (html_content) {
                //trimmed_content= html_content[2].replace(/(\n|\r|\s)/mg, ''); // replace all whitespace
                html_content  = html_content[2].replace(/^\s+|\s+$/g, '');  // trim

                if ( html_content.length == 0 ) {
                    html_content = '<span class="info">No feature info found near click point</span><br />'
                }
            }

            return html_content;
        }

        return '<span class="info">No feature info found near click point</span><br />'
    }
    else{
        return setHTML_ncWMS(response);
    }
}

function setHTML_ncWMS(response) {
    
    var xmldoc = response.responseXML;
    
    if ( xmldoc == null ) return "response not in xmls";
    
    var lon  = parseFloat((xmldoc.getElementsByTagName('longitude'))[0].firstChild.nodeValue);
    var lat  = parseFloat((xmldoc.getElementsByTagName('latitude'))[0].firstChild.nodeValue);
    var startval  = parseFloat(xmldoc.getElementsByTagName('value')[0].firstChild.nodeValue);
    var x    = xmldoc.getElementsByTagName('value');
    var copyright = xmldoc.getElementsByTagName('copyright');
    var vals = "";
    var origStartVal = startval;

    var time = xmldoc.getElementsByTagName('time')[0].firstChild.nodeValue;
    var timeList = xmldoc.getElementsByTagName('time').length;
    time = null;

    if(timeList > 0){
        time = xmldoc.getElementsByTagName('time')[0].firstChild.nodeValue;
    }
        
    if (x.length > 1) {
        var endval = parseFloat(xmldoc.getElementsByTagName('value')[x.length -1].childNodes[0].nodeValue);
        if(time != null)
            var endtime = xmldoc.getElementsByTagName('time')[x.length -1].firstChild.nodeValue;
    }
    var origEndVal = endval;

    var html = "";
    var  extras = "";

    var isSD = true;//this.layername.toLowerCase().indexOf("standard deviation") >= 0;
    

    if (lon) {  // We have a successful result

        if (!isNaN(startval) ) {  // may have no data at this point
            var layer_type = " - ncWMS Layer";

            if(time != null)
            {
                var human_time = new Date();
                human_time.setISO8601(time);
            } 
            if(time != null)
            {
                if (endval == null) {
                    if(isSD)
                    {
                        vals = "<br /><b>Value at: </b>" + human_time.toUTCString() + " <b>" + origStartVal + "</b> degrees";
                    }
                    else{
                        vals = "<br /><b>Value at </b>"+human_time.toUTCString()+"<b> " + startval[0] +"</b> "+ startval[1] + startval[2];
                    }
                }
                else {

                    var human_endtime = new Date();
                    human_endtime.setISO8601(endtime);
                    var endval =getCelsius(endval, this.unit);
                    
                    if(isSD)
                    {
                        vals = "<br /><b>Start date:</b>"+human_time.toUTCString()+": <b>" + origStartVal + "</b> degrees";
                        vals += "<br /><b>End date:</b>"+human_endtime.toUTCString()+ ": <b>" + origEndVal + "</b> degrees";
                        vals += "<BR />";
                    }
                    else
                    {
                        vals = "<br /><b>Start date:</b>"+human_time.toUTCString()+": <b> " + startval[0] +"</b> "+ startval[1] + startval[2];
                        vals += "<br /><b>End date:</b>"+human_endtime.toUTCString()+":<b> " + endval[0] +"</b> "+ endval[1]  + endval[2];
                        vals += "<BR />";
                    }
                }
            }
            
			
            lon = toNSigFigs(lon, 7);
            lat = toNSigFigs(lat, 7);

            
            html = "<h3>" + layer_type + "</h3>";
            
            html +=        "<div class=\"feature\">";

            html += "<b>Lon:</b> " + lon + "<br /><b>Lat:</b> " + lat + "<br /> " +  vals + "\n<br />" + extras;

                // to do add transect drawing here
                //
           html += "<br><h6>Get a graph of the data along a transect via layer options!</h6>\n";
           //html = html +" <div  ><a href="#" onclick=\"addLineDrawingLayer('ocean_east_aus_temp/temp','http://emii3.its.utas.edu.au/ncWMS/wms')\" >Turn on transect graphing for this layer </a></div>";

          if(copyright.length > 0)
          {
                html += "<p>" + copyright[0].firstChild.nodeValue + "</p>";
          }

          
            html = html +"</div>" ;
        }

    }
    else {
        html = "Can't get feature info data for this layer <a href='javascript:popUp('whynot.html', 200, 200)'>(why not?)</a>";
    }

    return html;
}
  
function inArray (array,value) {
    
    for (var i = 0; i < array.length; i++) {
        
        if (array[i] === value) {
                return true;
        }
    }
    
    return false;
}

function is_ncWms(type) {
   
   alert( 'is_ncWms(' + type + ')' );
   
   /* return ((type == parent.ncwms)||
        (type == parent.thredds));
    */
}

function isWms(type) {
    
    alert( 'isWms(' + type + ')' );
   
   /* return (
        (type == parent.wms100) ||
        (type == parent.wms110) ||
        (type == parent.wms111) ||
        (type == parent.wms130) ||
        (type == parent.ncwms) ||
        (type == parent.thredds));
    */
}

function getDepth(e) {

    var I= e.xy.x; //pixel on map
    var J= e.xy.y; // pixel on map
    var click = mapPanel.map.getLonLatFromPixel(new OpenLayers.Pixel(I,J));

    var url = "DepthServlet?" +
            "lon=" + click.lon +
            "&lat="  + click.lat ;

    var request = OpenLayers.Request.GET({
        url: url,
        headers: {
            "Content-Type": "application/xml"
        },
        callback: setDepth
    });
}

function setDepth(response) {

    var i = 0;
    var total_depths = 0;
    var xmldoc = response.responseXML;
    var str = "";

    // guard against the depth servlet going feral
    var depthval = xmldoc.getElementsByTagName('depth')[0].firstChild.nodeValue.replace(/^\s+|\s+$/g, ''); //trim
    if (depthval != "null") {
        var depth = parseFloat(depthval);
    var desc = (depth > 0) ? "Altitude " : "Depth ";
        str = desc + "<b>" + Math.abs(depth) + "m</b>" ;
    }

    str = str + " Lon:<b> " + X + "</b> Lat:<b> " + Y + "</b>";
    jQuery('#featureinfodepth').html(str);

    // if this id is available populate it and hide featureinfodepth
    if (jQuery('#featureinfoGeneral')) {
      jQuery('#featureinfoGeneral').html(str).fadeIn(400);
      jQuery('#featureinfodepth').hide();
    }
}

// Special popup for ncwms transects
function mkTransectPopup(inf) {

    killTransectPopup(); // kill previous unless we can make these popups draggable
    var posi = mapPanel.map.getLonLatFromViewPortPx(new OpenLayers.Geometry.Point(60,20));

    var html = "<div id=\"transectImageheader\">" +
                "</div>" +
                "<div id=\"transectinfostatus\">" +
                "<h3>" + inf.label + "</h3><h5>Data along the transect: </h5>" + inf.line +  " " +
                "<BR><img src=\"" + inf.transectUrl + "\" />" +
                "</div>" ;

    popup2 = new OpenLayers.Popup.AnchoredBubble( "transectfeaturepopup",
        posi,
        new OpenLayers.Size(popupWidth,60),
        html,
        null, true, null);

    popup2.autoSize = true;
    mapPanel.map.popup2 = popup2;
    mapPanel.map.addPopup(popup2);
}

function killTransectPopup() {
    if (mapPanel.map.popup2 != null) {
        mapPanel.map.removePopup(mapPanel.map.popup2);
        mapPanel.map.popup2.destroy();
        mapPanel.map.popup2 = null;
    }
}

Date.prototype.setISO8601 = function (string) {
    var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
    "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
    "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
    var d = string.match(new RegExp(regexp));

    var offset = 0;
    var date = new Date(d[1], 0, 1);

    if (d[3]) {
        date.setMonth(d[3] - 1);
    }
    if (d[5]) {
        date.setDate(d[5]);
    }
    if (d[7]) {
        date.setHours(d[7]);
    }
    if (d[8]) {
        date.setMinutes(d[8]);
    }
    if (d[10]) {
        date.setSeconds(d[10]);
    }
    if (d[12]) {
        date.setMilliseconds(Number("0." + d[12]) * 1000);
    }
    if (d[14]) {
        offset = (Number(d[16]) * 60) + Number(d[17]);
        offset *= ((d[15] == '-') ? 1 : -1);
    }

    offset -= date.getTimezoneOffset();
    time = (Number(date) + (offset * 60 * 1000));
    this.setTime(Number(time));
}

 function imgSizer(){
    //Configuration Options
    var max_width = popupWidth -70 ; 	//Sets the max width, in pixels, for every image
    var selector = 'div#featureinfocontent .feature img';

    //destroy_imagePopup(); // make sure there is no other
    var tics = new Date().getTime();

    $(selector).each(function(){
        var width = $.width();
        var height = $.height();
        //alert("here");
        if (width > max_width) {

            //Set variables for manipulation
            var ratio = (max_width / width );
            var new_width = max_width;
            var new_height = (height * ratio);
            //alert("(popupwidth "+max_width+" "+width + ") " +height+" * "+ratio);

            //Shrink the image and add link to full-sized image
            $.animate({
                width: new_width
            }, 'slow').width(new_height);

            $.hover(function(){
                $.attr("title", "This image has been scaled down.")
            //$(this).css("cursor","pointer");
            });

        } //ends if statement
    }); //ends each function
}

function destroy_imagePopup(imagePopup) {
    jQuery("#" + imagePopup ).hide();
}

/*jQuery showhide (toggle visibility of element)
 *  param: the dom element
 *  ie: #theId or .theClass
 */
function showhide(css_id) {
      $(css_id).toggle(450);
}

/*jQuery show
 *  param: the dom element
 *  ie: #theId or .theClass
 */
function show(css_id) {
      $(css_id).show(450);
}

function showChannel(css_id, facilityName) {
 jQuery("#[id*=" + facilityName + "]").hide();
 jQuery('#' + facilityName + css_id).show(450);
 imgSizer();
}

function dressUpMyLine(line){

    var x = line.split(",");
    var newString = "";

    for(i = 0; i < x.length; i++){
            var latlon = x[i].split(" ");
            var lon = latlon[0].substring(0, latlon[0].lastIndexOf(".") + 4);
            var lat = latlon[1].substring(0, latlon[1].lastIndexOf(".") + 4);
            newString = newString + "Lon:" + lon + " Lat:" +lat + ",<BR>";
    }
    return newString;
}

function centreOnArgo(base_url, argo_id, zoomlevel) {

    getArgoList(base_url);

    if (IsInt(argo_id)) {

        var xmlDoc = getXML(base_url + '/geoserver/wfs?request=GetFeature&typeName=topp:argo_float&propertyName=last_lat,last_long&version=1.0.0&CQL_FILTER=platform_number='+ argo_id + '&MAXFEATURES=1');
        var x= xmlDoc.getElementsByTagName('topp:argo_float');

        if (x.length > 0) {

            var lat = xmlDoc.getElementsByTagName("topp:last_lat")[0].childNodes[0].nodeValue;
            var lon = xmlDoc.getElementsByTagName("topp:last_long")[0].childNodes[0].nodeValue;

            //mapPanel.map.setCenter(new OpenLayers.LonLat(lon,lat),zoomlevel,1,1);

            // no zooming in
            mapPanel.map.setCenter(new OpenLayers.LonLat(lon,lat),zoomlevel,1,1);
            hidepopup(); // clear the popup out of users face
        }

    }
    else {
        alert("Please enter an Argo ID number");
    }
}

// This function gets over the Firefox 4096 character limit for XML nodes using 'textContent''
// IE doesn’t support the textContent attribute
function getNodeText(xmlNode)
{
    if(!xmlNode) return '';
    if(typeof(xmlNode.textContent) != "undefined") return xmlNode.textContent;
    return xmlNode.firstChild.nodeValue;
}

/*
* Opens the form area
* Populates argos[]
*/
function getArgo(base_url,inputId) {

    show('#argo_find');
    getArgoList(base_url);

    // turn on auto complete
    if (argos.length > 0) {
        $("input#" + inputId).autocomplete(argos);
    }
}

function isArgoExisting (base_url,argo_id) {

    var status = false;

    if (!IsInt(argo_id)) {
        alert("Please enter an Argo ID number");
    }
    else {

        getArgoList(base_url) ;

        if(argos.length > 0) {
            if ( inArray(argos,argo_id))  {
                status = true;
             }
             //
            else {
                alert("Your supplied Argo ID number is not known in this region");
            }
        }
        else {
            // gracefully forget about it if the list of argos failed
            status = true;
        }
    }
    
    return status;
}

function setExtWmsLayer(url,label,type,layer,sld,options,style) {

    // options are comma delimited to include a unique label from a single value such as a dropdown box
    if (options.length > 1) {
    var opts = options.split(",");
    var cql = opts[0];
    var newLabel = label;
    if (opts.length > 1) {
        newLabel = label + " " + opts[1];
    }

        layer = new OpenLayers.Layer.WMS(
                newLabel,
                url,
                {layers: layer, transparent: true, CQL_FILTER: cql, STYLE: style},
                {wrapDateLine: true,
                isBaseLayer: false}
        );
        mapPanel.map.addLayer(layer);
    }
}

// called via argo getfeatureinfo results
function drawSingleArgo(base_url, argo_id, zoomlevel) {

    if (isArgoExisting(base_url,argo_id)) {
        setExtWmsLayer(base_url +'/geoserver/wms','Argo - ' + argo_id + '','1.1.1','argo_float','','platform_number = '+ argo_id + '','argo_large');
        centreOnArgo(base_url, argo_id, null);
    }
}

function getArgoList(base_url) {
       
    if (argos == null) {
        argos =  Array();
        var xmlDoc = getXML(base_url + '/geoserver/wfs?request=GetFeature&typeName=topp:argo_float&propertyName=platform_number&version=1.0.0');
        if(xmlDoc!=null){
            var x= xmlDoc.getElementsByTagName('topp:argo_float');
            if (x.length > 0) {
                 for (i=0;i<x.length;i++) {
                    argos[i]= x[i].getElementsByTagName("topp:platform_number")[0].childNodes[0].nodeValue;
                 }
            }
            else {
                // tried once and failed leave it alone
                argos =  Array();
            }
        }
    }
}

function IsInt(sText) {

    var ValidChars = "0123456789";
    var IsInt= true;
    sText = sTExt.trim();
    var Char;
    if (sTExt.length == "0") {
         IsInt = false;
    }
    else {
       for (i = 0; i < sTExt.length && IsInt == true; i++) {
          Char = sTExt.charAt(i);
          if (ValidChars.indexOf(Char) == -1) {
             IsInt = false;
          }
       }
    }
   return IsInt;

}

function acornHistory(request_string,div,data) {

        var xmlDoc = getXML(request_string);
        var x=xmlDoc.getElementsByTagName(data);
        str= "";

        if (x.length > 0) {
            str = str + ("<table class=\"featureInfo\">");
            str =str + ("<tr><th>Date/Time</th><th>Speed</th><th>Direction</th></tr>");
            for (i=0;i<x.length;i++)
                {
                str = str + ("<tr><td>");
                var dateTime =  (x[i].getElementsByTagName("topp:timecreated")[0].childNodes[0].nodeValue);
                str = str + formatISO8601Date(dateTime);
                str = str + ("</td><td>");
                str = str + (x[i].getElementsByTagName("topp:speed")[0].childNodes[0].nodeValue) + "m/s";
                str = str + ("</td><td>");
                str = str + (x[i].getElementsByTagName("topp:direction")[0].childNodes[0].nodeValue) + "&#176;N";
                str = str + ("</td></tr>");
            }
            str = str + ("</table>");
        }
        else {
            str="<p class=\"error\">No previous results.</p>";
        }
        jQuery("#acorn"+div).html(str);
        jQuery("#acorn"+div).show(500);
        jQuery("#acorn"+div + "_single").hide();


    return false;
}