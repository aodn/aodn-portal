/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

var viewport;
var progressCount = 0;

Ext.state.Manager.setProvider(new Ext.state.CookieProvider()); // Used by aggregate download
Ext.Updater.defaults.showLoadIndicator = false; // stop loader inside autoLoad'ed components
Ext.BLANK_IMAGE_URL = 'img/blank.gif';
Ext.QuickTips.init();

//--------------------------------------------------------------------------------------------
Ext.ns('Portal');

Portal.app = {

    ajaxComplete: function () {
        progressCount--;
        if (progressCount <= 0) {
            progressCount = 0;
            this.ajaxAction('hide');
        }
    },

    init: function () {

        // Set open layers proxyhost
        OpenLayers.ProxyHost = proxyURL;

        // Global Ajax events can be handled on every request!
        Ext.Ajax.on('beforerequest', function () {
            if (progressCount == 0) {
                this.ajaxAction('show');
            }
            progressCount++;
        }, this);

        Ext.Ajax.on('requestcomplete', this.ajaxComplete, this);
        Ext.Ajax.on('requestexception', this.ajaxComplete, this);

        // Load configs
        new Portal.config.PortalConfigLoader().load(this, this.afterConfigLoad, this.configLoadFailed);
    },

    afterConfigLoad: function() {

        // Display MOTD if required
        if (this.portal.config.enableMOTD) {

            Ext.Msg.show({
                title: "<h2>" + this.portal.config.motd.motdTitle + "</h2>",
                msg: this.portal.config.motd.motd,
                buttons: Ext.Msg.OK,
                cls: 'motd',
                width: 600
            });
        }

        var startTab = 0;
        var startSnapshot = null;
        if (window.location.search.length > 0) {
            var regPattern = new RegExp(/\?savedMapId=([0-9]+)/);
            var matches = regPattern.exec(window.location.search);

            if (matches != null && matches.length == 2) {
                //coming from saved map, so start at map.
                startTab = 1;
                startSnapshot = matches[1];
            }

            Ext.Msg.show({
                title: "<h2>Disclaimer</h2>",
                buttons: Ext.Msg.OK,
                cls: 'motd',
                width: 600,
                msg: this.portal.config.footerContent
            });
        }

        viewport = new Portal.ui.Viewport(
            {
                appConfig: Portal.app.config,
                activeTab: startTab,
                startSnapshot: startSnapshot
            }
        );
    },

    configLoadFailed: function() {

        Ext.MessageBox.alert('Error', 'There was a problem loading the Portal.<br>Refreshing the page may resolve the problem.');
    },

    ajaxAction:function (request) {
        if (request == 'show') {
            jQuery('.extAjaxLoading').show(100);
        }
        else {
            jQuery('.extAjaxLoading').hide('slow');
        }
    }
};

//GeoExt stuff
Ext.onReady(Portal.app.init, Portal.app);

// sets the tab from the external links in the header
function setViewPortTab(tabIndex) {
    viewport.setActiveTab(tabIndex);
}

// Fix for closing animation time period window after selection
// http://www.sencha.com/forum/archive/index.php/t-98338.html
// Bug in Ext.form.MessageTargets in connection with using compositeFields
//The problem is, that composite fields doesn't have the "dom" node and that is why the clear functions of Ext.form.MessageTargets.qtip
//and Ext.form.MessageTargets.side are saying "field.el.dom" is undefined.
Ext.onReady(function () {

    Ext.apply(Ext.form.MessageTargets.qtip, {
        clear:function (field) {
            field.el.removeClass(field.invalidClass);
            // fix

            if (field.el.dom) {
                field.el.dom.qtip = '';
            }
        }
    });

    Ext.apply(Ext.form.MessageTargets.side, {
        clear:function (field) {
            field.el.removeClass(field.invalidClass);
            // fix

            if (field.errorIcon && field.errorIcon.dom) {
                field.errorIcon.dom.qtip = '';
                field.errorIcon.hide();
            } else {
                // fix

                if (field.el.dom) {
                    field.el.dom.title = '';
                }
            }
        }
    });
});
