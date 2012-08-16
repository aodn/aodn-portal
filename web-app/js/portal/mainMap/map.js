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

/*
function inArray (array,value) {
    
    for (var i = 0; i < array.length; i++) {
        
        if (array[i] === value) {
            return true;
        }
    }
    
    return false;
}
*/
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
*/
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

	dl.queryable = true; // Setting to true because our proxy will not connect to any untrusted servers

	//dl.sld = sld; //comment out until required from the setExtWmsLayer function

	// style in .ftl's but should be styles
	dl.defaultStyle = style;
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


	getMapPanel().addExternalLayer(dl);
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