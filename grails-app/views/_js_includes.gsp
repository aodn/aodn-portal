<!-- First import JQUERY -->
<script language="JavaScript" type="text/javascript" src="${resource(dir: 'js/jquery', file: 'jquery-3.2.0.min.js')}"></script>
<script language="JavaScript" type="text/javascript" src="${resource(dir: 'js/portal', file: 'jquery.js')}"></script>
<!-- Import extra pluggins-->
<script language="JavaScript" type="text/javascript" src="${resource(dir: 'js/jquery', file: 'jquery-autocomplete1.1.js')}"></script>
<script language="JavaScript" type="text/javascript" src="${resource(dir: 'js/jquery', file: 'jquery.fileDownload.js')}"></script>
<script language="JavaScript" type="text/javascript" src="${resource(dir: 'js/jquery', file: 'jquery.rotate.1-1.js')}"></script>
<script language="JavaScript" type="text/javascript" src="${resource(dir: 'js/jquery', file: 'jquery.cookie.js')}"></script>
<script language="JavaScript" type="text/javascript" src="${resource(dir: 'js/jquery', file: 'jquery-ui.min.js')}"></script>

<script type="text/javascript" src="${resource(dir: 'js/log4javascript-1.4.6', file: 'log4javascript_uncompressed.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js/portal/utils', file: 'Logging.js')}"></script>

<script src="${resource(dir: 'js/portal/common', file: 'helpers.js')}" type="text/javascript"></script>


<g:if env="development">
    <script src="${resource(dir: 'js/ext-3.3.1/adapter/ext', file: 'ext-base-debug.js')}" type="text/javascript"></script>
    <script src="${resource(dir: 'js/ext-3.3.1', file: 'ext-all-debug.js')}" type="text/javascript"></script>
    <script src="${resource(dir: 'js/OpenLayers-2.13.1/lib', file: 'OpenLayers.js')}" type="text/javascript"></script>
    <script src="${resource(dir: 'js/OpenLayers-2.13.1/lib', file: 'deprecated.js')}" type="text/javascript"></script>
    <!--- GeoExt (Has to be after Openlayers and ExJS) -->
    <script src="${resource(dir: 'js/GeoExt1.1/lib', file: 'GeoExt.js')}" type="text/javascript"></script>
</g:if>
<g:else>
    <script src="${resource(dir: 'js/ext-3.3.1/adapter/ext', file: 'ext-base.js')}" type="text/javascript"></script>
    <script src="${resource(dir: 'js/ext-3.3.1', file: 'ext-all.js')}" type="text/javascript"></script>
    <script src="${resource(dir: 'js/OpenLayers-2.13.1', file: 'OpenLayers.js')}" type="text/javascript"></script>
    <script src="${resource(dir: 'js/OpenLayers-2.13.1/lib', file: 'deprecated.js')}" type="text/javascript"></script>
    <!--- GeoExt (Has to be after Openlayers and ExJS) -->
    <script src="${resource(dir: 'js/GeoExt1.1/script', file: 'GeoExt.js')}" type="text/javascript"></script>
</g:else>

<script src="${resource(dir: 'js/ext-ux/form', file: 'DateTime.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js/ext-ux', file: 'ScrollTo.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js/ext-ux/Hyperlink', file: 'Hyperlink.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js/ext-ux/tree', file: 'XmlTreeLoader.js')}" type="text/javascript"></script>
<script src="${resource(dir: 'js/ext-ux/util', file: 'MessageBus.js')}" type="text/javascript"></script>

