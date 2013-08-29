/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

OpenLayers.Util.extend(OpenLayers.Lang.en, {

    maskText: "Searching ... ",
    pleasePickCondensed: '**pick**',
    loadingSpinner: '<img src=\"images/spinner.gif\" style=\"vertical-align: middle;\" alt=\"Loading...\" />&nbsp;<i>Loading ${resource}\u2025</i>',

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
    emptyCartText: "The cart is empty of datasets to download.",
    unavailableDataLink: "Sorry this data is currently unavailable",

    // Animation Panel
    stop: 'Stop',
    start: 'Start',
    play: 'Play',
    pause: 'Pause',
    end: 'End',
    time: 'Animation time',
    speed: ' (x 1)',
    warn_label: "Only one layer can be animated at a time.  You must remove an existing animation to create a new animation.",
    speedUp: "Doubles animation speed",
    slowDown: "Halves animation speed",
    clearButton_tip: "Stops animation and remove all animated layers from map",
    pauseButton_tip: "Pauses animation and can explore individual time step using the slider above",

    // Map.js
    controlButton_4AnimationControlsPanel: 'Animation Options',

    // MapOptionsPanel.js
    mapOptionsResetButton: 'This will re-load the default set of map layers and reset the map location and zoom level',
    mapOptionsRemoveLayersButton: "Remove all overlay layers from the map",

    // Search results
    selectLayer: 'Select layer',
    bboxLayer: 'Extent',
    logoHeading: 'Logo',
    descHeading: 'Description',
    actionsHeading: 'Actions',
    datasetInfo: 'Dataset information',
    showOnMinimap: "Show '${layerDesc}' on mini-map",
    addToMap: "Add '${layerDesc}' to map",
    layerSelectionWindowShowOnMinimap: "Show on mini-map",
    layerSelectionWindowAddToMap: "Add to map",
    datasetLayers: 'Dataset layers',
    selectLink: 'Select linked page',

    // Refine search panel
    filterNames: {
        keywords: 'Keywords',
        organizationNames: 'Organisations',
        dataParameters: 'Data Parameters'
    },

    // DetailsPanel.js
    opacity: "Opacity",
    wmsLayerProblem: "There is a problem with the availability of this layer",

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
    mapLayersOnly: 'Map Layers Only',
    mapLayers: 'Map Layers',
    mapLayer: 'Map Layer',
    mapLayersOnlyDesc: 'Show Me Results With Map Layers Only',
    exactMatches: 'Exact Matches',
    precision: 'Precision',
    exactMatchesDesc: 'Must Match Search Terms Exactly',
    searchButton: 'Search',
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

    // Download Cart
    downloadCartConfirmationWindowTitle: 'Download Cart',
    downloadCartConfirmationDownloadText: 'I understand, download',
    downloadCartConfirmationCancelText: 'Cancel',

    //mainMapPanel
    layerExistsTitle: 'Add layer',
    layerExistsMsg: 'This layer has already been added to the map',
    layerAddedTitle: 'Add layer',
    layerAddedMsg: "'${layerDesc}' has been added to the map",
    layerActions: 'Actions',
    autoZoomControlLabel: 'Auto zoom to layer',
    removeAllControlLabel: 'Remove all\u2025',
    resetMapControlLabel: 'Reset map\u2025',

    // detailsPanel.js
    pickAStyle : ' ** Pick a style ** ',

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
    layerSearch: 'Map Layers',
    themeFilter: 'Theme',
    locationFilter: 'Location',
    methodFilter: 'Collection method',
    organisationFilter: 'Organisation',
    parameterFilter: 'Measured parameter',
    dateFilter: 'Date',
    geoFilter: "Geographic Boundary",
    freeTextFilter: 'Free Text',
    freeTextSearch: 'Go',
    facetedSearchPanelTitle: 'Find layers by:',
    facetedSearchClearAllLink: 'Clear all',
    facetedSearchUnavailable: 'Search is currently unavailable.',
    facetedSearchResetting: 'Resetting search',

    showAll: {'true': '(less\u2025)', 'false': '(more\u2025)'},
    matchingLayers: 'Add Layer',

    //MapOptionsPanel
    autozoom: 'Auto zoom to layer',
    hideDetailsPanel: 'Hide layer details',

    // RightDetailsPanel.js
    noActiveLayersSelected:	"No layers have been added to the map",
    layerOptions: "Layer Options",

    //Options Panel
    turnOnTransect: 'Turn on transect graphing for this layer:',
    drawing: 'Drawing',
    drawingTitle: 'Draw a transect line',
    transectTab: 'Transect',
    transectDataHeading: 'Data along the transect: ',
    dimensionValuesHeading: 'For dimension values: ',

    layerSearchTabTitle: 'Layers',
    downloadSearchTabTitle: 'Downloads',

    // AODAAC aggregator
    aodaacDialogTitle: 'Data subset',
    aodaacJobCreatedMsg: 'Your subsetting job has been created. Processing commenced.<br /><br />When the job is complete we will send an email to <i>${email}</i> with download instructions.<br /><br />NB. Subsetting jobs can vary considerably in how long they take, from minutes to hours. Both the number of source files and the selected area can affect how long a job takes to run.',
    aodaacJobCreateErrorMsg: 'Unable to create subsetting job. Please re-check the parameters you provided and try again.',
    aodaacNoEmailAddressMsg: 'Please enter a valid email address so we can notify you when the job is complete.'
});
