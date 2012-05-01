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
var proxyCachedURL = "proxy/cache?URL=";
var argos = null; // array of existing argo platform_numbers
var layersLoading = 0; // Layer loading activity indicator
var popup;

function getMapPanel() {
	return Ext.getCmp('map');
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

function addToPopup(mapPanel, e) {
	
    var map = mapPanel.map;
    var wmsLayers = map.getLayersByClass("OpenLayers.Layer.WMS");
    var imageLayers = map.getLayersByClass("OpenLayers.Layer.Image");

    wmsLayers = wmsLayers.concat(imageLayers);
    
    // create a new popup each time.
    // ols query results 'should' become orphaned
    closePopup();

    popup = new GeoExt.Popup({
        title: "Searching for Features at your click point",
        width: Portal.app.config.popupWidth,
        height: 80, // set height later when there are results
        maximizable: true,
        map: mapPanel.map,
        anchored: true,
        autoScroll: true
    });

    // Add container for html (empty for now)
    popup.add( new Ext.Container({
        html: "Loading ...",
        cls: 'popupHtml',      
        ref: 'popupHtml'
	}));

    // Add tab panel (empty for now)
    popup.add( new Ext.TabPanel({
        ref: 'popupTab',
        enableTabScroll : true,
        deferredRender: true,
        hidden: true
    }));

    popup.numResultsToLoad = 0; // Reset count
    popup.numGoodResults = 0;
    popup.numResultQueries = 0;

    var loc = mapPanel.map.getLonLatFromViewPortPx(e.xy);
    // do all this work to reduce the length of the mouse click precision for the popup title
    var locArray = loc.toShortString().split(",");
    popup.locationString = "<b>Lat:</b> " + toNSigFigs(locArray[1], 4) + " <b>Lon:</b> " + toNSigFigs(locArray[0], 4);

    // reset the popup's location
    popup.location = loc;    
    popup.doLayout();
    popup.show(); // since the popup is anchored, calling show will move popup to this location  

    // if depthservice is enabled, make it live!
    if (Portal.app.config.useDepthService) {
        Ext.Ajax.request({
            url: 'depth' , 
            params: {
                lat: locArray[1],
                lon: locArray[0]
            },
            success: function(resp, options){
                updatePopupDepthStatus(resp);
            }
        });
    }
    else {
        updatePopupDepthStatus( null ); // Update with no info (will still clear 'loading' message)
    }

    // For each layer...
    for (var i = 0; i < wmsLayers.length; i++ ) {

        var layer = wmsLayers[i];
        var url = "none";
        var params;
        var expectedFormat = isncWMS(layer) ? "text/xml" : "text/html";
        var featureCount = isncWMS(layer) ? 1 : 100; // some ncWMS servers have a problem with 'FEATURE_COUNT >1 ''   ]
        var isAnimatedLayer = layer.originalWMSLayer != undefined;

        // this is an animated image
        if (isAnimatedLayer) {

            if ( layer.getVisibility() ) { // Only show if visible

                var chart_bbox = layer.url.match("BBOX=[^\&]*")[0].substring(5);
                var chart_time =  layer.url.match("TIME=[^\&]*")[0].substring(5);
                var chart_style =  layer.url.match("STYLES=[^\&]*")[0].substring(7);

                url = layer.url.substring(0, layer.url.indexOf("?")) +
                    "?SERVICE=WMS&REQUEST=GetFeatureInfo" +
                    "&EXCEPTIONS=application/vnd.ogc.se_xml" +
                    "&BBOX=" + layer.extent.toBBOX() +
                    "&INFO_FORMAT=image/png" +
                    "&QUERY_LAYERS=" + layer.originalWMSLayer.params.LAYERS +
                    "&FEATURE_COUNT=" + featureCount +
                    "&STYLES=" + chart_style +
                    "&CRS=EPSG:4326" +
                    "&BUFFER="+ Portal.app.config.mapGetFeatureInfoBuffer +
                    "&WIDTH=" +  mapPanel.map.size.w +
                    "&HEIGHT="  +   mapPanel.map.size.h +
                    "&TIME=" + chart_time +
                    "&VERSION=" + layer.originalWMSLayer.params.VERSION;

                if (layer.originalWMSLayer.params.VERSION == "1.1.1" || layer.originalWMSLayer.params.VERSION == "1.1.0")
                {
                    url += "&X=" + e.xy.x + "&Y=" + e.xy.y;
                }
                else
                {
                    url += "&I=" + e.xy.x + "&J=" + e.xy.y;
                }
            }
        }
        else {
            
            var bboxBounds = layer.getExtent();
            // only handling WMS-1.3.0 reversing here not ncWMS
            if(layer.server.type == "WMS-1.3.0") { 
                bboxBounds =  new OpenLayers.Bounds.fromArray(bboxBounds.toArray(true));
            } 
			
            if ((!layer.isBaseLayer) && layer.getVisibility() && layer.params.QUERYABLE) {
                if (layer.params.VERSION == "1.1.1" || layer.params.VERSION == "1.1.0") {                
                    url = layer.getFullRequestString({
                        REQUEST: "GetFeatureInfo",
                        EXCEPTIONS: "application/vnd.ogc.se_xml",
                        BBOX: bboxBounds.toBBOX(),
                        X: e.xy.x,
                        Y: e.xy.y,
                        I: e.xy.x, // buggy IVEC NCWMS-1.1.1
                        J: e.xy.y, // buggy IVEC NCWMS-1.1.1
                        INFO_FORMAT: expectedFormat,
                        QUERY_LAYERS: layer.params.LAYERS,
                        FEATURE_COUNT: featureCount,
                        BUFFER: Portal.app.config.mapGetFeatureInfoBuffer,
                        SRS: 'EPSG:4326',
                        WIDTH: layer.map.size.w,
                        HEIGHT: layer.map.size.h
                    });                    
                }
                else if (layer.params.VERSION == "1.3.0") {
                    url = layer.getFullRequestString({
                        REQUEST: "GetFeatureInfo",
                        EXCEPTIONS: "application/vnd.ogc.se_xml",
                        BBOX: bboxBounds.toBBOX(),
                        I: e.xy.x,
                        J: e.xy.y,
                        INFO_FORMAT: expectedFormat,
                        QUERY_LAYERS: layer.params.LAYERS,
                        FEATURE_COUNT: featureCount,
                        //Styles: '',
                        CRS: 'EPSG:4326',
                        BUFFER: Portal.app.config.mapGetFeatureInfoBuffer,
                        WIDTH: layer.map.size.w,
                        HEIGHT: layer.map.size.h
                    });
                }
            }
        }

        if ( url != "none" ) {
            popup.numResultsToLoad++; // Record layers requested

            Ext.Ajax.request({
                url: proxyURL + encodeURIComponent( url ) + "&format=" + encodeURIComponent(expectedFormat), // add format for grails proxy
                params: {
                    name: layer.name,
                    id: layer.id,
                    expectedFormat: expectedFormat,
                    isAnimatedLayer: isAnimatedLayer,
                    units: layer.metadata.units
                },
                success: function(resp, options){
                    if ( popup ) { // Popup may have been closed since request was sent

                        var newTabContent;

                        if(options.params.isAnimatedLayer)
                            newTabContent = "<div><img src='" + url + "'></div>";
                        else
                            newTabContent = formatGetFeatureInfo( resp, options );

                        if (newTabContent) {
                            popup.numGoodResults++;

                            tabsFromPopup( popup ).add( {
                                xtype: "box",
                                id: options.params.id,
                                title: options.params.name,
                                padding: 30,
                                autoHeight: true,
                                cls: "featureinfocontent",
                                autoEl: {
                                    html: newTabContent
                                }
                            });

                            if (popup.numGoodResults == 1) {                                
                                
                                // set to full height and re-pan
                                popup.setSize(Portal.app.config.popupWidth,Portal.app.config.popupHeight);               
                                popup.show(); // since the popup is anchored, calling show will move popup to this location 

                                // Make first tab active
                                var poptabs = tabsFromPopup( popup );
                                poptabs.setActiveTab( 0 );
                                poptabs.doLayout();
                                poptabs.show();

                                setTimeout('imgSizer()', 900); // ensure the popup is ready
                            }
                        }
                        // got a result, maybe empty
                        popup.numResultQueries++;
                        
                        updatePopupStatus(popup);
                    } 
                },

                failure: function(resp, options) { // Popup may have been closed since request was sent
                    updatePopupStatus(popup);
                    // got a fail but its still a result
                    popup.numResultQueries++;
                }
            });
        }
    }
    
    // no layers to query
    if ( popup.numResultsToLoad == 0 ) {
        popup.setTitle("No features found. No queryable layers selected");
    }
}


function closePopup() {
    if (popup) {
        popup.close();
    }
}

function updatePopupDepthStatus(response) {   
    
    if (response != undefined) {
        var xmldoc = response.responseXML;  

        if (xmldoc.getElementsByTagName('depth') != undefined) {

            var depth = xmldoc.getElementsByTagName('depth')[0].firstChild.nodeValue;

            var str =  (depth <= 0) ?  "Depth:" : "Altitude:";

            if ( popup ) { // Popup may have been closed since request was sent
                popup.popupHtml.update(popup.locationString + " <b>" + str + "</b> " + Math.abs(depth) + "m");
            }
        }
    }
    else {
        // clear out any placeholder 'loading' text
        popup.popupHtml.update("");
    }
}

function updatePopupStatus(popup) {
    
    //popup.setTitle("Features at " + popup.locationString);
    if (popup.numGoodResults > 0) {
        popup.setTitle("Feature information found for " + popup.numGoodResults + " / " + popup.numResultsToLoad + " layers");
    }
    else if (popup.numResultQueries == popup.numResultsToLoad) {
        var layerStr = (popup.numResultsToLoad == 1) ? "layer" : "layers";
        popup.setTitle("No features found for " + popup.numResultsToLoad + " queryable " + layerStr);
    }
}

// Get tabs from getFeatureInfo popup
function tabsFromPopup(popup) {    
    return popup.popupTab;
}

// if its XML then ncWMS is assumed. XML can mean errors
function formatGetFeatureInfo(response, options) {

    if(options.params.expectedFormat == 'text/html') {

        // strip out all unwanted HTML
        if ( response.responseText.match(/<\/body>/m)) {

            var html_content  =  response.responseText.match(/(.|\s)*?<body[^>]*>((.|\s)*?)<\/body>(.|\s)*?/m);
            if (html_content) {

                html_content  = html_content[2].replace(/^\s+|\s+$/g, '');  // trim

                if ( html_content.length != 0 ) {
                    return html_content;
                }
            }
        }   
    }
    else if(options.params.expectedFormat == 'text/xml') {
        return setHTML_ncWMS(response,options);
    }
    else if(options.params.expectedFormat.indexOf('image') >= 0){

        // todo - So what do we do here?
    }
    else{
        console.log("ERROR: as yet unhandled response type for getFeatureInfo");
    }
}

function setHTML_ncWMS(response,options) {
    
    var xmldoc = response.responseXML;  
    
    if (xmldoc.getElementsByTagName('longitude')[0] != undefined) { 
        
        var lon  = parseFloat((xmldoc.getElementsByTagName('longitude'))[0].firstChild.nodeValue);

        if (lon) {  // We have a successful result

            var lat = parseFloat((xmldoc.getElementsByTagName('latitude'))[0].firstChild.nodeValue);
            var startval = parseFloat(xmldoc.getElementsByTagName('value')[0].firstChild.nodeValue);
            var x = xmldoc.getElementsByTagName('value');
            var copyright = xmldoc.getElementsByTagName('copyright')[0];
            var vals = "";
            var origStartVal = startval;

            var timeList = xmldoc.getElementsByTagName('time').length;
            var time = null;

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

            var isSD = options.params.name.toLowerCase().indexOf("standard deviation") >= 0;

            if (!isNaN(startval) ) {  // may have no data at this point

                if(time != null)   {
                    
                    var human_time = new Date();
                    human_time.setISO8601(time);
                    if (endtime != null) {
                        var human_endtime = new Date();
                        human_endtime.setISO8601(endtime);                        
                        endval = getAussieUnits(endval, options.params.units);
                    }
                }
                
                var startval = getAussieUnits(startval, options.params.units);
                
                if(human_time != null)  {
                    
                    if (endval == null) {
                        if(isSD)  {
                            vals = "<br /><b>Value at: </b>" + human_time.toUTCString() + " " + "(standard deviation) " + "<b>" + origStartVal + "</b> " + options.params.units;
                        }
                        else {
                            vals = "<br /><b>Value at </b>"+human_time.toUTCString()+"<b> " + startval[0] +"</b> "+ startval[1] + startval[2];
                        }
                    }
                    else {
                        if(isSD)
                        {
                            vals = "<br /><b>Start date:</b>"+human_time.toUTCString()+ " " + "(standard deviation) " +" <b>" + origStartVal + "</b> " + options.params.units;
                            vals += "<br /><b>End date:</b>"+human_endtime.toUTCString()+ " " + "(standard deviation) " + " <b>" + origEndVal + "</b> " + options.params.units;
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
                else {
                    if(isSD)  {
                        vals = "<br /><b>" + "(standard deviation) " + "<b>" + origStartVal + "</b> " + options.params.units;
                    }
                    else {
                        vals = "<br /><b> " + startval[0] +"</b> "+ startval[1] + startval[2];
                    }
                }

                lon = toNSigFigs(lon, 5);
                lat = toNSigFigs(lat, 5);

                html =  "<div class=\"feature\">";
                html += "<b>Lon:</b> " + lon + "<br /><b>Lat:</b> " + lat + "<br /> " +  vals + "\n<br />" + extras;

                if(copyright != undefined) {
                    html += "<p>" + copyright.childNodes[0].nodeValue + "</p>";
                }

                html = html +"</div>";
            }
        }
        else {
            html = "Can't get feature info data for this layer <a href='javascript:popUp('whynot.html', 200, 200)'>(why not?)</a>";
        }
    }
    else {
        console.log("ERROR: getFeatureInfo xml response empty or should have longitude element. response following:");
        console.log(response.responseXML);
    }

    return html;
}

function isncWMS(layer) {
    return getMapPanel().isNcwmsServer(layer);   
}                    
  
function inArray (array,value) {
    
    for (var i = 0; i < array.length; i++) {
        
        if (array[i] === value) {
            return true;
        }
    }
    
    return false;
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

/*  Not used?????
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
        new OpenLayers.Size(Portal.app.config.popupWidth,60),
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
*/

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
    var max_width = Portal.app.config.popupWidth -70 ; 	//Sets the max width, in pixels, for every image
    var selector = 'div > .featureinfocontent .feature img';

    //destroy_imagePopup(); // make sure there is no other
    var tics = new Date().getTime();

    $(selector).each(function(){

        var width = $(this).width();
        var height = $(this).height();

        if (width > max_width) {

            //Set variables for manipulation
            var ratio = (max_width / width );
            var new_width = max_width;
            var new_height = (height * ratio);
            //alert("(popupwidth "+max_width+" "+width + ") " +height+" * "+ratio);

            //Shrink the image and add link to full-sized image
            $(this).animate({
                width: new_width
            }, 'slow').width(new_height);

            $(this).hover(function(){
                $(this).attr("title", "This image has been scaled down.");
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

// This function gets over the Firefox 4096 character limit for XML nodes using 'textContent''
// IE doesn't support the textContent attribute
function getNodeText(xmlNode)
{
    if(!xmlNode) return '';
    if(typeof(xmlNode.textContent) != "undefined") return xmlNode.textContent;
    return xmlNode.firstChild.nodeValue;
}

function setExtWmsLayer(url,label,type,layer,sld,options,style) {
    
    var dl = {}
	var server = {}

	server.uri = url;
	server.type = type;    
	server.opacity = 100;
	dl.server = server;

	dl.queryable = false; // no more

	//dl.sld = sld; //comment out until required from the setExtWmsLayer function

	// style in .ftl's but should be styles
	dl.styles = style;
	dl.name = layer; // layer id on server  
	dl.title = label; 

	// options are comma delimited to include a unique label from a single value such as a dropdown box
	if (options.length > 1) {
		var opts = options.split(",");
		var cql = opts[0];
		var newLabel = label;
		if (opts.length > 1) {
			newLabel = label + " " + opts[1];
		}

		dl.cql = cql;
		if (newLabel.length > 0) {
			dl.title = newLabel;
		} else {
			dl.cql = '';
		}

	}


	getMapPanel().addMapLayer(dl);
}

function IsInt(sText) {

    var ValidChars = "0123456789";
    var IsInt= true;
    sText = sText.trim();
    var Char;
    if (sText.length == "0") {
        IsInt = false;
    }
    else {
        for (i = 0; i < sText.length && IsInt == true; i++) {
            Char = sText.charAt(i);
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