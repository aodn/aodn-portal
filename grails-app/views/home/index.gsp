<html>

<head>


<!--- common styles and JavaScript for the map page and Grails admin pages -->
 <g:render template="/common_includes"></g:render>
 
<!-- Open Layers-->
<script src="${resource(dir:'js',file:'OpenLayers-2.10/OpenLayers.js')}" defer="defer" type="text/javascript"></script>
<link rel="stylesheet" media="screen" type="text/css"  href="${resource(dir:'css',file:'general.css')}" />
<!--link rel="stylesheet" media="print" type="text/css"  href="${resource(dir:'css',file:'mapprint.css')}" /-->
 
<!--- GeoExt (Has to be after Openlayers and ExJS) -->
<script src="${resource(dir:'js',file:'GeoExt/script/GeoExt.js')}" defer="defer"  type="text/javascript"></script>
<link rel="stylesheet" type="text/css"  href="${resource(dir:'js',file:'GeoExt/resources/css/geoext-all.css')}" />

<!-- GeoNetwork - required classes only -->
<script src="${resource(dir:'js',file:'Geonetwork/lib/OpenLayers/addins/Format/GeoNetworkRecords.js')}" defer="defer" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'Geonetwork/lib/GeoNetwork/Util.js')}" defer="defer" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'Geonetwork/lib/GeoNetwork/lang/en.js')}" defer="defer" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'Geonetwork/lib/GeoNetwork/Catalogue.js')}" defer="defer" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'Geonetwork/lib/GeoNetwork/util/SearchTools.js')}" defer="defer" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'Geonetwork/lib/GeoNetwork/data/MetadataResultsStore.js')}" defer="defer" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'Geonetwork/lib/GeoNetwork/data/OpenSearchSuggestionReader.js')}" defer="defer" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'Geonetwork/lib/GeoNetwork/data/OpenSearchSuggestionStore.js')}" defer="defer" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'Geonetwork/lib/GeoNetwork/form/OpenSearchSuggestionTextField.js')}" defer="defer" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'Geonetwork/lib/GeoNetwork/map/ExtentMap.js')}" defer="defer" type="text/javascript"></script>

<!-- Portal classes-->
<link rel="stylesheet" type="text/css"  href="${resource(dir:'css',file:'portal-search.css')}" />
<script src="${resource(dir:'js',file:'portal/data/RefinementList.js')}" defer="defer"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/data/FacetStore.js')}" defer="defer"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/field/FreeText.js')}" defer="defer"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/field/DateRange.js')}" defer="defer"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/field/BoundingBox.js')}" defer="defer"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/field/OpenSearchSuggestionTextField.js')}" defer="defer"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/MiniMapPanel.js')}" defer="defer"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/RefineSearchPanel.js')}" defer="defer"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/SearchForm.js')}" defer="defer"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/SearchTabPanel.js')}" defer="defer"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/ResultsGrid.js')}" defer="defer"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/config/FacetConfig.js')}" defer="defer"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/locale/portal-lang-en.js')}" defer="defer"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/mainMap/map.js')}" defer="defer"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/mainMap/mainMapPanel.js')}" defer="defer"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/mainMap/menuPanel.js')}"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/mainMap/detailsPanel.js')}"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/mainMap/ncWMSAnimation.js')}"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/viewport.js')}" defer="defer"  type="text/javascript"></script>

<script src="${resource(dir:'js',file:'portal/mainMap/ramadda.js')}"  type="text/javascript"></script>

<link rel="shortcut icon" href="${resource(dir:'images',file:'favicon.ico')}" type="image/x-icon" />


<title>${configInstance?.name}</title>
</head>

<body>
  <div id="header">
    <shiro:user>Logged-in as: <g:link controller="user" action="updateAccount"><shiro:principal /></g:link> (<g:link controller="auth" action="signOut">Log out</g:link>)</shiro:user>
    <shiro:notUser>Not logged-in. <g:link controller="auth" action="login">Log in</g:link> or <g:link controller="auth" action="register">register</g:link>.</shiro:notUser>
    <br/>
  
    <g:if test="${flash.message}">
      <div class="message">${flash.message}</div>
    </g:if>
  </div>

</body>

</html>
