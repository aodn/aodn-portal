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

        <g:render template="/js_includes"></g:render>
        <g:render template="/public_theme_includes"></g:render>

        <script type="text/javascript">
            // Supporting only Firefox and Chrome users
            Ext.onReady(Portal.app.browserCheck);

            <portal:motdPopup />
        </script>
    </head>

    <body>
        <g:render template="/header/mainPortalHeader" model="['showLinks': false, 'configInstance': cfg, 'portalBranding': portalBranding]"></g:render>

        <div>
            <div class="landingContainer">
                <div id="landingLeft">
                    <img class="roundedImages" src="images/IMOS/landing/leftLandingBling.jpg" />
                </div>

                <div id="landingCentre">
                    <div class="landingSubLeft">
                        <a href="${resource(dir: 'home')}" id="landingBigButton" title="Get Ocean Data">Get Ocean Data</a>
                    </div>

                    <div class="landingSubRight">
                        <h1>IMOS Ocean Portal</h1>

                        <div class="bigtext">"All IMOS data is freely and openly available for the benefit of Australian marine and climate science as a whole."</div>
                    </div>

                    <div class="clear"></div>

                    <div>
                        <a href="${resource(dir: 'home')}" title="Click here to search for and download Ocean Data">
                            <img class="roundedImages" alt="Image link to search for and download Ocean Data" src="images/IMOS/landing/landingBling.png" width="600" />
                        </a>
                    </div>

                    <div class="clear"></div>

                    <div>
                        <div class="landingSubLeft">
                            <g:render template='oceanCurrentMini' />
                        </div>

                        <div class="landingSubRight">
                            <g:render template='link2AODNMini' />
                        </div>
                    </div>

                    <div class="clear"></div>
                    <hr />

                    <div class="footer">
                        <div class="landingSubLeft">
                            <img  src="http://static.emii.org.au/images/logo/utas/UTAS_MONO_190w.png" alt="UTAS logo" />
                            <img class="miniSpacer" src="http://static.emii.org.au/images/logo/NCRIS_Initiative_stacked200.png" width="140" alt="DIISTRE logo" />
                            <br />
                            <a class="noUnderline" href="http://twitter.com/AusOceanDataNet" target="_blank">
                                <img class="miniSpacer" src="${resource(dir: 'images', file: 'Twitter_logo_black.png')}" title="Follow us on twitter" alt="Follow us on twitter" />
                            </a>
                            <a class="noUnderline" href="http://www.facebook.com/AusOceanDataNet" target="_blank">
                                <img class="miniSpacer" src="${resource(dir: 'images', file: 'FB-logo-gray.png')}" title="Find us on Facebook" alt="Find us on Facebook" />
                            </a>
                        </div>

                        <div class="landingSubRight">
                            <p>
                                IMOS is a national collaborative research infrastructure, supported by
                                Australian Government. It is led by <a target="_blank" title="UTAS home page" href="http://www.utas.edu.au/">University of Tasmania</a> in partnership
                                with the Australian marine & climate science community.
                            </p>

                            ${portalBranding.footerContent}

                            <div class="buildInfo"><buildInfo:summary /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <g:render template="/google_analytics"></g:render>
    </body>
</html>
