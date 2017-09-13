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
    jQuery('div.feature[id^=" + facilityName + "]').hide();
    jQuery('#' + facilityName + css_id).show(450);
    Portal.utils.Image.resizeWhenLoadedAfterDelay('div > .featureinfocontent .feature img', 500);
}
