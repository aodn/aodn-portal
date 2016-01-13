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

            // simple parallax for <section data-uitype="background">...</section> tags
            $('section[data-uitype="background"]').each(function() {
                var element = $(this);
                $(window).scroll(function() {
                    var yPos = -($window.scrollTop() / element.data('speed'));
                    element.css({backgroundPosition: '50% ' + yPos + 'px'});
                });
            });

            // fade when away from element
            $('section[data-uitype="fade"]').each(function() {
                var element = $(this);
                $(window).scroll(function() {
                    var pixelBuffer = 350;
                    var scrollVar = $(window).scrollTop();
                    var elementOffset = element.offset().top;
                    var distance = Math.abs(scrollVar - elementOffset);

                    var opacity = 0;
                    if (distance < pixelBuffer ) {
                        opacity = Math.abs(1 - distance / (pixelBuffer + (pixelBuffer/10)));
                    }
                    element.children().css({'opacity': opacity});
                });
            });

            // slowly move to named anchor links
            var $root = $('html, body');
            $('a').click(function() {
                $root.animate({
                    scrollTop: $('[name="' + $.attr(this, 'href').substr(1) + '"]').offset().top
                }, 500);
                return false;
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
                <h1>AODN Ocean Portal</h1>

                <div>
                    <div class="hero-unit">"All IMOS data is freely and openly available for the
                    benefit of Australian marine and climate science as a whole"
                    </div>
                </div>

                <div><a href="home" class="btn btn-primary btn-lg">Get Data Now</a>
                </div>
            </div>

            <div class="text-center"><a href="#services"><i class="white fa fa-3x fa-angle-double-down"></i></a></div>
        </div>

    </section>
    <a name="services"></a>
    <section id="services" data-uitype="fade" >
        <div class="text-vcenter">
            <div class="container">
                <h4 class="text-center">Products</h4> <hr />

                <div class="col-sm-6 ">
                    <a class="services-links" target="_blank" title="AODN Ocean Data Portal"
                        href="${resource(dir: 'home')}">
                        <i class="fa fa-4x fa-arrow-circle-o-right"></i>

                        <h3>AODN portal</h3>
                    </a>

                    <p>The <a target="_blank" class="external" title="AODN Ocean Data Portal" href="http://portal.aodn.org.au/aodn">AODN Ocean Data Portal</a> has access to the complete IMOS metadata catalog and <a target="_blank" class="external" href="https://imos.aodn.org.au/data_collections.html">all available ocean data</a>. The AODN includes data from the six Commonwealth Agencies with responsibilities in the Australian marine jurisdiction (AAD, AIMS, BOM, CSIRO, GA and RAN).
                    </p>
                </div>

                <div class="col-sm-6 ">
                    <a class="services-links" title="Ocean Current page" href="http://oceancurrent.aodn.org.au" target="_blank">
                        <i class="fa fa-4x fa-arrow-circle-o-right"></i>

                        <h3>Ocean Current</h3>
                    </a>

                    <p class="">To view the latest state of Australian oceans and coastal seas,
                    go to our <a class="external" title="Ocean Current page" href="http://oceancurrent.aodn.org.au" target="_blank"><nobr>Ocean Current</nobr>
                    </a> page.
                    </p>
                </div>
            </div>
            <div class="text-center"><a href="#information"><i class="fa fa-3x fa-angle-double-down"></i></a></div>
        </div>


    </section>

    <a name="information"></a>
    <section id="information" data-uitype="fade">
        <div class="information-panel-wrapper">
            <div class="information-panel">
                <div class="container">
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="panel-body lead">
                                <a href="http://www.utas.edu.au/" title="UTAS home page" target="_blank"><img src="https://static.emii.org.au/images/logo/utas/UTAS_MONO_190w.png" alt="UTAS logo" />
                                </a>
                                <img class="miniSpacer" src="https://static.emii.org.au/images/logo/NCRIS_Initiative_stacked200.png" alt="NCRIS logo" />
                                <br />
                                <a class="noUnderline" href="http://twitter.com/AusOceanDataNet" target="_blank">
                                    <img class="miniSpacer" src="${resource(
                                        dir: 'images', file: 'Twitter_logo_black.png'
                                    )}" title="Follow us on twitter" alt="Follow us on twitter" />
                                </a>
                                <a class="noUnderline" href="http://www.facebook.com/AusOceanDataNet" target="_blank">
                                    <img class="miniSpacer" src="${resource(
                                        dir: 'images', file: 'FB-logo-gray.png'
                                    )}" title="Find us on Facebook" alt="Find us on Facebook" />
                                </a>
                            </div>
                        </div>

                        <div class="col-sm-6">
                            <div class="">
                                <div class="panel-body lead">
                                    <g:render template='link2AODNMini' />

                                    <p>
                                        IMOS is a national collaborative research infrastructure, supported by
                                        Australian Government. It is led by <a target="_blank" title="UTAS home page" href="http://www.utas.edu.au/">University of Tasmania</a> in partnership
                                    with the Australian marine & climate science community.
                                    </p>

                                    <p>${portalBranding.footerContent}</p>

                                    <div class="buildInfo"><buildInfo:summary /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <g:render template="/google_analytics"></g:render>
</body>
</html>
