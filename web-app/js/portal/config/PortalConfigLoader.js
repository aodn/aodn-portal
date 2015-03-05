/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.config');

Portal.config.isFeatureToggleEnabled = function(toggleName) {
    return Portal.app.appConfig.featureToggles[toggleName];
}

// Loads the various configs the Portal needs and calls functions based on success or failure
Portal.config.PortalConfigLoader = Ext.extend(Object, {

    portal: undefined,
    onSuccess: undefined,
    onFailure: undefined,

    appConfigLoaded: undefined,
    viewportConfigLoaded: undefined,

    load: function(portal, onSuccess, onFailure) {
        this.portal = portal;
        this.onSuccess = onSuccess;
        this.onFailure = onFailure;

        // These two AJAX calls could be combined, except the backend code for the viewport config is doing
        // some pretty funky stuff and I don't really want to modify it until I can talk to @dnahodil about
        // it.
        this.loadAppConfig();
        this.loadViewportConfig();
        this.waitForConfigsAndComplete();
    },

    loadAppConfig: function() {
        Ext.Ajax.request({
            url: 'home/config',
            scope: this,
            success: this.appConfigLoadSuccess,
            failure: this.appConfigLoadFailure
        });
    },

    loadViewportConfig: function() {
        Ext.Ajax.request({
            url: 'config/viewport',
            scope: this,
            success: this.viewportConfigLoadSuccess,
            failure: this.viewportConfigLoadFailure
        });
    },

    appConfigLoadSuccess: function(resp) {
        this._configLoadSuccess(resp, 'app', 'appConfig', 'appConfigLoaded');
    },

    appConfigLoadFailure: function(resp) {
        this._configLoadFailure(resp, 'app');
    },

    viewportConfigLoadSuccess: function(resp) {
        this._configLoadSuccess(resp, 'viewport', 'config', 'viewportConfigLoaded');
    },

    viewportConfigLoadFailure: function(resp) {
        this._configLoadFailure(resp, 'viewport');
    },

    _configLoadSuccess: function(resp, name, dst, loadedFlag) {
        var txt = resp.responseText;

        try {
            this.portal[dst] = Ext.util.JSON.decode(txt);
            this[loadedFlag] = true;
        }
        catch (e) {
            log.error('Unable to load ' + name + ' config. Invalid response: ' + txt);
            this[loadedFlag] = false;
        }
    },

    _configLoadFailure: function(resp, name) {
        log.error("Unable to load " + name + " config: '" + resp.responseText + "' (status: " + resp.status + ")" );
        this[name + 'ConfigLoaded'] = false;
    },

    waitForConfigsAndComplete: function() {
        if (this.bothConfigsLoaded()) {
            this.onSuccess();
        }
        else if (this.eitherConfigFailed()) {
            this.onFailure();
        }
        else {
            // Keep waiting
            var loader = this; // Need to keep another reference to 'this' because 'this' changes scope in the anonymous function
            setTimeout(function() { loader.waitForConfigsAndComplete(); }, 200 );
        }
    },

    bothConfigsLoaded: function() {
        return this.viewportConfigLoaded === true && this.appConfigLoaded === true
    },

    eitherConfigFailed: function() {
        return this.viewportConfigLoaded === false || this.appConfigLoaded === false
    }
});
