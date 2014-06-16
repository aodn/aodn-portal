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
