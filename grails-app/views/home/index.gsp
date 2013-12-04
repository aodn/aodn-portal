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

<title>${configInstance?.name}</title>

${buildInfo}

    <!--[if lt IE 8]>
 <script type="text/javascript">
    alert("Sorry. The Portal requires IE8 or better! Although the site may appear to work, the functionality is not guaranteed or supported in your web browser. Please update!");
 </script>
   <![endif]-->

<!--link rel="stylesheet" media="print" type="text/css"  href="${resource(dir: 'css', file: 'mapprint.css')}" /-->
<link rel="stylesheet" type="text/css" href="${resource(dir: 'js', file: 'GeoExt1.1/resources/css/geoext-all.css')}"/>
<!-- User extensions -->
<link rel="stylesheet" type="text/css" href="${resource(dir: 'js', file: 'ext-ux/SuperBoxSelect/superboxselect.css')}"/>
<link rel="stylesheet" type="text/css" href="${resource(dir: 'js', file: 'ext-ux/Hyperlink/hyperlink.css')}"/>
<!-- Portal classes-->
<link rel="stylesheet" type="text/css" href="${resource(dir: 'css', file: 'portal-search.css')}"/>

<g:render template="/js_includes"></g:render>
<g:render template="/theme_includes"></g:render>

<script>

    // Init step One
    Ext.onReady(Portal.app.init, Portal.app);

</script>


</head>

<body>

<g:render template="/header/mainPortalHeader" model="['showLinks': true, 'configInstance': configInstance]"></g:render>

<%-- Display message from Grails app --%>
<g:if test="${flash.openIdMessage }">
    <script type="text/javascript">
        Ext.Msg.alert("Message", "${flash.openIdMessage.encodeAsHTML()}");
    </script>
</g:if>
</body>
</html>
