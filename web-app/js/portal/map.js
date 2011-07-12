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
/**
 * Instance of OpenLayers map
 */
var map;
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

var testing;//Variable for debug.


// Pop up things
var popup;
var bogusMarkup = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.";
function addToPopup(loc,mapPanel,e) {
		
        // create the popup if it doesn't exist
        if (!popup) {
            popup = new GeoExt.Popup({
                title: "Popup",
                width: 400,
				height: 300,
                maximizable: true,
                collapsible: true,
                map: mapPanel.map,
                anchored: true,
				autoScroll: true, 
                listeners: {
                    close: function() {
                        // closing a popup destroys it, but our reference is truthy
                        popup = null;
                    }
                }
            });
        }

		var map = mapPanel.map;
		var wmsLayers = map.getLayersByClass("OpenLayers.Layer.WMS");
		var imageLayers = map.getLayersByClass("OpenLayers.Layer.Image");

		wmsLayers = wmsLayers.concat(imageLayers);
		
		for (key in wmsLayers) {
			if (map.layers[key] != undefined && map.layers[key].id !=undefined) {
			   url="none";
			   var layer = map.getLayer(map.layers[key].id);
				if ((!layer.isBaseLayer) && layer.queryable) {
					if (layer.animatedNcwmsLayer) {
					   if (layer.tile.bounds.containsLonLat(lonlat)) {
							url = layer.baseUri +
							"&EXCEPTIONS=application/vnd.ogc.se_xml" +
							"&BBOX=" + layer.getExtent().toBBOX() +
							"&I=" + e.xy.x +
							"&J=" + e.xy.y +
							"&INFO_FORMAT=text/xml" +
							"&CRS=EPSG:4326" +
							"&WIDTH=" + map.size.w +
							"&HEIGHT=" +  map.size.h +
							"&BBOX=" + map.getExtent().toBBOX();


							timeSeriesPlotUri =
							layer.timeSeriesPlotUri +
							"&I=" + e.xy.x +
							"&J=" + e.xy.y +
							"&WIDTH=" + layer.map.size.w +
							"&HEIGHT=" +  layer.map.size.h +
							"&BBOX=" + map.getExtent().toBBOX();

						}
					}
					else if (layer.params.VERSION == "1.1.1") {
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
                       
			if(url!="none"){
                                format = "html";
                                if(layer.isncWMS!=undefined) format = "xml";
                                
				Ext.Ajax.request({
				   url: proxyURL+encodeURIComponent(url),
                                   params: {format: format},
				   success: function(resp){		 
					  // add some content to the popup (this can be any Ext component)
						popup.add({
							xtype: "box",
							autoEl: {
								html: formatGetFeatureInfo(resp)
							}
						});

						// reset the popup's location
						popup.location = loc;
						
						popup.doLayout();
						// since the popup is anchored, calling show will move popup to this location
						popup.show();
                                                imgSizer();
					}
				});
			}
		  }
		}
}


OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {                

    defaultHandlerOptions: {
        single: true,
        double: false,
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


// First solution where the only distinction if we have XML response
// then I know is XML. For the future I think the proxy should return some
// extra information to be used by the formatFetFeatureInfo, for example an
// xml document where the first value is the javascript function that has to
// applied to format the get feature Info.
function formatGetFeatureInfo(response){
        if(response.responseXML == null){
            return response.responseText;
        }else{
            return setHTML_ncWMS(response);
        }
}


function setHTML_ncWMS(response) {

    
    var xmldoc = response.responseXML;
    if (xmldoc==null) return "response not in xmls";
    var lon  = parseFloat((xmldoc.getElementsByTagName('longitude'))[0].firstChild.nodeValue);
    var lat  = parseFloat((xmldoc.getElementsByTagName('latitude'))[0].firstChild.nodeValue);
    var startval  = parseFloat(xmldoc.getElementsByTagName('value')[0].firstChild.nodeValue);
    var x    = xmldoc.getElementsByTagName('value');
    var copyright = xmldoc.getElementsByTagName('copyright');
    var vals = "";
    var origStartVal = startval;

    var time = xmldoc.getElementsByTagName('time')[0].firstChild.nodeValue;
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

            
            html = "<h3>"+layer_type+"</h3>";

            
            html +=        "<div class=\"feature\">";

            html += "<b>Lon:</b> " + lon + "<br /><b>Lat:</b> " + lat + "<br /> " +  vals + "\n<BR />" + extras;

                // to do add transect drawing here
                //
           html += "<BR><h6>Get a graph of the data along a transect via layer options!</h6>\n";
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
	var i;
	for (i=0; i < array.length; i++) {
		if (array[i] === value) {
			return true;
		}
	}
	return false;
}


function is_ncWms(type) {
    return ((type == parent.ncwms)||
        (type == parent.thredds));
}

function isWms(type) {
    return (
        (type == parent.wms100) ||
        (type == parent.wms110) ||
        (type == parent.wms111) ||
        (type == parent.wms130) ||
        (type == parent.ncwms) ||
        (type == parent.thredds));
}


function getDepth(e) {

    var I= e.xy.x; //pixel on map
    var J= e.xy.y; // pixel on map
    var click = map.getLonLatFromPixel(new OpenLayers.Pixel(I,J));

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

// designed for Geoserver valid response
function setHTML2(response) {

        var pointInfo_str = '';

        var tmp_response = response.responseText;
        var html_content = "";

        if (tmp_response.match(/<\/body>/m)) {

            html_content  = tmp_response.match(/(.|\s)*?<body[^>]*>((.|\s)*?)<\/body>(.|\s)*?/m);
            if (html_content) {
                //trimmed_content= html_content[2].replace(/(\n|\r|\s)/mg, ''); // replace all whitespace
                html_content  = html_content[2].replace(/^\s+|\s+$/g, '');  // trim
            }
        }

        if (html_content.length > 0) {
            // at least one valid query
            queries_valid_content = true;
            this.layer_data = true;
        }

    if (handleQueryStatus(this)) {
        setFeatureInfo(html_content,true);
    }


}


// if units label is known as fahrenheit or kelvin, convert val to celcius
function getCelsius(val,src_units) {
     var cel = "";
     var c = "&#176;C";
     var ret = [];
     var old = "";
     src_units = src_units.toLowerCase();
     src_units = src_units.replace(/^\s+|\s+$/g, '');  // trim
     // arrays hold all posiible names for farenheight or kelvin and celcius
     var celNameArray = ["c","celcius","cel","deg_c"];
     var farNameArray = ["f","fahrenheit"];
     var kelNameArray = ["k","kelvin","kel"]


     // fahrenheit
      if (inArray(farNameArray,src_units)) {
        cel = (val - 32) / 1.8;
        old = " (<b>"+toNSigFigs(val,4) +"</b>fahrenheit)";
        ret = [toNSigFigs(cel,4),c,old];
      }
      // kelvin
      else if (inArray(kelNameArray,src_units)) {
        cel = val - 272.15;
        old = " (<b>" + toNSigFigs(val,4) + "</b>kelvin)";
        ret = [toNSigFigs(cel,4),c,old];
      }
      // celcius
      else if (inArray(celNameArray,src_units)) {
         ret = [toNSigFigs(val,4),c,""];
         cel = "himum";
      }


      // if cel empty then the unit wasnt temperature
      // or we cant even anticipate..
      if (cel == "") {
          cel = val;
          return [toNSigFigs(cel,4),src_units,""];
      }
      else {
          return ret;
      }

}

function getCurrentFeatureInfo() {
    return jQuery('#featureinfocontent').html();
}

function setFeatureInfo(content,line_break) {

    showpopup();
    var br = "";
    if (line_break == true ) {
        br = "<hr>\n\n";
    }
    //jQuery('#featureinfocontent').html(content).hide();
    if (content.length > 0 ) {
        jQuery('#featureinfocontent').prepend(content+br).hide().fadeIn(400);
    }
    if (jQuery('#featureinfocontent').html() != "") {
        map.popup.setSize(new OpenLayers.Size(popupWidth,popupHeight));
        //
    }

    jQuery('#featureinfocontent').fadeIn(400);

}

// Special popup for ncwms transects
function mkTransectPopup(inf) {

    killTransectPopup(); // kill previous unless we can make these popups draggable
    var posi = map.getLonLatFromViewPortPx(new OpenLayers.Geometry.Point(60,20));

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
    map.popup2 = popup2;
    map.addPopup(popup2);


}

function killTransectPopup() {
    if (map.popup2 != null) {
        map.removePopup(map.popup2);
        map.popup2.destroy();
        map.popup2 = null;
    }
}

// called when a click is made
function mkpopup(e) {

    var point = e.xy;
    var pointclick = map.getLonLatFromViewPortPx(point.add(2,0));

    // kill previous popup to startover at new location
    if (map.popup != null) {
        map.removePopup(map.popup);
        map.popup.destroy();
        map.popup = null;
    }

    var html = "<div id=\"featureinfoheader\"><h4>New Query:</h4></div>" +
    "<div id=\"featureinfostatus\">" +
    "Waiting on the response for <b>" + requestCount + "</b> layers..." +
    "<img class=\"small_loader\" src=\"/webportal/img/loading_small.gif\" /></div>"  +
    "<div id=\"featureinfodepth\"></div>" +
    "<div class=\"spacer\" style=\"clear:both;height:2px;\">&nbsp;</div>" +
    "<div id=\"featureinfocontent_topborder\"><img id=\"featureinfocontent_topborderimg\" src=\"img/mapshadow.png\" />\n" +
    "<div id=\"featureinfocontent\"></div>\n</div>" ;
    popup = new OpenLayers.Popup.AnchoredBubble( "getfeaturepopup",
        pointclick,
        new OpenLayers.Size(popupWidth,popupHeight),
        html,
        null, true, null);


    popup.panMapIfOutOfView = true;
    //popup.autoSize = true;
    map.popup = popup;
    map.addPopup(popup);
    map.popup.setOpacity(0.9);

    /* shrink back down while searching.
     * popup will always pan into view with previous size.
     * close image always therefore visible
    */
    map.popup.setSize(new OpenLayers.Size(popupWidth,50));

    // a prompt for stupid people
    if (requestCount == "0") {
        jQuery('#featureinfostatus').html("<font class=\"error\">Please choose a queryable layer from the menu..</font>").fadeIn(400);
    }
}

function hidepopup() {
    if ((map.popup != null)) {
         jQuery('div.olPopup').fadeOut(900);
    }
}

function showpopup() {

    if ((map.popup != null)) {
        map.popup.setOpacity(1);
        setTimeout('imgSizer()', 900); // ensure the popup is ready
    }

}

//server might be down
function setError(response) {
    alert("The server is unavailable");
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

//Formats the given value to numSigFigs significant figures
//WARNING: Javascript 1.5 only!
function toNSigFigs(value, numSigFigs) {
    if (!value.toPrecision) {
        return value;
    } else {
        return value.toPrecision(numSigFigs);
    }
}

function ucwords( str ) {
    // Uppercase the first character of every word in a string
    return (str+'').replace(/^(.)|\s(.)/g, function ( $1 ) {
        return $1.toUpperCase ( );
    } );
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

            //map.setCenter(new OpenLayers.LonLat(lon,lat),zoomlevel,1,1);

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
			map.addLayer(layer);
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



/*function getXML(request_string) {
        var xml;
        var conn = new Ext.data.Connection;
        conn.request({
          url: proxyURL+encodeURIComponent(request_string)+"&format=xml",
          callback: function(options, success, response)
          {
            testing=response;
            if (success){      
                xml=response.responseXML;
                return xml;
            }else{
                xml=null;
                return xml;
            }
          }
        });
        alert("outsidecall: "+xml);
        
}*/
// Move this to Extjs framework

function getXML(request_string) {

        if (window.XMLHttpRequest)  {
            xhttp=new XMLHttpRequest();
        }
        else {// Internet Explorer 5/6
            xhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhttp.open("GET",proxyURL+encodeURIComponent(request_string)+"&format=xml",false);
        xhttp.send("");
        testing=xhttp;
       return xhttp.responseXML;

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



function formatISO8601Date(dateString) {

    var d_names = new Array("Sun", "Mon", "Tues",
    "Wed", "Thur", "Fri", "Sat");

    var m_names = new Array("Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec");

    var a_p = "";
    var d = new Date();
	d.setISO8601(dateString);

    var curr_date = d.getDate();
    var curr_year = d.getFullYear();
    var curr_month = d.getMonth();
    var curr_day = d.getDay();
    var curr_min = d.getMinutes();
    var curr_hour = d.getHours();

    var sup = "";
    if (curr_date == 1 || curr_date == 21 || curr_date ==31)  {
       sup = "st";
       }
    else if (curr_date == 2 || curr_date == 22)  {
       sup = "nd";
       }
    else if (curr_date == 3 || curr_date == 23)   {
       sup = "rd";
       }
    else   {
       sup = "th";
       }


    var date = (d_names[curr_day] + " " + curr_date + ""
    + sup + " " + m_names[curr_month] + " " + curr_year);

    if (curr_hour < 12)   {
       a_p = "AM";
       }
    else  {
       a_p = "PM";
       }
    if (curr_hour == 0)   {
       curr_hour = 12;
       }
    if (curr_hour > 12)   {
       curr_hour = curr_hour - 12;
       }

    curr_min = curr_min + "";

    if (curr_min.length == 1)      {
       curr_min = "0" + curr_min;
       }

    var time =  curr_hour + ":" + curr_min + "" + a_p;
    return (date + " " + time);

}
// Not handling timezone offset correctly
Date.prototype.setISO8601 = function (string) {
    var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
        "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
        "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
    var d = string.match(new RegExp(regexp));

    var offset = 0;
    var date = new Date(d[1], 0, 1);

    if (d[3]) {date.setMonth(d[3] - 1);}
    if (d[5]) {date.setDate(d[5]);}
    if (d[7]) {date.setHours(d[7]);}
    if (d[8]) {date.setMinutes(d[8]);}
    if (d[10]) {date.setSeconds(d[10]);}


    //if (d[12]) {date.setMilliseconds(Number("0." + d[12]) * 1000);}
    //if (d[14]) {
    //    offset = (Number(d[16]) * 60) + Number(d[17]);
    //    offset *= ((d[15] == '-') ? 1 : -1);
    //}

    //offset -= date.getTimezoneOffset();
    time = (Number(date) + (offset * 60 * 1000));
    this.setTime(Number(time));
}
