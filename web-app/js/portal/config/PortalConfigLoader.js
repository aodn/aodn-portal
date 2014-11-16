
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

    appConfigLoaded: undefined,
    viewportConfigLoaded: undefined,

    load: function(portal, onSuccess, onFailure) {
        this.portal = portal;
        this.onSuccess = onSuccess;
        this.onFailure = onFailure;
        this.loadAppConfig();
    },

    loadAppConfig: function() {
        Ext.Ajax.request({
            url: 'home/config',
            scope: this,
            success: this._configLoadSuccess,
            failure: this._configLoadFailure
        });
    },

    _configLoadSuccess: function(resp) {
        var txt = resp.responseText;

        try {
            this.portal.appConfig = Ext.util.JSON.decode(txt);
            this.onSuccess();
        }
        catch (e) {
            log.error('Unable to load config. Invalid response: ' + txt);
            this.onFailure();
        }
    },

    _configLoadFailure: function(resp) {
        log.error("Unable to load '" + resp.responseText + "' (status: " + resp.status + ")" );
        this.onFailure();
    }
});
