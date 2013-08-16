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


    <!--[if lt IE 8]>
 <script type="text/javascript">
    alert("Sorry. The Portal requires IE8 or better! Although the site may appear to work, the functionality is not guaranteed or supported in your web browser. Please update!");
 </script>
   <![endif]-->


${buildInfo}

<!--link rel="stylesheet" media="print" type="text/css"  href="${resource(dir: 'css', file: 'mapprint.css')}" /-->
<link rel="stylesheet" type="text/css"
      href="${resource(dir: 'js', file: 'GeoExt1.1/resources/css/geoext-all.css')}"/>
<!-- User extensions -->
<link rel="stylesheet" type="text/css"
      href="${resource(dir: 'js', file: 'ext-ux/SuperBoxSelect/superboxselect.css')}"/>
<link rel="stylesheet" type="text/css" href="${resource(dir: 'js', file: 'ext-ux/Hyperlink/hyperlink.css')}"/>
<!-- Portal classes-->
<link rel="stylesheet" type="text/css" href="${resource(dir: 'css', file: 'portal-search.css')}"/>

<!-- common styles and JavaScript for the map page and Grails admin pages -->
<g:render template="/common_includes"></g:render>

<g:if env="development">
    <script src="${resource(dir: 'js', file: 'ext-3.3.1/adapter/ext/ext-base-debug.js')}"
            type="text/javascript"></script>
    <script src="${resource(dir: 'js', file: 'ext-3.3.1/ext-all-debug.js')}" type="text/javascript"></script>
    <script src="${resource(dir: 'js', file: 'OpenLayers-2.10/OpenLayers.js')}" type="text/javascript"></script>
    <!--- GeoExt (Has to be after Openlayers and ExJS) -->
    <script src="${resource(dir: 'js', file: 'GeoExt1.1/lib/GeoExt.js')}" type="text/javascript"></script>
</g:if>
<g:else>
    <script src="${resource(dir: 'js', file: 'ext-3.3.1/adapter/ext/ext-base.js')}" type="text/javascript"></script>
    <script src="${resource(dir: 'js', file: 'ext-3.3.1/ext-all.js')}" type="text/javascript"></script>
    <script src="${resource(dir: 'js', file: 'OpenLayers-2.10/OpenLayers.js')}" type="text/javascript"></script>
    <!--- GeoExt (Has to be after Openlayers and ExJS) -->
    <script src="${resource(dir: 'js', file: 'GeoExt1.1/script/GeoExt.js')}" type="text/javascript"></script>
</g:else>

<!-- GeoNetwork - required classes only -->
<script src="${resource(dir: 'js', file: 'Geonetwork/lib/OpenLayers/addins/Format/GeoNetworkRecords.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'Geonetwork/lib/GeoNetwork/Util.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'Geonetwork/lib/GeoNetwork/lang/en.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'Geonetwork/lib/GeoNetwork/Catalogue.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'Geonetwork/lib/GeoNetwork/util/SearchTools.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'Geonetwork/lib/GeoNetwork/data/OpenSearchSuggestionReader.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'Geonetwork/lib/GeoNetwork/data/OpenSearchSuggestionStore.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'Geonetwork/lib/GeoNetwork/map/ExtentMap.js')}"
        type="text/javascript"></script>

<script src="${resource(dir: 'js', file: 'ext-ux/SuperBoxSelect/SuperBoxSelect.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'ext-ux/Hyperlink/Hyperlink.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'ext-ux/util/MessageBus.js')}" type="text/javascript"></script>

