//Formats the given value to numSigFigs significant figures
function toNSigFigs(num, dec) {
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
}

// if units label is known as fahrenheit or kelvin, convert val to celcius
function getAussieUnits(val, src_units) {
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
        var metresNameArray = ["m","metres","meters","metre"];

        // fahrenheit
        if (inArray(farNameArray,src_units)) {
            cel = (val - 32) / 1.8;
            old = " (<b>"+toNSigFigs(val,4) +"</b> fahrenheit)";
            ret = [toNSigFigs(cel,4),c,old];
            //console.log("farren");
        }
        else if (inArray(kelNameArray,src_units)) {
            // kelvin
            cel = val - 272.15;
            old = " (<b>" + toNSigFigs(val,4) + "</b> kelvin)";
            ret = [toNSigFigs(cel,4),c,old];

        // console.log("kel");
        }
        else if (inArray(celNameArray,src_units)) {
            // celcius
            ret = [toNSigFigs(val,4),c,""];
            cel = "success";

            //console.log("cel");
        }
        else if (inArray(metresNameArray,src_units)) {
            // metres
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

function pad(numNumber, numLength) {
    var strString = '' + numNumber;
    while(strString.length<numLength) {
        strString = '0' + strString;
    }
    return strString;
}

function cleanStringForFunctionParameter(parameter) {
    return parameter.replace(/["()']+/g, "");
}

//if its XML then ncWMS is assumed. XML can mean errors
function formatGetFeatureInfo(response, options) {

    var expectedFormat = options.extraParams.expectedFormat;

    if (expectedFormat == 'text/html') {

        // strip out all unwanted HTML
        if (response.responseText.match(/<\/body>/m)) {

            var html_content  =  response.responseText.match(/(.|\s)*?<body[^>]*>((.|\s)*?)<\/body>(.|\s)*?/m);
            if (html_content) {

                html_content  = html_content[2].replace(/^\s+|\s+$/g, '');  // trim

                if ( html_content.length != 0 ) {
                    return html_content;
                }
            }
        }
    }
    else if (expectedFormat == 'text/xml' && response.responseXML) {
        return setHTML_ncWMS(response, options);
    }
    else if (expectedFormat == 'text/plain') {
        // cant be assed to handle different line endings. its crap anyhow
        return "<div class=\"featureinfocontent\"><pre>" + response.responseText + "</pre></div>";
    }
    else {
        log.error("Unhandled response type for getFeatureInfo: '" + expectedFormat + "'");
        return '';
    }
}

function setHTML_ncWMS(response, options) {
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

            if (timeList > 0) {
                time = xmldoc.getElementsByTagName('time')[0].firstChild.nodeValue;
            }

            if (x.length > 1) {
                var endval = parseFloat(xmldoc.getElementsByTagName('value')[x.length -1].childNodes[0].nodeValue);
                if (time != null)
                    var endtime = xmldoc.getElementsByTagName('time')[x.length -1].firstChild.nodeValue;
            }
            var origEndVal = endval;

            var html = "";
            var  extras = "";

            var isSD = options.extraParams.name.toLowerCase().indexOf("standard deviation") >= 0;

            if (!isNaN(startval) ) {  // may have no data at this point

                if (time != null)   {

                    var human_time = new Date();
                    human_time.setISO8601(time);
                    if (endtime != null) {
                        var human_endtime = new Date();
                        human_endtime.setISO8601(endtime);
                        endval = getAussieUnits(endval, options.extraParams.units);
                    }
                }

                var startval = getAussieUnits(startval, options.extraParams.units);

                if (human_time != null)  {

                    if (endval == null) {
                        if (isSD)  {
                            vals = "<br /><b>Value at: </b>" + human_time.toUTCString() + " " + "(standard deviation) " + "<b>" + origStartVal + "</b> " + options.extraParams.units;
                        }
                        else {
                            vals = "<br /><b>Value at </b>"+human_time.toUTCString()+"<b> " + startval[0] +"</b> "+ startval[1] + startval[2];
                        }
                    }
                    else {
                        if (isSD)
                        {
                            vals = "<br /><b>Start date:</b>"+human_time.toUTCString()+ " " + "(standard deviation) " +" <b>" + origStartVal + "</b> " + options.extraParams.units;
                            vals += "<br /><b>End date:</b>"+human_endtime.toUTCString()+ " " + "(standard deviation) " + " <b>" + origEndVal + "</b> " + options.extraParams.units;
                            vals += "<BR />";
                        }
                        else {
                            vals = "<br /><b>Start date:</b>"+human_time.toUTCString()+": <b> " + startval[0] +"</b> "+ startval[1] + startval[2];
                            vals += "<br /><b>End date:</b>"+human_endtime.toUTCString()+":<b> " + endval[0] +"</b> "+ endval[1]  + endval[2];
                            vals += "<BR />";
                        }
                    }
                }
                else {
                    if (isSD)  {
                        vals = "<br /><b>" + "(standard deviation) " + "<b>" + origStartVal + "</b> " + options.extraParams.units;
                    }
                    else {
                        vals = "<br /><b> " + startval[0] +"</b> "+ startval[1] + startval[2];
                    }
                }

                lon = toNSigFigs(lon, 5);
                lat = toNSigFigs(lat, 5);

                html =  "<div class=\"feature\">";
                html += "<b>Lon:</b> " + lon + "<br /><b>Lat:</b> " + lat + "<br /> " +  vals + "\n<br />" + extras;

                if (xmldoc.getElementsByTagName('copyright')[0] != undefined) {
                    // If copyright was returned in GetFeatureInfo, we can simply implant it with no decoding
                    html += "<p>" + xmldoc.getElementsByTagName('copyright')[0].childNodes[0].nodeValue + "</p>";
                }
                else if (options.extraParams.copyright != undefined) {
                    // If copyright was returned in GetMetadata we need to decode the html
                    var decodedCopyright = $('<div/>').html(options.extraParams.copyright).text();
                    html += "<p>" + decodedCopyright + "</p>";
                }

                html = html +"</div>";
            }
        }
        else {
            html = "Can't get feature info data for this collection";
        }
    }
    else {
        log.error("getFeatureInfo xml response empty or should have longitude element. response following:");
        log.error(response.responseXML);
    }

    return html;
}

function inArray(array, value) {

    for (var i = 0; i < array.length; i++) {

        if (array[i] === value) {
            return true;
        }
    }

    return false;
}

// Performs a binary search on a sorted array using
// isGreaterFunction should return true if lhs is greater than rhs
function binSearch(sortedArray, value, isGreaterFunction, scope) {
    var _scope = scope ? scope : this;
    var min = 0;
    var max = sortedArray.length - 1;
    while (max >= min) {
        var mid = Math.floor((max + min) / 2);
        // If it's not greater and not smaller - it's equal!
        if (!isGreaterFunction.call(_scope, value, sortedArray[mid]) &&
            !isGreaterFunction.call(_scope, sortedArray[mid], value)) {
            return mid;
        }
        else if (isGreaterFunction.call(_scope, sortedArray[mid], value)) {
            max = mid - 1;
        }
        else {
            min = mid + 1;
        }
    }
    return -1;
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
};

function getPortalBase(pathname) {
    if (!pathname) {
        pathname = window.location.pathname;
    }
    return pathname.replace(/\/search$/, "");
};

function normaliseLongitude(longitude) {
    if (longitude >= -180 && longitude <= 180)
        return longitude; // No need to normalize!
    else
        return (longitude + 540) % 360 - 180;
};

// Remove all child nodes of HTML elements from the DOM
function clearContents(jQuerySelector) {
    jQuery(jQuerySelector).empty();
}

function animateNumberField(jQueryParentIdSelector) {
    jQuery("#" + jQueryParentIdSelector + ' .x-form-num-field').addClass('animatedBox').delay(1500).queue(function(){
        $(this).removeClass('animatedBox').clearQueue();
    });
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
