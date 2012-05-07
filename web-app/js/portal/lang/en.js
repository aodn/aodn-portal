OpenLayers.Util.extend(OpenLayers.Lang.en, {
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
    mapLayer: 'Map Layer',
    searchButton: 'Search',
    fullTextSearch: ' ** Free text search **',
    saveSearchButtonText: 'Save...',
    saveSearchButtonTip: 'Save the current search',
    deleteSavedSearchButtonText: 'Delete',
    deleteSavedSearchButtonTip: 'Delete the current saved search',
    saveSearchDialogTitle: 'Save Search',
    saveSearchName: 'Name',
	saveSearchFailureErrMsg: 'Unexpected failure saving search',
	chooseSavedSearch: 'Choose a Saved Search',
      
    
    // Download Cart
    ttAddToDownload: 'Add to download cart',
    ttAddAllToDownload: 'Add all to download cart',
    btnAddAllToDownload: 'Add all',
    titlFileLimitReached: 'Unable to add',
    msgFileLimitReached: 'Maximum number of files now in download cart (${limit}). Not all selected files were added.',

    downloadCartConfirmationWindowTitle: 'Download Cart',
    downloadCartConfirmationDownloadText: 'I understand, download',
    downloadCartConfirmationCancelText: 'Cancel',

    //mainMapPanel
    layerExistsTitle: 'Add layer',
    layerExistsMsg: 'This layer has already been added to the map',
    layerAddedTitle: 'Add layer',
    layerAddedMsg: "'${layerDesc}' has been added to the map",
    
    // detailsPanel.js
    pickAStyle : ' ** Pick a style ** ',
	
	// UserDefinedWMSPanel
	searching: 'Searching ...',
	addYourURL: ' ** Add your URL ** ',	
	addYourURLHeader: "Enter WMS Server URL",
	addYourLayerSucess: '\'${layerName}\' added to map',
	addYourURLHelp: '<i>Any OGC compliant Web Map Server URL can be entered here to add layers to the portal map. Only add required parameters specific to the server such as \'dataset\' or \'namespace\'. The maplayers must also be available from this base URL.<BR>Due to Javascript restrictions, layer features cant be retrieved when you click on the map. You may also note reduced functionality.</i>',	
	addYourURLSucessful: 'Server sucessfully loaded',
	addYourURLUnsucessful: 'Unsucessfully tried to load <a class=\"external\" target=\"_blank\" href=\"${url}\">${url}</a><BR>To diagnose the problem, click the link to see the full reponse from the server.',
	addYourURLUnsucessfulNoResponse: 'No response recieved from the WMS server. Connection timed out',
	addYourURLDuplicate: 'The server has previously been loaded',
	addYourURLDuplicateBody: 'Add parameters to the WMS server URL if required, to change the returned list of layers',
	addYourURLSubmit: 'Submit',
	addYourURLSubmitTip: 'Load layers from your OGC compliant Web Map Server URL',
  
    //snapshots 
    saveMapButton: 'Save Map',
    saveMapButtonTip: 'Save the current state of the map',
    saveSnapshotDialogTitle: 'Save Map',
    saveSnapshotName: 'Name',
	saveSnapshotFailureErrMsg: 'Unexpected failure saving snapshot',
    btnSave: 'Save',
    btnCancel: 'Cancel',
    chooseSavedMap: 'Choose a Saved Map',
    deleteSnapshot: 'Delete',
    deleteSnapshotTip: 'Delete a saved map',
	
  	// UserDefinedWMSPanel
	rourUrl: 'Choose a Saved Map',
	
	//MapOptionsPanel
	autozoom: 'Auto zoom to layer',
	hideDetailsPanel: 'Hide layer details',
	
	// RightDetailsPanel.js
	noActiveLayersSelected:	"No active layers have been selected",
	layerOptions: "Layer Options",
	
    //Options Panel
    turnOnTransect: 'Turn on transect graphing for this layer:',
    drawing: 'Drawing',
    drawingTitle: 'Draw a transect line',
    transectTab: 'Transect',
    transectDataHeading: 'Data along the transect: ',
    dimensionValuesHeading: 'For dimension values: '
}); 
