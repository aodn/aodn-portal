// wrapper to the Google Analytics function
function trackUsage(category, action, label, collection, value) {

    if (typeof ga == 'function') {
        ga('send', 'event', category, action, label, value, {
            dimension1: collection
        });
    }
    else {
        //console.log(String.format("ga('send', 'event', category={0}, action={1}, label={2}, collection={3}, value={4})",category, action, label, collection, value));
    }
}

function trackNavigationUsage(actionKey, label) {
    trackUsage(
        OpenLayers.i18n('navigationTrackingCategory'),
        OpenLayers.i18n(actionKey),
        label
    );
}

function trackFacetUsage(action, label) {
    trackUsage(
        OpenLayers.i18n('facetTrackingCategory'),
        action,
        label
    );
}

function trackUsabilityTest(action, label) {
    trackUsage(
        OpenLayers.i18n('usabilityTestTrackingCategory'),
        action,
        label
    );
}

function trackFiltersUsage(actionKey, label, collection) {
    trackUsage(
        OpenLayers.i18n('filtersTrackingCategory'),
        OpenLayers.i18n(actionKey),
        label,
        collection
    );
}

function trackDownloadUsage(action, collection, downloadParams) {
    trackUsage(
        OpenLayers.i18n('downloadTrackingCategory'),
        action,
        collection,
        downloadParams
    );
}

function trackUserUsage(action, email, collection, value) {
    trackUsage(
        OpenLayers.i18n('usersTrackingCategory'),
        action,
        email,
        collection,
        (value == "emailWasRequested")? 1: undefined
    );
}

function trackLayerControlUsage(action, label, collection) {
    trackUsage(
        OpenLayers.i18n('layerControlTrackingCategory'),
        action,
        label,
        collection
    );
}

function trackDataCollectionSelectionUsage(actionKey, label, collection) {
    trackUsage(
        OpenLayers.i18n('dataCollectionSelectionTrackingCategory'),
        OpenLayers.i18n(actionKey),
        label,
        collection
    );
}

function trackGetFeatureInfoResultLinkUsage(link) {
    trackUsage(
        OpenLayers.i18n('getFeatureInfoTrackingCategory'),
        OpenLayers.i18n('getfeatureInfoAnchorTrackingAction'),
        link
    );
}
