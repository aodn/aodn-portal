jQuery( document ).ready(function() {

    jQuery(".resultsHeaderBackground:not(.facetedSearchBtn *)").on("click",
        function(){
            var resBody = jQuery(this).children('.facetedSearchResultBody');
            var fullHeight = resBody[0].scrollHeight;
            var originalHeight = resBody.height();

            if (fullHeight > 0  && fullHeight != originalHeight) {
                resBody.data("originalHeight", originalHeight );
                resBody.animate({
                    height: fullHeight
                }, 300);
            }
            else {
                resBody.animate({
                    height: resBody.data("originalHeight")
                }, 150);
            }
        });

    jQuery(".resultsHeaderBackground:not(.facetedSearchBtn *)").on("mouseover",
        function(){
            var resBody = jQuery(this).children('.facetedSearchResultBody');
            var fullHeight = resBody[0].scrollHeight;

            if (fullHeight > 0  && fullHeight != resBody.height()) {
                jQuery(this).addClass("expandable");
            }
        });

    jQuery('.button input').on('hover',
        function(){
            jQuery(this).toggleClass("hover")
                .next().stop(true, true).slideToggle();

        });

    // getFeatureInfo popup links  .not('.jQueryLiveAnchor')
    jQuery('.featureinfocontent a:not(.jQueryLiveAnchor)').on('hover',
        function() {
            var thisTag = jQuery(this);
            var trackChangesCommand = "trackGetFeatureInfoClickUsage('" + thisTag.attr('href') + "'); return true;";
            thisTag.attr('onclick', trackChangesCommand)
                .attr('target', '_blank')
                .addClass('jQueryLiveAnchor')
                .addClass('external');
        });

    // activelayer/tree labels
    jQuery('#activeLayerTreePanel .x-tree-node a span, .x-tree-node-leaf span').on('hover',
        function(){
            jQuery(this).attr('title', jQuery(this).html());
            jQuery(this).off('hover');
        });

    // helper tooltip for unpin (popup)
    jQuery('.x-tool-unpin').on('hover',
        function(){
            jQuery(this).attr('title', "Click to move and resize");
            jQuery(this).off('hover');
        });


    jQuery('.layersDiv, .olControlOverviewMapElement')
        .on("mouseenter", function(){
            jQuery(this).addClass("fullTransparency");
        })
        .on("mouseleave", function(){
            jQuery(this).removeClass("fullTransparency");
        });

});

