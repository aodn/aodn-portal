var viewport;
var progressCount = 0;

Ext.state.Manager.setProvider(new Ext.state.CookieProvider()); // Used by aggregate download
Ext.Updater.defaults.showLoadIndicator = false; // stop loader inside autoLoad'ed components
Ext.BLANK_IMAGE_URL = 'img/blank.gif';
Ext.QuickTips.init();

//--------------------------------------------------------------------------------------------
Ext.ns('Portal');

Portal.app = {

    ajaxComplete: function() {
        progressCount--;
        if (progressCount <= 0) {
            progressCount = 0;
            this.ajaxAction('hide');
        }
    },

    init: function() {
        // Set open layers proxyhost
        OpenLayers.ProxyHost = Ext.ux.Ajax.proxyUrl;

        // Global Ajax events can be handled on every request!
        Ext.Ajax.on('beforerequest', function() {
            if (progressCount == 0) {
                this.ajaxAction('show');
            }
            progressCount++;
        }, this);

        Ext.Ajax.on('requestcomplete', this.ajaxComplete, this);
        Ext.Ajax.on('requestexception', this.ajaxComplete, this);

        // Load config
        Ext.Ajax.request({
            url: 'search/config',
            scope: this,
            success: this.afterConfigLoad,
            failure: this.configLoadFailed
        });
    },

    afterConfigLoad: function(resp) {

        var configJson = resp.responseText;

        try {
            this.appConfig = Ext.util.JSON.decode(configJson);
        }
        catch (e) {
            log.error('Unable to load config. Invalid response: ' + configJson);
            this._displayPortalLoadError();
        }

        viewport = new Portal.ui.Viewport({
            appConfig: Portal.app.appConfig
        });
    },

    configLoadFailed: function(resp) {
        log.error("Unable to load '" + resp.responseText + "' (status: " + resp.status + ")" );
        this._displayPortalLoadError();
    },

    _displayPortalLoadError: function() {
        Ext.MessageBox.alert('Error', 'There was a problem loading the Portal.<br>Refreshing the page may resolve the problem.');
    },

    ajaxAction: function(request) {
        if (request == 'show') {
            jQuery('.extAjaxLoading').show(100);
        }
        else {
            jQuery('.extAjaxLoading').hide('slow');
        }
    }
};

// sets the tab from the external links in the header
function setViewPortTab(tabIndex) {
    viewport.setActiveTab(tabIndex);
}

// Fix for closing animation time period window after selection
// http://www.sencha.com/forum/archive/index.php/t-98338.html
// Bug in Ext.form.MessageTargets in connection with using compositeFields
//The problem is, that composite fields doesn't have the "dom" node and that is why the clear functions of Ext.form.MessageTargets.qtip
//and Ext.form.MessageTargets.side are saying "field.el.dom" is undefined.
Ext.onReady(function() {
    
    Ext.apply(Ext.form.MessageTargets.qtip, {
        clear: function(field) {
            field.el.removeClass(field.invalidClass);
            // fix

            if (field.el.dom) {
                field.el.dom.qtip = '';
            }
        }
    });

    Ext.apply(Ext.form.MessageTargets.side, {
        clear: function(field) {
            field.el.removeClass(field.invalidClass);
            // fix

            if (field.errorIcon && field.errorIcon.dom) {
                field.errorIcon.dom.qtip = '';
                field.errorIcon.hide();
            }
            else {
                // fix

                if (field.el.dom) {
                    field.el.dom.title = '';
                }
            }
        }
    });
});