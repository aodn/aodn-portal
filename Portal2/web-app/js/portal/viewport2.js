

var viewport;
var proxyURL = "proxy?url=";
var progressCount = 0;

Ext.state.Manager.setProvider(new Ext.state.CookieProvider()); // Used by aggregate download
Ext.Updater.defaults.showLoadIndicator = false; // stop loader inside autoLoad'ed components 
Ext.BLANK_IMAGE_URL = 'img/blank.gif';
Ext.QuickTips.init();

//--------------------------------------------------------------------------------------------
Ext.ns('Portal');

Portal.app = {
    
    ajaxComplete: function(conn, response, options) {
        progressCount--;
        if(progressCount == 0) {
            this.ajaxAction('hide');
        }
        
    },
    init: function() {
    	// Set open layers proxyhost
        OpenLayers.ProxyHost = proxyURL;
        
        // Global Ajax events can be handled on every request!
        Ext.Ajax.on('beforerequest', function(conn, options){
            if(progressCount == 0) {
                this.ajaxAction('show');
            }
            progressCount++;
        }, this);

        Ext.Ajax.on('requestcomplete',  this.ajaxComplete, this);        
        Ext.Ajax.on('requestexception',  this.ajaxComplete, this);       
        
        Ext.Ajax.request({
            url: 'config/viewport',
            scope: this,
            success: function(resp) {        
                this.config = Ext.util.JSON.decode(resp.responseText);
                if(this.config.length == 0)
                {
                    Ext.MessageBox.alert('Error!', 'Your portal has no configuration.  Abort!');
                }
                else
                {
                    if(this.config.enableMOTD)  {
                        var nav = new Ext.Panel({
                            labelWidth:400,
                            title: "<h2>"+ this.config.motd.motdTitle + "</h2>", 
                            html: this.config.motd.motd,
                            padding: 20,
                            unstyled: true,
                            width:300
                        });
                        var dlgPopup = new Ext.Window({  
                            modal:true,
                            layout:'fit',
                            unstyled: true, 
                            cls: "motd",
                            closable:true,
                            resizable:false,
                            plain:true,
                            items:[nav]
                        });
                        dlgPopup.show();
                    };
                };
                initDetailsPanel();
                doViewPort();
                setViewPortTab( 0 ); // Select default tab                
            }
        });
    },
    
    ajaxAction: function(request) {
        if (request == 'show') {        
            jQuery('.extAjaxLoading').show(100);
        }
        else {
            jQuery('.extAjaxLoading').hide('slow');
        }
    }
};

//GeoExt stuff
Ext.onReady(Portal.app.init, Portal.app);

// sets the tab from the external links in the header
function setViewPortTab(tabIndex){ 
    Ext.getCmp('centerTabPanel').setActiveTab(tabIndex);
    
    jQuery('[id^=viewPortTab]').removeClass('viewPortTabActive');
    jQuery('#viewPortTab' + tabIndex).addClass('viewPortTabActive');
}

function doViewPort() {    
    var portalPanel = new Portal.ui.PortalPanel({appConfig: Portal.app.config});
    portalPanel.on('hide', function() {
    	if (popup) {
    		popup.close();
    	}
    }, this);
    
    var homePanel = new Portal.ui.HomePanel({appConfig: Portal.app.config});
    var centreTabPanel = initCentreTabPanel(homePanel, portalPanel);
    
    viewport = new Ext.Viewport({
        layout: 'border',
        boxMinWidth: 1050,
        items: [
            {
	            unstyled: true,
	            region: 'north',
	            height: Portal.app.config.headerHeight + 15
	        },
	        centreTabPanel,
	        {
                region: 'south',
                height: 15,
                unstyled: true
            },
            new Portal.ui.LayerChooserPanel({ 
            	region: 'west', 
                id: 'leftLayerChooserPanel',
            	appConfig: Portal.app.config, 
            	mapPanel: portalPanel.getMapPanel(),
                width: Portal.app.config.westWidth,
                minWidth: 260,
                maxWidth: 450,
                collapsible: true,
                collapseMode: 'mini',
                stateful: false,
                split: true
        	})
	    ],
        listeners: {
            afterrender: function(panel) {              
                jQuery("#loader").hide('slow'); // close the loader            
            }
            
        }
    });
    
    viewport.show();
}

function initCentreTabPanel(homePanel, portalPanel) {
	return new Ext.TabPanel({
        region: 'center',
        id: 'centerTabPanel',
        xtype: 'tabpanel', // TabPanel itself has no title        
        autoDestroy: false, // wont destroy tab contents when switching        
        activeTab: 0,
        unstyled: true,
        // method to hide the usual tab panel header with css
        headerCfg: {
            cls: 'mainTabPanelHeader'  // Default class not applied if Custom element specified
        },
        items: [
            homePanel,
            portalPanel,
            initSearchTabPanel(portalPanel.getMapPanel())
        ],
        listeners: {
            beforetabchange: function(thisTabPanel, newTab, currentTab) {  
                if (newTab.id == "mainMapPanel") {
                    // show the map options and active layers
                    Ext.getCmp('activeMenuPanel').show();
                    //Ext.getCmp('activeMenuPanel').setHeight(300);
                    Ext.getCmp('leftLayerChooserPanel').doLayout();
                }
                else {
                    // hide the map options and active layers
                    Ext.getCmp('activeMenuPanel').hide();
                    //Ext.getCmp('activeMenuPanel').setHeight(0);
                    
                }
                          
            }
        }
    });
}

function initSearchTabPanel(mapPanel) {
	return new Portal.search.SearchTabPanel({
	    listeners: {
	        addLayer: {
	            fn: function(layerDef) {
	                mapPanel.addMapLayer(layerDef);
	                Ext.Msg.alert(OpenLayers.i18n('layerAddedTitle'), OpenLayers.i18n('layerAddedMsg', {layerDesc: layerDef.title}));
	            }
	        }
	    }
	});
}

//
// Fix for closing animation time period window after selection
// http://www.sencha.com/forum/archive/index.php/t-98338.html
// Bug in Ext.form.MessageTargets in connection with using compositeFields
//The problem is, that composite fields doesn't have the "dom" node and that is why the clear functions of Ext.form.MessageTargets.qtip 
//and Ext.form.MessageTargets.side are saying "field.el.dom" is undefined.
Ext.onReady(function() {

    Ext.apply(Ext.form.MessageTargets.qtip, {
        clear: function(field){
            field.el.removeClass(field.invalidClass);
            // fix

            if(field.el.dom) {
                field.el.dom.qtip = '';
            }
        }
    });


    Ext.apply(Ext.form.MessageTargets.side, {
        clear: function(field){
            field.el.removeClass(field.invalidClass);
            // fix

            if(field.errorIcon && field.errorIcon.dom){
                field.errorIcon.dom.qtip = '';
                field.errorIcon.hide();
            }else{
                // fix

                if(field.el.dom) {
                    field.el.dom.title = '';
                }
            }
        }
    });
});
