
// wrapper to the Google Analytics function
function trackUsage(category, action, label, value) {
    if ( typeof ga == 'function' ) {
        ga('send', 'event', category, action, label, value);
    }
}