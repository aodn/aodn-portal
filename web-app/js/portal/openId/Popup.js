/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

$(document).ready( function()
{
    // hide the popup if user mouses out of area
    $( "#loginpopup").mouseleave( function(){
        $( "#loginpopup").hide();
    } ) ;

    // toggle tests existing state, so combines with mouseleave cleanly
    // use the animation version of toggle()
    $("#loginbutton").click(function(){
        $( "#loginpopup").slideToggle();
    });
}  ) ;

function clearOnce(input_element)
{
    if (!input_element.alreadyCleared)
    {
        input_element.value = "";
        input_element.alreadyCleared = true;
    }
}