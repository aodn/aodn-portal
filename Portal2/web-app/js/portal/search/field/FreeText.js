Ext.namespace('Portal.search.field');

Portal.search.field.FreeText = Ext.extend(Ext.form.TextField, {
   width: 250,
   fieldLabel: 'Free text search',
   name: 'any'   
});

Ext.reg('portal.search.field.freetext', Portal.search.field.FreeText);