<g:if env="development">
<script src="${resource(dir: 'js', file: 'portal/PortalEvents.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/prototypes/Array.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/prototypes/OpenLayers.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/lang/en.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/common/LayerDescriptor.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/common/spin.min.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/common/BrowserWindow.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/common/ActionColumn.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/common/LoadMask.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/common/AppConfigStore.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/common/SaveDialog.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/common/MapPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/common/Controller.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/config/PortalConfigLoader.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/data/LayerStore.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/data/MenuTreeLoader.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/data/SuggestionStore.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/data/CatalogResult.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/data/CatalogResultsStore.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/data/LinkStore.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/data/FacetStore.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/field/FreeText.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/field/DateRange.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/field/FacetedDateRange.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/field/BoundingBox.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/field/MultiSelectCombo.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/field/CheckBox.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/field/ValueCheckBox.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/field/MapLayersCheckBox.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/filter/FilterComboBox.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/filter/FiltersPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/filter/FilterStore.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/FilterSelector.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/NewSearchLink.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/SaveSearchLink.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/SavedSearchComboBox.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/CloneMapPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/GeoFacetMapToolbar.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/FacetMapPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/SaveSearchDialog.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/SavedSearchPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/SearchController.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/SearchForm.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/RightSearchTabPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/SearchTabPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/LinkSelectionWindow.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/LayerSelectionWindow.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/ResultsGrid.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/FacetedSearchResultsGrid.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/DateSelectionPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/GeoSelectionPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/search/MetadataExtent.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/data/ServerNodeLayerDescriptorStore.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/data/MenuItemToNodeBuilder.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/snapshot/SnapshotProxy.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/snapshot/SnapshotController.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/snapshot/SaveSnapshotDialog.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/snapshot/SnapshotSaveButton.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/snapshot/SnapshotOptionsPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/ActiveLayersTreeNodeUI.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/ActionsPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/ActiveLayersPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/utils/FormUtil.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/utils/TimeUtil.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/utils/moment.min.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/details/TimeComboBox.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/details/AnimationDateTimeSelectorPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/details/AnimationControlsPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/filter/BaseFilter.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/filter/ComboFilter.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/filter/TimeFilter.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/filter/BoundingBoxFilter.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/filter/BooleanFilter.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/filter/NumberFilter.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/filter/FilterPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/details/NCWMSColourScalePanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/details/StylePanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/details/DetailsPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/details/AodaacPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/details/DetailsPanelTab.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/details/InfoPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/openlayers/ClickControl.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/openlayers/LayerOptions.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/openlayers/LayerParams.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/openlayers/MapActionsControl.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/openlayers/MapOptions.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/openlayers/TemporalMap.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/openlayers/Timer.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/openlayers/control/Time.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/openlayers/layer/NcWMS.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/openlayers/tile/TemporalImage.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/AnimationPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/RightDetailsPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/MapPanel.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/HomePanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/MapOptionsPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/MapMenuPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/PortalPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/LayerChooserPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/MainTabPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/UserDefinedWMSPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/cart/DownloadCartConfirmationWindow.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/FeatureInfoPopup.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/Viewport.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/SelectionPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/search/SearchPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/search/FreeTextSearchPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/service/CatalogSearcher.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/search/SearchFiltersPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/data/TopTermStore.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/TermSelectionPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/data/GeoNetworkRecord.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/data/GeoNetworkRecordStore.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/cart/Downloader.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/data/ActiveGeoNetworkRecordStore.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/EmptyDropZonePlaceholder.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/mainMap/map.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/mainMap/TransectControl.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/portal.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/common/GeoExt.ux.BaseLayerCombobox.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/common/LayerOpacitySliderFixed.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/ui/MenuPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/cart/DownloadPanelTemplate.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/cart/DownloadColumnModel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/cart/DownloadGridView.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/cart/DownloadToolbar.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/cart/DownloadPanel.js')}"
        type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'portal/openId/Popup.js')}"
        type="text/javascript"></script>
</g:if>
<g:else>
    <script src="${resource(dir: 'js', file: 'portal-all.js')}?v=${jsVerNum}" type="text/javascript"></script>
</g:else>

<title>${configInstance?.name}</title>
</head>

<body>

<g:render template="/mainPortalHeader" model="['showLinks': true, 'configInstance': configInstance]"></g:render>

<%-- Display message from Grails app --%>
<g:if test="${flash.openIdMessage }">
    <script type="text/javascript">
        Ext.Msg.alert("Message", "${flash.openIdMessage.encodeAsHTML()}");
    </script>
</g:if>
</body>
</html>
