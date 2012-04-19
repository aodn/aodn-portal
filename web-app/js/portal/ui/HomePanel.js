
Ext.namespace('Portal.ui');

Portal.ui.HomePanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {
        
        this.appConfig = cfg.appConfig;
        // containers
        var config = Ext.apply({

            layout: 'border',
            id: 'homePanel',
            title: 'Home ',
            minHeight: 600,
            items: [
            {
                region:'center',
                layout:'fit',
                //minHeight: 600,
                padding:  '0px 10px 0px 10px',
                unstyled: true,
                stateful: false,
                items: [  
                {
                    autoEl: 'vbox',
                    unstyled: true,                    
                    autoScroll: true, // finally in the right place!!
                    items: [
                    {

                        unstyled: true,
                        padding:  '15px',
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
                        layout: 'hbox',
                        cls: 'footer',
                        padding:  '7px 20px 5px 20px',
                        unstyled: true,
                        height: this.appConfig.footerHeight,
                        items: [
                        {
                            // this is not a configured item as wont change and will need tailoring for every instance
                            xtype: 'container',
                            html: "<img src=\"images/DIISRTE_Inline-PNGSmall.png\" />",
                            width: 220
                            
                        },
                        {
                            xtype: 'container',
                            html: this.appConfig.footerContent,
                            cls: 'footerText'
                        }
                        ]
                    }
                    ]
                }
                ]
            },
            {
                //xtype: 'panel',
                id: 'rightHomePanel',
                region: 'east',          
                stateful: false,
                unstyled: true,                   
                autoScroll: true,
                padding:  '15px 5px 5px 5px',
                //html: 'ActiveLayers Details panel here',
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
            }],
            listeners: {
  
                hide: function(panel) {
                
                
                    if (panel.id == 'mainMapPanel') {                        
                        closeNHideDetailsPanel();
                    
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

