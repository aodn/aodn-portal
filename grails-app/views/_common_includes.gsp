
<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>

      <!-- First import JQUERY -->
      <script language="JavaScript" type="text/javascript" src="${resource(dir:'js',file:'jquery/jquery-1.4.1.min.js')}"></script>
      <script>
        jQuery('.button input').live('hover',
          function () {
            jQuery(this).toggleClass("hover")
              .next().stop(true, true).slideToggle();

          });

        // getFeatureInfo popup links
        jQuery('.featureinfocontent a').live('hover',
            function () {
                jQuery(this).attr('target', '_blank').addClass('external');
            });
		  
		  // activelayer/tree labels
		  jQuery('#activeLayerTreePanel .x-tree-node a span, .x-tree-node-leaf span').live('hover',
          function () {
			jQuery(this).attr('title', jQuery(this).html());
			jQuery(this).die('hover'); // This removes the .live() functionality
          });
		  
		  // helper tooltip for unpin (popup)
		  jQuery('.x-tool-unpin').live('hover',
          function () {
			jQuery(this).attr('title', "Click to move and resize");
			jQuery(this).die('hover'); // This removes the .live() functionality
          });
		  
		  
		  jQuery('.layersDiv, .olControlOverviewMapElement')
				.live("mouseenter", function () {
				  $(this).addClass("fullTransparency");
				})
				.live("mouseleave", function () {
				  $(this).removeClass("fullTransparency");
				});

		  
      </script>
      <!-- Import extra pluggins-->
      <script language="JavaScript" type="text/javascript" src="${resource(dir:'js',file:'jquery/jquery-autocomplete1.1.js')}"></script>
      <script language="JavaScript" type="text/javascript" src="${resource(dir:'js',file:'jquery/jquery.rotate.1-1.js')}"></script>

      <script src="${resource(dir:'js/portal/common',file:'helpers.js')}"   type="text/javascript"></script>

      <link rel="stylesheet" type="text/css" href="${resource(dir:'js', file:'ext-3.3.1/resources/css/ext-all.css')}" />
      <link rel="stylesheet" type="text/css" href="${resource(dir:'js', file:'ext-3.3.1/resources/css/xtheme-gray.css')}" />
      <link rel="stylesheet" type="text/css" href="${resource(dir:'css', file:'extThemeOverrides.css')}" />
      <link rel="stylesheet" type="text/css" href="${resource(dir:'css', file:'general.css')}" />
      <g:if test="${grailsApplication.config.portal.instance?.css}">
          <link rel="stylesheet" type="text/css" href="${grailsApplication.config.portal.instance.css}" />
      </g:if>
      <g:elseif test="${grailsApplication.config.portal.instance?.name}">
          <link rel="stylesheet" type="text/css" href="${resource(dir:'css', file: grailsApplication.config.portal.instance.name + '.css')}" />
      </g:elseif>

      <g:if test="${grailsApplication.config.portal.instance?.name}">
        <link rel="shortcut icon" href="${resource(dir:'images',file: grailsApplication.config.portal.instance.name + 'favicon.ico')}" type="image/x-icon" />
      </g:if>
