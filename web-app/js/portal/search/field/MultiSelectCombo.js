
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search.field');

Portal.search.field.MultiSelectCombo = Ext.extend(Ext.ux.form.SuperBoxSelect, {
    proxyUrl: null,
    field: null,
    url: null,
    maxCaptionLength: 99999999,
    autoHeight: true,
    mode: 'local',

    filterOptions: {
        anyMatch: true,
        caseInsensitive: true,
        exactMatch: false
    },

    minChars: 0,
    hideTrigger: false,
    valueField: 'value',
    displayField: 'display',
    hideLabel: false,
    width: 350,
    maxCaptionLength: 40,
    extraItemCls: 'wrapping-wrapped-field',
    pinList: false,

    initComponent: function(config) {
        this.store = new Portal.data.SuggestionStore({
                url : this.url,
                autoLoad: true
            });

        if (this.baseParams) {
            this.store.baseParams = this.baseParams;
        }

        this.valueDelimiter = Portal.search.field.MultiSelectCombo.VALUE_DELIMITER;

        Portal.search.field.MultiSelectCombo.superclass.initComponent.call(this);

        this.mon(this.store.proxy, {
            scope: this,
            beforeLoad: this.proxyBeforeLoad
        });

        this.on({
            scope: this,
            additem: this.onItemChange,
            removeitem: this.onItemChange,
            clear: this.onItemChange,
        });

        this.addEvents('contentchange');
        this.enableBubble('contentchange');
    },

    onProtocolChange: function(protocol)
    {
        this.setBaseParams({ 'protocol': protocol });
        this.store.load();
    },

    setBaseParams: function(baseParams) {
        this.store.baseParams = baseParams;
    },

    getFilterValue: function () {
        return { value: this.getValue() };
    },

    setFilterValue: function(v) {

        // setValue() has to be called *after* the store is loaded, hence the callback.
        this.store.load({
            callback: function(records, options, success) {
                if (success) {
                    this.setValue(v.value);
                }
        },
            scope: this
        });
    },

    onItemChange: function() {
        this.fireEvent('contentchange');
    },


    proxyBeforeLoad: function(proxy, params) {
        var protocolString = "";
        if(params.protocol != null)
        {
            protocolString = "protocol=" + params.protocol;
        }
        proxy.setUrl(this.proxyUrl + encodeURIComponent(proxy.url + '?' +protocolString) + '&format=text/xml');
    }
});

Portal.search.field.MultiSelectCombo.VALUE_DELIMITER = '_AND';

Ext.reg('portal.search.field.multiselect', Portal.search.field.MultiSelectCombo);


