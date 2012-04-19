<html>

<head>
<meta http-equiv="content-script-type" content="text/javascript" />
<meta http-equiv="X-UA-Compatible" content="IE=8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />




<!--link rel="stylesheet" media="print" type="text/css"  href="${resource(dir:'css',file:'mapprint.css')}" /-->
<link rel="stylesheet" type="text/css"  href="${resource(dir:'js',file:'GeoExt1.1/resources/css/geoext-all.css')}" />
<!-- User extensions -->
<link rel="stylesheet" type="text/css"  href="${resource(dir:'js',file:'ext-ux/SuperBoxSelect/superboxselect.css')}" />
<!-- Portal classes-->
<link rel="stylesheet" type="text/css"  href="${resource(dir:'css',file:'portal-search.css')}" />

<g:if env="development">
<script src="${resource(dir:'js',file:'ext-3.3.1/adapter/ext/ext-base-debug.js')}"  type="text/javascript"></script>          
<script src="${resource(dir:'js',file:'ext-3.3.1/ext-all-debug.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'OpenLayers-2.10/OpenLayers.js')}" type="text/javascript"></script>
<!--- GeoExt (Has to be after Openlayers and ExJS) -->
<script src="${resource(dir:'js',file:'GeoExt1.1/lib/GeoExt.js')}"  type="text/javascript"></script>
</g:if>
<g:else>
<script src="${resource(dir:'js',file:'ext-3.3.1/adapter/ext/ext-base.js')}"  type="text/javascript"></script>          
<script src="${resource(dir:'js',file:'ext-3.3.1/ext-all.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'OpenLayers-2.10/OpenLayers.js')}" type="text/javascript"></script>
<!--- GeoExt (Has to be after Openlayers and ExJS) -->
<script src="${resource(dir:'js',file:'GeoExt1.1/script/GeoExt.js')}"  type="text/javascript"></script>
</g:else>

<!-- GeoNetwork - required classes only -->
<script src="${resource(dir:'js',file:'Geonetwork/lib/OpenLayers/addins/Format/GeoNetworkRecords.js')}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'Geonetwork/lib/GeoNetwork/Util.js')}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'Geonetwork/lib/GeoNetwork/lang/en.js')}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'Geonetwork/lib/GeoNetwork/Catalogue.js')}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'Geonetwork/lib/GeoNetwork/util/SearchTools.js')}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'Geonetwork/lib/GeoNetwork/data/OpenSearchSuggestionReader.js')}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'Geonetwork/lib/GeoNetwork/data/OpenSearchSuggestionStore.js')}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'Geonetwork/lib/GeoNetwork/map/ExtentMap.js')}" type="text/javascript"></script>

<script src="${resource(dir:'js',file:'ext-ux/SuperBoxSelect/SuperBoxSelect.js')}" type="text/javascript"></script>

<script src="${resource(dir:'js',file:'portal/lang/en.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/common/spin.min.js')}"   type="text/javascript"></script>   
<script src="${resource(dir:'js',file:'portal/common/BrowserWindow.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/common/ActionColumn.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/common/LoadMask.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/common/AppConfigStore.js')}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/common/SaveDialog.js')}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/data/CatalogResultsStore.js')}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/data/LinkStore.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/data/RefinementList.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/data/FacetStore.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/field/FreeText.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/field/DateRange.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/field/BoundingBox.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/field/MultiSelectCombo.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/filter/FilterComboBox.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/filter/FiltersPanel.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/filter/FilterStore.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/ControlPanel.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/MiniMapPanel.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/SavedSearchComboBox.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/SaveSearchDialog.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/SearchController.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/SearchForm.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/SearchTabPanel.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/SaveSearchPanel.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/LinkSelectionWindow.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/LayerSelectionWindow.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/ResultsGrid.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/data/ServerNodeLayerDescriptorStore.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/data/MenuItemToNodeBuilder.js')}"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/snapshot/SnapshotProxy.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/snapshot/SnapshotController.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/snapshot/SaveSnapshotDialog.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/snapshot/SnapshotSaveButton.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/snapshot/SnapshotOptionsPanel.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/data/MenuTreeLoader.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/ui/ActionsPanel.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/ui/ActiveLayersPanel.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/ui/Map.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/ui/HomePanel.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/ui/MapOptionsPanel.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/ui/MapMenuPanel.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/ui/PortalPanel.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/ui/LayerChooserPanel.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/ui/MainTabPanel.js')}"    type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/mainMap/map.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/mainMap/TransectControl.js')}"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/mainMap/detailsPanel.js')}"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/mainMap/ncWMSAnimation.js')}"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/common/DownloadCart.js')}"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/ui/Viewport.js')}"    type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/portal.js')}"    type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/common/GeoExt.ux.BaseLayerCombobox.js')}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/mainMap/ramadda.js')}"  type="text/javascript"></script>

<!--- common styles and JavaScript for the map page and Grails admin pages -->
 <g:render template="/common_includes"></g:render>
 
<title>${configInstance?.name}</title>
</head>

<body>
    
  <g:render template="/mainPortalHeader" model="['showLinks':true,'configInstance':configInstance]"></g:render>
  
<div id="loader" style="position:absolute; top:50%; left:43%; z-index: 9000;">
  <p>Page Loading ....</p>
  <div id="jsloader" style="position:relative;left:120px;top:-7px" ></div>
    <!--img src="images/spinnerLarge.gif" alt="Loading..." /-->
  </div>

<%-- Display message from Grails app --%>
<g:if test="${flash.message}">
  <script type="text/javascript">
    Ext.Msg.alert( "Message", "${flash.message.encodeAsHTML()}" );
  </script>
</g:if>
  
</body>

</html>
