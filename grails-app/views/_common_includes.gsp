      <!-- First import JQUERY -->
      <script language="JavaScript" type="text/javascript" src="${resource(dir:'js',file:'jquery/jquery-1.4.1.min.js')}"></script>
      <script>
        jQuery('.button input').live('hover',
          function () {
            jQuery(this).toggleClass("hover")
              .next().stop(true, true).slideToggle();

          }

        );
      </script>
      <!-- Import extra pluggins-->
      <script language="JavaScript" type="text/javascript" src="${resource(dir:'js',file:'jquery/jquery-autocomplete1.1.js')}"></script>
      <script language="JavaScript" type="text/javascript" src="${resource(dir:'js',file:'jquery/jquery.rotate.1-1.js')}"></script>

      <script src="${resource(dir:'js/portal/common',file:'helpers.js')}"   type="text/javascript"></script>

      <link rel="stylesheet" type="text/css" href="${resource(dir:'js', file:'ext-3.3.1/resources/css/ext-all.css')}" />
      <link rel="stylesheet" type="text/css" href="${resource(dir:'js', file:'ext-3.3.1/resources/css/xtheme-gray.css')}" />
      <link rel="stylesheet" type="text/css" href="${resource(dir:'css', file:'extThemeOverrides.css')}" />
      <link rel="stylesheet" type="text/css" href="${resource(dir:'css', file:'general.css')}" />
	  <link rel="stylesheet" type="text/css" href="${resource(dir:'css', file: grailsApplication.config.instanceName + '.css')}" />

      <link rel="shortcut icon" href="${resource(dir:'images',file:'favicon.ico')}" type="image/x-icon" />