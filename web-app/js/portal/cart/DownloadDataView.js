Ext.namespace('Portal.cart');

Portal.cart.DownloadDataView = Ext.extend(Ext.DataView, {

    constructor:function (cfg) {

        this.mimeTypes = Portal.app.config.downloadCartMimeTypeToExtensionMapping

        this.downloadItemsStore = new Ext.data.JsonStore({
            // store configs
            autoDestroy:true,
            url:'downloadCart/getCartRecords',
            storeId:'myStore',
            // reader configs
            root:'records',
            idProperty:'title',
            fields:['title', 'uuid', 'downloads', 'disable' ]
        });
        this.downloadItemsStore.load();

        var template = new Ext.XTemplate(
            '<tpl for=".">',
            '<tpl if="values.disable == false">',
            '<div class="cart-row">',
            '<div class="cart-title-row">',
            '<div class="floatRight"><a href="#" onclick="javascript:setDownloadCartRecordDisableFlag(\'{uuid}\',\'true\'); return false;">Remove</a></div>',
            '<span class="cart-title">{title}</span>',
            '</div>',
            '<div class="cart-files" >{[ this.getFiles(values) ]}</div>',
            '</div>',
            '</tpl>',
            '</tpl>',
            {
                getFiles:function (values) {
                    var html = "";
                    Ext.each(values.downloads, function (f) {
                        html += subFilesTemplate.apply(f);
                    });
                    return html;
                }
            }
        );

        var subFilesTemplate = new Ext.XTemplate(
            '<div class="cart-file-row" >',
                '{[this.markup(values)]}',
            '</div>',
            {

                markup: function(values) {

                    var ret = "";
                    // todo remove this horrible hack when the df is truely gone
                    if (values.href.indexOf("df.arcs.org.au") < 0) {
                        ret += "<i>" + values.title + "</i> (" + this.getSimpleType(values.type) + ")<br/>";
                    }
                    else {
                        ret += OpenLayers.i18n("unavailableDataLink");
                    }
                    return ret;
                }
            }, this
        );

        var config = Ext.apply({
            id:"downloadList",
            store:this.downloadItemsStore,
            emptyText:OpenLayers.i18n("emptyCartText"),
            tpl:template,
            autoScroll:true
        }, cfg);

        Portal.cart.DownloadDataView.superclass.constructor.call(this, config);

        Ext.MsgBus.subscribe("downloadCart.cartContentsUpdated", function () {
            this.downloadItemsStore.load();
        }, this);
    },

    getSimpleType: function(type) {

        for (var key in this.mimeTypes) {
            if (key == type) {
                return this.mimeTypes[key];
            }
        }
    }
});
