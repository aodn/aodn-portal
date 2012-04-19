Ext.namespace('Portal.search.field');

Portal.search.field.FreeText = Ext.extend(Ext.form.TextField, {
   hideLabel: true,
   emptyText: OpenLayers.i18n('fullTextSearch'),
   fieldClass: "searchInput",
   name: 'any',
   getFilterValue: function () {
	   return { value: this.getValue() };
   },
   setFilterValue: function(v) {
	   this.setValue(v.value);
   }
});

Ext.reg('portal.search.field.freetext', Portal.search.field.FreeText);
