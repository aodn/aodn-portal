/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
OpenLayers.Tile.TemporalImage = OpenLayers.Class(OpenLayers.Tile.Image, {

    imgCache: {},

    parentDiv: null,
    
    toTime: function(dateTime) {

        var key = this.position.toString() + dateTime.format();

        if (!this.imgCache[key]) {

            this.url = this.layer.getURL(this.bounds);
            
            var img = new Image();
            img.src = this.url;
            $(img).addClass($(this.imgDiv).attr('class'));
            $(img).attr('style', $(this.imgDiv).attr('style'));
            
            this.imgCache[key] = img;
        }

        if (!this.parentDiv) {
            this.parentDiv = $(this.imgDiv).parent().get(0);
        }

        this.imgDiv = this.imgCache[key];
        
        $(this.parentDiv).empty();
        $(this.parentDiv).append(this.imgCache[key]);

        this.show();
    }
});
