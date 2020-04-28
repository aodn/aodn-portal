jQuery( document ).ready(function() {

    jQuery(document).on("click", ".resultsRowHeaderTitle",
        function() {
            var resBody = jQuery(this).parents(".resultsHeaderBackground");
            var resContainer = resBody.children('.facetedSearchResultBody');
            var abstractContainer = resContainer.find('.abstractContainer');

            var mainHeight = resContainer[0].scrollHeight;
            let mainOffsetHeight = resContainer[0].offsetHeight;

            //on the first run we store the initial height so we can return to it later
            if (resContainer.data("originalHeight") == undefined) {
                resContainer.data("originalHeight", mainOffsetHeight);
            }
            var margin = 10;

            let state = {
                "duration": 500,
                "complete": function () {
                    let height = resContainer[0].scrollHeight;
                    if (abstractContainer.is(":visible")) {
                        height: (height + margin)
                    }
                    else {
                        height = resContainer.data("originalHeight");
                    }
                    // // resContainer set height to its contents ( includes abtractContainer currently)
                    // resContainer.animate({
                    //     height: height
                    // }, 300);

                    // set parent container height
                    resContainer.animate({
                        height: height
                    }, 300);
                }
            };

            abstractContainer.toggle(state);


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
