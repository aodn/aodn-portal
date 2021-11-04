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
        <link rel="stylesheet" type="text/css" href="${resource(dir: 'js', file: 'ext-ux/Hyperlink/hyperlink.css')}" />

        <g:render template="/js_includes"></g:render>
        <g:render template="/public_theme_includes"></g:render>

        <script type="text/javascript">

            (function () {
                // Fixes #1723, redirect 'search/' to 'search'
                if (window.location.href.match(/\/search\/$/)) {
                    var homeWithoutTrailingSlash = window.location.href.substring(0, window.location.href.length - 1);
                    window.location.replace(homeWithoutTrailingSlash);
                }
            }());

            // Supporting only Firefox and Chrome users
            Ext.onReady(browserCheck);
            // Init step One
            Ext.onReady(Portal.app.init, Portal.app);

        </script>

    </head>

    <body>
        <g:render template="/header/mainPortalHeader" model="['showLinks': true, 'configInstance': configInstance]"></g:render>
        <g:render template="/google_analytics"></g:render>
        <g:render template="/hotjar"></g:render>
        <g:render template="/auth/signInModal"></g:render>
        <g:render template="/auth/signUpModal"></g:render>
        <g:render template="/auth/signUpMessage"></g:render>
        <g:render template="/auth/signInCodeModal"></g:render>
    </body>
</html>
