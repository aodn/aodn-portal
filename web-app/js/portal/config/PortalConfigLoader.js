
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.config');

// Loads the various configs the Portal needs and calls functions based on success or failure
Portal.config.PortalConfigLoader = Ext.extend(Object, {

    portal: undefined,
    onSuccess: undefined,
    onFailure: undefined,

    appConfigStoreLoaded: undefined,
    viewportConfigLoaded: undefined,

    load: function(portal, onSuccess, onFailure) {

        this.portal = portal;
        this.onSuccess = onSuccess;
        this.onFailure = onFailure;

        this.loadAppStoreConfig();
        this.loadViewportConfig();
        this.waitForConfigsAndComplete();
    },

    loadAppStoreConfig: function() {

        appConfigStore.load({
            callback: this.appConfigStoreLoadComplete,
            scope: this
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

    appConfigStoreLoadComplete: function(r, options, success) {

        this.appConfigStoreLoaded = success;
    },

    viewportConfigLoadSuccess: function(resp) {

        var txt = resp.responseText;

        try {

            this.portal.config = Ext.util.JSON.decode(txt);

            this.viewportConfigLoaded = true;
        }
        catch (e) {

            console.log('Unable to load app config. Invalid response: ' + txt);

            this.viewportConfigLoaded = false;
        }
    },

    viewportConfigLoadFailure: function(resp) {

        console.log( "Unable to load viewport config: '" + resp.responseText + "' (status: " + resp.status + ")" );

        this.viewportConfigLoaded = false;
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
            setTimeout(function(){ loader.waitForConfigsAndComplete(); }, 200 );
        }
    },

    bothConfigsLoaded: function() {

        return this.viewportConfigLoaded === true && this.appConfigStoreLoaded === true
    },

    eitherConfigFailed: function() {

        return this.viewportConfigLoaded === false || this.appConfigStoreLoaded === false
    }
});