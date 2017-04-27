Ext.namespace('Portal.cart');

Portal.cart.DownloadEmailPanel = Ext.extend(Ext.Panel, {

    initComponent: function() {

        var emailVal = "";
        var EMPTY_EXT3_3_0_COOKIE_STRING = "undefined";

        if (Ext.util.Cookies.get('emailField') && Ext.util.Cookies.get('emailField') != EMPTY_EXT3_3_0_COOKIE_STRING) {
            emailVal = Ext.util.Cookies.get('emailField');
        }

        this.downloadChallengePanel = new Portal.cart.DownloadChallengePanel();

        this.emailField = new Ext.form.TextField({
            name: "emailField",
            value: emailVal,
            emptyText: OpenLayers.i18n('emailAddressPlaceholder'),
            invalidText: OpenLayers.i18n('emailAddressValidationError'),
            width: 250,
            validator: this._validateEmailAddress,
            bubbleEvents: [ 'valid', 'invalid' ]
        });

        var config = {
            cls: 'alert alert-attention',
            items: [
                {xtype: 'spacer', height: 5},
                this.emailField,
                {xtype: 'spacer', height: 5},
                {
                    html: OpenLayers.i18n('notificationBlurbMessage')
                },
                this.downloadChallengePanel
            ],
            listeners: {
                scope: this,
                'show': function() {
                    this.emailField.focus();
                    this.downloadChallengePanel._doReset();
                    var the = this;
                    setTimeout(function() { the.emailField.validate(); }, 200 );
                }
            }
        };

        Ext.apply(this, config);

        Portal.cart.DownloadEmailPanel.superclass.initComponent.call(this, arguments);
    },

    getEmailValue: function() {
        var emailValue = this.emailField.getValue();
        Ext.util.Cookies.set('emailField', emailValue, new Date().add(Date.DAY, 90));
        return emailValue;
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
