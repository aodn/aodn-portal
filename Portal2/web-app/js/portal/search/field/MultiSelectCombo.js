Ext.namespace('Portal.search.field');

Portal.search.field.MultiSelectCombo = Ext.extend(Ext.ux.form.SuperBoxSelect, {
   proxyUrl: null,
   field: null,
   url: null,
   maxCaptionLength: 99999999,
   autoHeight: true,
   
   minChars: 0,
   queryParam: 'q',
   hideTrigger: false,
   valueField: 'value',
   displayField: 'value',
   valueDelimiter: ' or ',
   hideLabel: false,
   width: 350,
   maxCaptionLength: 40,

   initComponent: function(config) {
      this.store = new GeoNetwork.data.OpenSearchSuggestionStore({
         url: this.url,
         rootId: 1,
         baseParams: {
             field: this.field
         }
     });

      Portal.search.field.MultiSelectCombo.superclass.initComponent.call(this);
      
      this.mon(this.store.proxy, {
         scope: this,
         beforeLoad: this.proxyBeforeLoad
      });

      this.on({
      	scope: this,
      	additem: this.onItemChange,
      	removeitem: this.onItemChange,
      	clear: this.onItemChange
      });
      
      this.addEvents('redraw');
   },

   //Limit size of displayed text
   addItemBox: function(val, display, caption, cls, style) {
   	var displayCaption = caption;
   	if (caption.length > this.maxCaptionLength) { 
   		displayCaption = '...' + caption.substring(caption.length - this.maxCaptionLength);
   	}
      Portal.search.field.MultiSelectCombo.superclass.addItemBox.call(this, val, display, displayCaption, cls, style);
   },
   
   onItemChange: function() {
   	this.fireEvent('redraw');
   },
   
   proxyBeforeLoad: function(proxy, params) {
      proxy.setUrl(this.proxyUrl + encodeURIComponent(proxy.url + '?' + Ext.urlEncode(params)));
   }
});

Ext.reg('portal.search.field.multiselect', Portal.search.field.MultiSelectCombo);


