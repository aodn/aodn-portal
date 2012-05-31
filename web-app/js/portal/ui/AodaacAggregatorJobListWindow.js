Ext.namespace('Portal.ui');

Portal.ui.AodaacAggregatorJobListWindow = Ext.extend(Ext.Window, {

    initComponent: function() {

        /*
         Ext.Ajax.request({
         url: proxyURL + encodeURIComponent( url ) + "&format=" + encodeURIComponent(expectedFormat), // add format for grails proxy
         params: {
         name: layer.name,
         id: layer.id,
         expectedFormat: expectedFormat,
         isAnimatedLayer: isAnimatedLayer,
         units: layer.metadata.units
         },
         success: function(resp, options){
         if ( popup ) { // Popup may have been closed since request was sent

         var newTabContent;

         if(options.params.isAnimatedLayer)
         newTabContent = "<div><img src='" + url + "'></div>";
         else
         newTabContent = formatGetFeatureInfo( resp, options );

         if (newTabContent) {
         popup.numGoodResults++;

         tabsFromPopup( popup ).add( {
         xtype: "box",
         id: options.params.id,
         title: options.params.name,
         padding: 30,
         autoHeight: true,
         cls: "featureinfocontent",
         autoEl: {
         html: newTabContent
         }
         });

         if (popup.numGoodResults == 1) {

         // set to full height and re-pan
         popup.setSize(Portal.app.config.popupWidth,Portal.app.config.popupHeight);
         popup.show(); // since the popup is anchored, calling show will move popup to this location

         // Make first tab active
         var poptabs = tabsFromPopup( popup );
         poptabs.setActiveTab( 0 );
         poptabs.doLayout();
         poptabs.show();

         setTimeout('imgSizer()', 900); // ensure the popup is ready
         }
         }
         // got a result, maybe empty
         popup.numResultQueries++;

         updatePopupStatus(popup);
         }
         },

         failure: function(resp, options) { // Popup may have been closed since request was sent
         updatePopupStatus(popup);
         // got a fail but its still a result
         popup.numResultQueries++;
         }
         });
         */

        // Content
        var contentPanel = new Ext.Panel({
            html: "Retrieving info...",
            width: 450,
            resizable: false
        });

        // Controls
        var clearFinishedButton = {
            text: "Clear finished" // Todo - DN: i18n
        };

        var cancelButton = {
            text: "Close", // Todo - DN: i18n
            listeners: {
                scope: this,
                click: this.onCancel
            }
        };

        Ext.apply(this, {
            title: "AODAAC Jobs", // Todo - DN: i18n
            modal: true,
			padding: 15,
            layout: 'fit',
            items: {
                autoHeight: true,
                autoWidth: true,
                padding: 5,
                items: [contentPanel],
                buttons: [clearFinishedButton, cancelButton],
                keys: [{
                    key: [Ext.EventObject.ESCAPE],
                    handler: this.onCancel,
                    scope: this
                }]
            },
            listeners: {
                show: this.onShow,
                scope: this
            }
        });

        Portal.ui.AodaacAggregatorJobListWindow.superclass.initComponent.apply(this, arguments);
    },

    onCancel: function() {
        this.close();
    }
});