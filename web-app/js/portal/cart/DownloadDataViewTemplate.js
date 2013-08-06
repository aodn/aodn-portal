/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DownloadDataViewTemplate = Ext.extend(Ext.XTemplate, {

    constructor: function() {

        this.mimeTypes = Portal.app.config.downloadCartMimeTypeToExtensionMapping

        // Some notes while this is in transition:
        //
        // - the disable flag is used to implement 'undo' functionality.  This probably better implemented
        //   by actually removing items from the store, and into an undo queue (it would simplify things
        //   quite a lot).
        //
        var templateLines = [
            '<tpl for=".">',
            '  <div class="cart-row">',
            '    <div class="cart-title-row">',
            '      <div class="floatRight">',
            // TODO: global functions must die.
            '        <a href="#" onclick="javascript:setDownloadCartRecordDisableFlag(\'{uuid}\',\'true\'); return false;">Remove</a>',
            '      </div>',
            '      <span class="cart-title">{title}</span>',
            '    </div>',
            '    <div class="cart-files" >{[this.getFileListMarkup(values)]}</div>',
            '  </div>',
            '</tpl>'
        ];

        Portal.cart.DownloadDataViewTemplate.superclass.constructor.call(this, templateLines);
    },

    getFileListMarkup: function(values) {

        var subFilesTemplate = new Ext.XTemplate(
            '<div class="cart-file-row" >',
            '{[this.getMarkupForOneFile(values)]}',
            '</div>',
            this
        );

        var html = "";
        Ext.each(values.downloads, function (f) {
            html += subFilesTemplate.apply(f);
        });

        return html;
    },

    getMarkupForOneFile: function(values) {
        var ret = "";
        // todo remove this horrible hack when the df is truely gone
        if (values.href.indexOf("df.arcs.org.au") < 0) {
            ret += "<i>" + values.title + "</i> (" + this.getSimpleType(values.type) + ")<br/>";
        }
        else {
            ret += OpenLayers.i18n("unavailableDataLink");
        }
        return ret;
    },

    getSimpleType: function(type) {

        for (var key in this.mimeTypes) {
            if (key == type) {
                return this.mimeTypes[key];
            }
        }
    }
});
