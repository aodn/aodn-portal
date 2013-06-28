/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */




//Formats the given value to numSigFigs significant figures
function toNSigFigs(num, dec) {
    	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}

function ucwords( str ) {
    // Uppercase the first character of every word in a string
    return (str+'').replace(/^(.)|\s(.)/g, function ( $1 ) {
        return $1.toUpperCase ( );
    } );
}



// if units label is known as fahrenheit or kelvin, convert val to celcius
function getAussieUnits(val,src_units) {
     var cel = "";
     var c = "&#176;C";
     var ret = [];
     var toReturn = [];
     var old = "";
     
     if (src_units != undefined) {
         src_units = src_units.toLowerCase();
         src_units = src_units.replace(/^\s+|\s+$/g, '');  // trim
         // arrays hold all possible names for a 'type'
         // 
         // ALL ARRAY ENTRIES IN LOWER CASE
         var celNameArray = ["c","celcius","cel","deg_c","degrees c"];
         var farNameArray = ["f","fahrenheit"];
         var kelNameArray = ["k","kelvin","kel"];
         var metresNameArray = ["m","metres","meters","metre"]

         // fahrenheit
          if (inArray(farNameArray,src_units)) {
            cel = (val - 32) / 1.8;
            old = " (<b>"+toNSigFigs(val,4) +"</b> fahrenheit)";
            ret = [toNSigFigs(cel,4),c,old];
            //console.log("farren");
          }
          // kelvin
          else if (inArray(kelNameArray,src_units)) {
            cel = val - 272.15;
            old = " (<b>" + toNSigFigs(val,4) + "</b> kelvin)";
            ret = [toNSigFigs(cel,4),c,old];
            
           // console.log("kel");
          }
          // celcius
          else if (inArray(celNameArray,src_units)) {
             ret = [toNSigFigs(val,4),c,""];
             cel = "success";
             
            //console.log("cel");
          }
          // metres
          else if (inArray(metresNameArray,src_units)) {
             ret = [toNSigFigs(val,2),"m",""];
             cel = "success";
          }


          // if cel empty then the unit wasnt suitable
          // or we cant even anticipate..
          if (cel == "") {
              cel = val;
              toReturn = [toNSigFigs(cel,4),src_units,""];
          }
          else {
              toReturn = ret;
          }
     }
     else {
         toReturn = [val," (unknown units)",""]; // return what was supplied as an array as expected
     }
     
     return toReturn;

}


function pad(numNumber, numLength){
	var strString = '' + numNumber;
	while(strString.length<numLength){
		strString = '0' + strString;
	}
	return strString;
}


