
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

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


function imgSizer() {
    //Configuration Options
    var max_width = Portal.app.config.popupWidth -70 ;     //Sets the max width, in pixels, for every image
    var selector = 'div > .featureinfocontent .feature img';

    //destroy_imagePopup(); // make sure there is no other
    var tics = new Date().getTime();

    $(selector).each(function() {

        //from stack overflow: http://stackoverflow.com/questions/318630/get-real-image-width-and-height-with-javascript-in-safari-chrome
        var pic_real_width, pic_real_height;
        $(this) // Make in memory copy of image to avoid css issues
            .load(function() {
                pic_real_width = this.width;   // Note: $(this).width() will not
                pic_real_height = this.height; // work for in memory images.
            });

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

            $(this).hover(function() {
                $(this).attr("title", OpenLayers.i18n('imageScaledDown'));
            });

        }
    });
}


/*jQuery showhide (toggle visibility of element)
 *  param: the dom element
 *  ie: #theId or .theClass
 */
// Used by IMOS getFeatureInfo content.ftl's
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
// Used by IMOS getFeatureInfo content.ftl's
function showChannel(css_id, facilityName) {
    jQuery("#[id*=" + facilityName + "]").hide();
    jQuery('#' + facilityName + css_id).show(450);
    imgSizer();
}

function dressUpMyLine(line) {
    var x = line.split(",");
    var newString = "";

    for(i = 0; i < x.length; i++) {
        var latlon = x[i].split(" ");
        var lon = latlon[0].substring(0, latlon[0].lastIndexOf(".") + 4);
        var lat = latlon[1].substring(0, latlon[1].lastIndexOf(".") + 4);
        newString = newString + "Lon:" + lon + " Lat:" +lat + ",<BR>";
    }
    return newString;
}


