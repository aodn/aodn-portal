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

    <!--g:render template="/js_includes"--><!--/g:render-->
    <g:render template="/public_theme_includes"></g:render>
    <g:render template="/landing_theme_includes"></g:render>

    <style>

    .headerHeightOverlord {
        height: auto;
    }
    #header {
        padding: 10px 20px;
    }

    @media (max-width: 992px) {
        #landingHeaderContainer {
            margin-left: 290px;
        }
    }

    @media (max-width: 768px) {
        #header {
            padding: 5px;
        }
        #landingHeaderContainer {
            margin-left: 200px;
        }
    }

    #logo {
        margin: inherit;
    }
    h1 {
        font-family: impact, sans-serif;
        text-shadow: 1px 1px 8px #333;
    }

    h1 {
        font-family: impact, sans-serif;
        text-shadow: 1px 1px 8px #333;
    }

    /* padded section */
    .pad-section {
        padding: 50px 0;
    }

    .pad-section img {
        width: 100%;
    }

    /* vertical-centered text */
    .text-vcenter {
        display: table-cell;
        text-align: center;
        vertical-align: middle;
    }

    .text-vcenter h1 {
        font-size: 4.5em;
        font-weight: 700;
        margin: 0;
        padding: 0;
    }

    /* additional sections */
    #home {
        /*background: url(http://felipeyjoana.smugmug.com/Public-Gallery/i-Qzhn6kJ/0/XL/P8120595-XL.jpg) no-repeat center center fixed;*/
        background: url(images/IMOS/landing/Nature-Clear-Sky-Blue-Water.jpg) no-repeat center center fixed;
        box-shadow: inset 29px 10px 139px 0px rgba(0, 0, 0, 0.3);
        display: table;
        height: 100%;
        position: relative;
        width: 100%;
        -webkit-background-size: cover;
        -moz-background-size: cover;
        -o-background-size: cover;
        background-size: cover;
        color: whitesmoke;
    }

    .homeContent div {
        margin: 20px 0;
    }

    h1, h2 {
        white-space: normal;
    }

    #services {
        background-color: #306d9f;
        color: #ffffff;
    }

    #services .glyphicon,
    #home .glyphicon {
        border: 2px solid #FFFFFF;
        border-radius: 50%;
        display: inline-block;
        font-size: 60px;
        height: 140px;
        line-height: 140px;
        text-align: center;
        vertical-align: middle;
        width: 140px;
    }

    #services a,
     a.white {
        color: white;
        text-decoration: underline;
    }

    #services a:hover,
    a.white:hover {
        color: orange;
    }

    #information {
        background: url(http://felipeyjoana.smugmug.com/Public-Gallery/i-dZGrDBs/0/XL/_5082210-XL.jpg) no-repeat center center fixed;
        display: table;
        height: 700px;
        position: relative;
        width: 100%;
        -webkit-background-size: cover;
        -moz-background-size: cover;
        -o-background-size: cover;
        background-size: cover;
    }

    #information .information-panel {
        background-color: white;
        box-shadow: inset 29px 10px 139px 0px rgba(50, 50, 50, 0.5);
        border-radius: 9px;
        opacity: 0.95;
    }

    .pad-section img {
        width: inherit;
    }

    </style>

    <script type="text/javascript">
        <portal:motdPopup />
    </script>
</head>

<body>
<nav class="">
<g:render template="/header/mainPortalHeader" model="['showLinks': false, 'portalBranding': portalBranding]"></g:render>
</nav>

<!-- first section - Home -->
<div id="home" class="home">
    <div class="text-vcenter">
        <div class="homeContent">
            <h1>IMOS Ocean Portal</h1>
            <div><a href="home" class="btn btn-primary btn-lg">Get Data</a>
            </div>
            <div>
                <a class="white" href="home"><i class="glyphicon glyphicon-folder-open"></i></a>
                </div>
        </div>
    </div>
</div>

