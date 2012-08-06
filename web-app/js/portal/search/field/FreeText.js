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
   },
   getValue: function() {
     var enteredValue = Portal.search.field.FreeText.superclass.getValue.call(this);
     // Strip hyphens from value entered - GeoNetwork can't handle them at the moment
     return enteredValue.replace('-', ' ');
   }
});

Ext.reg('portal.search.field.freetext', Portal.search.field.FreeText);
