
// wrapper to the Google Analytics function
function trackUsage(category, action, label, collection, value) {
    if ( typeof ga == 'function' ) {
        ga('send', 'event', category, action, label, value, {
            dimension1: collection
        });
    }
}