<div id="services" class="pad-section">
    <div class="container">
        <h2 class="text-center">Our Products</h2> <hr />

        <div class="row text-center">
            <div class="col-sm-6 col-xs-6">
                <a title="Ocean Current page" href="http://oceancurrent.aodn.org.au" target="_blank">
                    <i class="glyphicon glyphicon-globe"></i>
                </a>
                <h3>Ocean Current</h3>

                <p>To view the latest state of Australian oceans and coastal seas,
                go to our <a class="external" title="Ocean Current page" href="http://oceancurrent.aodn.org.au" target="_blank"><nobr>Ocean Current</nobr>
                </a> page.
                </p>
            </div>

            <div class="col-sm-6 col-xs-6">
                <a target="_blank" title="AODN Ocean Data Portal" href="http://portal.aodn.org.au/aodn">
                    <i class="glyphicon glyphicon-folder-open"></i>
                </a>
                <h3>AODN portal</h3>

                <p>The <a target="_blank" class="external" title="AODN Ocean Data Portal" href="http://portal.aodn.org.au/aodn">AODN Ocean Data Portal</a> has access to the complete IMOS metadata catalog and <a target="_blank" class="external" href="https://imos.aodn.org.au/data_collections.html">all available ocean data</a>. The AODN includes data from the six Commonwealth Agencies with responsibilities in the Australian marine jurisdiction (AAD, AIMS, BOM, CSIRO, GA and RAN).
                </p>
            </div>

        </div>
    </div>
</div>
%{--
<div id="about" class="pad-section">
    <div class="container">
        <div class="row">
            <div class="col-sm-6">
                stuff
            </div>

            <div class="col-sm-6 text-center">
                <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in sem cras amet.</h2>

                <p class="lead">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed interdum metus et ligula venenatis, at rhoncus nisi molestie. Pellentesque porttitor elit suscipit massa laoreet metus.</p>
            </div>
        </div>
    </div>
</div>--}%

<div id="information" class="pad-section">
    <div class="container information-panel">
        <div class="row">
            <div class="col-sm-6">
                <div class="">
                    <div class="panel-body lead">
                        <div class="bigtext">"All IMOS data is freely and openly available for the benefit of Australian marine and climate science as a whole." &nbsp;<a href="${resource(
                            dir: 'home'
                        )}"></div>

                        <div class="landingSuLeft">
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



%{--<div>
    <div class="landingContainer">


        <div id="landingCentre">
            <div class="main">
                <a href="${resource(dir: 'home')}" id="landingBigButton" title="Get Ocean Data" onclick="trackUsage('Get Ocean Data Button', 'Clicked');return true;">Get Ocean Data</a>
            </div>

            <div class="footer">



            <div class="clear"></div>

            <div >
                <div class="landingSubLeft">
                    <g:render template='oceanCurrentMini' />
                </div>

            </div>

            <div class="clear"></div>
            <hr />

            <div class="footer">

                <div class="bigtext">"All IMOS data is freely and openly available for the benefit of Australian marine and climate science as a whole." &nbsp;<a href="${resource(dir: 'home')}" ><small>Start searching here...</small></a></div>
            </div>
                <div class="landingSubLeft">
                    <a href="http://www.utas.edu.au/" title="UTAS home page" target="_blank"><img src="https://static.emii.org.au/images/logo/utas/UTAS_MONO_190w.png" alt="UTAS logo" /></a>
                    <img class="miniSpacer" src="https://static.emii.org.au/images/logo/NCRIS_Initiative_stacked200.png" alt="NCRIS logo" />
                    <br />
                    <a class="noUnderline" href="http://twitter.com/AusOceanDataNet" target="_blank">
                        <img class="miniSpacer" src="${resource(dir: 'images', file: 'Twitter_logo_black.png')}" title="Follow us on twitter" alt="Follow us on twitter" />
                    </a>
                    <a class="noUnderline" href="http://www.facebook.com/AusOceanDataNet" target="_blank">
                        <img class="miniSpacer" src="${resource(dir: 'images', file: 'FB-logo-gray.png')}" title="Find us on Facebook" alt="Find us on Facebook" />
                    </a>
                </div>

                <div class="landingSubRight">

                    <g:render template='link2AODNMini' />

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
</div>--}%
<g:render template="/google_analytics"></g:render>
</body>
</html>
