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
    dataCollectionsTitle: "Subsetting data collection:",
    noCollectionSelectedHelp: "Please return and search for data collections.",

    // Geographic Bounds
    navigate: 'Select by Map Bounds',
    navigateHelp: 'Drag the map. The map bounds is the selection area',
    box: 'Drag a Box',
    boxHelp: 'Drag a Box with a click and drag.',
    polygon: 'Draw Polygon',
    polygonHelp: 'Click to add points. Double click to close polygon.',
    geoSelectionPanelHelp: "Choose a method of defining a bounding area.",

    // Download Step
    noDataMessage: 'No direct access to data available currently.',
    downloadButtonLabel: 'Download as\u2026',
    downloadAsCsvLabel: 'CSV',
    downloadAsSubsettedNetCdfLabel: 'NetCDF',
    downloadAsAllSourceNetCdfLabel: 'Un-subsetted NetCDFs',
    downloadAsHdfLabel: 'HDF',
    downloadAsAsciiLabel: 'ASCII text',
    downloadAsUrlsLabel: 'List of URLs',
    downloadAsPythonSnippetLabel: 'Python',
    parametersLabel: 'Parameters:',
    parameterAreaLabel: 'Area',
    parameterDateLabel: 'Date range',
    parameterTimeLabel: 'Time-of-day range',
    metadataLinkText: 'View metadata record',
    emailAddressPlaceholder: 'Your email address',
    emailAddressValidationError: 'Enter a valid email address',
    notificationBlurbMessage: 'Subsetting gridded data can take a long time.<br>You will be notified via email when your data is ready for download.',

    // WFS Filters Panel
    subsetParametersText: 'subset parameters',
    subsetParametersErrorText: 'Filtering of this collection is not possible at this time.',
    subsetEmptyFiltersText: 'Filtering of this collection is not available at this time.',
    subsetNoOptionsText: 'No options available',

    // map.js
    imageScaledDown: 'This image has been scaled down.',

    // DateSelectionPanel.js
    min: 'Min',
    max: 'Max',

    // LayerGridPanel.js
    dragLayersOrServers: 'Drag layers or Servers to the menu tree',

    // MapOptions
    panControl: 'Pan/Zoom Control',
    mapGlobalOptionsTitle: "Global Map Options",

    layerOptionsTitle: "Layer Options",

    // Animation Panel
    selectTimePeriod: 'Select ${direction} Time Period',
    selectMapTimePeriod: 'Move Time on Map',
    errorSelectMapTimePeriod: "End of the Collections available dates",

    // Search results
    addToMap: "Add '${layerDesc}' to portal",

    // tab titles
    subsetPanelTitle: 'Subset',
    stylePanelTitle: 'Layer',
    infoTabTitle: 'Info',
    mapTabTitle: 'Map',

    // Refine search panel
    filterNames: {
        keywords: 'Keywords',
        organizationNames: 'Organisations',
        dataParameters: 'Data Parameters'
    },

    // Search form
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
    downloads: 'Downloads',
    mapLayers: 'Map Collections',
    mapLayer: 'Map Collections',
    precision: 'Precision',
    emptySpatialBL: 'enter',
    goButton: 'Go',
    clearButton: 'Clear',
    fullTextSearch: 'What are you looking for?',

    // FacetedSearchResultsDataView.js
    searchPlatformText: ' ',
    searchOrganisationText: ' ',
    searchDateText: ' ',
    searchParametersText: ' ',
    temporalExtentDateFormat: 'YYYY',
    metadataLink: 'continue reading',

    // errors
    errorDialogTitle: 'Error',

    downloadButtonId: 'download-button-${id}',
    removeButtonId: 'remove-button-${id}',

    removeButton: 'Remove',

    // Download View
    downloadConfirmationWindowTitle: 'Data Download',
    downloadConfirmationWindowContent: " \
  <h3>Licence and use limitations</h3> \
    <p>Data downloaded in a cart may include licence information or use limitations. \
       If an agreement is included with data in the cart then by using those data you are accepting the terms of that \
       agreement.</p> \
    <h3>Any questions?</h3> \
    <p>Please visit the <a class='external' target='_blank' href=\"${downloadDatasetHelpUrl}\">Download a Dataset</a> \
       page of the <a class='external' target='_blank' href=\"${helpUrl}\">Portal Help</a> forum where you can find \
       more information.</p> \
    <br /> \
    <p class=\"small\"><i>You accept all risks and responsibility for losses, damages, costs and other consequences \
      resulting directly or indirectly from using this site and any information or material available from it.</i></p> \
",
    downloadConfirmationDownloadText: 'I understand, download',
    downloadConfirmationCancelText: 'Cancel',
    challengeInstructions: 'Type the characters you see in the image above',

    // mainMapPanel
    layerExistsTitle: 'Add data collection',
    collectionExistsMsg: 'This data collection has already been added',
    addDataCollectionMsg: "Add this collection",

    loadingMessage: 'Loading ...',
    noMetadataMessage: 'No information available at this time.',

    btnSave: 'Save',
    btnCancel: 'Cancel',

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
    facetedSearchNewSearchButton: 'Start new search',
    facetedSearchUnavailable: 'Search is currently unavailable.',
    facetedSearchResetting: 'Resetting search',
    noParametersForCollection: 'No parameters',

    showAll: {'true': '(less\u2025)', 'false': '(more\u2025)'},

    autozoom: 'Auto zoom to data collection extent',
    hideDetailsPanel: 'Hide data collection details',
    clearAllButtonLabel: 'Clear and Reset',
    clearAllButtonTooltip: 'Remove all data collections from the Subset and Download pages, reset the map location and zoom level',
    removeButtonTooltip: 'Remove this data collection from the Subset and Download pages, the collection can be re-added from the search.',


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

    // FacetFilterPanel
    addAnother: 'Add another filter',

    // Async Downloads
    asyncDownloadPanelTitle: 'Subset',
    asyncDownloadSuccessMsg: 'Your subsetting job has been created. Processing commenced.<br /><br />When the job is complete we will send an email to <i>${email}</i> with download instructions.<br /><br />NB. Subsetting jobs can vary considerably in how long they take, from minutes to hours. Both the number of source files and the selected area can affect how long a job takes to run.',
    asyncDownloadErrorMsg: 'Unable to create subsetting job. Please re-check the parameters you provided and try again.',

    spatialExtentHeading: 'Spatial Extent',
    temporalExtentHeading: 'Temporal Extent',
    generalFilterHeading: 'Filters',
    currentDateTimeLabel: 'Displaying',

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

    // PolygonTypeComboBox
    comboBoxTypeLabels: [
        { value: Portal.ui.openlayers.SpatialConstraintType.BOUNDING_BOX, label: "Bounding Box" },
        { value: Portal.ui.openlayers.SpatialConstraintType.POLYGON, label: "Polygon" }
    ],

    emptyPolygonHelperText: "Click points on the map to create your polygon.",

    // WfsDataRowTemplate
    fileSizeIconMarkup: '<img src="images/error.png">',
    estimatedDlMessage: "The download size is ",
    estimatedDlFailedMsg: "The download size is unknown.",
    estimatedNoDataMsg: "No data available. <i>(Try changing filters)</i>",
    estimatedDlLoadingMessage: "Estimating download size...",
    estimatedDlLoadingSpinner: '<img src=\"images/spinner.gif\" style=\"vertical-align: middle;\" alt=\"Loading...\" />',
    estimatedDlTimeoutMsg: "The download size is too large to estimate.",
    transAbortMsg: "transaction aborted",

    dateTimeDisplayFormat: 'YYYY/MMM/DD-HH:mm-UTC', // moment formatting
    timeDisplayFormat: 'HH:mm UTC',
    timeDisplayFormatExtJs: 'H:i \\U\\TC',// Ext.form.DateField formatting
    dateDisplayFormatExtJs: 'Y/m/d', // Ext.form.DateField formatting
    dateAltFormats: "Y|Y/m|d-m-Y", // Ext.form.DateField formatting
    dateNcWmsMinError: "The entered date is earlier than the first available date: {0}",
    dateNcWmsMaxError: "The entered date is greater than the last available date: {0}",

    // Google Analytics
    onClickTrackUsageFunction: " onclick=\"trackUsage('{0}','{1}','{2}');return true;\"",
    navigationTrackingCategory: "Navigation",
    navigationTrackingMainAction: "Main",
    navigationTrackingPrimaryAction: "Primary",
    navigationTrackingSecondaryAction: "Secondary",
    navigationTrackingCartButtonAction: "Cart Button",
    navigationTrackingStepPrefix: "Step ",
    downloadTrackingCategory: "DataCollections",
    downloadTrackingActionPrefix: "Download - ",
    layerSelectionTrackingCategory: "Collection",
    layerSelectionTrackingAction: "select",
    filtersTrackingCategory: "Filters",
    detailsTrackingCategory: "Details",
    detailsTabsTrackingAction: "Tabs",
    filtersTrackingBooleanAction: "Boolean",
    filtersTrackingComboAction: 'Combo',
    filtersTrackingDateAction: 'Date',
    filtersTrackingNumberAction: 'Number',
    filtersTrackingSpatialConstraintAction: 'Spatial Constraint',
    featureInfoTrackingCategory: "FeatureInfo",
    metadataTrackingCategory: "Metadata",
    metadataTrackingStep1Action: "Search",
    metadataTrackingStep3Action: "Download",
    trackingUserSet: "user set",
    trackingDefaultValueReset: "reset",
    trackingValueCleared: "cleared",
    trackingSpatialConstraintSketched: "sketched",
    trackingClickLabel: "click",
    trackingInitLabel: 'created-init',
    trackingTypedBboxLabel: 'typedBbox',
    facetTrackingCategory: "Facets",
    goButtonTrackingLabel: "Go",

    shareButton: "New portal with only this collection"
});
