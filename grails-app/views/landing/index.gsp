<html>
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-type" content="text/html;charset=UTF-8" />
    <meta http-equiv="content-script-type" content="text/javascript" />
    <meta http-equiv="X-UA-Compatible" content="IE=8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>${portalBranding.siteHeader}</title>

    <buildInfo:comment />

    <g:render template="/public_theme_includes"></g:render>
    <g:render template="/landing_theme_includes"></g:render>


    <script type="text/javascript">
        <portal:motdPopup />

        $(document).ready(function() {
            $window = $(window);

            $('section[data-uitype="background"]').each(function() {
                var element = $(this);
                $(window).scroll(function() {
                    var yPos = -($window.scrollTop() / element.data('speed'));
                    element.css({backgroundPosition: '50% ' + yPos + 'px'});
                });
            });
        });

    </script>
</head>

<body>

<nav class="">
    <g:render template="/header/mainPortalHeader" model="['showLinks': false, 'portalBranding': portalBranding]"></g:render>
</nav>

<!-- first section - Home -->
<section id="home" data-uitype="background" data-speed="4">

    <div class="text-vcenter">
        <div class="homeContent">
            <h1>AODN Portal</h1>

            <p>"The gateway to Australian marine and climate science data"</p>

            <div><a href="search" class="btn btn-primary btn-lg">Get Ocean Data Now</a></div>
        </div>
    </div>

</section>

<section id="information" data-uitype="fade">
    <div class="container">
        <div class="row">
            <div class="col-md-4 text-center">
                <div class="panel-body lead">
                    <div>
                        <img src="https://static.emii.org.au/images/logo/NCRIS_Initiative_stacked200.png" alt="NCRIS logo" />
                        <a href="http://www.utas.edu.au/" title="UTAS home page" target="_blank"><img src="https://static.emii.org.au/images/logo/utas/UTAS_MONO_190w.png" alt="UTAS logo" />
                        </a>
                    </div>
                    <div class="socialLinks">
                        <a class="noUnderline" href="http://twitter.com/AusOceanDataNet" target="_blank">
                            <img src="${resource(
                                dir: 'images', file: 'Twitter_logo_black.png'
                            )}" title="Follow us on twitter" alt="Follow us on twitter" />
                        </a>
                        <a class="noUnderline" href="http://www.facebook.com/AusOceanDataNet" target="_blank">
                            <img src="${resource(
                                dir: 'images', file: 'FB-logo-gray.png'
                            )}" title="Find us on Facebook" alt="Find us on Facebook" />
                        </a>
                    </div>
                </div>
            </div>

            <div class="col-md-4 text-center">
                <div class="panel-body lead">
                    <a href="http://oceancurrent.imos.org.au/" class="btn btn-secondary btn-lg">IMOS OceanCurrent</a>
                    <p></p>
                    <p><strong>The latest ocean information around Australia</strong></p>
                </div>
            </div>

            <div class="col-md-4 text-left">
                <div class="footerText">
                    <div class="panel-body lead">
                        <p>
                            The <a target="_blank" class="external" title="AODN Portal" href="http://portal.aodn.org.au/aodn">AODN Portal</a> provides access to all available Australian marine and climate science data and provides the primary access to IMOS data including access to the IMOS metadata.
                        </p>

                        <p>
                            IMOS is a national collaborative research infrastructure, supported by
                            Australian Government. It is led by <a target="_blank" title="UTAS home page" href="http://www.utas.edu.au/">University of Tasmania</a> in partnership
                        with the Australian marine &amp; climate science community.
                        </p>

                        <p>${portalBranding.footerContent}</p>

                        <div class="buildInfo"><buildInfo:summary /></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<g:render template="/google_analytics"></g:render>
</body>
</html>
