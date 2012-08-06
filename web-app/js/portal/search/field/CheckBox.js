Ext.namespace('Portal.search.field');

Portal.search.field.CheckBox = Ext.extend(Ext.form.Checkbox, {
  
   getFilterValue: function () {
     return { value: this.getValue()};
   },
   
   setFilterValue: function(v) {
     this.setValue(v.value);
   }
});

Ext.reg('portal.search.field.checkbox', Portal.search.field.CheckBox);

