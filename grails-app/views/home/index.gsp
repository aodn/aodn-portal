${buildInfo}
<html>
<head>
<meta http-equiv="content-script-type" content="text/javascript" />
<meta http-equiv="X-UA-Compatible" content="IE=8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />

<!--link rel="stylesheet" media="print" type="text/css"  href="${resource(dir:'css',file:'mapprint.css')}" /-->
<link rel="stylesheet" type="text/css"  href="${resource(dir:'js',file:'GeoExt1.1/resources/css/geoext-all.css')}" />
<!-- User extensions -->
<link rel="stylesheet" type="text/css"  href="${resource(dir:'js',file:'ext-ux/SuperBoxSelect/superboxselect.css')}" />
<link rel="stylesheet" type="text/css"  href="${resource(dir:'js',file:'ext-ux/Hyperlink/hyperlink.css')}" />
<!-- Portal classes-->
<link rel="stylesheet" type="text/css"  href="${resource(dir:'css',file:'portal-search.css')}" />

<g:if env="development">
<script src="${resource(dir:'js',file:'ext-3.3.1/adapter/ext/ext-base-debug.js')}" type="text/javascript"></script>          
<script src="${resource(dir:'js',file:'ext-3.3.1/ext-all-debug.js')}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'OpenLayers-2.10/OpenLayers.js')}" type="text/javascript"></script>
<!--- GeoExt (Has to be after Openlayers and ExJS) -->
<script src="${resource(dir:'js',file:'GeoExt1.1/lib/GeoExt.js')}" type="text/javascript"></script>
</g:if>
<g:else>
<script src="${resource(dir:'js',file:'ext-3.3.1/adapter/ext/ext-base.js')}" type="text/javascript"></script>          
<script src="${resource(dir:'js',file:'ext-3.3.1/ext-all.js')}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'OpenLayers-2.10/OpenLayers.js')}" type="text/javascript"></script>
<!--- GeoExt (Has to be after Openlayers and ExJS) -->
<script src="${resource(dir:'js',file:'GeoExt1.1/script/GeoExt.js')}" type="text/javascript"></script>
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
<script src="${resource(dir:'js',file:'ext-ux/Hyperlink/Hyperlink.js')}" type="text/javascript"></script>

<script src="${resource(dir:'js',file:'portal/lang/en.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/common/spin.min.js?')}${jsVerNum}" type="text/javascript"></script>   
<script src="${resource(dir:'js',file:'portal/common/BrowserWindow.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/common/ActionColumn.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/common/LoadMask.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/common/AppConfigStore.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/common/SaveDialog.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/common/MapPanel.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/data/MenuTreeLoader.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/data/SuggestionStore.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/data/CatalogResultsStore.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/data/LinkStore.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/data/FacetStore.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/field/FreeText.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/field/DateRange.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/field/BoundingBox.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/field/MultiSelectCombo.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/filter/FilterComboBox.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/filter/FiltersPanel.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/filter/FilterStore.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/FilterSelector.js?')}${jsVerNum}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/NewSearchLink.js?')}${jsVerNum}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/SaveSearchLink.js?')}${jsVerNum}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/MiniMapPanel.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/SavedSearchComboBox.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/SaveSearchDialog.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/SavedSearchPanel.js?')}${jsVerNum}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/SearchController.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/SearchForm.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/RightSearchTabPanel.js?')}${jsVerNum}"   type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/SearchTabPanel.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/LinkSelectionWindow.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/LayerSelectionWindow.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/search/ResultsGrid.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/data/ServerNodeLayerDescriptorStore.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/data/MenuItemToNodeBuilder.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/snapshot/SnapshotProxy.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/snapshot/SnapshotController.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/snapshot/SaveSnapshotDialog.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/snapshot/SnapshotSaveButton.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/snapshot/SnapshotOptionsPanel.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/ui/ActionsPanel.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/ui/ActiveLayersPanel.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/details/AnimationPanel.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/details/NCWMSColourScalePanel.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/details/StylePanel.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/details/DetailsPanel.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/details/DetailsPanelTab.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/details/InfoPanel.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/ui/RightDetailsPanel.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/ui/Map.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/ui/HomePanel.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/ui/MapOptionsPanel.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/ui/MapMenuPanel.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/ui/PortalPanel.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/ui/LayerChooserPanel.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/ui/MainTabPanel.js?')}${jsVerNum}"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/ui/UserDefinedWMSPanel.js?')}${jsVerNum}"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/ui/DownloadCartConfirmationWindow.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/ui/Viewport.js?')}${jsVerNum}"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/mainMap/map.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/mainMap/TransectControl.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/common/DownloadCart.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/portal.js?')}${jsVerNum}"  type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/common/GeoExt.ux.BaseLayerCombobox.js?')}${jsVerNum}" type="text/javascript"></script>
<script src="${resource(dir:'js',file:'portal/mainMap/ramadda.js?')}${jsVerNum}" type="text/javascript"></script>

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
