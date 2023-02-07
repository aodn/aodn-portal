OpenLayers.Lang.en = OpenLayers.Util.extend(OpenLayers.Lang.en, {

    navigationButtonNext: '${label} <span class="fa fa-angle-right"></span><span class="fa fa-angle-right"></span>',
    navigationButtonPrevious: '<span class="fa fa-angle-left"></span><span class="fa fa-angle-left"></span> ${label}',

    stepHeader: '<span class="stepTitle">Step ${stepNumber}:</span> ${stepDescription}',
    step1Description: 'Select a Data Collection',
    step2Description: 'Create a Subset',
    step3Description: 'Download',

    maskText: "Searching ... ",
    pleasePickCondensed: '**pick**',
    pleasePickNumberOperator: 'Please pick a condition operator to filter on',
    pleasePickNumberField: 'Please enter a number to filter on, according to your operator',
    loadingResourceMessage: '<i>Loading ${resource}\u2025</i>',
    subsetRestrictiveFiltersText: 'No data is available using your chosen subset.',

    // SubsetPanel.js
    opacity: "Opacity",
    layerProblem: "There is a problem with the availability of this collection",
    noActiveCollectionSelected: "No data collections selected",
    dataCollectionsTitle: "Subsetting data collection:",
    noCollectionSelectedHelp: "Please return to Step 1 to add data collections.",

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
    downloadButtonLabel: '<span class="fa fa-lg fa-fw fa-download"></span> Download as\u2026 ',
    downloadAsShapeFileLabel: 'Shapefile',
    downloadAsCsvLabel: 'CSV',
    downloadAsSubsettedNetCdfLabel: 'NetCDF',
    downloadAsPointTimeSeriesCsvLabel: 'CSV',
    downloadAsDataTrawlerCsvLabel: 'CSV - CSIRO Data Trawler',
    downloadAsAllSourceNetCdfLabel: 'Un-subsetted NetCDFs',
    downloadAsUrlsLabel: 'List of URLs',
    downloadAsPythonSnippetLabel: 'Python',
    parameterDateLabel: 'Date range',
    metadataLinkText: 'View metadata record',
    emailAddressPlaceholder: 'Your email address',
    emailAddressValidationError: 'Enter a valid email address',
    notificationBlurbMessage: 'Subsetting data can take a long time.<br>You will be notified via email when your data is ready for download.',

    subsetFormat: 'TIME,{0},{1};LATITUDE,{2},{3};LONGITUDE,{4},{5}{6}',
    subsetFormatWithoutTime: 'LATITUDE,{2},{3};LONGITUDE,{4},{5}{6}',

    // WFS Filters Panel
    subsetParametersText: 'subset parameters',
    subsetEmptyFiltersText: 'Filtering of this collection is not available at this time.',
    subsetNoOptionsText: 'No options available',

    // map.js
    imageScaledDown: 'This image has been scaled down.',

    // DateSelectionPanel.js
    min: 'Min',
    max: 'Max',

    // MapOptions
    panControl: 'Enable Pan/Zoom',
    drawingControl: 'Enable spatial subset drawing',
    mapGlobalOptionsTitle: "Global Map Options",

    // Animation Panel
    selectTimePeriod: 'Select ${direction} Time Period',
    selectMapTimePeriod: 'Move Time on Map',
    unavailableTemporalExtent: "The data collection has no temporal information",
    invalidTemporalExtent: "Your date range selection has errors and cannot be applied",

    // tab titles
    subsetPanelTitle: 'Subset',
    layerDetailsPanelTitle: 'Layer',
    infoTabTitle: 'Info',
    mapTabTitle: 'Map',

    // Info panel (abstract and links)
    abstractTitle: "Abstract",
    supplementaryLinksTitle: "Supplementary Resources",
    unnamedResourceName: "Unnamed Resource",

    // Search form
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
    emptyText: 'enter',
    goButton: 'Go',
    clearButton: 'Clear',

    // FacetedSearchResultsDataView.js
    searchPlatformText: 'Observing Platform Type',
    searchOrganisationText: 'Contributing Organisation',
    searchDateText: 'Date Range',
    searchParametersText: 'Observed Parameter',
    temporalExtentDateFormat: 'YYYY',
    metadataLink: 'more',
    searchFieldText: "Type keyword(s) and press Enter",

    // errors
    errorDialogTitle: 'Error',

    downloadButtonId: 'download-button-${id}',
    removeButtonId: 'remove-button-${id}',
    shareButtonId: 'share-button-${id}',

    shareButtonTooltip: "Share link to new portal with only this collection",

    removeButton: '<span class="fa fa-fw fa-remove"></span> Remove',
    carticon: '<span class="fa fa-2x fa-shopping-cart "></span> ',

    // Download View
    downloadConfirmationWindowTitle: 'Data Download',
    downloadConfirmationWindowContent: " \
  <h2>Licence and use limitations</h2> \
    <p> \
      <tpl if=\"jurisdictionLink\"><a target=\"_blank\" href=\"{jurisdictionLink}\">Jurisdiction</a></tpl> \
      <tpl if=\"imageLink\"><img src=\"{imageLink}\" /></tpl> \
      <tpl if=\"licenseLink != undefined\"><a target=\"_blank\" href=\"{licenseLink}\">{licenseName}</a></tpl> \
      <tpl if=\"licenseLink == undefined\">{licenseName}</tpl> \
    </p> \
    <tpl if=\"attrConstr && attrConstr.length &gt; 0\"> \
      <h4><legend>Attribution Constraints</h4> \
      <tpl for=\"attrConstr\"><p>{.}</p></tpl> \
    </tpl> \
    <tpl if=\"otherConstr && otherConstr.length &gt; 0\"> \
      <h4><legend>Other Constraints</h4> \
      <tpl for=\"otherConstr\"><p>{.}</p></tpl> \
    </tpl> \
    <tpl if=\"useLimitation && useLimitation.length\"> \
      <h4>Usage Constraints</h4> \
      <tpl for=\"useLimitation\"><p>{.}</p></tpl> \
    </tpl> \
    <p><i class=\"small\">By using this data you are accepting the license agreement and terms specified above. \
      You accept all risks and responsibility for losses, damages, costs and other consequences \
      resulting directly or indirectly from using this site and any information or material available from it.</i></p> \
",
    downloadConfirmationDownloadText: 'I understand, download',
    downloadConfirmationCancelText: 'Cancel',
    challengeInstructions: 'Type the characters you see in the image above',
    downloadErrorText: 'There is a problem with the availability of your selected data download.',

    // mainMapPanel
    layerExistsTitle: 'Add data collection',
    collectionExistsMsg: 'This data collection has already been added',
    addDataCollectionMsg: "Add this collection",

    loadingMessage: 'Loading ...',
    requiredMessage: "**Required**",
    emptyDateFieldMessage: "This field will not apply if empty",
    noMetadataMessage: 'No information available at this time.',

    btnSave: 'Save',
    btnCancel: 'Cancel',

    errorLoadingCollectionMessage: 'The data collection could not be loaded because a data collection with UUID \'{0}\' does not exist. Please contact {1} for assistance with finding this data.',

    // Faceted layer search
    searchTabTitle: 'Search',
    organisationFilter: 'Organisation',
    platformFilter: 'Platform',
    temporalResolutionFilter: 'Temporal Resolution',
    parameterFilter: 'Parameter',
    freetextFilter: 'Keyword',
    freeTextFilterSearchErrorMsg: "Search for free text within metadata records ",
    freeTextFilterSearchHelperMsg: "Type keyword, press enter",
    freeTextSearchToolTip: "Type a keyword and press enter to narrow search results",
    freeTextSearchClearButton: '<span class=\"fa fa-remove\"></span> Clear <b>\'${val}\'</b>',
    dateFilter: 'Date (UTC)',
    geoFilter: "Geographic Boundary",
    facetedSearchNewSearchButton: 'New Search',
    facetedSearchUnavailable: 'Search is currently unavailable.',
    facetedSearchResetting: 'Resetting Search',
    noParametersForCollection: 'No parameters',

    showAll: {'true': '(less\u2025)', 'false': '(more\u2025)'},

    showMapLayer: 'Shown on map',
    clearAllButtonTooltip: 'Remove all data collections from the Subset and Download pages, reset the map location and zoom level',

    clearLinkLabel: '<span class=\"fa fa-undo\"></span> ${text}',
    clearAndResetLabel: 'Clear and Reset',
    resetLabel: 'Reset',
    clearSubsetLabel: 'Clear Subsets',
    resetLabelText: 'Reset \'{0}\'',

    // ComboFilterPanel.js
    clearFilterOption: 'All',

    fromLabelText: 'From',
    fromDateEmptyText: 'Min',
    toLabelText: 'To',
    toDateEmptyText: 'Max',

    // FacetFilterPanel
    addAnother: 'Add another filter - where possible',

    // Async Downloads
    asyncDownloadPanelTitleLoading: 'Requesting subset ...',
    asyncDownloadPanelTitle: 'Subset job status',
    asyncDownloadSuccessPendingMsg: "Waiting for your job to register with our servers.....",
    asyncDownloadSuccessMsg: 'Your subsetting job has been created. Processing commenced.<br /><br />When the job is complete we will send an email to <i><b>${email}</b></i> with download instructions.<br /><br />${serviceMessage}<br /><b>Note:</b> Subsetting jobs can vary considerably in how long they take, from minutes to hours. Both the number of source files and the selected area can affect how long a job takes to run.',
    asyncDownloadErrorMsg: 'Unable to create subsetting job. Please re-check the parameters you provided and try again.',
    asyncServiceMsg: "<a class='external' target='_blank' href='${url}'>Follow the progress of your job</a><br />",
    unexpectedDownloadResponse: "Error. Unexpected response from download server.",
    timeoutError: 'Error. A backend server timed out while preparing download.',

    spatialExtentHeading: 'Spatial',
    timeSeriesAtHeading: 'Timeseries at Lat/Lon',
    temporalExtentHeading: 'Temporal',
    alaSpeciesOccuranceHeading: 'Filter by species/taxon',
    generalFilterHeading: 'Others',
    multiFilterSelectionHeading: 'filter/s:',
    currentDateTimeLabel: 'Displaying',
    spatialExtentPolygonNote: 'Polygon with max extent ',
    pointTimeSeriesLabel: 'Point timeseries',
    latitudeLabel: 'Latitude',
    longitudeLabel: 'Longitude',
    enableTimeSeriesDialog: 'A {0} is required for downloading CSV at a point',
    enableTimeSeriesEditing: 'Check {0} to enable editing',

    dateFilterBeforeFormat: '{0}: before {2}',
    dateFilterAfterFormat: '{0}: after {1}',
    dateFilterBetweenFormat: '{0}: {1} to {2}',
    dateFormLogicalError: "<b>Start date</b> <i>({0})</i> must be before <BR><b>End date</b> <i>({1})</i>",

    numberFilterOptionsFields: [
         'code', 'text',                     'cql',                 'symbol'
    ],
    numberFilterDropdownOptions: [
        ['CLR',  'none'], // This option is in the dropdown to clear the number filter
        ['GT',   'greater than',             '> {0}',               '>' ],
        ['GTE',  'greater than or equal to', '>= {0}',              '>='],
        ['EQ',   'equal to',                 '= {0}',               '=' ],
        ['NEQ',  'not equal to',             '<> {0}',              '≠' ],
        ['LT',   'less than',                '< {0}',               '<' ],
        ['LTE',  'less than or equal to',    '<= {0}',              '<='],
        ['BTWN', 'between (inclusive)',      'BETWEEN {0} AND {1}', '–' ]
    ],

    numberFilterError: 'Start value must be less the end value',

    emptyDownloadFilter: "The full data collection will be downloaded. Please consider filtering the collection.",
    emptyDownload: "The full data collection cannot be downloaded. Please filter the collection.",
    temporalSubsetHelperMsg: "Please consider filtering the temporal extent.",
    temporalExtentNotLoaded: "Waiting for Temporal extent to load.. <br/>Please consider filtering the collection before downloading",

    // FeatureInfoPopup.js
    noDataCollectionTitle: 'No data collection selected',
    searchingTitle: 'Searching for more information at this point...',
    infoFoundTitle: "Detailed information for ${dataCollectionNumber} data collection(s) at this point",
    noInfoFoundTitle: "No more information found at this point",

    removeDataCollectionTooltip: 'Remove this data collection from the Subset and Download pages, the collection can be re-added from the search',
    zoomToDataCollection: '<span class=\"fa fa-fw fa-search\"></span> Zoom to collection',

    // PolygonTypeComboBox
    comboBoxTypeLabels: [
        { value: Portal.ui.openlayers.SpatialConstraintType.BOUNDING_BOX, label: "Bounding Box" },
        { value: Portal.ui.openlayers.SpatialConstraintType.POLYGON, label: "Polygon" }
    ],

    depthLabel: "Depth",
    elevationLabel: 'Elevation',
    zAxisLabelPositiveUp: 'Height',
    zAxisLabelPositiveDown: 'Depth',
    ncwmsDateParamsFilter: "ncwmsDateParamsFilter",
    zAxisPanelCmpId: 'titleContainer',

    elevationLogicalError: "<b>From </b> <i>({0})</i> must be greater than <BR><b> To</b> <i>({1})</i>",

    emptyPolygonHelperText: "Click points on the map to create your polygon.",

    downloadStatusRequested: "Downloading...",

    // WfsDataRowTemplate
    faError: '<span class=\"fa fa-fw fa-warning error \"></span>',
    transAbortMsg: "transaction aborted",

    dateTimeDisplayFormat: 'YYYY-MMM-DD-HH:mm-UTC', // moment formatting
    dateTimeDisplayDayFormat: 'YYYY-MM-DD', // moment formatting
    timeDisplayFormat: 'HH:mm UTC',
    timeDisplayFormatExtJs: 'H:i \\U\\TC',// Ext.form.DateField formatting
    dateDisplayFormatExtJs: 'Y-m-d', // Ext.form.DateField formatting
    dateAltFormats: "Y|Y-m",
    dateNcWmsMinError: "The entered date is earlier than the first available date: {0}",
    dateNcWmsMaxError: "The entered date is greater than the last available date: {0}",
    defaultTextStylesPicker: "Default style/palette",

    // Google Analytics
    onClickTrackUsageFunction: " onclick=\"trackUsage('{0}','{1}','{2}');return true;\"",
    navigationTrackingCategory: "Navigation",
    navigationTrackingMainAction: "Main",
    navigationTrackingProgressBarAction: "Progress Bar",
    navigationTrackingNavigationButtonsAction: "Navigation Buttons",
    navigationTrackingCartButtonAction: "Cart Button",
    navigationTrackingIconAction: "Icon",
    navigationTrackingStepPrefix: "Step ",
    downloadTrackingCategory: "DataCollections",
    downloadTrackingActionPrefix: "Download - ",
    usersTrackingCategory: "Users",
    dataCollectionSelectionTrackingCategory: "Collection",
    dataCollectionSelectionTrackingAction: "select",
    dataCollectionRemovalTrackingAction: "remove",
    dataCollectionClearAndReset: "clear and reset",
    filtersTrackingCategory: "Filters",
    subsetItemsTrackingCategory: "Details",
    subsetItemsTabsTrackingAction: "Tabs",
    filtersTrackingBooleanAction: "Boolean",
    filtersTrackingComboAction: 'Combo',
    trackingDateAction: 'Date',
    trackingTimeSliceAction: '(ncWMS) Selected ${direction} TimeSlice',
    filtersTrackingNumberAction: 'Number',
    filtersTrackingSpatialConstraintAction: 'Spatial Constraint',
    layerControlTrackingCategory: "LayerControl",
    changeLayerTrackingAction: "change layer",
    changeLayerTrackingActionOpacity: "opacity",
    layerControlTrackingActionVisibility: "visibility",
    layerControlTrackingActionStyle: "style",
    layerControlTrackingActionStyleRange: "style range",
    getFeatureInfoTrackingCategory: "FeatureInfo",
    getfeatureInfoAnchorTrackingAction: "GFI link",
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
    facetTrackingFreeTextMagnifierLabel: "attempt to click magnifier",
    facetTrackingFreeTextEnterLabel: "use enter to search",
    goButtonTrackingLabel: "Go",
    gogoduckTrackingLabel: "GoGoDuck",
    downloadFileListAction: 'Un-subsetted Non-NetCDFs',
    downloadCsvAlaAction: 'CSV - ALA',
    downloadTsvAlaAction: 'TSV - ALA',
    downloadShpAlaAction: 'SHP - ALA',
    downloadUnsubsettedNetCdfAction: 'Un-subsetted NetCDFs',
    downloadPointCsvAction: 'CSV - gridded (point timeseries)',
    downloadUrlListAction: 'List of URLs',
    downloadNetCDFDownloadServiceAction: 'NetCDF - gridded',
    downloadDataTrawlerServiceAction: 'CSV - DataTrawler',
    downloadGoGoDuckV1Action: 'GoGoDuckV1',
    downloadPythonAction: 'Python',
    downloadShapefileAction: 'Shapefile',
    downloadCsvNonGriddedAction: 'CSV - non-gridded',
    downloadCsvAction: 'downloadAsCsvLabel',
    usabilityTestTrackingCategory: "UsabilityTests",
    usabilityTestKeywordSubmitAction: "Keyword submit",
    usabilityTestKeywordEnterLabel: "Enter",
    usabilityTestKeywordMagnifierLabel: "Magnifying glass",
    usabilityTestKeywordGotFocusLabel: "Got focus",

    shareButton: "New portal with only this collection",
    menuItemGroupTitle: '<span class="menu-title">${title}</span>',
    wpsTrackingLabel: "WPS Service",

    // Atlas of Living Australia

    ALANoFilterText: 'A taxon filter is required for ALA downloads',
    ALAOccurrencesStyle: "color:d9684c;size:1;opacity:1.0;", // colour from www.ala.org.au page
    ALAPerSpeciesStyle: "colormode:species_guid;name:circle;size:3;opacity:1.0",

    // the Portal.ui.openlayers.LayerSwitcher
    Overlays: "Helper Layers"
});