<g:if env="development">
    <script type="text/javascript" src="${resource(dir: 'js/portal/ui/openlayers/control', file: 'SpatialConstraint.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/utils/geo', file: 'GeoUtil.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/utils', file: 'Image.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/utils', file: 'Proxy.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/utils', file: 'Set.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/utils', file: 'ObservableUtils.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/utils', file: 'BrowserCheck.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal', file: 'portal.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal', file: 'ObjectFactory.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal', file: 'PortalEvents.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/prototypes', file: 'Number.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/prototypes', file: 'WKTNormalised.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/prototypes', file: 'Array.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/prototypes', file: 'Ext.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/prototypes', file: 'ExtUxAjax.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/prototypes', file: 'Object.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/prototypes', file: 'String.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/prototypes', file: 'OpenLayers.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/lang', file: 'en.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/common', file: 'LayerDescriptor.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/common', file: 'BrowserWindow.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/common', file: 'ActionColumn.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/common', file: 'SaveDialog.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/common', file: 'MapPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/common', file: 'Controller.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/common', file: 'EmptyCollectionsStatusPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/data', file: 'LayerStore.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/data', file: 'Server.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/data', file: 'SuggestionStore.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/search/data', file: 'LinkStore.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/search/data', file: 'MetadataSearchResponseLoader.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/search/field', file: 'FacetedDateRange.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/search', file: 'GeoFacetMapToolbar.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/search', file: 'FacetMapPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/search', file: 'FacetedSearchResultsMiniMap.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/search', file: 'FacetedSearchResultsPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/search', file: 'FacetedSearchResultsDataView.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/search', file: 'FreeTextSearchPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/search', file: 'DateSelectionPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/search', file: 'GeoSelectionPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/search', file: 'MetadataExtent.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/search', file: 'PagingToolbar.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/utils', file: 'FormUtil.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/utils', file: 'StopWatch.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/utils', file: 'Date.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/utils', file: 'moment.min.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/utils', file: 'trackUsage.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/prototypes', file: 'Moment.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/prototypes', file: 'NonCollapsingAccordionLayout.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/details', file: 'BoxDisplayPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/details', file: 'PolygonDisplayPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/details', file: 'SpatialConstraintDisplayPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/details', file: 'GlobalGeometryFilterPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/filter', file: 'FilterUtils.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/filter', file: 'Filter.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/filter', file: 'BooleanFilter.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/filter', file: 'DateFilter.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/filter', file: 'GeometryFilter.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/filter', file: 'NumberFilter.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/filter', file: 'StringFilter.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/filter', file: 'PointFilter.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/filter', file: 'FilterService.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/filter/ui', file: 'BaseFilterPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/filter/ui', file: 'ComboFilterPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/filter/ui', file: 'ResettableDate.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/filter/ui', file: 'DateFilterPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/filter/ui', file: 'BooleanFilterPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/filter/ui', file: 'NumberFilterPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/filter/ui', file: 'FilterGroupPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/filter/ui', file: 'GeometryFilterService.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/filter/combiner', file: 'BaseFilterCombiner.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/filter/combiner', file: 'FilterCqlBuilder.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/filter/combiner', file: 'MapCqlBuilder.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/filter/combiner', file: 'BodaacCqlBuilder.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/filter/combiner', file: 'FileListCqlBuilder.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/filter/combiner', file: 'ShapeFileCqlBuilder.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/filter/combiner', file: 'DataDownloadCqlBuilder.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/filter/combiner', file: 'HumanReadableFilterDescriber.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/filter/validation', file: 'SpatialConstraintValidator.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/form', file: 'UtcExtentDateTime.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/form', file: 'UtcDateField.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/form', file: 'PolygonTypeComboBox.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/details', file: 'NcWmsScaleRangeControls.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/details', file: 'StylePanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/details', file: 'LayerControlPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/details', file: 'LayerDetailsPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/details', file: 'SubsetPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/details', file: 'NcWmsPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/details', file: 'DataCollectionDetailsAccordion.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/details', file: 'InfoPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/details', file: 'SubsetItemsTabPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/details', file: 'DataCollectionDetailsPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/details', file: 'PointTimeSeriesPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/ui/openlayers', file: 'ClickControl.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/ui/openlayers', file: 'LayerOptions.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/ui/openlayers', file: 'LayerParams.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/ui/openlayers', file: 'MapOptions.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/ui/openlayers', file: 'SpatialConstraintMap.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/ui/openlayers/layer', file: 'MiniMapBaseLayer.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/ui/openlayers/layer', file: 'NcWms.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/ui', file: 'MapPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/ui', file: 'VisualisePanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/ui', file: 'MainToolbar.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/ui', file: 'NavigableCardLayout.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/ui', file: 'MainPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/ui', file: 'FeatureInfoPopup.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/ui', file: 'Viewport.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/ui', file: 'DownloadCartWidget.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/ui', file: 'TimeRangeLabel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/search', file: 'SearchBodyPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/search', file: 'SearchPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/service', file: 'CatalogSearcher.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/search', file: 'SearchFiltersPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/search', file: 'FacetDrilldownPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/search', file: 'FacetFilterPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/data', file: 'ChildElementsField.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/data', file: 'MetadataRecord.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/data', file: 'TermClassification.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/data', file: 'TermClassificationStore.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/data', file: 'MetadataRecordFetcher.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/data', file: 'MetadataRecordStore.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/data', file: 'DataCollection.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/data', file: 'LayerSelectionModel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/data', file: 'DataCollectionLayerAdapter.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/data', file: 'DataCollectionStore.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/mainMap', file: 'map.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/common', file: 'GeoExt.ux.BaseLayerCombobox.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/common', file: 'LayerOpacitySliderFixed.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/cart', file: 'DownloadPanelItemTemplate.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/cart', file: 'Downloader.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/cart', file: 'DownloadPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/cart', file: 'DownloadEmailPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/cart', file: 'DownloadChallengePanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/cart', file: 'DownloadConfirmationWindow.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/cart', file: 'DownloadCalculatorPanel.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/cart', file: 'InsertionService.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/cart', file: 'BaseInjector.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/cart', file: 'NoDataInjector.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/cart', file: 'WmsInjector.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/cart', file: 'NcWmsInjector.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/cart', file: 'DownloadHandler.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/cart', file: 'BodaacDownloadHandler.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/cart', file: 'AsyncDownloadHandler.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/cart', file: 'GogoduckV1DownloadHandler.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/cart', file: 'GogoduckDownloadHandler.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/cart', file: 'PointCSVDownloadHandler.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/cart', file: 'FileListDownloadHandler.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/cart', file: 'ShapeFileDownloadHandler.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/cart', file: 'NetcdfSubsetServiceDownloadHandler.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/cart', file: 'PythonDownloadHandler.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/cart', file: 'WfsDownloadHandler.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/visualise/animations', file: 'TemporalExtent.js')}"></script>
    <script type="text/javascript" src="${resource(dir: 'js/portal/visualise/animations', file: 'TemporalExtentParser.js')}"></script>
</g:if>
<g:else>
    <script src="${resource(dir: 'js', file: 'portal-all.js')}?v=${resourceVersionNumber}" type="text/javascript"></script>
</g:else>
