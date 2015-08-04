
Ext.namespace('Portal.cart');

Portal.cart.DownloadChallengePanel = Ext.extend(Ext.Panel, {

    challenged: false,

    initComponent: function() {

        this.challengeResponseField = new Ext.form.TextField({
            name: "challengeResponseField",
            width: 250
        });

        var config = {
            padding: 10,
            cls: 'downloadChallengePanel',
            items: [
                {xtype: 'spacer', height: 5},
                {
                    html: "<div id='challenge'></div>"
                },
                {
                    xtype: 'label',
                    text: OpenLayers.i18n('challengeInstructions')
                },
                {xtype: 'spacer', height: 5},
                this.challengeResponseField
            ],
            listeners: {
                scope: this,
                show: function() {
                    this._getChallenge();
                }
            }
        };

        Ext.apply(this, config);

        Portal.cart.DownloadChallengePanel.superclass.initComponent.call(this, arguments);

        this._hideChallenge();
    },

    _getChallenge: function() {
        this._hideChallenge();

        Ext.Ajax.request({
            url: 'downloadAuth',
            scope: this,
            success: function(resp) {
                this._configureChallengeHtmlElements(resp);
            },
            failure: function(resp) {
                log.debug("Failed to obtain challenge from server");
            }
        });
    },

    _showChallenge: function(html) {
        Ext.each(this.items.items, function(component) { component.show(); });

        $("#challenge").html(html);
        this.challenged = true;
    },

    _hideChallenge: function() {
        Ext.each(this.items.items, function(component) { component.hide(); });

        $("#challenge").html("");
        this.challenged = false;
    },

    _configureChallengeHtmlElements: function(resp) {
        if (this._needToDisplayChallenge(resp)) {
            this._showChallenge(resp.responseText);
        }
        else {
            this._hideChallenge();
        }
    },

    _needToDisplayChallenge: function(resp) {
        return resp.responseText && resp.responseText.length > 0;
    },

    isChallenged: function() {
        return this.challenged;
    },

    getChallengeResponseValue: function() {
        return this.challengeResponseField.getValue();
    }
});
