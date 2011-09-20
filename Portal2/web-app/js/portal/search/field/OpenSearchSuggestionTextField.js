Ext.namespace('Portal.search.field');

Portal.search.field.OpenSearchSuggestionTextField = Ext.extend(GeoNetwork.form.OpenSearchSuggestionTextField, {
   proxyUrl: null,
   
   initComponent: function(config) {
      Portal.search.field.OpenSearchSuggestionTextField.superclass.initComponent.call(this);
      
      this.mon(this.store.proxy, {
         scope: this,
         beforeLoad: this.proxyBeforeLoad
      });
   },
   
   proxyBeforeLoad: function(proxy, params) {
      proxy.setUrl(this.proxyUrl + encodeURIComponent(proxy.url + '?' + Ext.urlEncode(params)));
   }
});

Ext.reg('portal.search.field.opensearchsuggestiontextfield', Portal.search.field.OpenSearchSuggestionTextField);


