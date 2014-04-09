/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DownloadEmailPanel = Ext.extend(Ext.Panel, {

    initComponent: function() {

        this.emailField = new Ext.form.TextField({
            name: "emailField"
        });

        var config = {
            items: [
                this.emailField,
                {
                    html: OpenLayers.i18n('notificationBlurbMessage')
                }
            ]
        };

        Ext.apply(this, config);

        Portal.cart.DownloadEmailPanel.superclass.initComponent.call(this, arguments);
    },

    getEmailValue: function() {
        return this.emailField.getValue();
    },

    clearEmailValue: function() {
        this.emailField.setValue('');
    }
});
