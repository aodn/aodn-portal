

var viewport;
var proxyURL = "proxy?url=";
var proxyWMSURL = "proxy/wmsOnly?url=";
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
        if(progressCount <= 0) {
        	progressCount = 0;
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
        
        appConfigStore.load();
        
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
                    }
                }

				viewport = new Portal.ui.Viewport({appConfig: Portal.app.config});

				if(window.location.search.length > 0){
                	setViewPortTab('map');

			        var regPattern = new RegExp(/\?savedMapId=([0-9]+)/);
			        var matches = regPattern.exec(window.location.search);

					if(matches != null && matches.length == 2){
						setViewPortTab( 1 );
						//show the map
                        viewport.showSnapshot(matches[1]);
					}
					else{
						//show the homepage
						setViewPortTab( 0 ); // Select default tab
					}
                }
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
    viewport.setActiveTab(tabIndex);
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
