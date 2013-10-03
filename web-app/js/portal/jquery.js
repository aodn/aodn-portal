/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

jQuery( window ).load(function() {


    jQuery('.button input').live('hover',
        function(){
            jQuery(this).toggleClass("hover")
                .next().stop(true, true).slideToggle();

        });

    // getFeatureInfo popup links without internal javascript calls
    jQuery('.featureinfocontent a').not("['onclick','onClick']").live('hover',
        function(){
            jQuery(this).attr('target', '_blank').addClass('external');
        });


    // activelayer/tree labels
    jQuery('#activeLayerTreePanel .x-tree-node a span, .x-tree-node-leaf span').live('hover',
        function(){
            jQuery(this).attr('title', jQuery(this).html());
            jQuery(this).die('hover'); // This removes the .live() functionality
        });

    // helper tooltip for unpin (popup)
    jQuery('.x-tool-unpin').live('hover',
        function(){
            jQuery(this).attr('title', "Click to move and resize");
            jQuery(this).die('hover'); // This removes the .live() functionality
        });


    jQuery('.layersDiv, .olControlOverviewMapElement')
        .live("mouseenter", function(){
            jQuery(this).addClass("fullTransparency");
        })
        .live("mouseleave", function(){
            jQuery(this).removeClass("fullTransparency");
        });

    // activate onclick - exclude disabled main viewport tabs
    jQuery('.viewPortTab:not(.viewPortTabDisabled)')
        .live("mouseenter", function(){
            // activate the onclick action
            var tabId = $(this).attr('id');
            jQuery(this).children('a').one('click', function(obj) {
                    setViewPortTab(parseInt(tabId.substr(tabId.length - 1)));
                }
            );
        });
});

