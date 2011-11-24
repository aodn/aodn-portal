
/* getMouseXY
// 
// Detect if the browser is IE or not.
// If it is not IE, we assume that the browser is NS.
var IE = document.all?true:false

// If NS -- that is, !IE -- then set up for mouse capture
if (!IE) document.captureEvents(Event.MOUSEMOVE)

// Set-up to use getMouseXY function onMouseMove
document.onmousemove = getMouseXY;

// Temporary variables to hold mouse x-y pos.s
var tempX = 0
var tempY = 0

function getMouseXY(e) {
  if (IE) { // grab the x-y pos.s if browser is IE
    tempX = event.clientX + document.body.scrollLeft
    tempY = event.clientY + document.body.scrollTop
  } else {  // grab the x-y pos.s if browser is NS
    tempX = e.pageX
    tempY = e.pageY
  }  
  // catch possible negative values in NS4
  if (tempX < 0){tempX = 0}
  if (tempY < 0){tempY = 0}  
  return true
}
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

// From old map.js Move this to Extjs framework

function getXML(request_string) {

        if (window.XMLHttpRequest)  {
            xhttp=new XMLHttpRequest();
        }
        else {// Internet Explorer 5/6
            xhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhttp.open("GET",proxyURL+encodeURIComponent(request_string)+"&format=xml",false);
        xhttp.send("");
       return xhttp.responseXML;

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


function pad(numNumber, numLength){
	var strString = '' + numNumber;
	while(strString.length<numLength){
		strString = '0' + strString;
	}
	return strString;
}

// IE 8 throws errors with console not existing
// Console will exist when using developer tools
if (typeof console === "undefined" || typeof console.log === "undefined") {
 console = {};
 console.log = function(msg) {
      //alert(msg); // never want to develop in IE ... never 
 };
 
}