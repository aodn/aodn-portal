Ext.namespace('Portal.search.field');

Portal.search.field.FreeText = Ext.extend(Ext.form.TextField, {
   width: 250,
   fieldLabel: OpenLayers.i18n('fullTextSearch'),
   name: 'any'   
});

Ext.reg('portal.search.field.freetext', Portal.search.field.FreeText);
