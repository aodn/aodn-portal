Ext.namespace('Portal.utils.Image');

Portal.utils.Image.resizeWhenLoadedAfterDelay = function(selector, delayMs) {
    $(selector).load(function() {
        Portal.utils.Image.resizeAfterDelay($(this), delayMs);
    });
};

Portal.utils.Image.resizeAfterDelay = function(img, delayMs) {
    setTimeout(function() {
        Portal.utils.Image.resize(img);
    }, delayMs);
};

Portal.utils.Image.resize = function(img) {
    // from stack overflow: http://stackoverflow.com/questions/318630/get-real-image-width-and-height-with-javascript-in-safari-chrome
    // Configuration Options
    var max_width = Portal.app.appConfig.portal.popupWidth - 70 ;     //Sets the max width, in pixels, for every image

    var width = img.width();
    var height = img.height();

    if (width > max_width) {

        //Set variables for manipulation
        var ratio = (max_width / width );
        var new_width = max_width;
        var new_height = (height * ratio);
        //alert("(popupwidth "+max_width+" "+width + ") " +height+" * "+ratio);

        //Shrink the image and add link to full-sized image
        img.animate({
            width: new_width
        }, 'slow').width(new_height);

        img.hover(function() {
            img.attr("title", OpenLayers.i18n('imageScaledDown'));
        });
    }
};
