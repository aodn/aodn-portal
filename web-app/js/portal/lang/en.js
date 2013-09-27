/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

OpenLayers.Util.extend(OpenLayers.Lang.en, {

    navigationButtonNext: "Next &#187;",
    navigationButtonPrevious: "&#171; Previous",
    navigationButtonSelect: "Select &#187;",
    navigationButtonDownload: "Download &#187;",

    maskText: "Searching ... ",
    pleasePickCondensed: '**pick**',
    loadingSpinner: '<img src=\"images/spinner.gif\" style=\"vertical-align: middle;\" alt=\"Loading...\" />&nbsp;<i>Loading ${resource}\u2025</i>',


    unavailableExtent: "The data extent is unavailable",

    //
    navigate: 'Select by Map Bounds',
    navigateHelp: 'Drag the map. The map bounds is the selection area',
    box: 'Drag a Box',
    boxHelp: 'Drag a Box with a click and drag.',
    polygon: 'Draw Polygon',
    polygonHelp: 'Click to add points. Double click to close polygon.',
    geoSelectionPanelHelp: "Choose a method of defining a bounding area.",

    //DownloadCartPanel.js
    okdownload: 'Download All',
    clearcart: "Clear Cart",
    downloadCartUndo: "Undo Last Remove",
    emptyCartText: "No data collections have been added.",
    unavailableDataLink: "Sorry this data is currently unavailable",

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

    // Map.js
    controlButton_4AnimationControlsPanel: 'Animation Options',

    // MapOptionsPanel.js
    mapOptionsResetButton: 'This will remove all data collections from the portal, reset the map location and zoom level',
    mapOptionsRemoveLayersButton: "Remove all data collections from the map and download pages",

    // Search results
    descHeading: 'Description',
    addToMap: "Add '${layerDesc}' to portal",

    // Refine search panel
    filterNames: {
        keywords: 'Keywords',
        organizationNames: 'Organisations',
        dataParameters: 'Data Parameters'
    },

    // DetailsPanel.js
    opacity: "Opacity",

    // Refine search panel revised
    refineSearch: 'Current Search',

    //Search form
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

    //mainMapPanel
    layerExistsTitle: 'Add data collection',
    layerExistsMsg: 'This data collection has already been added to the map',
    layerAddedTitle: 'Add data collection',
    layerAddedMsg: "'${layerDesc}' has been added",
    layerActions: 'Actions',



    // detailsPanel.js
    pickAStyle : ' ** Pick a style ** ',

    // InfoPanel.js
    loadingMessage: 'Loading ...',
    noMetadataMessage: 'No information available at this time.',

    //snapshots
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

    // RightDetailsPanel.js
    noActiveLayersSelected: "No data collections selected",

    //FilterPanel.js
    filterPanelTitle: 'Subset',

    // ActiveLayersPanel.js
    dataCollectionsTitle: "Data Collections",
    noCollectionSelectedHelp: "Please return and search for data collections.",

    //Options Panel
    turnOnTransect: 'Turn on transect graphing for this data collection:',
    drawing: 'Drawing',
    drawingTitle: 'Draw a transect line',
    transectTab: 'Transect',
    transectDataHeading: 'Data along the transect: ',
    dimensionValuesHeading: 'For dimension values: ',

    downloadSearchTabTitle: 'Downloads',

    // AODAAC aggregator
    aodaacPanelTitle: 'Subset',
    aodaacJobCreatedMsg: 'Your subsetting job has been created. Processing commenced.<br /><br />When the job is complete we will send an email to <i>${email}</i> with download instructions.<br /><br />NB. Subsetting jobs can vary considerably in how long they take, from minutes to hours. Both the number of source files and the selected area can affect how long a job takes to run.',
    aodaacJobCreateErrorMsg: 'Unable to create subsetting job. Please re-check the parameters you provided and try again.',
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

    // ActiveLayersTreeNodeUI.js
    removeDataCollection: 'Remove data collection',
    zoomToDataCollection: 'Zoom to data collection'
});
