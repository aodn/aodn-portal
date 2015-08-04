

jQuery( window ).load(function() {


    jQuery('.button input').live('hover',
        function(){
            jQuery(this).toggleClass("hover")
                .next().stop(true, true).slideToggle();

        });

    // getFeatureInfo popup links without internal javascript calls
    jQuery('.featureinfocontent a').not(['onclick','onClick']).live('hover',
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

    // exclude disabled main viewport tabs
    jQuery('.viewPortTab:not(.viewPortTabDisabled)')
        .live("mouseenter", function(){
            var tabId = $(this).attr('id');
            var tabIdInt = parseInt(tabId.substr(tabId.length - 1));
            jQuery(this).children('button').each(
                function() {
                    var events = jQuery(this).data('events');
                    if (events == undefined || typeof (events.click) != "object") {
                        // activate the onclick action
                        jQuery(this).click(function() {
                            trackNavigationUsage(
                                'navigationTrackingPrimaryAction',
                                OpenLayers.i18n('navigationTrackingStepPrefix') + (tabIdInt + 1)
                            );
                            setViewPortTab(tabIdInt);
                            return false;
                        });
                    }
                }
            );
        });
});

