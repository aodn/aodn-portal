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

<!-- common styles and JavaScript for the map page and Grails admin pages -->
<g:render template="/common_includes"></g:render>

<script src="http://maps.google.com/maps/api/js?v=3.6&sensor=false"></script>

<g:if env="development">
    <script src="${resource(dir: 'js', file: 'ext-3.3.1/adapter/ext/ext-base-debug.js')}" type="text/javascript"></script>
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
<script src="${resource(dir: 'js', file: 'Geonetwork/lib/OpenLayers/addins/Format/GeoNetworkRecords.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'Geonetwork/lib/GeoNetwork/Util.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'Geonetwork/lib/GeoNetwork/lang/en.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'Geonetwork/lib/GeoNetwork/Catalogue.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'Geonetwork/lib/GeoNetwork/util/SearchTools.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'Geonetwork/lib/GeoNetwork/data/OpenSearchSuggestionReader.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'Geonetwork/lib/GeoNetwork/data/OpenSearchSuggestionStore.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'Geonetwork/lib/GeoNetwork/map/ExtentMap.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'Geonetwork/lib/GeoNetwork/map/Ext.ux/form/DateTime.js')}" type="text/javascript"></script>

<script src="${resource(dir: 'js', file: 'ext-ux/SuperBoxSelect/SuperBoxSelect.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'ext-ux/Hyperlink/Hyperlink.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js', file: 'ext-ux/util/MessageBus.js')}" type="text/javascript"></script>

<g:if env="development">
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/utils/geo/GeoUtil.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/portal.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/PortalEvents.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/prototypes/Array.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/prototypes/Object.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/prototypes/String.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/prototypes/OpenLayers.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/lang/en.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/common/LayerDescriptor.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/common/spin.min.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/common/BrowserWindow.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/common/ActionColumn.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/common/LoadMask.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/common/AppConfigStore.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/common/SaveDialog.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/common/MapPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/common/Controller.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/config/PortalConfigLoader.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/data/LayerStore.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/data/MenuTreeLoader.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/data/SuggestionStore.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/search/data/LinkStore.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/search/data/FacetStore.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/search/field/FreeText.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/search/field/DateRange.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/search/field/FacetedDateRange.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/search/field/MultiSelectCombo.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/search/field/CheckBox.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/search/field/ValueCheckBox.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/search/GeoFacetMapToolbar.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/search/FacetMapPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/search/FacetedSearchResultsMiniMap.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/search/FacetedSearchResultsPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/search/FacetedSearchResultsDataView.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/search/DateSelectionPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/search/GeoSelectionPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/search/MetadataExtent.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/data/ServerNodeLayerDescriptorStore.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/data/MenuItemToNodeBuilder.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/ui/ActiveLayersTreeNodeUI.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/ui/ActionsPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/ui/ActiveLayersPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/utils/FormUtil.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/utils/TimeUtil.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/utils/moment.min.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/details/BoxDisplayPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/details/PolygonDisplayPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/details/SpatialConstraintDisplayPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/details/TimeComboBox.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/filter/BaseFilterPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/filter/ComboFilterPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/filter/DateFilterPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/filter/DateRangeFilterPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/filter/BoundingBoxFilterPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/filter/BooleanFilterPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/filter/NumberFilterPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/filter/FilterGroupPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/form/UtcExtentDateTime.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/form/PolygonTypeComboBox.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/details/NCWMSColourScalePanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/details/StylePanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/details/DetailsPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/details/AodaacPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/details/DetailsPanelTab.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/details/InfoPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/ui/openlayers/ClickControl.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/ui/openlayers/LayerOptions.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/ui/openlayers/LayerParams.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/ui/openlayers/MapActionsControl.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/ui/openlayers/MapOptions.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/ui/openlayers/TemporalMap.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/ui/openlayers/layer/NcWMS.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/ui/openlayers/control/SpatialConstraint.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/ui/MapPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/ui/MapOptionsPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/ui/VisualisePanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/ui/MainToolbar.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/ui/NavigableCardLayout.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/ui/MainPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/ui/FeatureInfoPopup.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/ui/Viewport.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/ui/SelectionPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/ui/search/SearchBodyPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/ui/search/SearchPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/ui/search/FreeTextSearchPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/service/CatalogSearcher.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/ui/search/SearchFiltersPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/ui/search/SearchFilterPanelFactory.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/data/TopTermStore.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/ui/TermSelectionPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/data/ChildElementsField.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/data/GeoNetworkRecord.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/data/GeoNetworkRecordStore.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/data/ActiveGeoNetworkRecordStore.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/ui/EmptyDropZonePlaceholder.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/mainMap/map.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/common/GeoExt.ux.BaseLayerCombobox.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/common/LayerOpacitySliderFixed.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/cart/DownloadPanelTemplate.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/cart/DownloadPanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/cart/DownloadConfirmationWindow.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/cart/AodaacDataRowTemplate.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/cart/WfsDataRowTemplate.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/cart/NoDataRowTemplate.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/visualise/animations/TemporalExtent.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/visualise/animations/TemporalExtentParser.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/visualise/PolygonTypePanel.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'portal/openId/Popup.js')}"></script>
</g:if>
<g:else>
    <script src="${resource(dir: 'js', file: 'portal-all.js')}?v=${jsVerNum}" type="text/javascript"></script>
</g:else>

<title>${configInstance?.name}</title>
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
