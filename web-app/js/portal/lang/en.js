/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

OpenLayers.Util.extend(OpenLayers.Lang.en, {

    navigationButtonNext: "Next >>",
    navigationButtonPrevious: "<< Previous",
    navigationButtonSelect: "Select >>",
    navigationButtonDownload: "Download >>",

    stepHeader: '<span class="stepTitle">Step ${stepNumber}:</span> ${stepDescription}',
    step1Description: 'Select a Data Collection',
    step2Description: 'Create a Subset',
    step3Description: 'Download',

    maskText: "Searching ... ",
    pleasePickCondensed: '**pick**',
    loadingSpinner: '<img src=\"images/spinner.gif\" style=\"vertical-align: middle;\" alt=\"Loading...\" />&nbsp;<i>Loading ${resource}\u2025</i>',


    unavailableExtent: "The data extent is unavailable",

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
    metadataSubheading: 'Metadata',
    dataSubheading: 'Data',
    filesSubheading: 'Attached files',
    noCollectionsMessage: 'No data collections to show',
    noFilesMessage: 'No attached files.',
    filterLabel: 'Filter applied:',
    noFilterMessage: 'No data filter applied.',
    noDataMessage: 'No direct access to data available currently.',
    downloadButtonLabel: 'Download as\u2026',
    downloadAsCsvLabel: 'Download as CSV',
    downloadAsGml3Label: 'Download as GML3',
    downloadAsShapefileLabel: 'Download as Shapefile',
    downloadAsNetCdfLabel: 'Download as NetCDF',
    downloadAsHdfLabel: 'Download as HDF',
    downloadAsAsciiLabel: 'Download as ASCII text',
    downloadAsOpenDapUrlsLabel: 'Download as a list of OpenDAP URLs',
    parametersLabel: 'Parameters:',
    parameterAreaLabel: 'Area',
    parameterDateLabel: 'Date range',
    parameterTimeLabel: 'Time-of-day range',
    metadataLinkText: 'View metadata record',
    emailAddressPlaceholder: 'Email address',
    notificationBlurbMessage: 'Subsetting gridded data can take a long time. You will be notified via email when your data is ready for download.',

    // WFS Filters Panel
    subsetParametersText: 'subset paramaters',

    // map.js
    imageScaledDown: 'This image has been scaled down.',

    // DateSelectionPanel.js
    min: 'Min',
    max: 'Max',

    // FacetedSearchResultsDataView.js
    platform: 'Platform',
    organisation: 'Organisation',
    dateRange: 'Date Range',
    parameters: 'Parameters',

    // LayerGridPanel.js
    dragLayersOrServers: 'Drag layers or Servers to the menu tree',

    // MapOptions
    panControl: 'Pan Control',
    zoomAndCentre: 'Zoom and centre [shift + mouse drag]',

    // Animation Panel
    stop: 'Stop',
    start: 'Start',
    play: 'Play',
    pause: 'Pause',
    end: 'End',
    time: 'Animation time',
    speed: ' (x 1)',
    warn_label: "Only one data collection can be animated at a time.  You must remove an existing animation to create a new animation.",
    speedUp: "Doubles animation speed",
    slowDown: "Halves animation speed",
    clearButton_tip: "Stops animation and remove all animated data collections from the map",
    pauseButton_tip: "Pauses animation and can explore individual time step using the slider above",
    selectTimePeriod: 'Select Time Period',

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
    dateRange: 'Date range',
    boundingBox: 'Bounding Box',
    northBL: 'N',
    eastBL: 'E',
    westBL: 'W',
    southBL: 'S',
    bboxHint: 'Hint: changing the mini-map extent updates the bounding box!',
    keyword: 'Keyword',
    parameter: 'Parameter',
    organisation: 'Organisation',
    downloadsOnly: 'Downloads Only',
    downloads: 'Downloads',
    downloadsText: 'Show me results with downloads only',
    mapLayers: 'Map Collections',
    mapLayer: 'Map Collections',
    exactMatches: 'Exact Matches',
    precision: 'Precision',
    exactMatchesDesc: 'Must Match Search Terms Exactly',
    goButton: 'Go',
    clearButton: 'Clear',
    fullTextSearch: 'What are you looking for?',
    saveSearchButtonText: 'Save',
    saveSearchButtonTip: 'Save the current search',
    deleteSavedSearchButtonText: 'Delete',
    deleteSavedSearchButtonTip: 'Delete the current saved search',
    saveSearchDialogTitle: 'Save Search',
    saveSearchName: 'Name',
    saveSearchFailureErrMsg: 'Unexpected failure saving search',
    chooseSavedSearch: 'Choose a Saved Search',
    mySearches: 'My Searches',
    registerToSave: 'Register or login to save your searches',
    newSearchText: 'New',
    newSearchTip: 'Start a new search',

    // errors
    errorDialogTitle: 'Error',

    // Download View
    downloadConfirmationWindowTitle: 'Data Download',
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
    parameterFilter: 'Measured parameter',
    dateFilter: 'Date',
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

    // FilterPanel.js
    filterPanelTitle: 'Subset',
    clearFilterButtonLabel: 'Clear subset',

    // ActiveLayersPanel.js
    dataCollectionsTitle: "Data Collections",
    noCollectionSelectedHelp: "Please return and search for data collections.",

    // Options Panel
    turnOnTransect: 'Turn on transect graphing for this data collection:',
    drawing: 'Drawing',
    drawingTitle: 'Draw a transect line',
    transectTab: 'Transect',
    transectDataHeading: 'Data along the transect: ',
    dimensionValuesHeading: 'For dimension values: ',

    // AODAAC aggregator
    aodaacPanelTitle: 'Subset',
    aodaacJobCreatedMsg: 'Your subsetting job has been created. Processing commenced.<br /><br />When the job is complete we will send an email to <i>${email}</i> with download instructions.<br /><br />NB. Subsetting jobs can vary considerably in how long they take, from minutes to hours. Both the number of source files and the selected area can affect how long a job takes to run.',
    aodaacJobCreateErrorMsg: 'Unable to create subsetting job. Please re-check the parameters you provided and try again.',
    aodaacEmailProblemDialogTitle: 'Invalid email address',
    aodaacNoEmailAddressMsg: 'Please enter a valid email address so we can notify you when the job is complete.',
    productInfoHeading: 'Product Info',
    spatialExtentHeading: 'Spatial Extent',
    temporalExtentHeading: 'Temporal Extent',
    areaCoveredLabel: 'Area covered: ',
    timeRangeLabel: 'Time range: ',
    timeOfDayLabel: 'Time of day',
    dateFromLabel: 'Date from:',
    dateToLabel: 'Date to:',

    // FeatureInfoPopup.js
    noDataCollectionSelected: 'No data collection selected.',
    featureInformationFoundForDataCollection: "Feature information found for ${dataCollectionNumber} data collection(s)",
    noFeatureInformationFoundForDataCollection: "No feature information found for ${dataCollectionNumber} queryable data collection(s)",
    searchingForFeatures: 'Searching for Features at your click point',
    depth: 'Depth',
    elevation: 'Elevation',

    // ActiveLayersTreeNodeUI.js
    removeDataCollection: 'Remove data collection',
    zoomToDataCollection: 'Zoom to data collection'
});
