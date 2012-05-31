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
   displayField: 'value',
   hideLabel: false,
   width: 350,
   maxCaptionLength: 40,
   extraItemCls: 'wrapping-wrapped-field',
   pinList: false,

   initComponent: function(config) {

	   this.store = new Portal.data.SuggestionStore({
	          url: this.url,
	          autoLoad: true
	      });
	 
	   if (this.baseParams) {
		   this.store.baseParams = this.baseParams;
	   }

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
      	  resize: this.handleResize
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
   
   handleResize: function() {
     // A resize may result in selected items being wrapped 
     // increasing the size of the component!
     // Handle this by signaling that parent containers should adjust for 
     // a change in content after this sequence of resize events has finished
     this.fireEvent.defer(50,this,['contentchange']);
   },
   
   proxyBeforeLoad: function(proxy, params) {
      proxy.setUrl(this.proxyUrl + encodeURIComponent(proxy.url + '?' + Ext.urlEncode(params)) + '&format=text/xml');
   }
});

Ext.reg('portal.search.field.multiselect', Portal.search.field.MultiSelectCombo);


