
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

$(document).ready( function() {
    // hide the popup if user mouses out of area
    $("#loginpopup").mouseleave(function(){
        $("#loginpopup").hide();
    });

    if ($.browser.msie && $.browser.version < 10) {
        // For IE8 and IE9, toggle() and slideToggle() rail to raise popup in jquery 1.4.1.
        // (Note that testing shows they do work with with jquery-1.10.1.js)
        // Instead use show()
        $("#loginbutton").click(function(){
            $("#loginpopup").show();
        });
    }
    else {
        // Firefox, Chromium et al.
        // slideToggle() tests existing state, and combines well with mouseleave()
        $("#loginbutton").click(function(){
            $("#loginpopup").slideToggle();
        });
    }
});

function clearOnce(input_element) {
    if (!input_element.alreadyCleared) {
        input_element.value = "";
        input_element.alreadyCleared = true;
    }
}
