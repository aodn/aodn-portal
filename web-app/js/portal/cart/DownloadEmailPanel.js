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
            name: "emailField",
            validator: this._validateEmailAddress,
            bubbleEvents: [ 'valid', 'invalid' ]
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

    isValid: function() {
        return this.emailField.isValid(true);
    },

    getEmailValue: function() {
        return this.emailField.getValue();
    },

    clearEmailValue: function() {
        this.emailField.setValue('');
    },

    _validateEmailAddress: function(address) {
        if (!address) {
            return false;
        }

        // From http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(address);
    }
});
