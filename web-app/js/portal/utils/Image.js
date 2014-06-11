/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.utils.Image');

Portal.utils.Image.resize = function(selector) {
    //Configuration Options
    var max_width = Portal.app.config.popupWidth - 70 ;     //Sets the max width, in pixels, for every image

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
};
