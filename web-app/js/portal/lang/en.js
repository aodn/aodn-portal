/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

OpenLayers.Util.extend(OpenLayers.Lang.en, {

    unsupportedWarningMessage: "Your browser or device is unsupported and may not work with this site. \nPlease use Chrome or Firefox on a later generation Windows PC, Linux or Macbook/iMac for the best experience.",

    navigationButtonNext: "Next <div class=doubleArrow>&gt;&gt;</div>",
    navigationButtonPrevious: "<div class=doubleArrow>&lt;&lt;</div> Previous",
    navigationButtonSelect: "Select <div class=doubleArrow>&gt;&gt;</div>",
    navigationButtonDownload: "Download <div class=doubleArrow>&gt;&gt;</div>",

    footerText: "<b>Disclaimer:</b> You accept all risks and responsibility for losses, damages, costs and other consequences resulting directly or indirectly from using this site and any information or material available from it.",

    stepHeader: '<span class="stepTitle">Step ${stepNumber}:</span> ${stepDescription}',
    step1Description: 'Select a Data Collection',
    step2Description: 'Create a Subset',
    step3Description: 'Download',

    maskText: "Searching ... ",
    pleasePickCondensed: '**pick**',
    loadingSpinner: '<img src=\"images/spinner.gif\" style=\"vertical-align: middle;\" alt=\"Loading...\" />&nbsp;<i>Loading ${resource}\u2025</i>',

    // DetailsPanel.js
    opacity: "Opacity",
    wmsLayerProblem: "There is a problem with the availability of this collection",
    pickAStyle : ' ** Pick a style ** ',
    noActiveCollectionSelected: "No data collections selected",

    // Geographic Bounds
    navigate: 'Select by Map Bounds',
    navigateHelp: 'Drag the map. The map bounds is the selection area',
    box: 'Drag a Box',
    boxHelp: 'Drag a Box with a click and drag.',
    polygon: 'Draw Polygon',
    polygonHelp: 'Click to add points. Double click to close polygon.',
    geoSelectionPanelHelp: "Choose a method of defining a bounding area.",

    // Download Step
    noCollectionsMessage: 'No data collections to show',
    noDataMessage: 'No direct access to data available currently.',
    downloadButtonLabel: 'Download as\u2026',
    downloadAsCsvLabel: 'CSV',
    downloadAsSubsettedNetCdfLabel: 'NetCDF',
    downloadAsAllSourceNetCdfLabel: 'Un-subsetted NetCDFs',
    downloadAsHdfLabel: 'HDF',
    downloadAsAsciiLabel: 'ASCII text',
    downloadAsUrlsLabel: 'List of URLs',
    parametersLabel: 'Parameters:',
    parameterAreaLabel: 'Area',
    parameterDateLabel: 'Date range',
    parameterTimeLabel: 'Time-of-day range',
    metadataLinkText: 'View metadata record',
    emailAddressPlaceholder: '<b>Email address</b>',
    emailAddressValidationError: 'Enter a valid email address',
    notificationBlurbMessage: 'Subsetting gridded data can take a long time.<br>You will be notified via email when your data is ready for download.',

    // WFS Filters Panel
    subsetParametersText: 'subset parameters',
    subsetParametersErrorText: 'Filtering of this layer is not possible at this time.',
    subsetEmptyFiltersText: 'Filtering of this layer is not available at this time.',

    // map.js
    imageScaledDown: 'This image has been scaled down.',

    // DateSelectionPanel.js
    min: 'Min',
    max: 'Max',

    // FacetedSearchResultsDataView.js
    platform: 'Platform',
    organisation: 'Organisation',
    parameters: 'Parameters',
    temporalExtentDateFormat: 'YYYY',
    metadataLink: 'continue reading',

    // LayerGridPanel.js
    dragLayersOrServers: 'Drag layers or Servers to the menu tree',

    // MapOptions
    panControl: 'Pan/Zoom Control',

    // Animation Panel
    selectTimePeriod: 'Select ${direction} Time Period',
    selectMapTimePeriod: 'Move Time on Map',
    errorSelectMapTimePeriod: "End of the Collections available dates",

    // Map.js
    controlButton_4AnimationControlsPanel: 'Animation Options',

    // Search results
    descHeading: 'Description',
    addToMap: "Add '${layerDesc}' to portal",

    // Refine search panel
    filterNames: {
        keywords: 'Keywords',
        organizationNames: 'Organisations',
        dataParameters: 'Data Parameters'
    },

    // Refine search panel revised
    refineSearch: 'Current Search',

    // Search form
    addCriteria: 'Limit search to',
    boundingBoxDescription: 'Bounding Box',
    boundingBoxDescriptionNcWms: 'Bounding Area',
    maxExtentOfPolygon: "Max extent of polygon",
    northBL: 'N',
    eastBL: 'E',
    westBL: 'W',
    southBL: 'S',
    keyword: 'Keyword',
    parameter: 'Parameter',
    organisation: 'Organisation',
    downloadsOnly: 'Downloads Only',
    downloads: 'Downloads',
    mapLayers: 'Map Collections',
    mapLayer: 'Map Collections',
    exactMatches: 'Exact Matches',
    precision: 'Precision',
    exactMatchesDesc: 'Must Match Search Terms Exactly',
    goButton: 'Go',
    clearButton: 'Clear',
    fullTextSearch: 'What are you looking for?',
    newSearchText: 'New',
    newSearchTip: 'Start a new search',

    // errors
    errorDialogTitle: 'Error',

    // Download View
    downloadConfirmationWindowTitle: 'Data Download',
    downloadConfirmationWindowContent: " \
  <h3>Licence and use limitations</h3/> \
    <p>Data downloaded in a cart may include licence information or use limitations. \
       If an agreement is included with data in the cart then by using those data you are accepting the terms of that \
       agreement.</p> \
    <h3>Any questions?</h3> \
    <p>Please visit the <a href=\"${downloadDatasetHelpUrl}\">Download a Dataset</a> \
       page of the <a href=\"${helpUrl}\">Portal Help</a> forum where you can find \
       more information.</p> \
    <br /> \
    <p class=\"small\"><i>You accept all risks and responsibility for losses, damages, costs and other consequences \
      resulting directly or indirectly from using this site and any information or material available from it.</i></p> \
",
    downloadConfirmationDownloadText: 'I understand, download',
    downloadConfirmationCancelText: 'Cancel',

    // mainMapPanel
    layerExistsTitle: 'Add data collection',
    layerExistsMsg: 'This data collection has already been added to the map',
    layerAddedTitle: 'Add data collection',
    layerAddedMsg: "'${layerDesc}' has been added",
    layerActions: 'Actions',


    // InfoPanel.js
    loadingMessage: 'Loading ...',
    noMetadataMessage: 'No information available at this time.',

    // Snapshots
    saveMapButton: 'Save Map',
    saveMapButtonTip: 'Save the current state of the map',
    saveSnapshotDialogTitle: 'Save Map',
    saveSnapshotName: 'Name',
    saveSnapshotFailureErrMsg: 'Unexpected failure saving snapshot',
    btnSave: 'Save',
    btnCancel: 'Cancel',
    chooseSavedMap: 'Load a Saved Map',
    deleteSnapshot: 'Delete',
    deleteSnapshotTip: 'Delete a saved map',
    shareSnapshot: 'Share',
    shareMapDialogTitle: 'Share Map',
    shareSnapshotTip: 'Share a saved map',
    savedMap: 'Saved Map',
    mapUnavailable: 'The map you are attempting to view is not available.',

    // Faceted layer search
    searchTabTitle: 'Search',
    themeFilter: 'Theme',
    locationFilter: 'Location',
    methodFilter: 'Collection method',
    organisationFilter: 'Organisation',
    platformFilter: 'Platform',
    parameterFilter: 'Measured parameter',
    dateFilter: 'Date (UTC)',
    geoFilter: "Geographic Boundary",
    freeTextFilter: 'Free Text',
    freeTextSearch: 'Go',
    facetedSearchNewSearchButton: 'Start new search',
    facetedSearchUnavailable: 'Search is currently unavailable.',
    facetedSearchResetting: 'Resetting search',

    showAll: {'true': '(less\u2025)', 'false': '(more\u2025)'},

    // MapOptionsPanel
    autozoom: 'Auto zoom to data collection extent',
    hideDetailsPanel: 'Hide data collection details',
    clearAllButtonLabel: 'Clear all',
    removeAllControlLabel: 'Remove all data collections',
    resetMapControlLabel: 'Reset map',
    mapOptionsResetButton: 'This will remove all data collections from the portal, reset the map location and zoom level',
    mapOptionsRemoveLayersButton: "Remove all data collections from the map and download pages",

    // SubsetPanel.js
    subsetPanelTitle: 'Subset',

    // FilterGroupPanel.js
    clearFilterButtonLabel: 'Clear subset',

    // ComboFilterPanel.js
    clearFilterOption: 'All',

    // DateFilterPanel.js
    fromDateLabel: 'From',
    fromDateEmptyText: 'Min',
    toDateLabel: 'To',
    toDateEmptyText: 'Max',
    resetActionText: 'reset',

    // BooleanFilterPanel.js
    checkboxDescription: 'Select only data with {0}(s)',

    // ActiveLayersPanel.js
    dataCollectionsTitle: "Data Collections",
    noCollectionSelectedHelp: "Please return and search for data collections.",

    // Gogoduck aggregator
    gogoduckPanelTitle: 'Subset',
    gogoduckJobCreatedMsg: 'Your subsetting job has been created. Processing commenced.<br /><br />When the job is complete we will send an email to <i>${email}</i> with download instructions.<br /><br />NB. Subsetting jobs can vary considerably in how long they take, from minutes to hours. Both the number of source files and the selected area can affect how long a job takes to run.',
    gogoduckJobCreateErrorMsg: 'Unable to create subsetting job. Please re-check the parameters you provided and try again.',
    gogoduckEmailProblemDialogTitle: 'Invalid email address',
    gogoduckNoEmailAddressMsg: 'Please enter a valid email address so we can notify you when the job is complete.',
    productInfoHeading: 'Product Info',
    spatialExtentHeading: 'Spatial Extent',
    temporalExtentHeading: 'Temporal Extent',
    areaCoveredLabel: 'Area covered: ',
    currentDateTimeLabel: 'Displaying',
    timeRangeLabel: 'Time range between: ',
    dateStartLabel: 'Start',
    dateEndLabel: 'End',
    layerComboHeading: 'Data Collection',

    emptyDownloadPlaceholder: "The full data collection will be downloaded. Consider filtering the collection.",

    // FeatureInfoPopup.js
    noDataCollectionTitle: 'No data collection selected',
    searchingTitle: 'Searching for more information at this point...',
    infoFoundTitle: "Detailed information for ${dataCollectionNumber} data collection(s) at this point",
    noInfoFoundTitle: "No more information found at this point",
    depthLabel: 'Depth:',
    elevationLabel: 'Elevation:',

    // ActiveLayersTreeNodeUI.js
    removeDataCollection: 'Remove data collection',
    zoomToDataCollection: 'Zoom to data collection',

    // PolygonTypePanel
    polygonTypePanelHeader: "Map Polygon Drawing Style",

    // PolygonTypeComboBox
    comboBoxTypeLabels: [
        { value: Portal.ui.openlayers.SpatialConstraintType.BOUNDING_BOX, label: "bounding box" },
        { value: Portal.ui.openlayers.SpatialConstraintType.POLYGON, label: "polygon" },
        { value: Portal.ui.openlayers.SpatialConstraintType.NONE, label: "none" }
    ],

    // WfsDataRowTemplate
    fileSizeIconMarkup: '<img src="images/error.png">',
    fileSizeGb: "GB",
    fileSizeMb: "MB",
    estimatedDlMessage: "The estimated NetCDF size is ",
    estimatedDlFailedMsg: "The estimated NetCDF size is unknown.",
    estimatedDlLoadingMessage: "Estimating NetCDF size...",
    estimatedDlLoadingSpinner: '<img src=\"images/spinner.gif\" style=\"vertical-align: middle;\" alt=\"Loading...\" />',
    estimatedDlTimeoutMsg: "The NetCDF size is too large to estimate.",
    transAbortMsg: "transaction aborted",

    dateTimeDisplayFormat: 'YYYY/MMM/DD-HH:mm-UTC' // moment formatting
});
