/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

def instanceCss = grailsApplication.config.portal.instance.css
def instanceNameCss = "${grailsApplication.config.portal.instance.name}.css"



modules = {

    helpers {
        resource url:"js/jquery/jquery-1.4.1.min.js", disposition:'head'
        resource url:"js/portal/jquery.js", disposition:'head'
        resource url:"js/jquery/jquery-autocomplete1.1.js", disposition:'head'
        resource url:"js/jquery/jquery.rotate.1-1.js", disposition:'head'
        resource url:"js/log4javascript-1.4.6/log4javascript_uncompressed.js", disposition:'head'
        resource url:"js/portal/utils/Logging.js", disposition:'head'
        resource url:"js/portal/common/helpers.js", disposition:'head'
    }

    geonetwork {

        dependsOn 'extJsbundle'

        // GeoNetwork - required classes only
        resource url:"js/Geonetwork/lib/OpenLayers/addins/Format/GeoNetworkRecords.js", disposition:'head'
        resource url:"js/Geonetwork/lib/GeoNetwork/Util.js", disposition:'head'
        resource url:"js/Geonetwork/lib/GeoNetwork/lang/en.js", disposition:'head'
        resource url:"js/Geonetwork/lib/GeoNetwork/Catalogue.js", disposition:'head'
        resource url:"js/Geonetwork/lib/GeoNetwork/util/SearchTools.js", disposition:'head'
        resource url:"js/Geonetwork/lib/GeoNetwork/data/OpenSearchSuggestionReader.js", disposition:'head'
        resource url:"js/Geonetwork/lib/GeoNetwork/data/OpenSearchSuggestionStore.js", disposition:'head'
        resource url:"js/Geonetwork/lib/GeoNetwork/map/ExtentMap.js", disposition:'head'
        resource url:"js/Geonetwork/lib/GeoNetwork/map/Ext.ux/form/DateTime.js", disposition:'head'

        resource url:"js/ext-ux/SuperBoxSelect/SuperBoxSelect.js", disposition:'head'
        resource url:"js/ext-ux/Hyperlink/Hyperlink.js", disposition:'head'
        resource url:"js/ext-ux/util/MessageBus.js", disposition:'head'
    }

    openLayers {
        resource url:"js/OpenLayers-2.10/OpenLayers.js", disposition:'head'
    }


    extJsbundle {

        dependsOn 'openLayers'

        if (env == "development") {
            resource url:"js/ext-3.3.1/adapter/ext/ext-base-debug.js", disposition:'head'
            resource url:"js/ext-3.3.1/ext-all-debug.js", disposition:'head'
            //GeoExt (Has to be after Openlayers and ExJS)
            resource url:"js/GeoExt1.1/lib/GeoExt.js", disposition:'head'
        }
        else {
            resource url:"js/ext-3.3.1/adapter/ext/ext-base.js", disposition:'head'
            resource url:"js/ext-3.3.1/ext-all.js", disposition:'head'
            //GeoExt (Has to be after Openlayers and ExJS)
            resource url:"js/GeoExt1.1/script/GeoExt.js", disposition:'head'
        }



    }

    common {

        defaultBundle 'portalJs'


        //resource url: [dir: "js", file: "myResourceThatShouldRemainUntouched.js"],  exclude:'yuijsminify'
        resource url:"js/portal/ui/openlayers/control/SpatialConstraint.js", disposition:'head'
        resource url:"js/portal/utils/geo/GeoUtil.js", disposition:'head'
        resource url:"js/portal/portal.js", disposition:'head'
        resource url:"js/portal/ObjectFactory.js", disposition:'head'
        resource url:"js/portal/PortalEvents.js", disposition:'head'
        resource url:"js/portal/prototypes/Array.js", disposition:'head'
        resource url:"js/portal/prototypes/Object.js", disposition:'head'
        resource url:"js/portal/prototypes/String.js", disposition:'head'
        resource url:"js/portal/prototypes/OpenLayers.js", disposition:'head'
        resource url:"js/portal/common/LayerDescriptor.js", disposition:'head'
        resource url:"js/portal/common/BrowserWindow.js", disposition:'head'
        resource url:"js/portal/common/ActionColumn.js", disposition:'head'
        resource url:"js/portal/common/AppConfigStore.js", disposition:'head'
        resource url:"js/portal/common/SaveDialog.js", disposition:'head'
        resource url:"js/portal/common/MapPanel.js", disposition:'head'
        resource url:"js/portal/common/Controller.js", disposition:'head'
        resource url:"js/portal/config/PortalConfigLoader.js", disposition:'head'
        resource url:"js/portal/data/LayerStore.js", disposition:'head'
        resource url:"js/portal/data/MenuTreeLoader.js", disposition:'head'
        resource url:"js/portal/data/SuggestionStore.js", disposition:'head'
        resource url:"js/portal/search/data/LinkStore.js", disposition:'head'
        resource url:"js/portal/search/data/FacetStore.js", disposition:'head'
        resource url:"js/portal/search/field/FreeText.js", disposition:'head'
        resource url:"js/portal/search/field/DateRange.js", disposition:'head'
        resource url:"js/portal/search/field/FacetedDateRange.js", disposition:'head'
        resource url:"js/portal/search/field/MultiSelectCombo.js", disposition:'head'
        resource url:"js/portal/search/field/CheckBox.js", disposition:'head'
        resource url:"js/portal/search/field/ValueCheckBox.js", disposition:'head'
        resource url:"js/portal/search/GeoFacetMapToolbar.js", disposition:'head'
        resource url:"js/portal/search/FacetMapPanel.js", disposition:'head'
        resource url:"js/portal/search/FacetedSearchResultsMiniMap.js", disposition:'head'
        resource url:"js/portal/search/FacetedSearchResultsPanel.js", disposition:'head'
        resource url:"js/portal/search/FacetedSearchResultsDataView.js", disposition:'head'
        resource url:"js/portal/search/DateSelectionPanel.js", disposition:'head'
        resource url:"js/portal/search/GeoSelectionPanel.js", disposition:'head'
        resource url:"js/portal/search/MetadataExtent.js", disposition:'head'
        resource url:"js/portal/data/ServerNodeLayerDescriptorStore.js", disposition:'head'
        resource url:"js/portal/data/MenuItemToNodeBuilder.js", disposition:'head'
        resource url:"js/portal/ui/ActiveLayersTreeNodeUI.js", disposition:'head'
        resource url:"js/portal/ui/ActionsPanel.js", disposition:'head'
        resource url:"js/portal/ui/ActiveLayersPanel.js", disposition:'head'
        resource url:"js/portal/utils/FormUtil.js", disposition:'head'
        resource url:"js/portal/utils/TimeUtil.js", disposition:'head'
        resource url:"js/portal/utils/moment.min.js", disposition:'head'
        resource url:"js/portal/prototypes/Moment.js", disposition:'head'
        resource url:"js/portal/details/BoxDisplayPanel.js", disposition:'head'
        resource url:"js/portal/details/PolygonDisplayPanel.js", disposition:'head'
        resource url:"js/portal/details/SpatialConstraintDisplayPanel.js", disposition:'head'
        resource url:"js/portal/details/SpatialSubsetControlsPanel.js", disposition:'head'
        resource url:"js/portal/details/TimeComboBox.js", disposition:'head'
        resource url:"js/portal/filter/BaseFilterPanel.js", disposition:'head'
        resource url:"js/portal/filter/ComboFilterPanel.js", disposition:'head'
        resource url:"js/portal/filter/ConfigPage.js", disposition:'head'
        resource url:"js/portal/filter/DateFilterPanel.js", disposition:'head'
        resource url:"js/portal/filter/DateRangeFilterPanel.js", disposition:'head'
        resource url:"js/portal/filter/BoundingBoxFilterPanel.js", disposition:'head'
        resource url:"js/portal/filter/BooleanFilterPanel.js", disposition:'head'
        resource url:"js/portal/filter/NumberFilterPanel.js", disposition:'head'
        resource url:"js/portal/filter/FilterGroupPanel.js", disposition:'head'
        resource url:"js/portal/form/UtcExtentDateTime.js", disposition:'head'
        resource url:"js/portal/form/PolygonTypeComboBox.js", disposition:'head'
        resource url:"js/portal/details/NCWMSColourScalePanel.js", disposition:'head'
        resource url:"js/portal/details/StylePanel.js", disposition:'head'
        resource url:"js/portal/details/DetailsPanel.js", disposition:'head'
        resource url:"js/portal/details/NcWmsPanel.js", disposition:'head'
        resource url:"js/portal/details/DetailsPanelTab.js", disposition:'head'
        resource url:"js/portal/details/InfoPanel.js", disposition:'head'
        resource url:"js/portal/details/SubsetPanel.js", disposition:'head'
        resource url:"js/portal/ui/openlayers/ClickControl.js", disposition:'head'
        resource url:"js/portal/ui/openlayers/LayerOptions.js", disposition:'head'
        resource url:"js/portal/ui/openlayers/LayerParams.js", disposition:'head'
        resource url:"js/portal/ui/openlayers/MapActionsControl.js", disposition:'head'
        resource url:"js/portal/ui/openlayers/MapOptions.js", disposition:'head'
        resource url:"js/portal/ui/openlayers/TemporalMap.js", disposition:'head'
        resource url:"js/portal/ui/openlayers/SpatialConstraintMap.js", disposition:'head'
        resource url:"js/portal/ui/openlayers/layer/NcWMS.js", disposition:'head'
        resource url:"js/portal/ui/MapPanel.js", disposition:'head'
        resource url:"js/portal/ui/MapOptionsPanel.js", disposition:'head'
        resource url:"js/portal/ui/VisualisePanel.js", disposition:'head'
        resource url:"js/portal/ui/MainToolbar.js", disposition:'head'
        resource url:"js/portal/ui/NavigableCardLayout.js", disposition:'head'
        resource url:"js/portal/ui/MainPanel.js", disposition:'head'
        resource url:"js/portal/ui/FeatureInfoPopup.js", disposition:'head'
        resource url:"js/portal/ui/Viewport.js", disposition:'head'
        resource url:"js/portal/ui/SelectionPanel.js", disposition:'head'
        resource url:"js/portal/ui/TimeRangeLabel.js", disposition:'head'
        resource url:"js/portal/ui/search/SearchBodyPanel.js", disposition:'head'
        resource url:"js/portal/ui/search/SearchPanel.js", disposition:'head'
        resource url:"js/portal/ui/search/FreeTextSearchPanel.js", disposition:'head'
        resource url:"js/portal/service/CatalogSearcher.js", disposition:'head'
        resource url:"js/portal/ui/search/SearchFiltersPanel.js", disposition:'head'
        resource url:"js/portal/data/TopTermStoreSortOrder.js", disposition:'head'
        resource url:"js/portal/data/TopTermStore.js", disposition:'head'
        resource url:"js/portal/ui/TermSelectionPanel.js", disposition:'head'
        resource url:"js/portal/data/ChildElementsField.js", disposition:'head'
        resource url:"js/portal/data/GeoNetworkRecord.js", disposition:'head'
        resource url:"js/portal/data/GeoNetworkRecordStore.js", disposition:'head'
        resource url:"js/portal/data/ActiveGeoNetworkRecordStore.js", disposition:'head'
        resource url:"js/portal/ui/EmptyDropZonePlaceholder.js", disposition:'head'
        resource url:"js/portal/mainMap/map.js", disposition:'head'
        resource url:"js/portal/common/GeoExt.ux.BaseLayerCombobox.js", disposition:'head'
        resource url:"js/portal/common/LayerOpacitySliderFixed.js", disposition:'head'
        resource url:"js/portal/cart/DownloadPanelItemTemplate.js", disposition:'head'
        resource url:"js/portal/cart/DownloadPanelBody.js", disposition:'head'
        resource url:"js/portal/cart/DownloadPanel.js", disposition:'head'
        resource url:"js/portal/cart/DownloadConfirmationWindow.js", disposition:'head'
        resource url:"js/portal/cart/NoDataRowHtml.js", disposition:'head'
        resource url:"js/portal/cart/WmsDataRowHtml.js", disposition:'head'
        resource url:"js/portal/cart/NcwmsDataRowHtml.js", disposition:'head'
        resource url:"js/portal/cart/DownloadEstimator.js", disposition:'head'
        resource url:"js/portal/visualise/animations/TemporalExtent.js", disposition:'head'
        resource url:"js/portal/visualise/animations/TemporalExtentParser.js", disposition:'head'
        resource url:"js/portal/openId/Popup.js", disposition:'head'
    }





    extDevel {
        resource url:"js/ext-3.3.1/adapter/ext/ext-base-debug.js", disposition:'head'
        resource url:"js/ext-3.3.1/ext-all-debug.js", disposition:'head'
        resource url:"js/GeoExt1.1/lib/GeoExt.js", disposition:'head'
    }







}