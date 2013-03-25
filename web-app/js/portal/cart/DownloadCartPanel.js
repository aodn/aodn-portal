/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */


Ext.namespace('Portal.cart');

Portal.cart.DownloadCartPanel = Ext.extend(Ext.Panel, {



    constructor: function(cfg) {

        this.listPanel = new Portal.cart.DownloadList();

        var footer = new Ext.Panel( {
            region: 'south',
            height: 80,
            padding: '10px',
            unstyled: true,
            layout: 'fit',
            anchor:'right 20%',

            html: '<span class="styledButton">' +
                '<a href="#" onclick="javascript:doDownload();">' +
                OpenLayers.i18n('okdownload') +
                '</a></span> ' +
                '<span class="styledButton">' +
                '<a href="javascript:clearDownloadCart();">' +
                OpenLayers.i18n('clearcart') +
                '</a></span>'
        });

        var config = Ext.apply({

            layout: 'border',
            id: "downloadCartPanel",
            title: 'Home ',
            minHeight: 600,
            items: [
                {
                    // this is a temporary header block until portal 3 workflow
                    region: 'north',
                    height: 50,
                    padding: '0px 5px',
                    html: '<div class="menuHeader">Data Download Cart</div>'
                },
                {
                    region:'center',
                    layout:'fit',
                    padding: '0px 20px',
                    stateful: false,
                    items: [
                        this.listPanel
                    ]
                },
                footer

            ]

        }, cfg);


        Portal.cart.DownloadCartPanel.superclass.constructor.call(this, config);

    }
});

