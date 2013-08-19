
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */


Ext.namespace('Portal.ui');

Portal.ui.HomePanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        this.appConfig = cfg.appConfig;

        var config = Ext.apply({

            layout: 'border',
            id: 'homePanel',
            title: 'Home ',
            minHeight: 600,
            items: [
                {
                    region:'center',
                    margins: { right: 5 },
                    unstyled: true,
                    stateful: false,
                    autoScroll: true,
                    id: 'mainHomePanel',
                    autoLoad:{
                        url: 'splash',
                        renderer: 'html',
                        scripts: true,
                        extraParams: {
                            showLoadIndicator: false
                        }
                    }
                },
                {
                    id: 'rightHomePanel',
                    region: 'east',
                    stateful: false,
                    unstyled: true,
                    autoScroll: true,
                    padding:  '20px 5px 10px 10px',
                    width: 360,
                    items: [
                        {
                            autoLoad:{
                                url:'splash/links',
                                scripts:true
                            }
                        },
                        {
                            autoLoad:{
                                url:'splash/community',
                                scripts:true
                            }
                        }
                    ]
                }
            ],
            listeners: {

                hide: function(panel) {


                    if (panel.id == 'mainMapPanel') {
                        jQuery("#loader").hide(); // close the layer loader

                        // close the getfeatureinfo popup
                        if (popup) {
                            popup.close();
                        }
                    }

                }
            }

        }, cfg);

        Portal.ui.HomePanel.superclass.constructor.call(this, config);
    }
});
