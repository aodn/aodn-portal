
// wrapper to the Google Analytics function
function trackUsage(category, action, label, collection, value) {
    if ( typeof ga == 'function' ) {
        ga('send', 'event', category, action, label, value, {
            dimension1: collection
        });
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
