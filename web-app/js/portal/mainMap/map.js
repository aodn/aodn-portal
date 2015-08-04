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

// Used by IMOS getFeatureInfo content.ftl's
function showChannel(css_id, facilityName) {
    jQuery("#[id*=" + facilityName + "]").hide();
    jQuery('#' + facilityName + css_id).show(450);
    Portal.utils.Image.resizeWhenLoadedAfterDelay('div > .featureinfocontent .feature img', 500);
}