//if its XML then ncWMS is assumed. XML can mean errors
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
	else if(options.params.expectedFormat == 'text/plain') {
		// cant be assed to handle different line endings. its crap anyhow
        return "<div class=\"featureinfocontent\"><pre>" + response.responseText + "</pre></div>";
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

                if(xmldoc.getElementsByTagName('copyright')[0] != undefined) {
                    // If copyright was returned in GetFeatureInfo, we can simply implant it with no decoding
                    html += "<p>" + xmldoc.getElementsByTagName('copyright')[0].childNodes[0].nodeValue + "</p>";
                } else if (options.params.copyright != undefined) {
                    // If copyright was returned in GetMetadata we need to decode the html
                    var decodedCopyright = $('<div/>').html(options.params.copyright).text();
                    html += "<p>" + decodedCopyright + "</p>";
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


function inArray (array,value) {
    
    for (var i = 0; i < array.length; i++) {
        
        if (array[i] === value) {
            return true;
        }
    }
    
    return false;
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


function expandExtendedISO8601Dates(splitDates) {

    /*
    Expand setISO8601 repeating intervals from array
    EG: [ "2001-01-10T22:36:00.000Z/2001-01-12T21:48:00.000Z/PT23H36M", "2002-01-10T22:36:00.000Z/2003-01-12T21:48:00.000Z/PT23H36M" ]
    */

    var isoDate;

    // Optimize array length - we'll have at least splitDates.length items
    // or more (usually)
    var expandedDates = [];
	expandedDates.length = splitDates.length;

    // Array insertion position
    var j = 0;
    for (var i = 0; i < splitDates.length; i++) {

        isoDate = splitDates[i].split("/");

        var x = isoDate.length;
        // no default condition
        switch (x)  {
            case 1:
                expandedDates[j++] = moment(splitDates[i]);
                break;
            case 2:
                console.log("ERROR: Unhandled date format: " + splitDates[i]);
                break;
            case 3:
                var arrayOfDateTimes = _expand3sectionExtendedISO8601Date(splitDates[i]);
                for (var x = 0; x < arrayOfDateTimes.length; x++) {
                    expandedDates[j++] = arrayOfDateTimes[x];
                }
                break;
        }

   }
   // Readjust array
   expandedDates.length = j;
   return expandedDates;
}

function _expand3sectionExtendedISO8601Date(extendedISO8601Date) {

    /* expecting the 3 part format as seen from ncWMS
        start / endate / interval
        EG: 2001-01-10T22:36:00.000Z/2001-01-12T21:48:00.000Z/PT23H36M
    */

    var expandedDates = new Array();

    var iSO8601DateParts = extendedISO8601Date.split("/");
    var period = iSO8601DateParts[2];

    // 'P' indicates that the duration that follows is specified by the number of years, months, days, hours, minutes, and seconds
    if (period.indexOf( "P" ) == 0) {

        var duration = moment.duration(_getISO8601Period(period));
        var nextDate = moment(iSO8601DateParts[0]);
        var endDate = moment(iSO8601DateParts[1]);

        if (nextDate.isValid()) {
            while (!nextDate.isAfter(endDate)) {
                expandedDates.push(nextDate.clone());
                nextDate.add(duration);
            }

            // always end with the last date
            if (!expandedDates[expandedDates.length - 1] .isSame (endDate)) {
                expandedDates.push(endDate.clone());
            }
        }
    }
    else {
        console.log('Date not understood: ' + period);
    }

    // Don't try to sort it, it's an array of moment()s, it'll sort
    // references in memory rather than compare dates.
    return expandedDates;
}


function _getISO8601Period(period) {



    // rip off the 'P'
    var _period  = period.substring(1);

    var moArray = new Array();
    var dateParts = _period;
    var timeParts = "";

    // 'T' indicates start of time elements
    if (_period.indexOf( "T" ) > -1) {
        var parts =  _period.split("T");
        dateParts = parts[0];
        timeParts = parts[1];
    }

    // expecting in order years, months, days
    if (dateParts.indexOf( "Y" ) > -1) {
        moArray[0] =  dateParts.split("Y")[0];
        dateParts =  dateParts.split("Y")[1];
    }
    if (dateParts.indexOf( "M" ) > -1) {
        moArray[1] =  dateParts.split("M")[0];
        dateParts =  dateParts.split("M")[1];
    }
    if (dateParts.indexOf( "W" ) > -1) {
        moArray[2] =  dateParts.split("W")[0];
        dateParts =  dateParts.split("W")[1];
    }
    if (dateParts.indexOf( "D" ) > -1) {
        moArray[3] =  dateParts.split("D")[0];
    }
    // expecting in order hours, minutes, and seconds
    if (timeParts.indexOf( "H" ) > -1) {
        moArray[4] =  timeParts.split("H")[0];
        timeParts =  timeParts.split("H")[1];
    }
    if (timeParts.indexOf( "M" ) > -1) {
        moArray[5] =  timeParts.split("M")[0];
        timeParts =  timeParts.split("M")[1];
    }
    if (timeParts.indexOf( "S" ) > -1) {
        moArray[6] =  timeParts.split("S")[0];
    }



    return {
        'seconds': Number(moArray[6]),
        'minutes': Number(moArray[5]),
        'hours':   Number(moArray[4]),
        'days':    Number(moArray[3]),
        'weeks':   Number(moArray[2]),
        'months':  Number(moArray[1]),
        'years':   Number(moArray[0])
    }



}



// IE 8 throws errors with console not existing
// Console will exist when using developer tools
if (typeof console === "undefined" || typeof console.log === "undefined") {
 console = {};
 console.log = function(msg) {
      //alert(msg); 
 };
 
}
