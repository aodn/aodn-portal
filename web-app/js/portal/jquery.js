jQuery( document ).ready(function() {

    jQuery(document).on("click", ".resultsHeaderBackground.expandable",
        function() {
            var resBody = jQuery(this).children('.facetedSearchResultBody');

            var fullHeight = resBody[0].scrollHeight;
            var currentHeight = resBody[0].offsetHeight;

            //on the first run we store the initial height so we can return to it later
            if (jQuery.data(resBody[0], "originalHeight") == undefined) {
                jQuery.data(resBody[0],"originalHeight", currentHeight );
            }

            if (fullHeight > 0  && currentHeight != fullHeight  ) {
                resBody.animate({
                    height: fullHeight
                }, 300);
            }
            else {
                resBody.animate({
                    height: jQuery.data(resBody[0],"originalHeight")
                }, 150);
            }
        });

    jQuery(document).on("mouseover", ".resultsHeaderBackground:not(.facetedSearchBtn *):not(.expandable)",
        function() {
            var resBodyChild = jQuery(this).children('.facetedSearchResultBody')[0];
            var fullHeight = resBodyChild.scrollHeight;

            if (fullHeight > 0 && fullHeight != resBodyChild.offsetHeight) {
                jQuery(this).addClass("expandable");
            }
        });

    // getFeatureInfo popup links  .not('.jQueryLiveAnchor')
    jQuery(document).on("mouseover", '.featureinfocontent a:not(.jQueryLiveAnchor)',
        function() {
            var thisTag = jQuery(this);
            var trackChangesCommand = "trackGetFeatureInfoResultLinkUsage('" + thisTag.attr('href') + "'); return true;";
            thisTag.attr('onclick', trackChangesCommand)
                .attr('target', '_blank')
                .addClass('jQueryLiveAnchor')
                .addClass('external');
        });

    // activelayer/tree labels
    jQuery(document).on("mouseover", '#activeLayerTreePanel .x-tree-node a span, .x-tree-node-el span',
        function() {
            jQuery(this).attr('title', jQuery(this).html());
        });

    // helper tooltip for unpin (popup)
    jQuery(document).on('mouseover', '.x-tool-unpin',
        function() {
            jQuery(this).attr('title', "Click to move and resize");
        });
});
