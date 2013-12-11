<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>
<html>
<head>
    <meta charset="UTF-8"/>
    <meta http-equiv="Content-type" content="text/html;charset=UTF-8">
    <meta http-equiv="content-script-type" content="text/javascript"/>
    <meta http-equiv="X-UA-Compatible" content="IE=8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <title>${cfg?.name}</title>

    <!--[if lt IE 8]>
 <script type="text/javascript">
    alert("Sorry. The Portal requires IE8 or better! Although the site may appear to work, the functionality is not guaranteed or supported in your web browser. Please update!");
 </script>
   <![endif]-->

    <g:render template="/js_includes"></g:render>
    <g:render template="/theme_includes"></g:render>

</head>

<body>
<g:render template="/header/mainPortalHeader" model="['showLinks': false, 'configInstance': cfg]"></g:render>

<div id="landing">
    <div id="landingMain">
        <div class="landingLeft">
            <a href="${resource(dir: 'home')}" id="landingBigButton" title="Search for Ocean Data">Search for Ocean Data</a>
        </div>
        <div class="landingRight">
            <h2>The Integrated Marine Observation System Ocean Portal</h2>
            "All IMOS data is freely and openly available for the benefit of Australian marine and climate science as a whole."
        </div>
    </div>

    <div class="clear"></div>

    <div id="landingSub">
        <div class="landingLeft">
            <g:render template='oceanCurrentMini'/>
        </div>

        <div class="landingRight">
            <g:render template='aodnPortal2Mini'/>
        </div>
    </div>

    <div class="clear"></div>
    <hr/>

    <div class="footer">
        <div class="landingLeft">
            <img class="logoSpacer" src="http://static.emii.org.au/images/logo/NCRIS_Initiative_stacked200.png" width="160" alt="DIISTRE logo"/>
            <img class="logoSpacer" src="http://static.emii.org.au/images/logo/Utas_vert.png" alt="UTAS logo"/>
            <br/>
            <a class="noUnderline" href="http://twitter.com/AusOceanDataNet" target="_blank">
                <img class="logoSpacer" src="${resource(dir: 'images', file: 'Twitter_logo_black.png')}" title="Follow us on twitter" alt="Follow us on twitter"/>
            </a>
            <a class="noUnderline" href="http://www.facebook.com/AusOceanDataNet" target="_blank">
                <img class="logoSpacer" src="${resource(dir: 'images', file: 'FB-logo-gray.png')}" title="Find us on Facebook" alt="Find us on Facebook"/>
            </a>
        </div>

        <div class="landingRight">
            <p>IMOS data is made freely available under the <a title="Conditions of Use" href="http://imos.org.au/fileadmin/user_upload/shared/IMOS%20General/documents/internal/IMOS_Policy_documents/Policy-Acknowledgement_of_use_of_IMOS_data_11Jun09.pdf">Conditions of Use</a>. <br/>Both IMOS data and this site are licensed under a <a target="_blank" href="http://creativecommons.org/licenses/by/2.5/au/" title="Creative Commons License" class="external"><span>Creative Commons Attribution 2.5 Australia License</span>
            </a> <a target="_blank" href="http://creativecommons.org/licenses/by/2.5/au/" title="Creative Commons License" class="external"><img src="${resource(dir: 'images', file: 'by.png')}" />
            </a></p>

            <p>You accept all risks and responsibility for losses, damages, costs and other consequences resulting directly or indirectly from using this site and any information or material available from it. If you have any concerns about the veracity of the data, please make enquiries via <a href="mailto:info@emii.org.au">info@emii.org.au</a> to be directed to the data custodian.<br/>IMOS is supported by the Australian Government through the National Collaborative Research Infrastructure Strategy and the Super Science Initiative. It is led by the University of Tasmania on behalf of the Australian marine climate science community.
            </p>

            <div class="buildInfo">${portalBuildInfo}</div>
        </div>
    </div>
</div>
</body>
</html>