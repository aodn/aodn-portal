<%--

Copyright 2012 IMOS

The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>

<html>
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="Content-type" content="text/html;charset=UTF-8" />
        <meta http-equiv="content-script-type" content="text/javascript" />
        <meta http-equiv="X-UA-Compatible" content="IE=8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />

        <title>${portalBranding.siteHeader}</title>

        <buildInfo:comment />

        <!--link rel="stylesheet" media="print" type="text/css"  href="${resource(dir: 'css', file: 'mapprint.css')}" /-->
        <link rel="stylesheet" type="text/css" href="${resource(dir: 'js', file: 'GeoExt1.1/resources/css/geoext-all.css')}" />
        <!-- User extensions -->
        <link rel="stylesheet" type="text/css" href="${resource(dir: 'js', file: 'ext-ux/SuperBoxSelect/superboxselect.css')}" />
        <link rel="stylesheet" type="text/css" href="${resource(dir: 'js', file: 'ext-ux/Hyperlink/hyperlink.css')}" />

        <!-- Ext JS 4 -->
        <link rel="stylesheet" type="text/css" href="js/extjs-4.1.1/resources/css/ext-sandbox-debug.css">
        <script type="text/javascript" src="js/extjs-4.1.1/builds/ext-all-sandbox-debug.js"></script>

        <script type="text/javascript">
            Ext4.Loader.setConfig({
                enabled: true,
                disableCaching: true,
                paths: {
                    "Ext.ux": "js/ext-ux",
                    "Portal": "js/portal"
                }
            });
        </script>

        <g:render template="/js_includes"></g:render>
        <g:render template="/public_theme_includes"></g:render>

        <script type="text/javascript">
            // Fixes #1723, redirect 'home/' to 'home'
            if (window.location.href.match(/\/home\/$/)) {
                var homeWithoutTrailingSlash = window.location.href.substring(0, window.location.href.length - 1);
                window.location.replace(homeWithoutTrailingSlash);
            }

            // Supporting only Firefox and Chrome users
            Ext.onReady(Portal.app.browserCheck);
            // Init step One
            Ext.onReady(Portal.app.init, Portal.app);

        </script>

    </head>

    <body>
        <g:render template="/header/mainPortalHeader" model="['showLinks': true, 'configInstance': configInstance]"></g:render>

        <g:render template="/google_analytics"></g:render>
    </body>
</html>
